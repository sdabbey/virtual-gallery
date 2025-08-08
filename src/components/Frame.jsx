import { useLoader } from "@react-three/fiber";
import * as THREE from "three";

export default function Frame({ position, imageUrl, title, artist, description, onClick }) {
  const texture = useLoader(THREE.TextureLoader, imageUrl);

  const artWidth = 6;
  const artHeight = 5;
  const frameDepth = 0.1;

  return (
    <group
      position={position}
      onClick={(e) => {
        e.stopPropagation(); // prevent background clicks
        onClick?.({
          cameraPos: [position[0], position[1], position[2] + 8], // zoom-in position
          lookAt: position, // focus on the artwork
          title,
          artist,
          description
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
