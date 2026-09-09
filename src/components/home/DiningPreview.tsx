"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Clock, UtensilsCrossed, PhoneCall, Wine } from "lucide-react";
import { DINING_INFO } from "@/data/dining";
import CardTilt3D from "@/components/3d/CardTilt3D";

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
      className="bg-[#FAF8F5] py-24 sm:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden text-[#1F1D1A]"
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
              <span className="text-xs uppercase tracking-[0.25em] text-[#9E8255] font-semibold flex items-center gap-1.5">
                <UtensilsCrossed className="w-3.5 h-3.5" />
                In-House Gastronomy
              </span>

              <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#0C0B0A] leading-tight">
                {DINING_INFO.name}
              </h2>

              <p className="text-[#6B635B] text-sm sm:text-base font-light leading-relaxed pt-1">
                Authentic Assamese specialties, wholesome North Indian gravies, sizzling Chinese wok noodles, and freshly cooked breakfasts — prepared to order with farm-fresh regional ingredients.
              </p>
            </div>

            {/* Timings & Service Cards */}
            <div className="space-y-3.5">
              {DINING_INFO.timings.map((t) => (
                <div
                  key={t.meal}
                  className="p-4 sm:p-5 rounded-2xl bg-white border border-[#0C0B0A]/8 shadow-sm flex items-start space-x-4 hover:border-[#9E8255]/40 transition-colors duration-200"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#FAF8F5] flex items-center justify-center text-[#9E8255] shrink-0 mt-0.5 border border-[#0C0B0A]/5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h4 className="font-serif text-lg text-[#0C0B0A] font-normal">{t.meal}</h4>
                      <span className="font-mono text-xs font-semibold text-[#9E8255] bg-[#FAF8F5] px-2.5 py-0.5 rounded-full self-start">
                        {t.hours}
                      </span>
                    </div>
                    <p className="text-xs text-[#6B635B] font-light leading-relaxed">
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
                className="group btn-luxury-gold inline-flex items-center justify-center px-7 py-3.5 text-xs font-bold uppercase tracking-[0.14em] rounded-full"
              >
                <span>View Full 70+ Item Menu</span>
                <ArrowUpRight className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>

              <span className="text-xs text-[#6B635B] flex items-center font-mono">
                <PhoneCall className="w-3.5 h-3.5 mr-1.5 text-[#9E8255]" />
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
            <CardTilt3D maxTilt={4}>
              <div className="relative aspect-[16/10] sm:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-[#0C0B0A]/10 group bg-[#1A1715]">
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

                <div className="absolute inset-0 bg-gradient-to-t from-[#0C0B0A]/85 via-transparent to-transparent pointer-events-none" />

                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between pointer-events-auto">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#BFA058] block">
                      {restaurantAngles[activeIdx].subtitle}
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl text-[#FAF8F5] font-normal">
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
            </CardTilt3D>

            {/* Thumbnail Selector Pills */}
            <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
              {restaurantAngles.map((angle, idx) => (
                <button
                  key={angle.src}
                  onClick={() => setActiveIdx(idx)}
                  className={`relative aspect-[16/11] rounded-xl overflow-hidden border-2 transition-all duration-200 group ${
                    activeIdx === idx
                      ? "border-[#9E8255] ring-2 ring-[#9E8255]/30 scale-[1.02]"
                      : "border-black/10 opacity-70 hover:opacity-100 hover:border-[#9E8255]/50"
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

        {/* Signature Dishes Showcase Strip with 3D Depth */}
        <div className="mt-20 pt-16 border-t border-[#0C0B0A]/10 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-[#9E8255] font-semibold block mb-1">
                Gastronomic Highlights
              </span>
              <h3 className="font-serif text-2xl sm:text-4xl text-[#0C0B0A] font-normal">
                Popular House Specialties
              </h3>
            </div>
            <Link
              href="/dining#menu"
              className="inline-flex items-center text-xs font-semibold uppercase tracking-wider text-[#0C0B0A] hover:text-[#9E8255]"
            >
              <span>Explore Complete 70+ Items Menu</span>
              <ArrowUpRight className="w-4 h-4 ml-1 text-[#9E8255]" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {DINING_INFO.featuredDishes.map((dish) => (
              <CardTilt3D key={dish.id} maxTilt={5} className="h-full">
                <div className="group rounded-3xl bg-white border border-[#0C0B0A]/8 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full">
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#FAF8F5]">
                    <Image
                      src={dish.image}
                      alt={dish.name}
                      fill
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] font-mono font-semibold uppercase tracking-wider bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-[#0C0B0A] shadow-sm border border-black/5">
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
                      <span className="text-[10px] font-mono text-[#9E8255] uppercase tracking-wider font-semibold block">
                        {dish.category}
                      </span>
                      <h4 className="font-serif text-lg font-normal text-[#0C0B0A] mt-0.5">
                        {dish.name}
                      </h4>
                      <p className="text-xs text-[#6B635B] font-light leading-relaxed mt-1">
                        {dish.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#0C0B0A]/8 flex items-center justify-between">
                      <span className="text-xs text-[#6B635B]">Direct Rate</span>
                      <span className="font-serif text-lg font-semibold text-[#9E8255]">
                        ₹{dish.price}
                      </span>
                    </div>
                  </div>
                </div>
              </CardTilt3D>
            ))}
          </div>
        </div>

        {/* Pavillion Bar Showcase Banner */}
        <div className="mt-16 bg-[#0C0B0A] text-[#FAF8F5] rounded-3xl p-8 sm:p-12 border border-white/10 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center space-x-2 bg-[#171412] border border-[#9E8255]/30 px-3.5 py-1.5 rounded-full">
                <Wine className="w-3.5 h-3.5 text-[#9E8255]" />
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#BFA058] font-semibold">
                  Hotel Lounge &amp; Bar &bull; 2nd Floor
                </span>
              </div>

              <h3 className="font-serif text-3xl sm:text-4xl text-white font-normal">
                Pavillion Bar
              </h3>

              <p className="text-xs sm:text-sm text-[#D1C7BD] font-light leading-relaxed">
                An intimate lounge setting for premium spirits, chilled draughts, and evening relaxation. Savor fine single malts, classic cocktails, and cold beers paired with sizzling tandoori and Chinese bar appetizers.
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs pt-2">
                <div className="flex items-center text-[#BFA058] font-mono">
                  <Clock className="w-3.5 h-3.5 mr-1.5" />
                  <span>11:00 AM – 11:00 PM Daily</span>
                </div>
                <span className="text-white/20">&bull;</span>
                <span className="text-[#A89F96]">2nd Floor, Hotel Ambarish</span>
              </div>

              <div className="pt-2">
                <Link
                  href="/dining#pavillion-bar"
                  className="btn-luxury-gold inline-flex items-center px-6 py-3 text-xs font-bold uppercase tracking-[0.14em] rounded-full"
                >
                  <span>Explore Pavillion Bar &amp; Photos</span>
                  <ArrowUpRight className="w-3.5 h-3.5 ml-2" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <CardTilt3D maxTilt={4}>
                <div className="relative aspect-[16/10] sm:aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 shadow-lg group">
                  <Image
                    src="/images/bar/bar1-lounge-seating.webp"
                    alt="Pavillion Bar Lounge - Hotel Ambarish Guwahati"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-3 left-3">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-white/90 bg-black/60 px-2.5 py-1 rounded-full backdrop-blur-sm border border-white/10">
                      Plush Lounge Seating
                    </span>
                  </div>
                </div>
              </CardTilt3D>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
