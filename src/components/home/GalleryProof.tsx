"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import CardTilt3D from "@/components/3d/CardTilt3D";

const curatedGallery = [
  {
    src: "/images/polished/suite-living-wide.webp",
    title: "Presidential Suite Living Salon",
    category: "Luxury Suite",
  },
  {
    src: "/images/polished/deluxe-king.webp",
    title: "Double Deluxe King Room",
    category: "Deluxe Rooms",
  },
  {
    src: "/images/bar/bar1-lounge-seating.webp",
    title: "Pavillion Bar Lounge (2nd Floor)",
    category: "Pavillion Bar",
  },
  {
    src: "/images/polished/restaurant-dining.webp",
    title: "The Ambarish Restaurant",
    category: "Dining",
  },
  {
    src: "/images/polished/reception-desk.webp",
    title: "Main Reception & Lobby",
    category: "Lobby",
  },
  {
    src: "/images/polished/banquet-boardroom-wide.webp",
    title: "Executive Boardroom Venue",
    category: "Banquets",
  },
];

export default function GalleryProof() {
  return (
    <section className="bg-[#0C0B0A] text-[#FAF8F5] py-24 sm:py-32 px-4 sm:px-6 lg:px-8 border-t border-white/10">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-white/10">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.28em] text-[#9E8255] font-semibold">
              Visual Archive
            </p>
            <h2 className="font-serif text-3xl sm:text-5xl font-normal leading-tight text-[#FAF8F5]">
              Authentic Hotel Photography
            </h2>
            <p className="text-[#FAF8F5]/65 text-sm sm:text-base font-light max-w-xl leading-relaxed">
              Genuine high-resolution photography of our guest rooms, presidential suite, multi-cuisine restaurant, reception, and event spaces.
            </p>
          </div>

          <div>
            <Link
              href="/gallery"
              className="group inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#FAF8F5] hover:text-[#9E8255] transition-colors"
            >
              <span>View Full Gallery</span>
              <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>

        {/* Balanced 3x2 Grid with 3D Depth */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {curatedGallery.map((img) => (
            <CardTilt3D key={img.src} maxTilt={5}>
              <Link
                href="/gallery"
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 bg-[#171412] shadow-lg transition-all duration-300 hover:border-[#9E8255]/50 block"
              >
                <Image
                  src={img.src}
                  alt={img.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-300" />

                {/* Title & Category Information */}
                <div className="absolute bottom-0 left-0 right-0 p-5 flex items-end justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#BFA058] block mb-1">
                      {img.category}
                    </span>
                    <h3 className="font-serif text-lg sm:text-xl text-white font-normal leading-snug">
                      {img.title}
                    </h3>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0 ml-3">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </CardTilt3D>
          ))}
        </div>
      </div>
    </section>
  );
}
