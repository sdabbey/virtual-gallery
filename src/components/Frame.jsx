import { useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { useState } from "react";
export default function Frame({ position, rotation, imageUrl, title, artist, description, onClick }) {
  

  const texture = useLoader(THREE.TextureLoader, imageUrl);

  const artWidth = 5.5;
  const artHeight = 6;
  const frameDepth = 0.2;

  return (
    <group
      position={position}
      rotation={rotation}
      onClick={(e) => {
        e.stopPropagation();

        // Step 1: make a forward vector
        const forward = new THREE.Vector3(0, 0, 1);

        // Step 2: apply the artwork's Y-rotation
        const q = new THREE.Quaternion().setFromEuler(
          new THREE.Euler(rotation[0], rotation[1], rotation[2])
        );
        forward.applyQuaternion(q);

        // Step 3: decide how far in front of the artwork you want the camera
        const distance = 8;
        const camPos = new THREE.Vector3(...position).add(forward.multiplyScalar(distance));

        // Step 4: pass correct values to CameraController
        onClick?.({
          cameraPos: [camPos.x, camPos.y, camPos.z],
          lookAt: position,
          title,
          artist,
          description,
          artPos: position
        });
        
      }}
    >
      {/* Frame border */}
      <mesh>
        <boxGeometry args={[artWidth + 0.4, artHeight + 0.4, frameDepth]} />
        <meshStandardMaterial color="#21130d" metalness={0.2} roughness={0.6} />
      </mesh>

      {/* Art itself */}
      <mesh position={[0, 0, frameDepth / 2 + 0.01]}>
        <planeGeometry args={[artWidth, artHeight]} />
        <meshStandardMaterial map={texture} />
      </mesh>
    </group>
  );
}
