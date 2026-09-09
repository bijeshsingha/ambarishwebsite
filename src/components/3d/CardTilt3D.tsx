"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface CardTilt3DProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
}

export default function CardTilt3D({
  children,
  className = "",
  maxTilt = 8,
}: CardTilt3DProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Raw mouse coordinates normalized from -0.5 to 0.5
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring physics for rotation and sheen
  const springConfig = { damping: 20, stiffness: 260, mass: 0.5 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [maxTilt, -maxTilt]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-maxTilt, maxTilt]), springConfig);

  const glareX = useTransform(mouseX, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(mouseY, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: "preserve-3d",
        rotateX,
        rotateY,
        WebkitFontSmoothing: "subpixel-antialiased",
        backfaceVisibility: "hidden",
      }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={`relative perspective-1000 ${className}`}
    >
      {children}

      {/* Subtle Specular Sheen Effect on Hover */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden transition-opacity duration-300 z-10"
        style={{
          opacity: isHovered ? 0.08 : 0,
          background: `radial-gradient(circle 320px at ${glareX} ${glareY}, rgba(255, 255, 255, 0.4), transparent 70%)`,
        }}
      />
    </motion.div>
  );
}
