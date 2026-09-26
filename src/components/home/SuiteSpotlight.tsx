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

  const parallaxY = useTransform(scrollYProgress, [0, 1], [-12, 12]);

  if (!suite) return null;

  const currentPhoto = SUITE_GALLERY[activePhotoIdx];

  return (
    <section
      ref={containerRef}
      className="relative bg-[#1F1C1A] text-[#FAF8F5] py-20 sm:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden border-t border-b border-[#3D3733]"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Curated Photo Showcase (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Main Stage Photo Frame */}
            <motion.div style={{ y: parallaxY }} className="relative">
              <CardTilt3D maxTilt={3}>
                <div className="relative aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-[#282421]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentPhoto.id}
                      initial={{ opacity: 0, scale: 1.02 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
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

                  <div className="absolute inset-0 bg-gradient-to-t from-[#1F1C1A]/85 via-transparent to-transparent pointer-events-none" />

                  {/* Price Tariff Badge */}
                  <div className="absolute top-5 left-5 bg-[#1F1C1A]/90 backdrop-blur-md text-[#FAF8F5] rounded-xl px-4 py-2.5 shadow-xl border border-[#8F6B2A]/40 z-10">
                    <span className="text-[9px] uppercase tracking-widest font-sans block text-[#B3863E] font-semibold">
                      Direct Tariff from
                    </span>
                    <span className="font-serif text-2xl sm:text-3xl font-medium block text-[#FAF8F5]">
                      {formatCurrencyINR(suite.basePrice)}
                    </span>
                    <span className="text-[10px] text-[#FAF8F5]/70 block">/ night (EP Plan)</span>
                  </div>

                  {/* Active Zone Label */}
                  <div className="absolute bottom-5 left-5 z-10 max-w-[75%]">
                    <span className="text-[10px] font-sans uppercase tracking-wider text-[#B3863E] bg-[#1F1C1A]/85 backdrop-blur-md px-3 py-1 rounded-md border border-white/10 inline-block mb-1.5 font-semibold">
                      {currentPhoto.badge}
                    </span>
                    <p className="text-xs text-white/90 font-light drop-shadow line-clamp-1 hidden sm:block">
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
                    className={`group text-left p-2 sm:p-2.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "bg-[#282421] border-[#8F6B2A] ring-1 ring-[#8F6B2A]/50 shadow-md"
                        : "bg-[#1F1C1A] border-[#3D3733] hover:border-[#8F6B2A]/50 hover:bg-[#282421]"
                    }`}
                  >
                    <div className="relative aspect-[16/10] rounded-lg overflow-hidden mb-2">
                      <Image
                        src={photo.src}
                        alt={photo.badge}
                        fill
                        className={`object-cover transition-all duration-500 ${
                          isActive
                            ? "brightness-105 scale-100"
                            : "brightness-75 group-hover:brightness-95 group-hover:scale-105"
                        }`}
                        sizes="200px"
                      />
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <span
                        className={`w-1.5 h-1.5 rounded-full transition-colors ${
                          isActive ? "bg-[#8F6B2A]" : "bg-white/20 group-hover:bg-white/40"
                        }`}
                      />
                      <p
                        className={`text-[11px] sm:text-xs font-medium font-serif truncate transition-colors ${
                          isActive ? "text-[#FAF8F5]" : "text-[#FAF8F5]/70 group-hover:text-[#FAF8F5]"
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

          {/* Right Column: Narrative & Specifications (5 Cols) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5 space-y-7"
          >
            <div className="space-y-2.5">
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#B3863E] font-semibold block">
                Signature Accommodation
              </span>

              <h2 className="font-serif text-3xl sm:text-5xl font-medium text-[#FAF8F5] leading-tight">
                The Presidential <br />
                <span className="text-[#B3863E] italic">Luxury Suite</span>
              </h2>

              <p className="text-[#FAF8F5]/80 text-sm sm:text-base font-normal leading-relaxed pt-1">
                The pinnacle of hospitality at Hotel Ambarish Grand Residency by Divine View. Spanning 460 sq.ft, the suite offers complete architectural separation between an independent living salon with kitchenette pantry, and a quiet master bedroom with ensuite marble bathroom.
              </p>
            </div>

            {/* Suite Highlight Grid */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="p-3.5 sm:p-4 rounded-xl bg-[#282421] border border-[#3D3733] space-y-1 hover:border-[#8F6B2A]/40 transition-colors">
                <Layers className="w-5 h-5 text-[#8F6B2A]" />
                <h4 className="font-serif text-base sm:text-lg text-[#FAF8F5] font-medium">Living &amp; Bedroom</h4>
                <p className="text-xs text-[#FAF8F5]/65 font-normal">Separated zones with private interconnecting door</p>
              </div>

              <div className="p-3.5 sm:p-4 rounded-xl bg-[#282421] border border-[#3D3733] space-y-1 hover:border-[#8F6B2A]/40 transition-colors">
                <Wind className="w-5 h-5 text-[#8F6B2A]" />
                <h4 className="font-serif text-base sm:text-lg text-[#FAF8F5] font-medium">Dual AC Units</h4>
                <p className="text-xs text-[#FAF8F5]/65 font-normal">Dedicated split ACs in both salon and bedroom</p>
              </div>

              <div className="p-3.5 sm:p-4 rounded-xl bg-[#282421] border border-[#3D3733] space-y-1 hover:border-[#8F6B2A]/40 transition-colors">
                <Utensils className="w-5 h-5 text-[#8F6B2A]" />
                <h4 className="font-serif text-base sm:text-lg text-[#FAF8F5] font-medium">Pantry Kitchenette</h4>
                <p className="text-xs text-[#FAF8F5]/65 font-normal">Counter with sink, cooktop &amp; preparation area</p>
              </div>

              <div className="p-3.5 sm:p-4 rounded-xl bg-[#282421] border border-[#3D3733] space-y-1 hover:border-[#8F6B2A]/40 transition-colors">
                <Tv className="w-5 h-5 text-[#8F6B2A]" />
                <h4 className="font-serif text-base sm:text-lg text-[#FAF8F5] font-medium">55&quot; Smart TV</h4>
                <p className="text-xs text-[#FAF8F5]/65 font-normal">Wall-mounted OLED facing master King bed</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href={`/booking?room=${suite.slug}`}
                className="btn-heritage-primary px-7 py-3 rounded-lg text-xs font-semibold tracking-wider flex items-center space-x-2"
              >
                <span>Reserve Presidential Suite</span>
                <ArrowUpRight className="w-4 h-4 ml-1" />
              </Link>

              <Link
                href={`/rooms/${suite.slug}`}
                className="inline-flex items-center justify-center px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#FAF8F5] hover:text-[#B3863E] transition-colors"
              >
                <span>View Full Specifications</span>
                <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
