import { useLoader, useThree } from "@react-three/fiber";
import { TextureLoader } from "three";
import Frame from "./Frame";
import * as THREE from "three";

export default function GalleryRoom({ onFrameClick}) {
  const { camera } = useThree();
  const wallTexture = useLoader(TextureLoader, "/textures/wall.jpg");
  wallTexture.wrapS = wallTexture.wrapT = THREE.RepeatWrapping;
  wallTexture.repeat.set(4, 4); // Adjust to taste

  const floorTexture = useLoader(TextureLoader, "/textures/floor.jpg");
  floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
  floorTexture.repeat.set(4, 4); // Adjust to taste

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial map={floorTexture} />
      </mesh>

      {/* Back Wall */}
      <mesh position={[0, 5, -20]}>
        <planeGeometry args={[40, 10]} />
        <meshStandardMaterial map={wallTexture} />
      </mesh>

      {/* Front Wall */}
      <mesh position={[0, 5, 20]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[40, 10]} />
        <meshStandardMaterial map={wallTexture} />
      </mesh>


      {/* Left Wall */}
      <mesh position={[-20, 5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[40, 10]} />
        <meshStandardMaterial map={wallTexture} />
      </mesh>

      {/* Right Wall */}
      <mesh position={[20, 5, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[40, 10]} />
        <meshStandardMaterial map={wallTexture} />
      </mesh>

      {/* Ceiling */}
      <mesh position={[0, 10, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#eeeeee" />
      </mesh>


      {/* Art Frames */}
      <Frame
        position={[-9, 4.5, -19.9]}
        imageUrl="/artworks/art1.jpg"
        title="Starry Night"
        artist="Vincent van Gogh"
        description="A depiction of the night sky from the asylum in Saint-Rémy."
        onClick={onFrameClick}
      />

      <Frame
        position={[0, 4.5, -19.9]}
        imageUrl="/artworks/art2.jpg"
        title="The Persistence of Memory"
        artist="Salvador Dalí"
        description="The famous melting clocks surreal landscape."
        onClick={onFrameClick}
      />

      <Frame
        position={[9, 4.5, -19.9]}
        imageUrl="/artworks/art3.jpg"
        title="Mona Lisa"
        artist="Leonardo da Vinci"
        description="One of the most famous portraits in art history."
        onClick={onFrameClick}
      />

    </group>
  );
}