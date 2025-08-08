// ControlsLimiter.jsx
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useMemo } from "react";

export default function ControlsLimiter({ controlsRef, bounds }) {
  const { camera } = useThree();

  // make THREE.Vector3 bounds once
  const minV = useMemo(() => new THREE.Vector3(bounds.minX, bounds.minY, bounds.minZ), [bounds]);
  const maxV = useMemo(() => new THREE.Vector3(bounds.maxX, bounds.maxY, bounds.maxZ), [bounds]);

  useFrame(() => {
    const controls = controlsRef?.current;
    if (!controls) return;

    // Only enforce while controls are enabled (i.e., user interaction / idle mode)
    if (!controls.enabled) return;

    // Clamp the controls target (this prevents rotating the target past walls)
    const t = controls.target;
    let targetChanged = false;
    if (t.x < minV.x) { t.x = minV.x; targetChanged = true; }
    if (t.x > maxV.x) { t.x = maxV.x; targetChanged = true; }
    if (t.y < minV.y) { t.y = minV.y; targetChanged = true; }
    if (t.y > maxV.y) { t.y = maxV.y; targetChanged = true; }
    if (t.z < minV.z) { t.z = minV.z; targetChanged = true; }
    if (t.z > maxV.z) { t.z = maxV.z; targetChanged = true; }
    if (targetChanged) controls.update();

    // Clamp camera position to same box (prevents camera going through walls)
    // Note: this is a hard clamp; if you prefer softer behaviour, change to lerp clamping.
    const p = camera.position;
    let camChanged = false;
    if (p.x < minV.x) { p.x = minV.x; camChanged = true; }
    if (p.x > maxV.x) { p.x = maxV.x; camChanged = true; }
    if (p.y < minV.y) { p.y = minV.y; camChanged = true; }
    if (p.y > maxV.y) { p.y = maxV.y; camChanged = true; }
    if (p.z < minV.z) { p.z = minV.z; camChanged = true; }
    if (p.z > maxV.z) { p.z = maxV.z; camChanged = true; }
    if (camChanged && controls) controls.update();
  });

  return null;
}
