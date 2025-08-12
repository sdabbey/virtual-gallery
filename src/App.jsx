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
import MovementHint from "./components/MovementHint";
import OnScreenControls from "./components/OnScreenControls";
import ArtDetailsUI from "./components/ArtDetailsUI";
import StartOverlay from "./components/StartOverlay";
/**
 * CameraController
 * - mode: "idle" | "in" | "out"
 * - in: lerp from current camera pos -> focus.cameraPos while looking at focus.lookAt
 * - out: lerp from current camera pos -> backPos (computed from camPos + dirAway*distance)
 *   while KEEPING lookAt locked at the artwork position (so no spin)
 */



import CameraController from "./components/CameraController";



export default function App() {
  const [focus, setFocus] = useState(null); // { cameraPos, lookAt, title,... } while zoomed in
  const [mode, setMode] = useState("idle"); // "idle" | "in" | "out"
  const [showDetailsBtn, setShowDetailsBtn] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [showStartOverlay, setShowStartOverlay] = useState(true);
  const controlsRef = useRef();
  const [zoomedArtPos, setZoomedArtPos] = useState(null);

  const onFrameClick = (data) => {
     // store clicked art's position
    setFocus(data);
    setZoomedArtPos(data.artPos);
    setMode("in");
    setShowDetailsBtn(false);
    setShowOverlay(false);
    setZoomedArtPos(data.artPos);
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
            outDistance={17}
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
      {/* Movement hint */}
      {/* <MovementHint/> */}
      {/* <div className="art-help">
        <svg fill="#ffffff" height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 52 52" xml:space="preserve" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M26,0C11.663,0,0,11.663,0,26s11.663,26,26,26s26-11.663,26-26S40.337,0,26,0z M26,50C12.767,50,2,39.233,2,26 S12.767,2,26,2s24,10.767,24,24S39.233,50,26,50z"></path> <path d="M26,37c-0.553,0-1,0.447-1,1v2c0,0.553,0.447,1,1,1s1-0.447,1-1v-2C27,37.447,26.553,37,26,37z"></path> <path d="M26.113,9.001C26.075,9.001,26.037,9,25.998,9c-2.116,0-4.106,0.815-5.615,2.304C18.847,12.819,18,14.842,18,17 c0,0.553,0.447,1,1,1s1-0.447,1-1c0-1.618,0.635-3.136,1.787-4.272c1.153-1.137,2.688-1.765,4.299-1.727 c3.161,0.044,5.869,2.752,5.913,5.913c0.029,2.084-0.999,4.002-2.751,5.132C26.588,23.762,25,26.794,25,30.158V33 c0,0.553,0.447,1,1,1s1-0.447,1-1v-2.842c0-2.642,1.276-5.105,3.332-6.432c2.335-1.506,3.706-4.063,3.667-6.84 C33.939,12.599,30.401,9.061,26.113,9.001z"></path> </g> </g></svg>
      </div> */}

      {mode !== "in" && !showStartOverlay && <OnScreenControls />}

     
      {/* Show details button */}
      {mode === "in" && !showOverlay && showDetailsBtn && zoomedArtPos && (
        <ArtDetailsUI >
          <button className="close-btn" onClick={() => handleExitRequest()}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="Menu / Close_LG"> <path id="Vector" d="M21 21L12 12M12 12L3 3M12 12L21.0001 3M12 12L3 21.0001" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"></path> </g> </g></svg>
          </button>
          <button className="more-info" onClick={() => setShowOverlay(true)}>
            <svg fill="#ffffff" viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M 24.3320 13.2461 C 24.3320 15.1211 25.8320 16.6211 27.7070 16.6211 C 29.6055 16.6211 31.0820 15.1211 31.0586 13.2461 C 31.0586 11.3477 29.6055 9.8477 27.7070 9.8477 C 25.8320 9.8477 24.3320 11.3477 24.3320 13.2461 Z M 18.5195 44.2305 C 18.5195 45.3789 19.3399 46.1523 20.5820 46.1523 L 35.4179 46.1523 C 36.6601 46.1523 37.4805 45.3789 37.4805 44.2305 C 37.4805 43.1055 36.6601 42.3320 35.4179 42.3320 L 30.7070 42.3320 L 30.7070 24.4492 C 30.7070 23.1836 29.8867 22.3399 28.6680 22.3399 L 21.2383 22.3399 C 20.0195 22.3399 19.1992 23.0899 19.1992 24.2148 C 19.1992 25.3867 20.0195 26.1602 21.2383 26.1602 L 26.3711 26.1602 L 26.3711 42.3320 L 20.5820 42.3320 C 19.3399 42.3320 18.5195 43.1055 18.5195 44.2305 Z"></path></g></svg>
          </button>

          <button className="link-btn">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M15.197 3.35462C16.8703 1.67483 19.4476 1.53865 20.9536 3.05046C22.4596 4.56228 22.3239 7.14956 20.6506 8.82935L18.2268 11.2626M10.0464 14C8.54044 12.4882 8.67609 9.90087 10.3494 8.22108L12.5 6.06212" stroke="#ffffff" strokeWidth="2" strokeLinecap="round"></path> <path d="M13.9536 10C15.4596 11.5118 15.3239 14.0991 13.6506 15.7789L11.2268 18.2121L8.80299 20.6454C7.12969 22.3252 4.55237 22.4613 3.0464 20.9495C1.54043 19.4377 1.67609 16.8504 3.34939 15.1706L5.77323 12.7373" stroke="#ffffff" strokeWidth="2" strokeLinecap="round"></path> </g></svg>
          </button>

        </ArtDetailsUI>
        
      )}

      {/* Start overlay */}
      {!focus && showStartOverlay && (
        <StartOverlay
          artist="The Art Agora"
          title="TAA Gallery"
          curationDate="2025-05-14 to 2025-08-14"
          onClose={() => setShowStartOverlay(false)}
        />
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
