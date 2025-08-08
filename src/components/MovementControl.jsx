// MovementControl.jsx
import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export default function MovementControl({
  controlsRef,
  enabled = true,
  speed = 6, // units per second
  bounds = {
    minX: -18, maxX: 18,
    minY: 1.2,  maxY: 9.5,
    minZ: -18, maxZ: 18
  }
}) {
  const { camera } = useThree();
  const keys = useRef({});

  // key handling
  useEffect(() => {
    const down = (e) => {
      const k = e.key.toLowerCase();
      keys.current[k] = true;
    };
    const up = (e) => {
      const k = e.key.toLowerCase();
      keys.current[k] = false;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  // clamp helper
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

  useFrame((state, delta) => {
    if (!enabled) return;

    // build input vector
    let forward = 0;
    let right = 0;
    if (keys.current["w"] || keys.current["arrowup"]) forward += 1;
    if (keys.current["s"] || keys.current["arrowdown"]) forward -= 1;
    if (keys.current["d"] || keys.current["arrowright"]) right += 1;
    if (keys.current["a"] || keys.current["arrowleft"]) right -= 1;

    // nothing pressed
    if (forward === 0 && right === 0) return;

    // direction vectors (horizontal only)
    const fwd = new THREE.Vector3();
    camera.getWorldDirection(fwd);
    fwd.y = 0;
    fwd.normalize();

    const rightVec = new THREE.Vector3();
    rightVec.crossVectors(fwd, camera.up).normalize(); // right relative to forward

    // combined movement vector
    const move = new THREE.Vector3();
    move.addScaledVector(fwd, forward);
    move.addScaledVector(rightVec, right);

    // normalize so diagonal speed not faster
    if (move.lengthSq() > 0) move.normalize();

    // apply delta time and speed
    const dist = speed * delta;
    move.multiplyScalar(dist);

    // apply to camera and to OrbitControls target (if present)
    camera.position.add(move);
    if (controlsRef?.current) {
      controlsRef.current.target.add(move);
    }

    // clamp camera & target to bounds to prevent going through walls
    camera.position.x = clamp(camera.position.x, bounds.minX, bounds.maxX);
    camera.position.y = clamp(camera.position.y, bounds.minY, bounds.maxY);
    camera.position.z = clamp(camera.position.z, bounds.minZ, bounds.maxZ);

    if (controlsRef?.current) {
      const t = controlsRef.current.target;
      t.x = clamp(t.x, bounds.minX, bounds.maxX);
      t.y = clamp(t.y, bounds.minY, bounds.maxY);
      t.z = clamp(t.z, bounds.minZ, bounds.maxZ);
      // inform OrbitControls of the change
      controlsRef.current.update();
    }
  });

  return null;
}
