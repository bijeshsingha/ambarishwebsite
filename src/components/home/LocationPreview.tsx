"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Train, Bus, Plane, Navigation, Phone, ArrowUpRight, Footprints } from "lucide-react";
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
    <section className="bg-[#FAF8F5] py-20 sm:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden text-[#1C1917]">
      <div className="max-w-7xl mx-auto space-y-14">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-[#E7E2D9]">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-2.5"
          >
            <span className="text-[11px] font-sans uppercase tracking-[0.2em] text-[#8F6B2A] font-semibold flex items-center">
              <MapPin className="w-3.5 h-3.5 mr-1.5 text-[#8F6B2A]" />
              Strategic Transit Position
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-medium text-[#1C1917] leading-tight">
              In the Heart of Paltan Bazaar
            </h2>
            <p className="text-[#44403C] text-sm sm:text-base font-normal max-w-xl leading-relaxed">
              Immediate access to Assam&apos;s primary railway terminus, commercial banking lanes, and cultural pilgrimage routes.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <a
              href="https://maps.google.com/?q=Hotel+Ambarish+Grand+Residency+Paltan+Bazaar+Guwahati"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#1C1917] hover:text-[#8F6B2A] transition-colors"
            >
              <span>Open in Google Maps</span>
              <Navigation className="w-4 h-4 text-[#8F6B2A] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
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
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
              >
                <CardTilt3D maxTilt={4} className="h-full">
                  <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E7E2D9] hover:border-[#8F6B2A]/40 shadow-sm transition-all duration-200 space-y-4 h-full flex flex-col justify-between">
                    <div className="w-10 h-10 rounded-xl bg-[#FAF5EB] flex items-center justify-center text-[#8F6B2A] border border-[#E7E2D9]">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="space-y-1.5">
                      <h4 className="font-serif text-lg text-[#1C1917] font-medium leading-snug">{l.name}</h4>
                      <p className="text-xs text-[#78716C] font-normal leading-relaxed">{l.detail}</p>
                      <div className="flex items-center space-x-2 text-xs text-[#44403C] font-sans pt-2 border-t border-[#E7E2D9]">
                        <span className="font-semibold text-[#8F6B2A]">{l.distance}</span>
                        <span>•</span>
                        <span>{l.time}</span>
                      </div>
                    </div>
                  </div>
                </CardTilt3D>
              </motion.div>
            );
          })}
        </div>

        {/* Architectural Walking Guide */}
        <div className="p-6 sm:p-10 rounded-2xl bg-[#1F1C1A] text-[#FAF8F5] border border-[#3D3733] shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-3">
              <span className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-[#282421] border border-[#8F6B2A]/40 text-[10px] font-sans font-semibold uppercase tracking-wider text-[#B3863E]">
                <Footprints className="w-3.5 h-3.5" />
                <span>Effortless Arrival</span>
              </span>

              <h3 className="font-serif text-2xl sm:text-3xl font-medium text-white">
                Step-by-Step Walk from Platform
              </h3>

              <p className="text-xs sm:text-sm text-[#FAF8F5]/80 font-normal leading-relaxed">
                Exit via Guwahati Railway Station Paltan Bazaar gate (PF 1 side). Walk straight along Md. Shah Road for 250 meters. Hotel Ambarish Grand Residency is prominently situated on the right with a dedicated parking portico.
              </p>
            </div>

            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-[#282421] border border-[#3D3733] space-y-1">
                <span className="text-[10px] uppercase font-sans tracking-wider text-[#B3863E] font-semibold">Step 01</span>
                <p className="text-sm text-white font-serif font-medium">Station Exit</p>
                <p className="text-xs text-[#FAF8F5]/65 font-normal">Head to Paltan Bazaar side exit</p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#282421] border border-[#3D3733] space-y-1">
                <span className="text-[10px] uppercase font-sans tracking-wider text-[#B3863E] font-semibold">Step 02</span>
                <p className="text-sm text-white font-serif font-medium">Md. Shah Road</p>
                <p className="text-xs text-[#FAF8F5]/65 font-normal">Walk 250m along main bazaar lane</p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#282421] border border-[#3D3733] space-y-1">
                <span className="text-[10px] uppercase font-sans tracking-wider text-[#B3863E] font-semibold">Step 03</span>
                <p className="text-sm text-white font-serif font-medium">Arrival</p>
                <p className="text-xs text-[#FAF8F5]/65 font-normal">Portico entrance with 24/7 reception</p>
              </div>
            </div>
          </div>
        </div>

        {/* Address Card with Direct Assistance */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="p-6 sm:p-8 rounded-2xl bg-[#F4EFE6] text-[#1C1917] flex flex-col md:flex-row items-center justify-between gap-6 border border-[#E7E2D9]"
        >
          <div className="space-y-1 text-center md:text-left">
            <span className="text-[11px] font-sans uppercase tracking-widest text-[#8F6B2A] font-semibold">
              Hotel Address • Reception 24/7
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#1C1917]">
              {HOTEL_INFO.address.street}, {HOTEL_INFO.address.city}, {HOTEL_INFO.address.state} {HOTEL_INFO.address.pincode}
            </h3>
            <p className="text-xs text-[#44403C] font-normal">
              Need walking guidance or luggage escort from the railway platform? Ring our reception desk anytime.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href={`tel:${HOTEL_INFO.phoneRaw}`}
              className="px-5 py-3 rounded-lg bg-white hover:bg-[#FAF5EB] text-xs font-semibold uppercase tracking-wider text-[#1C1917] border border-[#E7E2D9] transition-colors flex items-center"
            >
              <Phone className="w-3.5 h-3.5 mr-2 text-[#8F6B2A]" />
              <span>Call Reception</span>
            </a>
            <Link
              href="/location"
              className="btn-heritage-primary px-6 py-3 rounded-lg text-xs font-semibold tracking-wider flex items-center space-x-1.5"
            >
              <span>Full Transit Guide</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
