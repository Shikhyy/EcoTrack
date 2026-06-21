"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float } from "@react-three/drei";
import { useRef } from "react";


function LowPolyTree({ color }) {
  const group = useRef();
  
  useFrame(() => {
    group.current.rotation.y += 0.005;
  });

  return (
    <group ref={group}>
      {/* Trunk */}
      <mesh position={[0, -1, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.4, 2, 5]} />
        <meshStandardMaterial color="#8B5A2B" roughness={0.9} flatShading />
      </mesh>
      
      {/* Leaves (Low Poly Icosahedrons) */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <icosahedronGeometry args={[1.5, 0]} />
        <meshStandardMaterial color={color} flatShading roughness={0.8} />
      </mesh>
      <mesh position={[0.8, 0.5, 0.5]} castShadow scale={0.7}>
        <icosahedronGeometry args={[1.2, 0]} />
        <meshStandardMaterial color={color} flatShading roughness={0.8} />
      </mesh>
      <mesh position={[-0.8, 0.6, -0.2]} castShadow scale={0.8}>
        <icosahedronGeometry args={[1.2, 0]} />
        <meshStandardMaterial color={color} flatShading roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.8, -1]} castShadow scale={0.6}>
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color={color} flatShading roughness={0.8} />
      </mesh>
    </group>
  );
}

export default function EarthGlobe({ color }) {
  return (
    <div className="w-full h-full cursor-grab active:cursor-grabbing">
      <Canvas shadows camera={{ position: [0, 2, 6], fov: 45 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 10, 5]} intensity={1.5} castShadow />
        <pointLight position={[-5, -5, -5]} intensity={0.5} color={color} />
        <Float speed={2} rotationIntensity={0.2} floatIntensity={1}>
          <LowPolyTree color={color} />
        </Float>
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
}
