"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Train, Bus, Plane, Navigation, Phone, ArrowUpRight, Clock, Footprints } from "lucide-react";
import { HOTEL_INFO } from "@/data/hotel-info";
import CardTilt3D from "@/components/3d/CardTilt3D";

const landmarks = [
  { icon: Train, name: "Guwahati Railway Station", distance: "250 meters", time: "3 min walk", detail: "Direct level walkway from Paltan Bazaar Exit" },
  { icon: Bus, name: "ASTC Central Bus Stand", distance: "500 meters", time: "5 min walk", detail: "Inter-district & airport bus connection" },
  { icon: Navigation, name: "Kamakhya Devi Temple", distance: "7.5 km", time: "20 min drive", detail: "Sacred corridor via MG Road" },
  { icon: Plane, name: "LGBI Airport (GAU)", distance: "22 km", time: "40 min drive", detail: "Airport pick up & dropping service upon request" },
];

export default function LocationPreview() {
  return (
    <section className="bg-[#FAF8F5] py-24 sm:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden text-[#1F1D1A]">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#0C0B0A]/10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-3"
          >
            <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-[#9E8255] font-semibold flex items-center">
              <MapPin className="w-3.5 h-3.5 mr-2 text-[#9E8255]" />
              Strategic Transit Position
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#0C0B0A] leading-tight">
              In the Heart of Paltan Bazaar
            </h2>
            <p className="text-[#6B635B] text-sm sm:text-base font-light max-w-xl leading-relaxed">
              Immediate access to Assam&apos;s primary railway terminus, commercial banking lanes, and cultural pilgrimage routes.
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
              className="group inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#0C0B0A] hover:text-[#9E8255] transition-colors"
            >
              <span>Open in Google Maps</span>
              <Navigation className="w-4 h-4 text-[#9E8255] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </motion.div>
        </div>

        {/* Transit Cards Grid with Subtle 3D Tilt */}
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
              >
                <CardTilt3D maxTilt={6} className="h-full">
                  <div className="p-6 rounded-2xl bg-white border border-[#0C0B0A]/8 hover:border-[#9E8255]/40 shadow-sm transition-all duration-200 space-y-4 h-full flex flex-col justify-between">
                    <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] flex items-center justify-center text-[#9E8255] border border-[#0C0B0A]/5">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="space-y-1.5">
                      <h4 className="font-serif text-lg text-[#0C0B0A] font-normal leading-snug">{l.name}</h4>
                      <p className="text-xs text-[#7A7067] font-light leading-relaxed">{l.detail}</p>
                      <div className="flex items-center space-x-2 text-xs text-[#6B635B] font-sans pt-2 border-t border-[#0C0B0A]/5">
                        <span className="font-semibold text-[#9E8255]">{l.distance}</span>
                        <span>&bull;</span>
                        <span>{l.time}</span>
                      </div>
                    </div>
                  </div>
                </CardTilt3D>
              </motion.div>
            );
          })}
        </div>

        {/* Architectural Walking Guide (Zero Gimmicks, Pure Clarity) */}
        <div className="p-8 sm:p-12 rounded-3xl bg-[#0C0B0A] text-[#FAF8F5] border border-white/10 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#9E8255]/15 border border-[#9E8255]/30 text-[10px] font-sans font-semibold uppercase tracking-wider text-[#BFA058]">
                <Footprints className="w-3.5 h-3.5" />
                <span>Effortless Arrival</span>
              </span>
              <h3 className="font-serif text-2xl sm:text-4xl text-white font-normal leading-snug">
                Step-Free 250m Walk From Guwahati Railway Station
              </h3>
              <p className="text-xs sm:text-sm text-[#D1C7BD] font-light leading-relaxed">
                Step off Platform 1 through the Paltan Bazaar South Entrance. Avoid cab negotiations, surge pricing, and peak-hour city bottlenecks — your room awaits just a brief 3-minute stroll away.
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs font-sans text-[#BFA058] pt-1">
                <span className="flex items-center">
                  <Clock className="w-3.5 h-3.5 mr-1" />
                  Average walk: 3 minutes
                </span>
                <span>&bull;</span>
                <span>Paved flat terrain</span>
                <span>&bull;</span>
                <span>24/7 Porter luggage assistance</span>
              </div>
            </div>

            {/* Architectural Timeline Diagram */}
            <div className="lg:col-span-6 bg-[#171412] p-6 sm:p-8 rounded-2xl border border-white/5 space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-7 h-7 rounded-full bg-[#9E8255]/20 text-[#BFA058] flex items-center justify-center font-sans text-xs font-bold shrink-0 border border-[#9E8255]/40">
                  1
                </div>
                <div className="space-y-0.5">
                  <span className="text-xs font-sans uppercase tracking-wider text-[#9E8255] font-semibold">Station Exit</span>
                  <p className="text-sm text-white font-serif">Paltan Bazaar South Gate (Platform 1)</p>
                  <p className="text-xs text-[#A89F96] font-light">Well-lit pedestrian passage with regional transit signboards.</p>
                </div>
              </div>

              <div className="w-px h-6 bg-[#9E8255]/30 ml-3.5" />

              <div className="flex items-start space-x-4">
                <div className="w-7 h-7 rounded-full bg-[#9E8255]/20 text-[#BFA058] flex items-center justify-center font-sans text-xs font-bold shrink-0 border border-[#9E8255]/40">
                  2
                </div>
                <div className="space-y-0.5">
                  <span className="text-xs font-sans uppercase tracking-wider text-[#9E8255] font-semibold">Corridor Walk</span>
                  <p className="text-sm text-white font-serif">Md. Shah Road (120 meters)</p>
                  <p className="text-xs text-[#A89F96] font-light">Direct street connection past local artisan shops and pharmacies.</p>
                </div>
              </div>

              <div className="w-px h-6 bg-[#9E8255]/30 ml-3.5" />

              <div className="flex items-start space-x-4">
                <div className="w-7 h-7 rounded-full bg-[#9E8255] text-[#0C0B0A] flex items-center justify-center font-sans text-xs font-bold shrink-0 shadow-md">
                  3
                </div>
                <div className="space-y-0.5">
                  <span className="text-xs font-sans uppercase tracking-wider text-[#BFA058] font-bold">Arrival</span>
                  <p className="text-sm text-white font-serif font-semibold">Hotel Ambarish Grand Residency</p>
                  <p className="text-xs text-[#A89F96] font-light">Private portico drop-off, luggage handling, and front desk check-in.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Address Card with Direct Assistance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="p-8 sm:p-10 rounded-3xl bg-[#0C0B0A] text-[#FAF8F5] flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-white/5"
        >
          <div className="space-y-2 text-center md:text-left">
            <span className="text-[10px] font-sans uppercase tracking-widest text-[#9E8255]">
              Hotel Address &bull; Reception 24/7
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-normal">
              {HOTEL_INFO.address.street}, {HOTEL_INFO.address.city}, {HOTEL_INFO.address.state} {HOTEL_INFO.address.pincode}
            </h3>
            <p className="text-xs text-[#FAF8F5]/60 font-light">
              Need walking guidance or luggage escort from the railway platform? Ring our reception desk anytime.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href={`tel:${HOTEL_INFO.phoneRaw}`}
              className="px-6 py-3.5 rounded-full bg-white/5 hover:bg-white/10 text-xs font-semibold uppercase tracking-wider text-[#FAF8F5] border border-white/10 transition-colors flex items-center"
            >
              <Phone className="w-3.5 h-3.5 mr-2 text-[#9E8255]" />
              <span>Call Reception</span>
            </a>
            <Link
              href="/location"
              className="btn-luxury-gold px-7 py-3.5 rounded-full text-xs font-bold uppercase tracking-[0.14em]"
            >
              <span>Full Transit Guide &rarr;</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
