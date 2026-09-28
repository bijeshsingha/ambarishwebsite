"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin } from "lucide-react";
import BookingBar from "@/components/booking/BookingBar";

export default function HeroSection() {
  const [imgIndex, setImgIndex] = useState(0);

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

  return (
    <section className="relative w-full h-[calc(100vh-68px)] min-h-[580px] max-h-[920px] flex flex-col justify-between overflow-hidden bg-[#171513] text-[#FAF8F5]">
      {/* Background Slideshow */}
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

        {/* High-Contrast Multi-Layer Scrim for Flawless Readability Over Bright Photos */}
        {/* Base dark tint to prevent ceiling/wall glare */}
        <div className="absolute inset-0 bg-[#0E0C0A]/50" />

        {/* Directional gradient: Deep header backdrop, subtle center, solid anchor for booking bar */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0E0C0A]/85 via-[#0E0C0A]/40 to-[#0E0C0A]/90" />

        {/* Soft radial vignette concentrated behind center text */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(14,12,10,0.65)_0%,_rgba(14,12,10,0.3)_60%,_transparent_100%)] pointer-events-none" />
      </div>

      {/* Top Editorial Slide Counter & Location */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-5 flex justify-between items-center text-xs tracking-wider uppercase">
        <div className="hidden sm:inline-flex items-center space-x-2 bg-[#1C1917]/85 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-[#C59A45]/30 text-[11px] text-[#E5C378] font-medium tracking-wider shadow-sm">
          <MapPin className="w-3.5 h-3.5 text-[#C59A45] shrink-0" />
          <span>Paltan Bazaar • 250m to Guwahati Railway Station</span>
        </div>
        <div className="flex items-center space-x-3 bg-[#1C1917]/85 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-white/20 text-[11px] text-[#FAF8F5] shadow-sm ml-auto sm:ml-0">
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

      {/* Center Zone: Headline */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-3 sm:py-5 flex flex-col justify-center text-center items-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl space-y-3 sm:space-y-3.5"
        >
          {/* Location Badge */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="inline-flex items-center space-x-2 bg-[#1C1917]/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-[#C59A45]/35 shadow-sm"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#E5C378]" />
            <span className="text-[11px] sm:text-xs uppercase tracking-[0.22em] text-[#E5C378] font-semibold">
              Paltan Bazaar • Guwahati, Assam
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-serif text-3xl sm:text-5xl lg:text-6xl font-medium text-[#FAF8F5] leading-[1.12] tracking-tight drop-shadow-[0_2px_18px_rgba(0,0,0,0.75)]"
          >
            Hotel Ambarish Grand Residency
            <span className="block text-xl sm:text-2xl lg:text-3xl text-[#E5C378] font-serif italic mt-2 font-normal tracking-wide drop-shadow-[0_2px_14px_rgba(0,0,0,0.75)]">
              by Divine View
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-[#FAF8F5] text-xs sm:text-sm md:text-base font-normal max-w-2xl mx-auto leading-relaxed pt-1.5 drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]"
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
