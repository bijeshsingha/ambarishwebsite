"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
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

        {/* Seamless Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0C0B0B] via-[#0C0B0B]/50 to-[#0C0B0B]/70" />
        <div className="absolute inset-0 bg-radial from-transparent via-[#0C0B0B]/40 to-[#0C0B0B]/85" />
      </div>

      {/* Top Slide Switcher */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-4 flex justify-end items-center">
        <div className="flex items-center space-x-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setImgIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === imgIndex ? "bg-[#B4872F] w-5" : "bg-white/30 hover:bg-white/60 w-1.5"
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Center Zone: Clean, Classic Editorial Headline */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-2 flex flex-col justify-center text-center items-center">
        <div className="max-w-3xl space-y-3">
          <p className="text-xs uppercase tracking-[0.3em] text-[#B4872F] font-semibold">
            Paltan Bazaar • Guwahati
          </p>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal text-[#F5EBDD] leading-[1.08] tracking-tight">
            Hotel Ambarish Grand Residency
            <span className="block text-xl sm:text-2xl lg:text-3xl text-[#B4872F] font-serif italic mt-2 font-normal tracking-wide drop-shadow-sm">
              by Divine View
            </span>
          </h1>

          <p className="text-[#F5EBDD]/80 text-xs sm:text-sm md:text-base font-light max-w-xl mx-auto leading-relaxed pt-1">
            A comfortable Guwahati stay, made simple. 250m from Guwahati Railway Station with clean AC rooms, in-house multi-cuisine dining, and 24/7 front desk hospitality.
          </p>
        </div>
      </div>

      {/* Bottom Zone: Booking Bar fully visible */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-5 sm:pb-7">
        <BookingBar />
      </div>
    </section>
  );
}
