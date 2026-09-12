"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
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
    <section className="relative w-full h-[calc(100vh-68px)] min-h-[560px] max-h-[900px] flex flex-col justify-between overflow-hidden bg-[#0C0B0B] text-[#F5EBDD]">
      {/* Cinematic Background Slideshow */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={heroSlides[imgIndex].src}
            initial={{ opacity: 0, scale: 1.05 }}
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

        {/* Clean Contrast Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0C0B0A]/85 via-black/25 to-black/30" />
      </div>

      {/* Top Editorial Slide Counter */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-5 flex justify-between items-center text-xs font-sans tracking-widest uppercase font-medium">
        <span className="text-[#9E8255] font-medium hidden sm:inline-block">
          Est. Paltan Bazaar &bull; 250m to Railway Station
        </span>
        <div className="flex items-center space-x-3 bg-black/50 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 text-[11px] text-[#F5EBDD]/80">
          <span className="text-[#D4AF37] font-bold">{String(imgIndex + 1).padStart(2, "0")}</span>
          <span className="text-white/30">/</span>
          <span>{String(heroSlides.length).padStart(2, "0")}</span>
          <div className="flex space-x-1 pl-1.5">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setImgIndex(i)}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i === imgIndex ? "bg-[#D4AF37] w-4" : "bg-white/30 hover:bg-white/60 w-1.5"
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Center Zone: Clean, Classic Editorial Headline with Smooth Stagger Motion */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-2 flex flex-col justify-center text-center items-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl space-y-3"
        >
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-xs uppercase tracking-[0.3em] text-[#B4872F] font-semibold"
          >
            Paltan Bazaar • Guwahati
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal text-[#F5EBDD] leading-[1.08] tracking-tight"
          >
            Hotel Ambarish Grand Residency
            <span className="block text-xl sm:text-2xl lg:text-3xl text-[#B4872F] font-serif italic mt-2 font-normal tracking-wide drop-shadow-sm">
              by Divine View
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-[#F5EBDD]/80 text-xs sm:text-sm md:text-base font-light max-w-xl mx-auto leading-relaxed pt-1"
          >
            A comfortable Guwahati stay, made simple. 250m from Guwahati Railway Station with clean AC rooms, in-house multi-cuisine dining, and 24/7 front desk hospitality.
          </motion.p>
        </motion.div>
      </div>

      {/* Bottom Zone: Booking Bar fully visible */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-5 sm:pb-7">
        <BookingBar />
      </div>
    </section>
  );
}
