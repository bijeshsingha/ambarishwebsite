"use client";

import React, { useState } from "react";
import { notFound, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Users,
  Maximize2,
  Wind,
  Wifi,
  Tv,
  Coffee,
  Bath,
  Briefcase,
  ShieldCheck,
  Check,
  Calendar,
  ArrowUpRight,
  Phone,
  Clock,
  ChevronLeft,
  ChevronRight,
  Expand,
} from "lucide-react";
import { ROOMS } from "@/data/rooms";
import { HOTEL_INFO } from "@/data/hotel-info";
import { formatCurrencyINR, getTodayDate, getTomorrowDate } from "@/lib/formatters";
import LightboxModal from "@/components/gallery/LightboxModal";
import RoomCard from "@/components/rooms/RoomCard";

export default function RoomDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const room = ROOMS.find((r) => r.slug === slug);
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Booking Widget State inside room detail
  const [checkIn, setCheckIn] = useState(getTodayDate());
  const [checkOut, setCheckOut] = useState(getTomorrowDate());
  const [selectedPlan, setSelectedPlan] = useState("EP");
  const [adults, setAdults] = useState(room?.capacity.adults || 2);

  if (!room) {
    notFound();
  }

  const galleryItems = room.images.map((imgSrc, i) => ({
    id: `room-img-${i}`,
    title: `${room.name} - View ${i + 1}`,
    category: "rooms" as const,
    categoryLabel: room.name,
    src: imgSrc,
    alt: `${room.name} photo ${i + 1}`,
    caption: `${room.name} - Hotel Ambarish Grand Residency by Divine View`,
  }));

  const activeRatePlan = room.ratePlans.find((p) => p.code === selectedPlan) || room.ratePlans[0];
  const relatedRooms = ROOMS.filter((r) => r.id !== room.id).slice(0, 2);

  return (
    <div className="bg-[#F5EBDD] text-[#0C0B0B] min-h-screen pb-20">
      {/* Minimal Breadcrumb */}
      <div className="py-4 px-4 sm:px-6 lg:px-8 text-xs text-[#7A7067] hairline-b">
        <div className="max-w-7xl mx-auto flex items-center space-x-2">
          <Link href="/" className="hover:text-[#0C0B0B]">Home</Link>
          <span>/</span>
          <Link href="/rooms" className="hover:text-[#0C0B0B]">Rooms</Link>
          <span>/</span>
          <span className="text-[#B4872F] font-medium">{room.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
        {/* Top Section: Gallery & Reservation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Gallery (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div
              onClick={() => setLightboxOpen(true)}
              className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden cursor-pointer bg-[#ECE1D0] border border-[#0C0B0B]/10 group shadow-md"
            >
              <Image
                src={room.images[activeImgIndex] || room.coverImage}
                alt={room.name}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-xs">
                <span className="bg-[#0C0B0B]/80 backdrop-blur-md px-3 py-1.5 rounded-full text-[#F5EBDD] border border-white/10 flex items-center">
                  <Expand className="w-3 h-3 mr-1.5 text-[#B4872F]" />
                  Photo {activeImgIndex + 1} / {room.images.length}
                </span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#F5EBDD] bg-[#0C0B0B]/80 px-3 py-1.5 rounded-full border border-white/10">
                  {room.categoryCode}
                </span>
              </div>
            </div>

            {/* Thumbnails */}
            <div className="flex space-x-3 overflow-x-auto pb-2">
              {room.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImgIndex(idx)}
                  className={`relative h-18 w-24 aspect-[4/3] shrink-0 rounded-xl overflow-hidden border transition-all ${
                    activeImgIndex === idx
                      ? "border-[#B62576] opacity-100 ring-2 ring-[#B62576]/30"
                      : "border-transparent opacity-50 hover:opacity-90"
                  }`}
                >
                  <Image src={img} alt={`Thumb ${idx + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Info & Direct Booking Card (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#B4872F] block">
                Verified Category
              </span>
              <h1 className="font-serif text-3xl sm:text-5xl font-normal text-[#0C0B0B]">
                {room.name}
              </h1>
              <p className="text-xs text-[#3D3734] font-light leading-relaxed">
                {room.shortDescription}
              </p>
            </div>

            {/* Quick Specs */}
            <div className="grid grid-cols-2 gap-3 py-3 hairline-y text-xs text-[#3D3734] font-light">
              <div>
                <span className="text-[10px] uppercase text-[#7A7067] block">Capacity</span>
                <span>{room.capacity.maxGuests} Guests ({room.bedType})</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-[#7A7067] block">Dimensions</span>
                <span>{room.sizeSqFt} sq.ft</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-[#7A7067] block">Air Conditioning</span>
                <span>{room.acType}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-[#7A7067] block">Smoking</span>
                <span>Non-Smoking</span>
              </div>
            </div>

            {/* Booking Box */}
            <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#0C0B0B]/10 space-y-5 shadow-xl">
              <div className="flex justify-between items-baseline hairline-b pb-3">
                <span className="text-xs text-[#7A7067] uppercase tracking-wider">Tariff</span>
                <span className="font-serif text-2xl text-[#B4872F]">
                  {formatCurrencyINR(activeRatePlan.pricePerNight)}
                  <span className="text-[11px] font-sans font-light text-[#7A7067] ml-1">/ night + GST</span>
                </span>
              </div>

              {/* Rate Plan Select */}
              <div className="space-y-2">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-[#B4872F] block">
                  Select meal plan:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {room.ratePlans.map((plan) => (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => setSelectedPlan(plan.code)}
                      className={`p-3 rounded-xl text-left border transition-all ${
                        selectedPlan === plan.code
                          ? "bg-[#F5EBDD] border-[#B62576] text-[#0C0B0B] ring-1 ring-[#B62576]"
                          : "bg-[#FFFFFF] border-[#0C0B0B]/10 text-[#3D3734] hover:border-[#0C0B0B]/20"
                      }`}
                    >
                      <span className="block text-xs font-semibold">{plan.code} Plan</span>
                      <span className="block text-[11px] text-[#B4872F]">
                        {formatCurrencyINR(plan.pricePerNight)}/nt
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[10px] uppercase text-[#7A7067] block mb-1">Check-in</label>
                  <input
                    type="date"
                    min={getTodayDate()}
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full bg-[#FAF6F0] border border-[#0C0B0B]/10 rounded-xl p-2.5 text-xs text-[#0C0B0B]"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase text-[#7A7067] block mb-1">Check-out</label>
                  <input
                    type="date"
                    min={checkIn || getTodayDate()}
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full bg-[#FAF6F0] border border-[#0C0B0B]/10 rounded-xl p-2.5 text-xs text-[#0C0B0B]"
                  />
                </div>
              </div>

              <Link
                href={`/checkout?room=${room.slug}&plan=${selectedPlan}&checkIn=${checkIn}&checkOut=${checkOut}&adults=${adults}`}
                className="w-full py-3.5 px-4 rounded-full bg-[#B62576] hover:bg-[#9A1D62] text-white text-xs font-bold uppercase tracking-[0.14em] flex items-center justify-center space-x-1.5 transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Proceed to checkout</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Narrative & Amenities */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-12 hairline-t">
          <div className="lg:col-span-7 space-y-6">
            <h3 className="font-serif text-2xl font-normal text-[#0C0B0B]">Room overview</h3>
            <p className="text-xs sm:text-sm text-[#3D3734] font-light leading-relaxed">
              {room.fullDescription}
            </p>

            <div className="space-y-3 pt-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#B4872F] block">
                Highlights
              </span>
              <ul className="space-y-2 text-xs text-[#3D3734] font-light">
                {room.highlights.map((h, i) => (
                  <li key={i} className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 bg-[#B4872F] rounded-full" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <h3 className="font-serif text-2xl font-normal text-[#0C0B0B]">Included amenities</h3>
            <div className="grid grid-cols-2 gap-3 p-5 rounded-2xl bg-[#FFFFFF] border border-[#0C0B0B]/10 text-xs text-[#3D3734] shadow-sm">
              {room.amenities.map((a, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-[#B4872F] rounded-full" />
                  <span>{a.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Other Rooms */}
        <div className="pt-12 hairline-t space-y-8">
          <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[#0C0B0B]">Alternative rooms</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {relatedRooms.map((r) => (
              <RoomCard key={r.id} room={r} />
            ))}
          </div>
        </div>
      </div>

      <LightboxModal
        images={galleryItems}
        currentIndex={activeImgIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={(idx) => setActiveImgIndex(idx)}
      />
    </div>
  );
}
