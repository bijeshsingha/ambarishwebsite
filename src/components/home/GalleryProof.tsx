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
    <section className="bg-[#F4EFE6] text-[#1C1917] py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-t border-[#E7E2D9]">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-4 border-b border-[#E7E2D9]">
          <div className="space-y-2">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#8F6B2A] font-semibold">
              Visual Archive
            </p>
            <h2 className="font-serif text-3xl sm:text-5xl font-medium leading-tight text-[#1C1917]">
              Authentic Hotel Photography
            </h2>
            <p className="text-[#44403C] text-sm sm:text-base font-normal max-w-xl leading-relaxed">
              Genuine high-resolution photography of our guest rooms, presidential suite, multi-cuisine restaurant, reception, and event spaces.
            </p>
          </div>

          <div>
            <Link
              href="/gallery"
              className="group inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#1C1917] hover:text-[#8F6B2A] transition-colors"
            >
              <span>View Full Gallery</span>
              <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>

        {/* 3x2 Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {curatedGallery.map((img) => (
            <CardTilt3D key={img.src} maxTilt={3}>
              <Link
                href="/gallery"
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden border border-[#E7E2D9] bg-[#FFFFFF] shadow-sm transition-all duration-300 hover:border-[#8F6B2A] hover:shadow-md block"
              >
                <Image
                  src={img.src}
                  alt={img.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />

                {/* Scrim Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-75 group-hover:opacity-90 transition-opacity duration-300" />

                {/* Title & Category Information */}
                <div className="absolute bottom-0 left-0 right-0 p-5 flex items-end justify-between">
                  <div>
                    <span className="text-[10px] font-sans uppercase tracking-widest text-[#B3863E] block mb-1 font-semibold">
                      {img.category}
                    </span>
                    <h3 className="font-serif text-lg sm:text-xl text-white font-medium leading-snug">
                      {img.title}
                    </h3>
                  </div>

                  <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
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
