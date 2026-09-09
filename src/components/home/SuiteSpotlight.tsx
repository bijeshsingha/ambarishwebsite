"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Layers, Wind, Tv, Utensils } from "lucide-react";
import { ROOMS } from "@/data/rooms";
import { formatCurrencyINR } from "@/lib/formatters";
import CardTilt3D from "@/components/3d/CardTilt3D";

const SUITE_GALLERY = [
  {
    id: "salon",
    src: "/images/polished/suite-living-wide.webp",
    title: "Private Living Drawing Salon",
    tagline: "Expansive drawing room with comfortable sofa seating & pantry kitchenette",
    badge: "Living Drawing Room",
  },
  {
    id: "bedroom",
    src: "/images/polished/suite-bedroom-full.webp",
    title: "Master King Bedroom",
    tagline: "Sound-insulated bedroom with bespoke King bed facing 55\" Smart OLED TV",
    badge: "Master King Bedroom",
  },
  {
    id: "bathroom",
    src: "/images/polished/suite-bathroom.webp",
    title: "Ensuite Marble Bathroom",
    tagline: "Modern glass shower cabin, continuous hot water geyser & designer vanity",
    badge: "Ensuite Bathroom",
  },
];

export default function SuiteSpotlight() {
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const suite = ROOMS.find((r) => r.slug === "suite-room");
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const parallaxY = useTransform(scrollYProgress, [0, 1], [-15, 15]);

  if (!suite) return null;

  const currentPhoto = SUITE_GALLERY[activePhotoIdx];

  return (
    <section
      ref={containerRef}
      className="relative bg-[#0C0B0A] text-[#FAF8F5] py-24 sm:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden border-t border-b border-white/5"
    >
      {/* Warm Ambient Underglow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#9E8255]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Curated Photo Showcase (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Main Stage Photo Frame */}
            <motion.div style={{ y: parallaxY }} className="relative">
              <CardTilt3D maxTilt={4}>
                <div className="relative aspect-[16/10] sm:aspect-[16/9] rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-[#141210]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentPhoto.id}
                      initial={{ opacity: 0, scale: 1.03 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.45, ease: "easeInOut" }}
                      className="relative w-full h-full"
                    >
                      <Image
                        src={currentPhoto.src}
                        alt={currentPhoto.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 60vw"
                        priority
                      />
                    </motion.div>
                  </AnimatePresence>

                  <div className="absolute inset-0 bg-gradient-to-t from-[#0C0B0A]/85 via-transparent to-transparent pointer-events-none" />

                  {/* Price Tariff Badge */}
                  <div className="absolute top-6 left-6 bg-[#171412]/90 backdrop-blur-md text-[#FAF8F5] rounded-2xl px-5 py-3 shadow-xl border border-[#9E8255]/40 z-10">
                    <span className="text-[9px] uppercase tracking-widest font-mono block text-[#9E8255]">
                      Direct Tariff from
                    </span>
                    <span className="font-serif text-2xl sm:text-3xl font-medium block">
                      {formatCurrencyINR(suite.basePrice)}
                    </span>
                    <span className="text-[10px] text-[#A89F96] block">/ night (EP Plan)</span>
                  </div>

                  {/* Active Zone Label */}
                  <div className="absolute bottom-6 left-6 z-10 max-w-[70%]">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#BFA058] bg-black/75 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 inline-block mb-1.5">
                      {currentPhoto.badge}
                    </span>
                    <p className="text-xs text-white/80 font-light drop-shadow line-clamp-1 hidden sm:block">
                      {currentPhoto.tagline}
                    </p>
                  </div>
                </div>
              </CardTilt3D>
            </motion.div>

            {/* Photo Gallery Thumbnail Switchers */}
            <div className="grid grid-cols-3 gap-3 pt-1">
              {SUITE_GALLERY.map((photo, index) => {
                const isActive = activePhotoIdx === index;
                return (
                  <button
                    key={photo.id}
                    type="button"
                    onClick={() => setActivePhotoIdx(index)}
                    className={`group text-left p-2 sm:p-2.5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "bg-[#1E1A17] border-[#9E8255] ring-1 ring-[#9E8255]/50 shadow-lg"
                        : "bg-[#141210] border-white/5 hover:border-white/20 hover:bg-[#171513]"
                    }`}
                  >
                    <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-2">
                      <Image
                        src={photo.src}
                        alt={photo.badge}
                        fill
                        className={`object-cover transition-all duration-500 ${
                          isActive
                            ? "brightness-105 scale-100"
                            : "brightness-70 group-hover:brightness-95 group-hover:scale-105"
                        }`}
                        sizes="200px"
                      />
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <span
                        className={`w-1.5 h-1.5 rounded-full transition-colors ${
                          isActive ? "bg-[#9E8255]" : "bg-white/20 group-hover:bg-white/40"
                        }`}
                      />
                      <p
                        className={`text-[11px] sm:text-xs font-medium font-serif truncate transition-colors ${
                          isActive ? "text-[#FAF8F5]" : "text-[#A89F96] group-hover:text-[#FAF8F5]"
                        }`}
                      >
                        {photo.badge}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Editorial Narrative & Specifications (5 Cols) */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5 space-y-8"
          >
            <div className="space-y-3">
              <span className="text-xs uppercase tracking-[0.25em] text-[#9E8255] font-semibold block">
                Signature Accommodation
              </span>

              <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#FAF8F5] leading-tight">
                The Presidential <br />
                <span className="text-[#BFA058] italic">Luxury Suite</span>
              </h2>

              <p className="text-[#FAF8F5]/75 text-sm sm:text-base font-light leading-relaxed pt-2">
                The pinnacle of hospitality at Hotel Ambarish Grand Residency by Divine View. Spanning 460 sq.ft, the suite offers complete architectural separation between an independent living salon with kitchenette pantry, and a quiet master bedroom with ensuite marble bathroom.
              </p>
            </div>

            {/* Suite Highlight Grid matching Floor Plan */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[#141210] border border-white/5 space-y-1.5 hover:border-[#9E8255]/30 transition-colors">
                <Layers className="w-5 h-5 text-[#9E8255]" />
                <h4 className="font-serif text-lg text-[#FAF8F5] font-normal">Living &amp; Bedroom</h4>
                <p className="text-xs text-[#FAF8F5]/60 font-light">Separated zones with private interconnecting door</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#141210] border border-white/5 space-y-1.5 hover:border-[#9E8255]/30 transition-colors">
                <Wind className="w-5 h-5 text-[#9E8255]" />
                <h4 className="font-serif text-lg text-[#FAF8F5] font-normal">Dual AC Units</h4>
                <p className="text-xs text-[#FAF8F5]/60 font-light">Dedicated split ACs in both salon and bedroom</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#141210] border border-white/5 space-y-1.5 hover:border-[#9E8255]/30 transition-colors">
                <Utensils className="w-5 h-5 text-[#9E8255]" />
                <h4 className="font-serif text-lg text-[#FAF8F5] font-normal">Pantry Kitchenette</h4>
                <p className="text-xs text-[#FAF8F5]/60 font-light">Counter with sink, cooktop &amp; preparation area</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#141210] border border-white/5 space-y-1.5 hover:border-[#9E8255]/30 transition-colors">
                <Tv className="w-5 h-5 text-[#9E8255]" />
                <h4 className="font-serif text-lg text-[#FAF8F5] font-normal">55&quot; Smart TV</h4>
                <p className="text-xs text-[#FAF8F5]/60 font-light">Wall-mounted OLED facing master King bed</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href={`/booking?room=${suite.slug}`}
                className="group btn-luxury-gold inline-flex items-center justify-center px-8 py-4 text-xs font-bold uppercase tracking-[0.16em] rounded-full"
              >
                <span>Reserve Presidential Suite</span>
                <ArrowUpRight className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>

              <Link
                href={`/rooms/${suite.slug}`}
                className="inline-flex items-center justify-center px-6 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-[#FAF8F5] hover:text-[#9E8255] transition-colors"
              >
                <span>View Full Specifications &rarr;</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
