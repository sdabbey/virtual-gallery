// App.jsx
import { useState, useEffect, useRef, Suspense } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import GalleryRoom from "./components/GalleryRoom";
import Overlay from "./components/Overlay";
import * as THREE from "three";
import "./App.css";
import ControlsLimiter from "./components/ControlsLimiter";
import MovementControl from "./components/MovementControl";

/**
 * CameraController
 * - mode: "idle" | "in" | "out"
 * - in: lerp from current camera pos -> focus.cameraPos while looking at focus.lookAt
 * - out: lerp from current camera pos -> backPos (computed from camPos + dirAway*distance)
 *   while KEEPING lookAt locked at the artwork position (so no spin)
 */
function CameraController({ mode, focus, controlsRef, onInArrive, outDistance = 15 }) {
  const { camera } = useThree();

  // anim values
  const t = useRef(0);
  const fromPos = useRef(new THREE.Vector3());
  const toPos = useRef(new THREE.Vector3());
  const lookAtVec = useRef(new THREE.Vector3());
  const initialized = useRef(false);

  // initialize when mode changes
  useEffect(() => {
    t.current = 0;
    initialized.current = false;
  }, [mode, focus]);

  useFrame((_, delta) => {
    // If idle do nothing
    if (mode === "idle") return;

    // Ensure controlsRef exists
    if (controlsRef?.current) controlsRef.current.enabled = false;

    // ZOOM IN behavior
    if (mode === "in" && focus) {
      // init once
      if (!initialized.current) {
        fromPos.current.copy(camera.position);
        toPos.current.set(...focus.cameraPos);
        lookAtVec.current.set(...focus.lookAt);
        t.current = 0;
        initialized.current = true;
      }

      // lerp t (speed tuned here)
      t.current = Math.min(1, t.current + delta * 2.0); // 0 -> 1 in ~0.5s (adjust multiplier)
      camera.position.lerpVectors(fromPos.current, toPos.current, t.current);
      camera.lookAt(lookAtVec.current);

      // also keep controls target locked (prevents future snap)
      if (controlsRef?.current) controlsRef.current.target.copy(lookAtVec.current);

      if (t.current >= 1) {
        onInArrive?.();
      }

      return;
    }

    // ZOOM OUT behavior (simple back-up, no extra rotate)
    if (mode === "out" && focus) {
      // init once
      if (!initialized.current) {
        fromPos.current.copy(camera.position); // start where camera currently is
        // direction from artwork to camera
        const artPos = new THREE.Vector3(...focus.lookAt);
        const camPos = new THREE.Vector3(...focus.cameraPos);
        const dir = camPos.clone().sub(artPos).normalize(); // art -> camera
        // compute end position: move further along same ray (backwards from artwork)
        const backPos = camPos.clone().add(dir.multiplyScalar(outDistance));
        toPos.current.copy(backPos);
        // Keep looking at the artwork the whole time
        lookAtVec.current.copy(artPos);
        t.current = 0;
        initialized.current = true;
      }

      t.current = Math.min(1, t.current + delta * 2.0);
      camera.position.lerpVectors(fromPos.current, toPos.current, t.current);

      // Crucial: KEEP facing artwork the whole way — no sudden rotation
      camera.lookAt(lookAtVec.current);

      // Keep OrbitControls.target aligned to avoid snapping when re-enabled
      if (controlsRef?.current) {
        controlsRef.current.target.copy(lookAtVec.current);
      }

      if (t.current >= 1) {
        // animation finished: re-enable controls and leave view in this backed-up position
        if (controlsRef?.current) {
          controlsRef.current.enabled = true;
          controlsRef.current.update();
        }
      }

      return;
    }
  });

  return null;
}

export default function App() {
  const [focus, setFocus] = useState(null); // { cameraPos, lookAt, title,... } while zoomed in
  const [mode, setMode] = useState("idle"); // "idle" | "in" | "out"
  const [showDetailsBtn, setShowDetailsBtn] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const controlsRef = useRef();

  // Called when user clicks a frame (from GalleryRoom)
  const onFrameClick = (data) => {
    // ensure controlsRef is available; if not, still proceed
    // data must include cameraPos and lookAt (as set by your Frame component)
    setFocus(data);
    setMode("in");
    setShowDetailsBtn(false);
    setShowOverlay(false);
  };

  // When camera finishes zooming in
  const handleInArrive = () => {
    // small timeout so camera settles
    setTimeout(() => setShowDetailsBtn(true), 250);
  };

  // user requests exit (ESC or background click)
  const handleExitRequest = () => {
    if (!focus) return;
    // switch to out mode and keep focus until out completes (we will clear focus after)
    setMode("out");
    setShowDetailsBtn(false);
    setShowOverlay(false);

    // After the out animation completes (we detect by a timeout that's slightly longer than lerp time)
    // you could instead wire a callback from CameraController using state, but a timeout is simple & reliable.
    // Here we use 600ms which matches the lerp speed above (delta*2.0 -> ~0.5s). Adjust if you change speed.
    setTimeout(() => {
      setMode("idle");
      setFocus(null);
      // OrbitControls already re-enabled by CameraController at end, but guard
      if (controlsRef?.current) {
        controlsRef.current.enabled = true;
        controlsRef.current.update();
      }
    }, 650);
  };

  // ESC handler
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        handleExitRequest();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [focus]);

  return (
    <div className="w-screen h-screen">
      <Canvas camera={{ position: [0, 4, 20], fov: 60 }} shadows style={{ backgroundColor: "#222" }}>
        <Suspense fallback={null}>
          <CameraController
            mode={mode}
            focus={focus}
            controlsRef={controlsRef}
            onInArrive={handleInArrive}
            outDistance={15}
          />

          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 10, 5]} intensity={1.2} castShadow />

          <GalleryRoom onFrameClick={onFrameClick} />

          <OrbitControls
            ref={controlsRef}
            enabled={mode === "idle" && !focus}
            enablePan
            enableZoom
            enableRotate
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 2.1}
            minDistance={10}
            maxDistance={50}
          />

          <MovementControl
            controlsRef={controlsRef}
            enabled={mode === "idle" && !focus} // only allow movement when idle
            speed={6}
            bounds={{minX:-18, maxX:18, minY:1.2, maxY:9.5, minZ:-18, maxZ:18}}
          />
          <ControlsLimiter
            controlsRef={controlsRef}
            bounds={{
              minX: -18, maxX: 18,
              minY: 1.2, maxY: 9.5,   // keep camera above floor and below ceiling
              minZ: -18, maxZ: 18      // keep camera/target inside walls (front/back)
            }}
          />
        </Suspense>
      </Canvas>

      {/* More details button (shows after arrival) */}
      {mode === "in" && !showOverlay && showDetailsBtn && (
        <button
          onClick={() => setShowOverlay(true)}
          className="absolute bottom-8 right-8 bg-white text-black px-4 py-2 rounded shadow-lg transition-opacity duration-300"
        >
          More details
        </button>
      )}

      {/* Overlay modal — clicking outside triggers handleExitRequest */}
      {showOverlay && focus && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleExitRequest();
            }
          }}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <Overlay
              title={focus.title}
              artist={focus.artist}
              description={focus.description}
              onClose={handleExitRequest}
            />
          </div>
        </div>
      )}
    </div>
  );
}
