import { Environment, OrbitControls, useGLTF } from "@react-three/drei";
import { Perf } from "r3f-perf";
import { useMemo, useRef } from "react";
import fragmentShader from "./shaders/wobble/fragment.glsl";
import vertexShader from "./shaders/wobble/vertex.glsl";
import CustomShaderMaterial from "three-custom-shader-material";
import CustomShaderMaterialVanilla from "three-custom-shader-material/vanilla";
import * as THREE from "three";
import hdrFile from "./public/urban_alley_01_1k.hdr";
// import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { useControls } from "leva";
import { useFrame } from "@react-three/fiber";
import suzanne from "./public/suzanne.glb";

// const geometry = (() => {
//   let geo = new THREE.IcosahedronGeometry(2.5, 50);
//   geo = mergeVertices(geo);
//   geo.computeTangents();
//   return geo;
// })();

function App() {
  const ref = useRef(null);
  const materialRef = useRef<typeof CustomShaderMaterial | null>(null);
  const uniforms = useMemo(
    () => ({
      uTime: new THREE.Uniform(0),
      uPositionFrequency: new THREE.Uniform(0.5),
      uTimeFrequency: new THREE.Uniform(0.4),
      uStrength: new THREE.Uniform(0.3),
      uWarpPositionFrequency: new THREE.Uniform(0.38),
      uWarpTimeFrequency: new THREE.Uniform(0.12),
      uWarpStrength: new THREE.Uniform(1.7),
      uColorA: new THREE.Uniform(new THREE.Color(0x000000)),
      uColorB: new THREE.Uniform(new THREE.Color(0xffffff)),
    }),
    []
  );

  const {
    color,
    metalness,
    roughness,
    // ior,
    // thickness,
    transparent,
    wireframe,
    // transmission,
  } = useControls({
    colorA: {
      value: "#000000",
      onChange: (v) => (uniforms.uColorA.value = new THREE.Color(v)),
    },
    colorB: {
      value: "#ffffff",
      onChange: (v) => (uniforms.uColorB.value = new THREE.Color(v)),
    },
    uPositionFrequency: {
      value: 0.5,
      min: 0,
      max: 2,
      step: 0.001,
      onChange: (v) => (uniforms.uPositionFrequency.value = v),
    },
    uTimeFrequency: {
      value: 0.4,
      min: 0,
      max: 2,
      step: 0.001,
      onChange: (v) => (uniforms.uTimeFrequency.value = v),
    },
    uStrength: {
      value: 0.3,
      min: 0,
      max: 2,
      step: 0.001,
      onChange: (v) => (uniforms.uStrength.value = v),
    },
    uWarpPositionFrequency: {
      value: 0.38,
      min: 0,
      max: 2,
      step: 0.001,
      onChange: (v) => (uniforms.uWarpPositionFrequency.value = v),
    },
    uWarpTimeFrequency: {
      value: 0.12,
      min: 0,
      max: 2,
      step: 0.001,
      onChange: (v) => (uniforms.uWarpTimeFrequency.value = v),
    },
    uWarpStrength: {
      value: 1.7,
      min: 0,
      max: 2,
      step: 0.001,
      onChange: (v) => (uniforms.uWarpStrength.value = v),
    },

    metalness: { value: 0, min: 0, max: 1, step: 0.001 },
    roughness: { value: 0.5, min: 0, max: 1, step: 0.001 },
    color: "#ffffff",
    transmission: { value: 0, min: 0, max: 1, step: 0.001 },
    ior: { value: 1.5, min: 0, max: 10, step: 0.001 },
    thickness: { value: 1.5, min: 0, max: 10, step: 0.001 },
    transparent: true,
    wireframe: false,
  });

  const depthMaterial = useMemo(
    () =>
      new CustomShaderMaterialVanilla({
        baseMaterial: THREE.MeshDepthMaterial,
        vertexShader,
        uniforms: uniforms,
        depthPacking: THREE.RGBADepthPacking,
      }),
    [uniforms]
  );

  useFrame(({ clock }) => {
    uniforms.uTime.value = clock.elapsedTime;
  });

  const gltf = useGLTF(suzanne);
  const { nodes, materials } = useMemo(() => gltf, [gltf]);

  return (
    <>
      <Perf position="top-left" />
      <OrbitControls />
      <Environment
        background
        files={hdrFile}
        backgroundIntensity={1}
        environmentIntensity={0.6}
      />
      <mesh
        ref={ref}
        geometry={nodes.Suzanne.geometry}
        material={materials["Material.001"]}
        castShadow
        customDepthMaterial={depthMaterial}
        rotation={[0, Math.PI / 2, 0]}
        receiveShadow
      >
        <CustomShaderMaterial
          ref={materialRef as any}
          baseMaterial={THREE.MeshPhysicalMaterial}
          fragmentShader={fragmentShader}
          vertexShader={vertexShader}
          uniforms={uniforms}
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
    </>
  );
}
useGLTF.preload("./public/suzanne.glb");
export default App;
