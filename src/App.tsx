import { CameraControls, Environment, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Leva, useControls } from "leva";
import { Perf } from "r3f-perf";
import { useRef } from "react";
import fragmentShader from "./shaders/wobble/fragment.glsl";
import vertexShader from "./shaders/wobble/vertex.glsl";
import CustomShaderMaterial from "three-custom-shader-material";
import * as THREE from "three";
import hdrFile from "./public/urban_alley_01_1k.hdr";

function App() {
  const ref = useRef(null);
  const materialRef = useRef<typeof CustomShaderMaterial | null>(null);
  const {
    color,
    metalness,
    roughness,
    ior,
    thickness,
    transparent,
    wireframe,
    transmission,
  } = useControls({
    metalness: { value: 0, min: 0, max: 1, step: 0.001 },
    roughness: { value: 0.5, min: 0, max: 1, step: 0.001 },
    color: "#ffffff",
    transmission: { value: 0, min: 0, max: 1, step: 0.001 },
    ior: { value: 1.5, min: 0, max: 10, step: 0.001 },
    thickness: { value: 1.5, min: 0, max: 10, step: 0.001 },
    transparent: true,
    wireframe: false,
  });

  // const gltf = useGLTF('/draco')

  return (
    <>
      <Canvas
        shadows
        camera={{
          fov: 45,
          near: 0.1,
          far: 200,
          position: [13, -3, -5],
        }}
      >
        <Perf position="top-left" />
        <CameraControls />
        <OrbitControls />
        <Environment
          background
          files={hdrFile}
          backgroundIntensity={1}
          environmentIntensity={0.6}
        />
        <mesh ref={ref} castShadow receiveShadow>
          <icosahedronGeometry args={[2.5, 50]} />
          <CustomShaderMaterial
            ref={materialRef as any}
            baseMaterial={THREE.MeshPhysicalMaterial}
            fragmentShader={fragmentShader}
            vertexShader={vertexShader}
            color={color}
            metalness={metalness}
            roughness={roughness}
            transparent={transparent}
            wireframe={wireframe}
          />
        </mesh>

        <mesh position={[0, -5, 5]} receiveShadow>
          <boxGeometry args={[15, 15, 0]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>

        <directionalLight
          position={[0.25, 2, -2.25]}
          intensity={2.6}
          color={"#ffffff"}
          castShadow
          shadow-mapSize={[1024, 1024]}
          shadow-camera-far={15}
        />
        <ambientLight intensity={0.2} />
      </Canvas>
      <Leva collapsed />
    </>
  );
}

export default App;
