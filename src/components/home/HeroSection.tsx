"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import { MapPin, Sparkles } from "lucide-react";
import BookingBar from "@/components/booking/BookingBar";

export default function HeroSection() {
  const [imgIndex, setImgIndex] = useState(0);

  // Interactive 3D Parallax Tilt state & specular reflection
  const [glintPos, setGlintPos] = useState({ x: 50, y: 50 });
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 120 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(springY, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(springX, [-0.5, 0.5], ["-5deg", "5deg"]);

  const heroSlides = [
    {
      src: "/images/polished/suite-living-wide.webp",
      alt: "Presidential Luxury Suite Living Salon",
    },
    {
      src: "/images/polished/deluxe-king.webp",
      alt: "Double Deluxe King Room",
    },
    {
      src: "/images/polished/hotel-exterior.webp",
      alt: "Hotel Ambarish Grand Residency Facade & Exterior",
    },
    {
      src: "/images/polished/restaurant-dining.webp",
      alt: "The Ambarish Restaurant & Dining",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setImgIndex((prev) => (prev + 1) % heroSlides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(xPct);
    mouseY.set(yPct);
    setGlintPos({
      x: Math.round(((e.clientX - rect.left) / rect.width) * 100),
      y: Math.round(((e.clientY - rect.top) / rect.height) * 100),
    });
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setGlintPos({ x: 50, y: 50 });
  };

  return (
    <section
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-[calc(100vh-68px)] min-h-[620px] max-h-[960px] flex flex-col justify-between overflow-hidden bg-[#171513] text-[#FAF8F5]"
    >
      {/* Background Slideshow: Bright & Clear to showcase hotel architecture */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={heroSlides[imgIndex].src}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={heroSlides[imgIndex].src}
              alt={heroSlides[imgIndex].alt}
              fill
              className="object-cover object-center transform-gpu"
              priority={imgIndex === 0}
              sizes="100vw"
            />
          </motion.div>
        </AnimatePresence>

        {/* Atmospheric Ambient Lighting: Keeps rooms vibrant while adding golden hour warmth */}
        <div className="absolute inset-0 bg-[#0E0C0A]/20 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.08)_0%,_transparent_75%)] pointer-events-none" />

        {/* Soft edge gradients for smooth navbar & booking bar transitions */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0E0C0A]/60 via-transparent to-[#0E0C0A]/75 pointer-events-none" />
      </div>

      {/* Top Editorial Slide Counter & Location */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-5 flex justify-between items-center text-xs tracking-wider uppercase">
        <div className="hidden sm:inline-flex items-center space-x-2 bg-[#1C1917]/85 backdrop-blur-md px-4 py-1.5 rounded-full border border-[#D4AF37]/30 text-[11px] text-[#E5C378] font-medium tracking-wider shadow-md">
          <MapPin className="w-3.5 h-3.5 text-[#C59A45] shrink-0" />
          <span>Paltan Bazaar • 250m to Guwahati Railway Station</span>
        </div>
        <div className="flex items-center space-x-3 bg-[#1C1917]/85 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 text-[11px] text-[#FAF8F5] shadow-md ml-auto sm:ml-0">
          <span className="text-[#E5C378] font-semibold">{String(imgIndex + 1).padStart(2, "0")}</span>
          <span className="text-white/40">/</span>
          <span className="text-[#FAF8F5]/80">{String(heroSlides.length).padStart(2, "0")}</span>
          <div className="flex space-x-1 pl-1.5">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setImgIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === imgIndex ? "bg-[#E5C378] w-5" : "bg-white/40 hover:bg-white/70 w-1.5"
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Center Zone: 3D Royal Crystal Showcase Plinth */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-3 sm:py-5 flex flex-col justify-center text-center items-center [perspective:1200px]">
        <motion.div
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative max-w-3xl mx-auto w-full px-6 py-7 sm:px-12 sm:py-9 rounded-3xl bg-gradient-to-b from-[#1C1815]/60 via-[#14110E]/65 to-[#0E0C0A]/75 backdrop-blur-2xl border border-[#D4AF37]/35 shadow-[0_25px_80px_-15px_rgba(0,0,0,0.85),_0_0_45px_rgba(212,175,55,0.08),_inset_0_1px_1px_rgba(255,255,255,0.2)] text-center space-y-3.5 sm:space-y-4 overflow-hidden group"
        >
          {/* Dynamic Specular Sheen (Reacts to cursor coordinates) */}
          <div
            className="pointer-events-none absolute -inset-px rounded-3xl opacity-60 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background: `radial-gradient(600px circle at ${glintPos.x}% ${glintPos.y}%, rgba(255, 245, 215, 0.12), transparent 50%)`,
            }}
          />

          {/* Delicate Heritage Corner Filigrees */}
          <div className="absolute top-3 left-3.5 w-4 h-4 border-t border-l border-[#E5C378]/50 rounded-tl pointer-events-none" />
          <div className="absolute top-3 right-3.5 w-4 h-4 border-t border-r border-[#E5C378]/50 rounded-tr pointer-events-none" />
          <div className="absolute bottom-3 left-3.5 w-4 h-4 border-b border-l border-[#E5C378]/50 rounded-bl pointer-events-none" />
          <div className="absolute bottom-3 right-3.5 w-4 h-4 border-b border-r border-[#E5C378]/50 rounded-br pointer-events-none" />

          {/* Heritage Star Crest (3D Layer 1) */}
          <motion.div
            style={{ transform: "translateZ(26px)" }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="flex flex-col items-center space-y-1.5"
          >
            <div className="flex items-center space-x-2 text-[#E5C378]">
              <div className="h-[1px] w-6 sm:w-10 bg-gradient-to-r from-transparent to-[#D4AF37]/70" />
              <span className="text-[10px] tracking-widest text-[#E5C378]">★ ★ ★</span>
              <div className="h-[1px] w-6 sm:w-10 bg-gradient-to-l from-transparent to-[#D4AF37]/70" />
            </div>
            <div className="inline-flex items-center space-x-2 bg-[#1C1815]/90 backdrop-blur-md px-4 py-1 rounded-full border border-[#D4AF37]/35 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E5C378] animate-pulse" />
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.24em] text-[#E5C378] font-semibold">
                Paltan Bazaar • Guwahati, Assam
              </span>
            </div>
          </motion.div>

          {/* Chiseled Royal Gold Foil Headline (3D Layer 2) */}
          <motion.h1
            style={{ transform: "translateZ(46px)" }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-serif text-3xl sm:text-5xl lg:text-[3.75rem] font-medium text-chiseled-gold leading-[1.08] tracking-tight py-1 select-none"
          >
            Hotel Ambarish Grand Residency
            <span className="block font-serif italic text-2xl sm:text-3xl lg:text-4xl text-[#E5C378] mt-2 font-light tracking-wide animate-gold-shimmer drop-shadow-[0_2px_16px_rgba(0,0,0,0.9)]">
              by Divine View
            </span>
          </motion.h1>

          {/* Filigree Divider (3D Layer 3) */}
          <motion.div
            style={{ transform: "translateZ(30px)" }}
            className="flex items-center justify-center space-x-3 py-0.5 opacity-75"
          >
            <div className="h-[1px] w-12 sm:w-16 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
            <div className="w-1.5 h-1.5 rotate-45 border border-[#D4AF37] bg-[#1C1815]" />
            <div className="h-[1px] w-12 sm:w-16 bg-gradient-to-l from-transparent via-[#D4AF37] to-transparent" />
          </motion.div>

          {/* Description Paragraph (3D Layer 4) */}
          <motion.p
            style={{ transform: "translateZ(24px)" }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-[#FAF8F5]/90 text-xs sm:text-sm md:text-[15px] font-normal max-w-xl mx-auto leading-relaxed pt-0.5 drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)] text-balance"
          >
            A comfortable Guwahati stay, made simple. 250m from Guwahati Railway Station with clean AC rooms, in-house multi-cuisine dining, and 24/7 front desk hospitality.
          </motion.p>
        </motion.div>
      </div>

      {/* Bottom Zone: Booking Bar */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-5 sm:pb-7">
        <BookingBar />
      </div>
    </section>
  );
}
