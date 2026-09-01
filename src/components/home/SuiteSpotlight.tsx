"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Layers, Wind, Tv, ShieldCheck } from "lucide-react";
import { ROOMS } from "@/data/rooms";
import { formatCurrencyINR } from "@/lib/formatters";

export default function SuiteSpotlight() {
  const suite = ROOMS.find((r) => r.slug === "suite-room");
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const parallaxY = useTransform(scrollYProgress, [0, 1], [-25, 25]);
  const floatingY = useTransform(scrollYProgress, [0, 1], [35, -35]);

  if (!suite) return null;

  return (
    <section
      ref={containerRef}
      className="relative bg-[#0C0B0B] text-[#F5EBDD] py-24 sm:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#B4872F]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Multi-Layer Parallax Imagery (7 Cols) */}
          <div className="lg:col-span-7 relative">
            {/* Primary Large Image: Living Salon */}
            <motion.div
              style={{ y: parallaxY }}
              className="relative aspect-[16/10] sm:aspect-[16/9] rounded-3xl overflow-hidden shadow-2xl border border-white/10"
            >
              <Image
                src="/images/polished/suite-living-wide.webp"
                alt="Presidential Luxury Suite Living Salon"
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0C0B0B]/80 via-transparent to-transparent" />

              {/* In-Image Tag */}
              <div className="absolute bottom-6 left-6">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#B4872F] bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
                  Private Living Drawing Room
                </span>
              </div>
            </motion.div>

            {/* Overlapping Floating Bedroom Card */}
            <motion.div
              style={{ y: floatingY }}
              className="absolute -bottom-8 -right-4 sm:-right-8 w-48 sm:w-64 aspect-[4/3] rounded-2xl overflow-hidden border-4 border-[#0C0B0B] shadow-2xl shadow-black hidden sm:block"
            >
              <Image
                src="/images/polished/suite-bedroom-full.webp"
                alt="Presidential Suite King Bedroom"
                fill
                className="object-cover"
                sizes="260px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <span className="absolute bottom-2.5 left-3 text-[9px] font-mono uppercase tracking-wider text-white bg-black/50 px-2 py-0.5 rounded backdrop-blur-sm">
                Master King Bedroom
              </span>
            </motion.div>

            {/* Price Badge */}
            <div className="absolute top-6 left-6 bg-[#B4872F] text-white rounded-2xl px-5 py-3 shadow-xl backdrop-blur-sm border border-white/20">
              <span className="text-[9px] uppercase tracking-widest font-mono block opacity-90">
                Direct Tariff from
              </span>
              <span className="font-serif text-2xl sm:text-3xl font-semibold block">
                {formatCurrencyINR(suite.basePrice)}
              </span>
              <span className="text-[10px] opacity-80 block">/ night (EP Plan)</span>
            </div>
          </div>

          {/* Right Column: Editorial Narrative & Specifications (5 Cols) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5 space-y-8"
          >
            <div className="space-y-3">
              <span className="text-xs uppercase tracking-[0.25em] text-[#B4872F] font-semibold block">
                Signature Penthouse Accommodation
              </span>

              <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#F5EBDD] leading-tight">
                The Presidential <br />
                <span className="text-[#B4872F] italic">Luxury Suite</span>
              </h2>

              <p className="text-[#F5EBDD]/75 text-sm sm:text-base font-light leading-relaxed pt-2">
                The pinnacle of hospitality at Hotel Ambarish Grand Residency by Divine View. Spanning 460 sq.ft, the suite offers complete separation between your master bedroom and an executive living salon — perfect for visiting dignitaries, corporate leadership, and families.
              </p>
            </div>

            {/* Suite Highlight Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[#141212] border border-white/5 space-y-1.5">
                <Layers className="w-5 h-5 text-[#B4872F]" />
                <h4 className="font-serif text-lg text-[#F5EBDD] font-normal">2 Private Rooms</h4>
                <p className="text-xs text-[#F5EBDD]/60 font-light">Independent living salon &amp; King bedroom</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#141212] border border-white/5 space-y-1.5">
                <Wind className="w-5 h-5 text-[#B4872F]" />
                <h4 className="font-serif text-lg text-[#F5EBDD] font-normal">Dual AC Units</h4>
                <p className="text-xs text-[#F5EBDD]/60 font-light">Dedicated climate control in both rooms</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#141212] border border-white/5 space-y-1.5">
                <Tv className="w-5 h-5 text-[#B4872F]" />
                <h4 className="font-serif text-lg text-[#F5EBDD] font-normal">Dual Smart TVs</h4>
                <p className="text-xs text-[#F5EBDD]/60 font-light">55&quot; 4K screens in salon and bedroom</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#141212] border border-white/5 space-y-1.5">
                <ShieldCheck className="w-5 h-5 text-[#B4872F]" />
                <h4 className="font-serif text-lg text-[#F5EBDD] font-normal">VIP Butler Desk</h4>
                <p className="text-xs text-[#F5EBDD]/60 font-light">Priority check-in &amp; dedicated service</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href={`/booking?room=${suite.slug}`}
                className="group inline-flex items-center justify-center px-8 py-4 text-xs font-bold uppercase tracking-[0.14em] text-white bg-[#B62576] hover:bg-[#9A1D62] rounded-full transition-all duration-200 shadow-xl shadow-[#B62576]/30 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Reserve Presidential Suite</span>
                <ArrowUpRight className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>

              <Link
                href={`/rooms/${suite.slug}`}
                className="inline-flex items-center justify-center px-6 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-[#F5EBDD] hover:text-[#B4872F] transition-colors"
              >
                <span>View Full Floorplan &amp; Photos &rarr;</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
