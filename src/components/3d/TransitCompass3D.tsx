"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function CompassModel() {
  const needleRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    // Subtle idle wobble for compass needle
    if (needleRef.current) {
      const time = state.clock.getElapsedTime();
      needleRef.current.rotation.z = Math.sin(time * 1.5) * 0.15 + (state.pointer.x * 0.4);
    }
    if (ringRef.current) {
      ringRef.current.rotation.y += delta * 0.12;
    }
  });

  return (
    <group rotation={[0.4, 0, 0]}>
      {/* Outer Dial Rim */}
      <mesh ref={ringRef}>
        <cylinderGeometry args={[2.4, 2.4, 0.25, 48]} />
        <meshStandardMaterial
          color="#D4AF37"
          metalness={0.9}
          roughness={0.25}
          emissive="#6B5014"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Dial Face Plate */}
      <mesh position={[0, 0.14, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.2, 48]} />
        <meshStandardMaterial color="#0C0B0B" roughness={0.7} metalness={0.2} />
      </mesh>

      {/* Gold Inner Tick Marks Ring */}
      <mesh position={[0, 0.15, 0]}>
        <ringGeometry args={[1.8, 1.95, 36]} />
        <meshStandardMaterial color="#E8C36A" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Central Pivot Hub */}
      <mesh position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.25, 0.25, 0.2, 24]} />
        <meshStandardMaterial color="#B62576" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Compass Needle (North / Railway direction) */}
      <group ref={needleRef} position={[0, 0.24, 0]}>
        {/* North pointer (Deep Magenta Accent) */}
        <mesh position={[0, 0.8, 0]} rotation={[0, 0, 0]}>
          <coneGeometry args={[0.22, 1.5, 4]} />
          <meshStandardMaterial
            color="#B62576"
            metalness={0.85}
            roughness={0.2}
            emissive="#92185C"
            emissiveIntensity={0.4}
          />
        </mesh>

        {/* South pointer (Polished Brass) */}
        <mesh position={[0, -0.8, 0]} rotation={[0, 0, Math.PI]}>
          <coneGeometry args={[0.22, 1.5, 4]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.3} />
        </mesh>
      </group>
    </group>
  );
}

export default function TransitCompass3D() {
  return (
    <div className="relative w-44 h-44 sm:w-52 sm:h-52 mx-auto cursor-grab active:cursor-grabbing">
      <Canvas
        camera={{ position: [0, 4.5, 4], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[4, 6, 3]} intensity={2.2} color="#FFF8EB" />
        <pointLight position={[-4, 2, -2]} intensity={1.2} color="#D4AF37" />
        <pointLight position={[0, -2, 3]} intensity={0.8} color="#B62576" />
        <Float speed={2} rotationIntensity={0.4} floatIntensity={0.5}>
          <CompassModel />
        </Float>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 2.2}
          minPolarAngle={Math.PI / 3.5}
          maxAzimuthAngle={Math.PI / 4}
          minAzimuthAngle={-Math.PI / 4}
        />
      </Canvas>
    </div>
  );
}
