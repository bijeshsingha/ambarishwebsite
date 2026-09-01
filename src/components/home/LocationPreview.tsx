"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Train, Bus, Plane, Compass, Navigation, Phone, ArrowUpRight } from "lucide-react";
import { HOTEL_INFO } from "@/data/hotel-info";

const landmarks = [
  { icon: Train, name: "Guwahati Railway Station", distance: "250 meters", time: "3 min walk" },
  { icon: Bus, name: "ASTC Central Bus Stand", distance: "500 meters", time: "5 min walk" },
  { icon: Compass, name: "Kamakhya Devi Temple", distance: "7.5 km", time: "20 min drive" },
  { icon: Plane, name: "LGBI Airport (GAU)", distance: "22 km", time: "40 min drive" },
];

export default function LocationPreview() {
  return (
    <section className="bg-[#FAF7F4] py-24 sm:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-[#0C0B0B]/10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-3"
          >
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#B4872F] font-semibold flex items-center">
              <MapPin className="w-3.5 h-3.5 mr-2 text-[#B4872F]" />
              Strategic Location
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#0C0B0B] leading-tight">
              In the Heart of Paltan Bazaar
            </h2>
            <p className="text-[#7A7067] text-sm sm:text-base font-light max-w-xl leading-relaxed">
              Immediate access to Assam&apos;s premier transit hub, commercial shopping lanes, and pilgrimage corridors.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <a
              href="https://maps.google.com/?q=Hotel+Ambarish+Grand+Residency+Paltan+Bazaar+Guwahati"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-[0.14em] text-[#0C0B0B] hover:text-[#B62576] transition-colors"
            >
              <span>Open in Google Maps</span>
              <Navigation className="w-4 h-4 text-[#B4872F] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </motion.div>
        </div>

        {/* Transit Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {landmarks.map((l, idx) => {
            const Icon = l.icon;
            return (
              <motion.div
                key={l.name}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#0C0B0B]/8 hover:border-[#B4872F]/30 shadow-sm transition-all duration-200 space-y-4"
              >
                <div className="w-10 h-10 rounded-xl bg-[#FAF7F4] flex items-center justify-center text-[#B4872F]">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif text-lg text-[#0C0B0B] font-normal leading-snug">{l.name}</h4>
                  <div className="flex items-center space-x-2 text-xs text-[#7A7067] font-mono mt-1">
                    <span className="font-semibold text-[#B4872F]">{l.distance}</span>
                    <span>•</span>
                    <span>{l.time}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Address Card with Direct Assistance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="p-8 sm:p-10 rounded-3xl bg-[#0C0B0B] text-[#F5EBDD] flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl"
        >
          <div className="space-y-2 text-center md:text-left">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#B4872F]">
              Hotel Address
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-normal">
              {HOTEL_INFO.address.street}, {HOTEL_INFO.address.city}, {HOTEL_INFO.address.state} {HOTEL_INFO.address.pincode}
            </h3>
            <p className="text-xs text-[#F5EBDD]/60 font-light">
              Need driving directions or station pickup assistance? Our reception desk is available 24/7.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href={`tel:${HOTEL_INFO.phoneRaw}`}
              className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-semibold uppercase tracking-wider text-[#F5EBDD] border border-white/10 transition-colors flex items-center"
            >
              <Phone className="w-3.5 h-3.5 mr-2 text-[#B4872F]" />
              <span>Call Reception</span>
            </a>
            <Link
              href="/location"
              className="px-7 py-3.5 rounded-full bg-[#B62576] hover:bg-[#9A1D62] text-xs font-bold uppercase tracking-[0.14em] text-white shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Location Details &rarr;
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
