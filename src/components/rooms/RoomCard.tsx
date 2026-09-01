"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ChevronLeft, ChevronRight, Users, Maximize2, BedDouble, Wind, Wifi, Tv } from "lucide-react";
import { RoomCategory } from "@/data/rooms";
import { formatCurrencyINR } from "@/lib/formatters";

interface RoomCardProps {
  room: RoomCategory;
  featured?: boolean;
}

export default function RoomCard({ room, featured = false }: RoomCardProps) {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev + 1) % room.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev - 1 + room.images.length) % room.images.length);
  };

  if (featured) {
    // Wide Horizon Editorial Layout for the Lead Room
    return (
      <div className="group bg-[#FFFFFF] rounded-3xl border border-[#0C0B0B]/10 hover:border-[#B4872F]/40 p-6 sm:p-8 transition-all duration-300 shadow-sm hover:shadow-2xl hover:shadow-black/5 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Large Image Showcase (7 Cols) */}
        <div className="lg:col-span-7 relative aspect-[16/10] sm:aspect-[16/9] overflow-hidden rounded-2xl bg-[#ECE1D0]">
          <Link href={`/rooms/${room.slug}`} className="block w-full h-full relative">
            <Image
              src={room.images[currentImgIndex] || room.coverImage}
              alt={`${room.name} - Hotel Ambarish Grand Residency`}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
          </Link>

          {/* Category Tag */}
          <div className="absolute top-4 left-4 pointer-events-none">
            <span className="text-[10px] font-mono tracking-widest uppercase text-[#0C0B0B] bg-[#FFFFFF]/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-black/5 shadow-sm font-semibold">
              ⭐ Most Popular • {room.categoryCode}
            </span>
          </div>

          {/* Carousel Arrows */}
          {room.images.length > 1 && (
            <div className="absolute bottom-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={prevImage}
                aria-label="Previous photo"
                className="p-2 rounded-full bg-white/90 text-[#0C0B0B] hover:bg-white transition-colors shadow-md backdrop-blur-sm"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextImage}
                aria-label="Next photo"
                className="p-2 rounded-full bg-white/90 text-[#0C0B0B] hover:bg-white transition-colors shadow-md backdrop-blur-sm"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Image Dots */}
          <div className="absolute bottom-4 left-4 flex space-x-1.5 pointer-events-none">
            {room.images.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentImgIndex ? "bg-[#B4872F] w-5" : "bg-white/60 w-1.5"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Room Information & Direct Booking (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#B4872F] font-semibold">
                Featured Accommodation
              </span>
              <h3 className="font-serif text-3xl sm:text-4xl font-normal text-[#0C0B0B] group-hover:text-[#B62576] transition-colors">
                <Link href={`/rooms/${room.slug}`}>{room.name}</Link>
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-[#3D3734] font-light leading-relaxed">
              {room.fullDescription}
            </p>

            {/* Spec Matrix */}
            <div className="grid grid-cols-3 gap-3 py-3 border-t border-b border-[#0C0B0B]/8">
              <div className="flex items-center space-x-2 text-xs text-[#7A7067]">
                <Users className="w-4 h-4 text-[#B4872F] shrink-0" />
                <span>{room.capacity.maxGuests} Guests</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-[#7A7067]">
                <Maximize2 className="w-4 h-4 text-[#B4872F] shrink-0" />
                <span>{room.sizeSqFt} sq.ft</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-[#7A7067]">
                <BedDouble className="w-4 h-4 text-[#B4872F] shrink-0" />
                <span className="truncate">{room.bedType.split(" or ")[0]}</span>
              </div>
            </div>

            {/* Top Inclusions */}
            <div className="flex flex-wrap gap-2 text-[11px] text-[#4A443F]">
              <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-[#FAF7F4] border border-[#0C0B0B]/5">
                <Wind className="w-3 h-3 text-[#B4872F] mr-1.5" />
                Split AC
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-[#FAF7F4] border border-[#0C0B0B]/5">
                <Wifi className="w-3 h-3 text-[#B4872F] mr-1.5" />
                High-Speed Wi-Fi
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-[#FAF7F4] border border-[#0C0B0B]/5">
                <Tv className="w-3 h-3 text-[#B4872F] mr-1.5" />
                Smart LED TV
              </span>
            </div>
          </div>

          {/* Pricing & CTA */}
          <div className="pt-2 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#7A7067] block">
                Direct Rate from
              </span>
              <span className="font-serif text-2xl sm:text-3xl font-semibold text-[#B4872F]">
                {formatCurrencyINR(room.basePrice)}
                <span className="text-xs font-sans font-normal text-[#7A7067]"> / night</span>
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <Link
                href={`/rooms/${room.slug}`}
                className="hidden sm:inline-flex items-center text-xs font-semibold uppercase tracking-wider text-[#0C0B0B] hover:text-[#B62576] transition-colors"
              >
                <span>Details</span>
                <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
              </Link>
              <Link
                href={`/booking?room=${room.slug}`}
                className="px-6 py-3 text-xs font-bold uppercase tracking-[0.14em] text-white bg-[#B62576] hover:bg-[#9A1D62] rounded-full transition-all duration-200 shadow-md hover:scale-[1.02] active:scale-[0.98]"
              >
                Book Direct
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Standard 2-Column Card Layout
  return (
    <div className="group bg-[#FFFFFF] rounded-3xl border border-[#0C0B0B]/10 hover:border-[#B4872F]/40 p-5 sm:p-6 transition-all duration-300 shadow-sm hover:shadow-2xl hover:shadow-black/5 flex flex-col justify-between space-y-5">
      {/* Large Image Showcase */}
      <div className="relative w-full aspect-[16/10] overflow-hidden rounded-2xl bg-[#ECE1D0]">
        <Link href={`/rooms/${room.slug}`} className="block w-full h-full relative">
          <Image
            src={room.images[currentImgIndex] || room.coverImage}
            alt={`${room.name} - Hotel Ambarish Grand Residency`}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </Link>

        {/* Category Badge */}
        <div className="absolute top-3.5 left-3.5 pointer-events-none">
          <span className="text-[10px] font-mono tracking-widest uppercase text-[#0C0B0B] bg-[#FFFFFF]/90 backdrop-blur-md px-3 py-1 rounded-full border border-black/5 shadow-sm font-semibold">
            {room.categoryCode}
          </span>
        </div>

        {/* Carousel Arrows */}
        {room.images.length > 1 && (
          <div className="absolute bottom-3.5 right-3.5 flex space-x-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={prevImage}
              aria-label="Previous photo"
              className="p-1.5 rounded-full bg-white/90 text-[#0C0B0B] hover:bg-white transition-colors shadow-md"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={nextImage}
              aria-label="Next photo"
              className="p-1.5 rounded-full bg-white/90 text-[#0C0B0B] hover:bg-white transition-colors shadow-md"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Indicator dots */}
        <div className="absolute bottom-3.5 left-3.5 flex space-x-1 pointer-events-none">
          {room.images.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentImgIndex ? "bg-[#B4872F] w-4" : "bg-white/60 w-1.5"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[#0C0B0B] group-hover:text-[#B62576] transition-colors">
              <Link href={`/rooms/${room.slug}`}>{room.name}</Link>
            </h3>
            <p className="text-[11px] uppercase tracking-wider text-[#7A7067] font-mono mt-1">
              {room.capacity.maxGuests} Guests • {room.sizeSqFt} sq.ft • {room.bedType}
            </p>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#7A7067] block">
              From
            </span>
            <span className="font-serif text-xl font-semibold text-[#B4872F]">
              {formatCurrencyINR(room.basePrice)}
            </span>
            <span className="text-[10px] text-[#7A7067] block font-sans">/ night</span>
          </div>
        </div>

        <p className="text-xs text-[#3D3734] font-light leading-relaxed line-clamp-2">
          {room.shortDescription}
        </p>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-[#0C0B0B]/8 flex items-center justify-between">
          <Link
            href={`/rooms/${room.slug}`}
            className="text-xs uppercase tracking-[0.14em] text-[#0C0B0B] hover:text-[#B62576] font-semibold transition-colors flex items-center group/link"
          >
            <span>View room</span>
            <ArrowUpRight className="w-3.5 h-3.5 ml-1 transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
          </Link>

          <Link
            href={`/booking?room=${room.slug}`}
            className="px-5 py-2 text-xs font-bold uppercase tracking-[0.12em] text-white bg-[#B62576] hover:bg-[#9A1D62] rounded-full transition-all duration-150 shadow-sm hover:scale-[1.02] active:scale-[0.98]"
          >
            Book direct
          </Link>
        </div>
      </div>
    </div>
  );
}
