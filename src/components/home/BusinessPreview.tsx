"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Users, Wifi, Projector, Mic2, Building } from "lucide-react";

export default function BusinessPreview() {
  const specs = [
    { icon: Users, label: "Up to 150 Guests", desc: "Single versatile hall for events & celebrations" },
    { icon: Projector, label: "AV & Sound on Request", desc: "Projector, screen & mics available on request" },
    { icon: Building, label: "Flexible Layouts", desc: "Theatre, Classroom, Boardroom & Social setups" },
    { icon: Wifi, label: "Negotiable Pricing", desc: "Customized tariffs tailored to your requirements" },
  ];

  return (
    <section className="bg-[#0C0B0B] text-[#F5EBDD] py-24 sm:py-32 px-4 sm:px-6 lg:px-8 border-t border-b border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Top Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-8 space-y-3"
          >
            <span className="text-xs uppercase tracking-[0.25em] text-[#B4872F] font-semibold block">
              Multi-Purpose Banquet Hall
            </span>

            <h2 className="font-serif text-3xl sm:text-5xl font-normal leading-tight">
              Host Conferences, Seminars &amp; <br />
              <span className="text-[#B4872F] italic">Social Celebrations</span>
            </h2>

            <p className="text-[#F5EBDD]/70 text-sm sm:text-base font-light max-w-2xl leading-relaxed pt-1">
              A single spacious, air-conditioned hall in Paltan Bazaar adaptable to any event — from corporate workshops and boardroom meets to family celebrations. Custom negotiable tariffs and catering options available.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-4 lg:text-right"
          >
            <Link
              href="/meetings-events#rfp-form"
              className="group inline-flex items-center justify-center px-8 py-4 text-xs font-bold uppercase tracking-[0.14em] text-white bg-[#B62576] hover:bg-[#9A1D62] rounded-full transition-all duration-200 shadow-xl shadow-[#B62576]/25 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Request Event Availability &amp; Quote</span>
              <ArrowUpRight className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </motion.div>
        </div>

        {/* Large Cinematic Photo & Spec Breakdown Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Banquet Image (7 Cols) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7 relative aspect-[16/10] sm:aspect-[16/9] rounded-3xl overflow-hidden border border-white/10 shadow-2xl group"
          >
            <Image
              src="/images/polished/banquet-meeting-in-use.webp"
              alt="Corporate seminar in session at Hotel Ambarish Grand Residency banquet hall"
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0C0B0B]/80 via-transparent to-transparent" />

            <div className="absolute bottom-6 left-6">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#B4872F] bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
                Grand Residency Banquet Hall in Session
              </span>
            </div>
          </motion.div>

          {/* 4 Feature Cards (5 Cols) */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {specs.map((s, idx) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="p-5 rounded-2xl bg-[#141212] border border-white/5 space-y-2 hover:border-[#B4872F]/30 transition-colors"
                >
                  <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-[#B4872F]">
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <h4 className="font-serif text-lg text-[#F5EBDD] font-normal">{s.label}</h4>
                  <p className="text-xs text-[#F5EBDD]/60 font-light leading-relaxed">{s.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
