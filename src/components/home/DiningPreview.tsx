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

  const parallaxY = useTransform(scrollYProgress, [0, 1], [-10, 10]);

  return (
    <section
      ref={containerRef}
      className="bg-[#FAF8F5] py-20 sm:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden text-[#1C1917]"
    >
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Story & Timings (6 Cols) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 space-y-7"
          >
            <div className="space-y-2.5">
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#8F6B2A] font-semibold flex items-center gap-1.5">
                <UtensilsCrossed className="w-3.5 h-3.5" />
                In-House Dining
              </span>

              <h2 className="font-serif text-3xl sm:text-5xl font-medium text-[#1C1917] leading-tight">
                {DINING_INFO.name}
              </h2>

              <p className="text-[#44403C] text-sm sm:text-base font-normal leading-relaxed pt-1">
                Authentic Assamese specialties, wholesome North Indian gravies, sizzling Chinese wok noodles, and freshly cooked breakfasts, prepared to order with fresh regional ingredients.
              </p>
            </div>

            {/* Timings & Service Cards */}
            <div className="space-y-3">
              {DINING_INFO.timings.map((t) => (
                <div
                  key={t.meal}
                  className="p-4 sm:p-5 rounded-xl bg-white border border-[#E7E2D9] shadow-sm flex items-start space-x-4 hover:border-[#8F6B2A]/40 transition-colors duration-200"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#FAF5EB] flex items-center justify-center text-[#8F6B2A] shrink-0 mt-0.5 border border-[#E7E2D9]">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h4 className="font-serif text-lg text-[#1C1917] font-medium">{t.meal}</h4>
                      <span className="font-sans text-xs font-semibold text-[#8F6B2A] bg-[#FAF5EB] px-2.5 py-0.5 rounded-md self-start border border-[#DFD5C0]">
                        {t.hours}
                      </span>
                    </div>
                    <p className="text-xs text-[#44403C] font-normal leading-relaxed">
                      {t.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <Link
                href="/dining"
                className="btn-heritage-primary px-6 py-3 text-xs font-semibold tracking-wider rounded-lg flex items-center"
              >
                <span>View 70+ Item Menu</span>
                <ArrowUpRight className="w-4 h-4 ml-1.5" />
              </Link>

              <span className="text-xs text-[#78716C] flex items-center font-sans font-medium">
                <PhoneCall className="w-3.5 h-3.5 mr-1.5 text-[#8F6B2A]" />
                In-Room Dining: Dial Ext 9
              </span>
            </div>
          </motion.div>

          {/* Right Column: Photography Showcase (6 Cols) */}
          <motion.div
            style={{ y: parallaxY }}
            className="lg:col-span-6 space-y-4"
          >
            {/* Primary Featured Image View */}
            <CardTilt3D maxTilt={3}>
              <div className="relative aspect-[16/10] sm:aspect-[4/3] rounded-2xl overflow-hidden shadow-xl border border-[#E7E2D9] group bg-[#F4EFE6]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={restaurantAngles[activeIdx].src}
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.45, ease: "easeInOut" }}
                    className="relative w-full h-full"
                  >
                    <Image
                      src={restaurantAngles[activeIdx].src}
                      alt={restaurantAngles[activeIdx].alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </motion.div>
                </AnimatePresence>

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                <div className="absolute bottom-4 left-4 right-4 z-10 flex items-end justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-sans uppercase tracking-widest text-[#B3863E] bg-[#1C1917]/85 backdrop-blur-md px-2.5 py-0.5 rounded border border-white/10 font-semibold inline-block">
                      {restaurantAngles[activeIdx].title}
                    </span>
                    <p className="text-xs text-white/90 font-light drop-shadow">
                      {restaurantAngles[activeIdx].subtitle}
                    </p>
                  </div>

                  <span className="text-xs text-white/70 font-mono">
                    0{activeIdx + 1} / 0{restaurantAngles.length}
                  </span>
                </div>
              </div>
            </CardTilt3D>

            {/* Thumbnail Switchers */}
            <div className="grid grid-cols-4 gap-2.5">
              {restaurantAngles.map((angle, i) => (
                <button
                  key={angle.src}
                  type="button"
                  onClick={() => setActiveIdx(i)}
                  className={`relative aspect-[16/10] rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                    activeIdx === i
                      ? "border-[#8F6B2A] ring-1 ring-[#8F6B2A]/40 shadow-sm"
                      : "border-[#E7E2D9] opacity-75 hover:opacity-100 hover:border-[#8F6B2A]/50"
                  }`}
                  aria-label={`View ${angle.title}`}
                >
                  <Image
                    src={angle.src}
                    alt={angle.alt}
                    fill
                    className="object-cover"
                    sizes="120px"
                  />
                </button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Lounge & Bar Banner Feature */}
        <div className="bg-[#1F1C1A] text-[#FAF8F5] rounded-2xl border border-[#3D3733] p-6 sm:p-10 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center space-x-2 bg-[#282421] border border-[#8F6B2A]/40 px-3.5 py-1 rounded-md">
                <Wine className="w-3.5 h-3.5 text-[#B3863E]" />
                <span className="text-[10px] uppercase font-sans tracking-widest text-[#B3863E] font-semibold">
                  Hotel Lounge &amp; Bar • 2nd Floor
                </span>
              </div>

              <h3 className="font-serif text-3xl sm:text-4xl text-white font-medium">
                Pavillion Bar
              </h3>

              <p className="text-xs sm:text-sm text-[#FAF8F5]/80 font-normal leading-relaxed">
                An intimate lounge setting for premium spirits, chilled beverages, and evening relaxation. Savor fine single malts, classic cocktails, and cold beers paired with sizzling tandoori and Chinese bar appetizers.
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
                <div className="flex items-center text-[#B3863E] font-sans font-semibold">
                  <Clock className="w-3.5 h-3.5 mr-1.5" />
                  <span>11:00 AM to 11:00 PM Daily</span>
                </div>
                <span className="text-white/20">•</span>
                <span className="text-[#FAF8F5]/70">2nd Floor, Hotel Ambarish</span>
              </div>

              <div className="pt-2">
                <Link
                  href="/dining#pavillion-bar"
                  className="btn-heritage-primary px-6 py-3 text-xs font-semibold tracking-wider rounded-lg inline-flex items-center"
                >
                  <span>Explore Pavillion Bar &amp; Photos</span>
                  <ArrowUpRight className="w-3.5 h-3.5 ml-1.5" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <CardTilt3D maxTilt={3}>
                <div className="relative aspect-[16/10] sm:aspect-[4/3] rounded-xl overflow-hidden border border-white/10 shadow-lg group">
                  <Image
                    src="/images/bar/bar1-lounge-seating.webp"
                    alt="Pavillion Bar Lounge - Hotel Ambarish Guwahati"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-3 left-3">
                    <span className="text-[10px] font-sans uppercase tracking-wider text-white/90 bg-black/60 px-2.5 py-1 rounded-md backdrop-blur-sm border border-white/10 font-semibold">
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
