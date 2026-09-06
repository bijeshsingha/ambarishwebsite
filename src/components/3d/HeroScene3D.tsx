"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import * as THREE from "three";

function AmbientGeometry() {
  const groupRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    // Smooth cursor parallax
    if (groupRef.current) {
      const targetX = state.pointer.x * 0.45;
      const targetY = -state.pointer.y * 0.3;
      groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, targetX, 2.5, delta);
      groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, targetY, 2.5, delta);
    }

    // Gentle continuous spin
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z += delta * 0.05;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z -= delta * 0.035;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.6}>
        {/* Luxury Grand Primary Ring */}
        <mesh ref={ring1Ref} position={[0, 0.2, -1]} rotation={[Math.PI / 5, Math.PI / 4, 0]}>
          <torusGeometry args={[3.4, 0.022, 16, 120]} />
          <meshStandardMaterial
            color="#D4AF37"
            metalness={0.92}
            roughness={0.2}
            emissive="#B4872F"
            emissiveIntensity={0.25}
          />
        </mesh>

        {/* Counter-balanced Secondary Inner Ring */}
        <mesh ref={ring2Ref} position={[0, -0.1, 0]} rotation={[-Math.PI / 4, Math.PI / 3, 0]}>
          <torusGeometry args={[2.3, 0.018, 16, 90]} />
          <meshStandardMaterial
            color="#F5EBDD"
            metalness={0.85}
            roughness={0.3}
            emissive="#7A5A1B"
            emissiveIntensity={0.15}
          />
        </mesh>

        {/* Subtle Decorative Accent Ring */}
        <mesh position={[1.8, 1.2, -3]} rotation={[Math.PI / 3, 0, Math.PI / 6]}>
          <torusGeometry args={[1.1, 0.012, 16, 60]} />
          <meshStandardMaterial
            color="#B62576"
            metalness={0.9}
            roughness={0.25}
            emissive="#92185C"
            emissiveIntensity={0.3}
          />
        </mesh>
      </Float>

      {/* Floating Golden Stardust Particles */}
      <Sparkles
        count={55}
        scale={[14, 8, 8]}
        size={2.2}
        speed={0.35}
        opacity={0.65}
        color="#E8C36A"
      />
    </group>
  );
}

export default function HeroScene3D() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-75 sm:opacity-85 mix-blend-screen transition-opacity duration-1000">
      <Canvas
        camera={{ position: [0, 0, 7.5], fov: 45 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 8, 5]} intensity={1.8} color="#FFF8EB" />
        <pointLight position={[-6, -4, 2]} intensity={1.2} color="#D4AF37" />
        <pointLight position={[6, 3, -2]} intensity={0.9} color="#B62576" />
        <AmbientGeometry />
      </Canvas>
    </div>
  );
}
