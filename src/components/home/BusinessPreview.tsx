"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Users, Wifi, Projector, Building } from "lucide-react";
import CardTilt3D from "@/components/3d/CardTilt3D";

export default function BusinessPreview() {
  const specs = [
    { icon: Users, label: "Up to 150 Guests", desc: "Single versatile hall for events & celebrations" },
    { icon: Projector, label: "AV & Sound on Request", desc: "Projector, screen & mics available on request" },
    { icon: Building, label: "Flexible Layouts", desc: "Theatre, Classroom, Boardroom & Social setups" },
    { icon: Wifi, label: "Negotiable Pricing", desc: "Customized tariffs tailored to your requirements" },
  ];

  return (
    <section className="bg-[#F4EFE6] text-[#1C1917] py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-t border-b border-[#E7E2D9] overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-14">
        {/* Top Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-8 space-y-2.5"
          >
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#8F6B2A] font-semibold block">
              Multi-Purpose Banquet Hall
            </span>

            <h2 className="font-serif text-3xl sm:text-5xl font-medium leading-tight text-[#1C1917]">
              Host Conferences, Seminars &amp; <br />
              <span className="text-[#8F6B2A] italic">Social Celebrations</span>
            </h2>

            <p className="text-[#44403C] text-sm sm:text-base font-normal max-w-2xl leading-relaxed pt-1">
              A spacious, air-conditioned hall in Paltan Bazaar adaptable to any event, from corporate workshops and boardroom meets to celebratory gatherings. Custom negotiable tariffs and catering options available.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-4 lg:text-right"
          >
            <Link
              href="/meetings-events#rfp-form"
              className="btn-heritage-primary px-6 py-3.5 text-xs font-semibold tracking-wider rounded-lg inline-flex items-center"
            >
              <span>Request Availability &amp; Quote</span>
              <ArrowUpRight className="w-4 h-4 ml-1.5" />
            </Link>
          </motion.div>
        </div>

        {/* Cinematic Photo & Spec Breakdown Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Banquet Image with 3D Tilt (7 Cols) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7"
          >
            <CardTilt3D maxTilt={3}>
              <div className="relative aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden border border-[#E7E2D9] shadow-xl group bg-[#FFFFFF]">
                <Image
                  src="/images/polished/banquet-meeting-in-use.webp"
                  alt="Corporate seminar in session at Hotel Ambarish Grand Residency banquet hall"
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                <div className="absolute bottom-4 left-4">
                  <span className="text-[10px] font-sans uppercase tracking-widest text-[#FAF8F5] bg-[#1C1917]/85 backdrop-blur-md px-3 py-1 rounded-md border border-white/10 font-semibold">
                    Grand Residency Banquet Hall in Session
                  </span>
                </div>
              </div>
            </CardTilt3D>
          </motion.div>

          {/* 4 Feature Cards (5 Cols) */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {specs.map((s, idx) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  className="p-4 sm:p-5 rounded-xl bg-[#FFFFFF] border border-[#E7E2D9] space-y-1.5 hover:border-[#8F6B2A]/40 transition-colors shadow-sm"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#FAF5EB] flex items-center justify-center text-[#8F6B2A] border border-[#E7E2D9]">
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <h4 className="font-serif text-base sm:text-lg text-[#1C1917] font-medium">{s.label}</h4>
                  <p className="text-xs text-[#44403C] font-normal leading-relaxed">{s.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
