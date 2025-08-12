import { useLoader, useThree } from "@react-three/fiber";
import { TextureLoader } from "three";
import Frame from "./Frame";
import * as THREE from "three";

export default function GalleryRoom({ onFrameClick}) {
  const { camera } = useThree();
  const wallTexture = useLoader(TextureLoader, "/textures/wall2.jpg");
  wallTexture.wrapS = wallTexture.wrapT = THREE.RepeatWrapping;
  wallTexture.repeat.set(4, 1); // Adjust to taste

  const floorTexture = useLoader(TextureLoader, "/textures/floor4.jpg");
  floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
  floorTexture.repeat.set(4, 3); // Adjust to taste

  const ceilingTexture = useLoader(TextureLoader, "/textures/ceiling3.jpg");
  ceilingTexture.wrapS = ceilingTexture.wrapT = THREE.RepeatWrapping;
  ceilingTexture.repeat.set(4, 3); // Adjust to taste

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
        <meshStandardMaterial map={ceilingTexture} />
      </mesh>


      {/* Art Frames */}
        {/* Front Wall */}
      <Frame
        position={[-15, 4.5, -19.9]}
        rotation={[0, 0, 0]}
        imageUrl="/artworks/devils-tarot.png"
        title="Starry Night"
        artist="Vincent van Gogh"
        description="A depiction of the night sky from the asylum in Saint-Rémy."
        onClick={onFrameClick}
      />

      <Frame
        position={[-5, 4.5, -19.9]}
        rotation={[0, 0, 0]}
        imageUrl="/artworks/diamond-in-the-rough.jpg"
        title="The Persistence of Memory"
        artist="Salvador Dalí"
        description="The famous melting clocks surreal landscape."
        onClick={onFrameClick}
      />

      <Frame
        position={[5, 4.5, -19.9]}
        rotation={[0, 0, 0]}
        imageUrl="/artworks/maniacal-nightmares.jpg"
        title="Mona Lisa"
        artist="Leonardo da Vinci"
        description="One of the most famous portraits in art history."
        onClick={onFrameClick}
      />

      <Frame
        position={[15, 4.5, -19.9]}
        rotation={[0, 0, 0]}
        imageUrl="/artworks/its-always-sunny.png"
        title="Mona Lisa"
        artist="Leonardo da Vinci"
        description="One of the most famous portraits in art history."
        onClick={onFrameClick}
      />

      {/* Right Wall */}
      <Frame
        position={[20, 4.5, -15]}
        rotation={[0, -Math.PI / 2, 0]}
        imageUrl="/artworks/lady-in-the-rain.png"
        title="Mona Lisa"
        artist="Leonardo da Vinci"
        description="One of the most famous portraits in art history."
        onClick={onFrameClick}
      />

      <Frame
        position={[20, 4.5, -5]}
        rotation={[0, -Math.PI / 2, 0]}
        imageUrl="/artworks/eden.png"
        title="Mona Lisa"
        artist="Leonardo da Vinci"
        description="One of the most famous portraits in art history."
        onClick={onFrameClick}
      />

      {/* Left Wall */}
      <Frame
        position={[-20, 4.5, -15]}
        rotation={[0, Math.PI / 2, 0]}
        imageUrl="/artworks/stan.png"
        title="Mona Lisa"
        artist="Leonardo da Vinci"
        description="One of the most famous portraits in art history."
        onClick={onFrameClick}
      />

       <Frame
        position={[-20, 4.5, -5]}
        rotation={[0, Math.PI / 2, 0]}
        imageUrl="/artworks/tapestry-of-dreams.png"
        title="Mona Lisa"
        artist="Leonardo da Vinci"
        description="One of the most famous portraits in art history."
        onClick={onFrameClick}
      />
    </group>
  );
}