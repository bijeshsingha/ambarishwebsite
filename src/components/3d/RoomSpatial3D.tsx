"use client";

import React, { useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";

const HOTSPOTS = [
  {
    id: "bath",
    position: [0.78, 0.6, -1.75] as [number, number, number],
    title: "Ensuite Bathroom",
    detail: "Enclosed bathroom with ceramic toilet, glazed shower cabin, and vanity washbasin.",
  },
  {
    id: "bed",
    position: [1.4, 0.7, 0.2] as [number, number, number],
    title: "Master King Bed",
    detail: "King bed with headboard against the exterior wall, directly facing the wall-mounted Smart TV.",
  },
  {
    id: "kitchen",
    position: [-1.2, 0.6, -2.1] as [number, number, number],
    title: "Pantry Kitchenette",
    detail: "Kitchen counter with stainless steel sink, 4-burner cooktop, and preparation surface.",
  },
  {
    id: "living",
    position: [-1.4, 0.6, 0.1] as [number, number, number],
    title: "Living Salon",
    detail: "Lounge with 3-seater sofa, twin dressing mirrors, and dedicated entrance foyer.",
  },
  {
    id: "ac",
    position: [0.0, 0.6, 2.3] as [number, number, number],
    title: "Dual Split AC Units",
    detail: "Independent climate control units mounted in both the Living Salon and Bedroom.",
  },
  {
    id: "nook",
    position: [-1.2, 0.5, 1.8] as [number, number, number],
    title: "Twin Seating Nooks",
    detail: "Armchair and coffee table seating nooks by the windows in each room.",
  },
];

function SuiteArchitecturalModel({
  activeHotspot,
  setActiveHotspot,
}: {
  activeHotspot: string | null;
  setActiveHotspot: (id: string | null) => void;
}) {
  const modelRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    // Gentle idle spin when user is not actively inspecting a hotspot
    if (modelRef.current && !activeHotspot) {
      modelRef.current.rotation.y += delta * 0.035;
    }
  });

  return (
    <group ref={modelRef} position={[0, -0.6, 0]}>
      {/* =========================================================
          1. FLOOR PLATES (1:1 Architectural Zoning)
          ========================================================= */}
      {/* Living Room Timber Floor (X: -2.5 to 0.1, Z: -2.5 to 2.5) */}
      <mesh position={[-1.2, 0, 0]} receiveShadow>
        <boxGeometry args={[2.6, 0.12, 5.0]} />
        <meshStandardMaterial color="#826143" roughness={0.65} metalness={0.08} />
      </mesh>

      {/* Main Bedroom Timber Floor (X: 0.1 to 2.5, Z: -1.08 to 2.5) */}
      <mesh position={[1.3, 0, 0.71]} receiveShadow>
        <boxGeometry args={[2.4, 0.12, 3.58]} />
        <meshStandardMaterial color="#8E6A4B" roughness={0.65} metalness={0.08} />
      </mesh>

      {/* Bedroom Upper Corridor (Right of Bathroom, X: 1.46 to 2.5, Z: -2.5 to -1.08) */}
      <mesh position={[1.98, 0, -1.79]} receiveShadow>
        <boxGeometry args={[1.04, 0.12, 1.42]} />
        <meshStandardMaterial color="#8E6A4B" roughness={0.65} metalness={0.08} />
      </mesh>

      {/* Bathroom Polished Marble Tile Floor (X: 0.1 to 1.46, Z: -2.5 to -1.08) */}
      <mesh position={[0.78, 0.01, -1.79]} receiveShadow>
        <boxGeometry args={[1.36, 0.12, 1.42]} />
        <meshStandardMaterial color="#EAE6DE" roughness={0.22} metalness={0.15} />
      </mesh>

      {/* =========================================================
          2. ARCHITECTURAL PERIMETER WALLS (Low Profile Cutaway)
          ========================================================= */}
      {/* Back Wall (Z: -2.5) */}
      <mesh position={[0, 0.45, -2.45]}>
        <boxGeometry args={[5.0, 0.8, 0.1]} />
        <meshStandardMaterial color="#F3EFEA" roughness={0.8} />
      </mesh>

      {/* Left Wall (X: -2.5) */}
      <mesh position={[-2.45, 0.45, 0]}>
        <boxGeometry args={[0.1, 0.8, 5.0]} />
        <meshStandardMaterial color="#EFEBE4" roughness={0.8} />
      </mesh>

      {/* Right Wall (X: +2.5) */}
      <mesh position={[2.45, 0.45, 0]}>
        <boxGeometry args={[0.1, 0.8, 5.0]} />
        <meshStandardMaterial color="#EFEBE4" roughness={0.8} />
      </mesh>

      {/* Front Wall (Z: +2.5) with Window Openings */}
      <mesh position={[-1.9, 0.45, 2.45]}>
        <boxGeometry args={[1.2, 0.8, 0.1]} />
        <meshStandardMaterial color="#F3EFEA" roughness={0.8} />
      </mesh>
      <mesh position={[0.0, 0.45, 2.45]}>
        <boxGeometry args={[1.0, 0.8, 0.1]} />
        <meshStandardMaterial color="#F3EFEA" roughness={0.8} />
      </mesh>
      <mesh position={[1.9, 0.45, 2.45]}>
        <boxGeometry args={[1.2, 0.8, 0.1]} />
        <meshStandardMaterial color="#F3EFEA" roughness={0.8} />
      </mesh>

      {/* =========================================================
          3. INTERNAL PARTITION WALLS & BATHROOM ENCLOSURE
          ========================================================= */}
      {/* Center Dividing Wall (X: 0.1, from Z: -0.85 down to Z: 2.45) */}
      <mesh position={[0.1, 0.45, 0.8]}>
        <boxGeometry args={[0.08, 0.8, 3.3]} />
        <meshStandardMaterial color="#E8E2D8" roughness={0.8} />
      </mesh>

      {/* Bathroom Left Wall along Center Axis (X: 0.1, from Z: -2.45 to -1.08) */}
      <mesh position={[0.1, 0.45, -1.79]}>
        <boxGeometry args={[0.08, 0.8, 1.42]} />
        <meshStandardMaterial color="#E8E2D8" roughness={0.8} />
      </mesh>

      {/* Bathroom Right Wall (X: 1.46, from Z: -2.45 to -1.08) */}
      <mesh position={[1.46, 0.45, -1.79]}>
        <boxGeometry args={[0.08, 0.8, 1.42]} />
        <meshStandardMaterial color="#E8E2D8" roughness={0.8} />
      </mesh>

      {/* Bathroom Bottom Wall (Z: -1.08, from X: 0.6 to 1.46) */}
      <mesh position={[1.03, 0.45, -1.08]}>
        <boxGeometry args={[0.94, 0.8, 0.08]} />
        <meshStandardMaterial color="#E8E2D8" roughness={0.8} />
      </mesh>

      {/* Bathroom Inward-Swinging Door Leaf (At Z: -1.08, opening into bathroom) */}
      <mesh position={[0.26, 0.38, -1.22]} rotation={[0, -0.65, 0]}>
        <boxGeometry args={[0.03, 0.68, 0.42]} />
        <meshStandardMaterial color="#9E8255" roughness={0.5} />
      </mesh>

      {/* Bedroom Door Leaf from Living Area (Between Z: -0.9 and -1.2) */}
      <mesh position={[0.26, 0.38, -0.75]} rotation={[0, 0.75, 0]}>
        <boxGeometry args={[0.03, 0.68, 0.45]} />
        <meshStandardMaterial color="#9E8255" roughness={0.5} />
      </mesh>

      {/* Suite Main Entry Door (Top-Left Wall, X: -2.45, Z: -1.7) */}
      <mesh position={[-2.32, 0.38, -1.55]} rotation={[0, 0.75, 0]}>
        <boxGeometry args={[0.03, 0.68, 0.45]} />
        <meshStandardMaterial color="#9E8255" roughness={0.5} />
      </mesh>

      {/* =========================================================
          4. ENSUITE BATHROOM INTERIOR (Correct Placement)
          ========================================================= */}
      {/* Ceramic Toilet WC (Top-Left of Bathroom: X ~ 0.45, Z ~ -2.15) */}
      <group position={[0.45, 0.1, -2.15]}>
        <mesh position={[0, 0.16, 0]}>
          <cylinderGeometry args={[0.12, 0.09, 0.22, 16]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.26, -0.14]}>
          <boxGeometry args={[0.24, 0.28, 0.12]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.2} />
        </mesh>
      </group>

      {/* Glazed Shower Cabin (Top-Right of Bathroom: X ~ 1.1, Z ~ -2.1) */}
      <group position={[1.1, 0.1, -2.1]}>
        {/* Shower Tray Base */}
        <mesh position={[0, 0.03, 0]}>
          <boxGeometry args={[0.62, 0.04, 0.62]} />
          <meshStandardMaterial color="#D6D0C5" roughness={0.4} />
        </mesh>
        {/* Glass Enclosure Left Partition */}
        <mesh position={[-0.31, 0.38, 0]}>
          <boxGeometry args={[0.02, 0.68, 0.62]} />
          <meshPhysicalMaterial color="#E8F4F8" transmission={0.9} transparent opacity={1} roughness={0.05} ior={1.4} />
        </mesh>
        {/* Glass Enclosure Front Partition */}
        <mesh position={[0, 0.38, 0.31]}>
          <boxGeometry args={[0.62, 0.68, 0.02]} />
          <meshPhysicalMaterial color="#E8F4F8" transmission={0.9} transparent opacity={1} roughness={0.05} ior={1.4} />
        </mesh>
        {/* Rain Shower Head */}
        <mesh position={[0, 0.66, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.02, 16]} />
          <meshStandardMaterial color="#BFA058" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* Vanity Wash Basin Counter (Bottom-Right of Bathroom: X ~ 1.15, Z ~ -1.4) */}
      <group position={[1.15, 0.1, -1.4]}>
        <mesh position={[0, 0.22, 0]}>
          <boxGeometry args={[0.52, 0.34, 0.36]} />
          <meshStandardMaterial color="#2E2824" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.4, 0]}>
          <cylinderGeometry args={[0.13, 0.11, 0.06, 16]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.2} />
        </mesh>
        {/* Vanity Wall Mirror against right bathroom wall */}
        <mesh position={[0.26, 0.48, 0]}>
          <boxGeometry args={[0.02, 0.4, 0.32]} />
          <meshStandardMaterial color="#D8E4F2" metalness={0.95} roughness={0.05} />
        </mesh>
      </group>

      {/* =========================================================
          5. MASTER BEDROOM (With Headboard against Right Wall)
          ========================================================= */}
      {/* Master King Bed (Headboard against East/Right Wall X: 2.38) */}
      <group position={[1.45, 0.1, 0.2]}>
        {/* Bed Platform Frame */}
        <mesh position={[0, 0.15, 0]} castShadow>
          <boxGeometry args={[1.75, 0.24, 1.6]} />
          <meshStandardMaterial color="#2E241E" roughness={0.7} />
        </mesh>
        {/* Mattress with Crisp White Linens */}
        <mesh position={[-0.05, 0.31, 0]} castShadow>
          <boxGeometry args={[1.65, 0.18, 1.5]} />
          <meshStandardMaterial color="#FAF8F5" roughness={0.9} />
        </mesh>
        {/* Headboard against East/Right Wall */}
        <mesh position={[0.85, 0.48, 0]}>
          <boxGeometry args={[0.08, 0.65, 1.6]} />
          <meshStandardMaterial color="#9E8255" metalness={0.5} roughness={0.4} />
        </mesh>
        {/* Dual Pillows against Headboard */}
        <mesh position={[0.62, 0.42, -0.38]} rotation={[0, 0, -0.2]}>
          <boxGeometry args={[0.3, 0.1, 0.48]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.9} />
        </mesh>
        <mesh position={[0.62, 0.42, 0.38]} rotation={[0, 0, -0.2]}>
          <boxGeometry args={[0.3, 0.1, 0.48]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.9} />
        </mesh>
        {/* Velvet Bed Runner */}
        <mesh position={[-0.55, 0.405, 0]}>
          <boxGeometry args={[0.42, 0.02, 1.45]} />
          <meshStandardMaterial color="#6E1A3C" roughness={0.8} />
        </mesh>
      </group>

      {/* Wall-Mounted 55" Smart TV on Center Dividing Wall (Facing Bed) */}
      <mesh position={[0.16, 0.45, 0.2]}>
        <boxGeometry args={[0.03, 0.38, 0.72]} />
        <meshStandardMaterial color="#111111" roughness={0.2} metalness={0.8} />
      </mesh>

      {/* Bedroom Sitting Nook (Bottom Window: Z ~ 1.8, X ~ 1.35) */}
      <group position={[1.35, 0.1, 1.8]}>
        {/* Round Coffee Table */}
        <mesh position={[0, 0.16, 0]}>
          <cylinderGeometry args={[0.24, 0.24, 0.2, 24]} />
          <meshStandardMaterial color="#9E8255" metalness={0.6} roughness={0.4} />
        </mesh>
        {/* Left Armchair */}
        <mesh position={[-0.45, 0.2, 0]} rotation={[0, 0.3, 0]}>
          <boxGeometry args={[0.34, 0.3, 0.34]} />
          <meshStandardMaterial color="#C8BEB0" roughness={0.8} />
        </mesh>
        {/* Right Armchair */}
        <mesh position={[0.45, 0.2, 0]} rotation={[0, -0.3, 0]}>
          <boxGeometry args={[0.34, 0.3, 0.34]} />
          <meshStandardMaterial color="#C8BEB0" roughness={0.8} />
        </mesh>
      </group>

      {/* Bedroom Split AC Unit on Bottom Wall */}
      <mesh position={[1.9, 0.65, 2.42]}>
        <boxGeometry args={[0.55, 0.16, 0.08]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
      </mesh>

      {/* =========================================================
          6. LIVING AREA & KITCHENETTE (Left Half)
          ========================================================= */}
      {/* Kitchenette Counter along Top Wall (X ~ -1.2, Z ~ -2.2) */}
      <group position={[-1.2, 0.1, -2.18]}>
        <mesh position={[0, 0.18, 0]} castShadow>
          <boxGeometry args={[1.9, 0.36, 0.5]} />
          <meshStandardMaterial color="#3A312A" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.37, 0]}>
          <boxGeometry args={[1.94, 0.04, 0.54]} />
          <meshStandardMaterial color="#E8E0D5" roughness={0.3} />
        </mesh>
        {/* Stainless Steel Sink Basin (Left) */}
        <mesh position={[-0.45, 0.395, 0]}>
          <boxGeometry args={[0.4, 0.02, 0.3]} />
          <meshStandardMaterial color="#A8A8A8" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Chrome Faucet */}
        <mesh position={[-0.45, 0.46, -0.1]}>
          <cylinderGeometry args={[0.015, 0.015, 0.12, 12]} />
          <meshStandardMaterial color="#D0D0D0" metalness={0.95} roughness={0.1} />
        </mesh>
        {/* 4-Burner Cooktop (Right) */}
        <mesh position={[0.45, 0.395, 0]}>
          <boxGeometry args={[0.42, 0.02, 0.32]} />
          <meshStandardMaterial color="#1C1A18" roughness={0.4} />
        </mesh>
      </group>

      {/* 3-Seater Sofa along Left Wall (X ~ -2.15, Z ~ 0.1) */}
      <group position={[-2.15, 0.1, 0.1]}>
        <mesh position={[0, 0.15, 0]} castShadow>
          <boxGeometry args={[0.55, 0.28, 1.8]} />
          <meshStandardMaterial color="#C8BEB0" roughness={0.8} />
        </mesh>
        <mesh position={[-0.22, 0.35, 0]}>
          <boxGeometry args={[0.14, 0.35, 1.8]} />
          <meshStandardMaterial color="#BDB3A5" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.26, -0.85]}>
          <boxGeometry args={[0.55, 0.2, 0.12]} />
          <meshStandardMaterial color="#BDB3A5" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.26, 0.85]}>
          <boxGeometry args={[0.55, 0.2, 0.12]} />
          <meshStandardMaterial color="#BDB3A5" roughness={0.8} />
        </mesh>
      </group>

      {/* Dressing Mirror on Lower Left Wall (X: -2.44, Z: 1.35) */}
      <mesh position={[-2.44, 0.45, 1.35]}>
        <boxGeometry args={[0.02, 0.55, 0.4]} />
        <meshStandardMaterial color="#C5D3E8" metalness={0.95} roughness={0.05} />
      </mesh>

      {/* Dressing Mirror on Center Dividing Wall (X: 0.05, Z: 1.35) */}
      <mesh position={[0.05, 0.45, 1.35]}>
        <boxGeometry args={[0.02, 0.55, 0.4]} />
        <meshStandardMaterial color="#C5D3E8" metalness={0.95} roughness={0.05} />
      </mesh>

      {/* Living Room Sitting Nook (Bottom Window: Z ~ 1.8, X ~ -1.2) */}
      <group position={[-1.2, 0.1, 1.8]}>
        <mesh position={[0, 0.16, 0]}>
          <cylinderGeometry args={[0.24, 0.24, 0.2, 24]} />
          <meshStandardMaterial color="#9E8255" metalness={0.6} roughness={0.4} />
        </mesh>
        <mesh position={[-0.45, 0.2, 0]} rotation={[0, 0.3, 0]}>
          <boxGeometry args={[0.34, 0.3, 0.34]} />
          <meshStandardMaterial color="#C8BEB0" roughness={0.8} />
        </mesh>
        <mesh position={[0.45, 0.2, 0]} rotation={[0, -0.3, 0]}>
          <boxGeometry args={[0.34, 0.3, 0.34]} />
          <meshStandardMaterial color="#C8BEB0" roughness={0.8} />
        </mesh>
      </group>

      {/* Living Room Split AC Unit on Bottom Wall */}
      <mesh position={[-1.9, 0.65, 2.42]}>
        <boxGeometry args={[0.55, 0.16, 0.08]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
      </mesh>

      {/* =========================================================
          7. INTERACTIVE HOTSPOT MARKERS
          ========================================================= */}
      {HOTSPOTS.map((h) => {
        const isSelected = activeHotspot === h.id;
        return (
          <group key={h.id} position={h.position}>
            <Html center distanceFactor={7}>
              <button
                type="button"
                onClick={() => setActiveHotspot(isSelected ? null : h.id)}
                className={`group relative flex items-center justify-center transition-all duration-300 ${
                  isSelected ? "scale-125" : "hover:scale-115"
                }`}
                aria-label={h.title}
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shadow-md border backdrop-blur-md transition-all ${
                    isSelected
                      ? "bg-[#9E8255] text-[#0C0B0A] border-white ring-4 ring-[#9E8255]/30 scale-110"
                      : "bg-[#0C0B0A]/90 text-[#FAF8F5] border-[#9E8255] hover:bg-[#9E8255] hover:text-[#0C0B0A]"
                  }`}
                >
                  +
                </span>

                {isSelected && (
                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-52 p-3 rounded-xl bg-[#0C0B0A]/95 text-[#FAF8F5] border border-[#9E8255]/50 shadow-xl backdrop-blur-xl text-left z-50 animate-in fade-in zoom-in-95 duration-200">
                    <span className="text-[10px] font-sans text-[#BFA058] uppercase font-bold block mb-1">
                      {h.title}
                    </span>
                    <p className="text-[11px] text-[#D1C7BD] font-light leading-snug">
                      {h.detail}
                    </p>
                  </div>
                )}
              </button>
            </Html>
          </group>
        );
      })}
    </group>
  );
}

export default function RoomSpatial3D() {
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  return (
    <div className="relative w-full h-[420px] sm:h-[500px] bg-gradient-to-b from-[#141210] to-[#0A0908] rounded-3xl overflow-hidden border border-white/10 shadow-xl select-none">
      {/* Top Architectural Legend */}
      <div className="absolute top-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="flex items-center space-x-2 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
          <span className="w-2 h-2 rounded-full bg-[#BFA058] animate-pulse" />
          <span className="text-[10px] font-sans tracking-wider uppercase text-[#FAF8F5] font-semibold">
            3D Cutaway Suite Floorplan
          </span>
        </div>

        <div className="bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-sans text-[#A89F96] border border-white/10 hidden sm:block">
          Rotate 360&deg; &bull; Click (+) Hotspots to Discover
        </div>
      </div>

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [3.8, 4.4, 4.2], fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={1.1} color="#FFFBF5" />
        <directionalLight position={[6, 9, 5]} intensity={2.2} color="#FFF5DF" />
        <pointLight position={[-4, 3, -2]} intensity={1.0} color="#BFA058" />
        <pointLight position={[2, -2, 4]} intensity={0.6} color="#8A6543" />
        <SuiteArchitecturalModel
          activeHotspot={activeHotspot}
          setActiveHotspot={setActiveHotspot}
        />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 2.3}
          minPolarAngle={Math.PI / 4.2}
        />
      </Canvas>

      {/* Bottom Hotspots Navigation Strip */}
      <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
        {HOTSPOTS.map((h) => (
          <button
            key={h.id}
            type="button"
            onClick={() => setActiveHotspot(activeHotspot === h.id ? null : h.id)}
            className={`px-3 py-1.5 rounded-full text-[10px] font-sans uppercase tracking-wider transition-all duration-200 border ${
              activeHotspot === h.id
                ? "bg-[#9E8255] text-[#0C0B0A] border-white shadow-md font-bold scale-105"
                : "bg-black/60 text-[#FAF8F5]/80 border-white/10 hover:border-[#9E8255] hover:text-[#BFA058]"
            }`}
          >
            {h.title}
          </button>
        ))}
      </div>
    </div>
  );
}
