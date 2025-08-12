import { useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { useState, useEffect } from "react";

export default function Frame({
  position,
  rotation,
  imageUrl,
  title,
  artist,
  description,
  onClick
}) {
  const texture = useLoader(THREE.TextureLoader, imageUrl);

  // Responsive sizing
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const artWidth = isMobile ? 3.5 : 5.5;
  const artHeight = isMobile ? 4 : 6;
  const frameDepth = 0.2;

  return (
    <group
      position={position}
      rotation={rotation}
      onClick={(e) => {
        e.stopPropagation();
        const forward = new THREE.Vector3(0, 0, 1);
        const q = new THREE.Quaternion().setFromEuler(
          new THREE.Euler(rotation[0], rotation[1], rotation[2])
        );
        forward.applyQuaternion(q);
        const distance = 8;
        const camPos = new THREE.Vector3(...position).add(
          forward.multiplyScalar(distance)
        );
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
        <meshStandardMaterial color="#fff" metalness={4} roughness={1} />
      </mesh>

      {/* Art itself */}
      <mesh position={[0, 0, frameDepth / 2 + 0.01]}>
        <planeGeometry args={[artWidth, artHeight]} />
        <meshStandardMaterial map={texture} />
      </mesh>
    </group>
  );
}
