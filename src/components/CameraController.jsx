import { useEffect, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";

import * as THREE from "three";

export default function CameraController({ mode, focus, controlsRef, onInArrive, outDistance = 17 }) {
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