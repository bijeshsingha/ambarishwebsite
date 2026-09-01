"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Clock, UtensilsCrossed, PhoneCall, Sparkles } from "lucide-react";
import { DINING_INFO } from "@/data/dining";

const restaurantAngles = [
  {
    src: "/images/polished/restaurant-dining.webp",
    alt: "The Ambarish Restaurant Main Dining Hall",
    title: "Main Dining Hall",
    subtitle: "Air-Conditioned & Elegant Ambiance",
  },
  {
    src: "/images/polished/restaurant-empty-symmetrical.webp",
    alt: "The Ambarish Restaurant Symmetrical Hall View",
    title: "Spacious Layout",
    subtitle: "Seating for 60+ Guests & Families",
  },
  {
    src: "/images/polished/restaurant-empty-angle-1.webp",
    alt: "The Ambarish Restaurant Side Angle View",
    title: "Side View & Warm Lights",
    subtitle: "Quiet & Relaxing Dining Experience",
  },
  {
    src: "/images/polished/restaurant-empty-angle-2.webp",
    alt: "The Ambarish Restaurant Corner Seating",
    title: "Corner Banquette Tables",
    subtitle: "Comfortable Configurations for Private Dining",
  },
];

export default function DiningPreview() {
  const [activeIdx, setActiveIdx] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const parallaxY = useTransform(scrollYProgress, [0, 1], [-15, 15]);

  return (
    <section
      ref={containerRef}
      className="bg-[#FAF7F4] py-24 sm:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Story & Timings (6 Cols) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-6 space-y-8"
          >
            <div className="space-y-3">
              <span className="text-xs uppercase tracking-[0.25em] text-[#B4872F] font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                In-House Gastronomy
              </span>

              <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#0C0B0B] leading-tight">
                {DINING_INFO.name}
              </h2>

              <p className="text-[#7A7067] text-sm sm:text-base font-light leading-relaxed pt-1">
                Authentic Assamese specialties, wholesome North Indian gravies, sizzling Chinese wok noodles, and freshly cooked breakfasts — crafted fresh to order with local ingredients.
              </p>
            </div>

            {/* Timings & Service Cards */}
            <div className="space-y-3.5">
              {DINING_INFO.timings.map((t) => (
                <div
                  key={t.meal}
                  className="p-4 sm:p-5 rounded-2xl bg-[#FFFFFF] border border-[#0C0B0B]/8 shadow-sm flex items-start space-x-4 hover:border-[#B4872F]/30 transition-colors duration-200"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#FAF7F4] flex items-center justify-center text-[#B4872F] shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h4 className="font-serif text-lg text-[#0C0B0B] font-normal">{t.meal}</h4>
                      <span className="font-mono text-xs font-semibold text-[#B4872F] bg-[#FAF7F4] px-2.5 py-0.5 rounded-full self-start">
                        {t.hours}
                      </span>
                    </div>
                    <p className="text-xs text-[#7A7067] font-light leading-relaxed">
                      {t.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/dining"
                className="group inline-flex items-center justify-center px-7 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-white bg-[#0C0B0B] hover:bg-[#B62576] rounded-full transition-all duration-200 shadow-md hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>View Full 70+ Item Menu</span>
                <ArrowUpRight className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>

              <span className="text-xs text-[#7A7067] flex items-center">
                <PhoneCall className="w-3.5 h-3.5 mr-1.5 text-[#B4872F]" />
                In-Room Dining: Dial Ext 9
              </span>
            </div>
          </motion.div>

          {/* Right Column: Photography Showcase with Multi-Angle Thumbnails (6 Cols) */}
          <motion.div
            style={{ y: parallaxY }}
            className="lg:col-span-6 space-y-4"
          >
            {/* Primary Featured Image View */}
            <div className="relative aspect-[16/10] sm:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-[#0C0B0B]/10 group bg-[#1A1715]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={restaurantAngles[activeIdx].src}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="absolute inset-0"
                >
                  <Image
                    src={restaurantAngles[activeIdx].src}
                    alt={restaurantAngles[activeIdx].alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                </motion.div>
              </AnimatePresence>

              <div className="absolute inset-0 bg-gradient-to-t from-[#0C0B0B]/85 via-transparent to-transparent pointer-events-none" />

              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between pointer-events-auto">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#B4872F] block">
                    {restaurantAngles[activeIdx].subtitle}
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl text-[#F5EBDD] font-normal">
                    {restaurantAngles[activeIdx].title}
                  </h3>
                </div>

                <Link
                  href="/dining"
                  className="hidden sm:inline-flex px-4 py-2 text-xs font-semibold text-white bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full border border-white/20 transition-colors"
                >
                  Explore Menu &rarr;
                </Link>
              </div>
            </div>

            {/* Thumbnail Selector Pills (Authentic Restaurant Angles) */}
            <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
              {restaurantAngles.map((angle, idx) => (
                <button
                  key={angle.src}
                  onClick={() => setActiveIdx(idx)}
                  className={`relative aspect-[16/11] rounded-xl overflow-hidden border-2 transition-all duration-200 group ${
                    activeIdx === idx
                      ? "border-[#B62576] ring-2 ring-[#B62576]/30 scale-[1.02]"
                      : "border-black/10 opacity-70 hover:opacity-100 hover:border-[#B4872F]/50"
                  }`}
                  aria-label={`View ${angle.title}`}
                >
                  <Image
                    src={angle.src}
                    alt={angle.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 25vw, 15vw"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                </button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Signature Dishes Showcase Strip */}
        <div className="mt-20 pt-16 border-t border-[#0C0B0B]/10 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-[#B4872F] font-semibold block mb-1">
                Gastronomic Highlights
              </span>
              <h3 className="font-serif text-2xl sm:text-4xl text-[#0C0B0B] font-normal">
                Popular House Specialties
              </h3>
            </div>
            <Link
              href="/dining#menu"
              className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-[#B62576] hover:text-[#9A1D62]"
            >
              <span>Explore Complete 70+ Items Menu</span>
              <ArrowUpRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {DINING_INFO.featuredDishes.map((dish) => (
              <div
                key={dish.id}
                className="group rounded-3xl bg-[#FFFFFF] border border-[#0C0B0B]/8 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#FAF7F4]">
                  <Image
                    src={dish.image}
                    alt={dish.name}
                    fill
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] font-mono font-semibold uppercase tracking-wider bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-[#0C0B0B] shadow-sm border border-black/5">
                      {dish.tag}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span
                      className={`w-4 h-4 border rounded-sm flex items-center justify-center bg-white/95 shadow-sm ${
                        dish.isVeg ? "border-green-600" : "border-red-600"
                      }`}
                      title={dish.isVeg ? "Vegetarian" : "Non-Vegetarian"}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          dish.isVeg ? "bg-green-600" : "bg-red-600"
                        }`}
                      />
                    </span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[10px] font-mono text-[#B4872F] uppercase tracking-wider font-semibold block">
                      {dish.category}
                    </span>
                    <h4 className="font-serif text-lg font-normal text-[#0C0B0B] mt-0.5">
                      {dish.name}
                    </h4>
                    <p className="text-xs text-[#7A7067] font-light leading-relaxed mt-1">
                      {dish.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#0C0B0B]/8 flex items-center justify-between">
                    <span className="text-xs text-[#7A7067]">Direct Rate</span>
                    <span className="font-serif text-lg font-bold text-[#B4872F]">
                      ₹{dish.price}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
