"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Filter } from "lucide-react";
import RoomCard from "@/components/rooms/RoomCard";
import BookingBar from "@/components/booking/BookingBar";
import { ROOMS } from "@/data/rooms";

export default function RoomsPage() {
  const [activeFilter, setActiveFilter] = useState<"all" | "DELUXE" | "EXECUTIVE" | "SUITE">("all");

  const filteredRooms = ROOMS.filter((room) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "DELUXE") return room.categoryCode === "DLX";
    if (activeFilter === "EXECUTIVE") return room.categoryCode === "EXE";
    if (activeFilter === "SUITE") return room.categoryCode === "SUI";
    return true;
  });

  return (
    <div className="bg-[#F5EBDD] text-[#0C0B0B] min-h-screen pb-20">
      {/* Header */}
      <section className="py-20 sm:py-28 bg-[#ECE1D0] hairline-b text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#B4872F] block">
            Accommodation
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-normal text-[#0C0B0B]">
            Rooms & Suites
          </h1>
          <p className="text-sm sm:text-base text-[#3D3734] max-w-xl mx-auto font-light leading-relaxed">
            Thoughtfully designed sanctuaries featuring split AC, pristine linens, 24/7 hot water, and high-speed Wi-Fi in Paltan Bazaar.
          </p>
        </div>
      </section>

      {/* Floating Booking Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 sm:-mt-8 relative z-20">
        <BookingBar />
      </div>

      {/* Main Catalog */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-8 hairline-b mb-12">
          <div className="flex items-center space-x-2 text-[11px] font-semibold uppercase tracking-wider text-[#7A7067]">
            <Filter className="w-3.5 h-3.5 text-[#B4872F]" />
            <span>Filter categories</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { id: "all", label: "All Rooms" },
              { id: "DELUXE", label: "Double Deluxe" },
              { id: "EXECUTIVE", label: "Executive King" },
              { id: "SUITE", label: "Presidential Suite" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id as any)}
                className={`px-4 py-1.5 rounded-full text-xs transition-all ${
                  activeFilter === f.id
                    ? "bg-[#0C0B0B] text-[#F5EBDD] font-semibold shadow-md"
                    : "bg-[#FFFFFF] text-[#3D3734] hover:text-[#0C0B0B] border border-[#0C0B0B]/10"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Room Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      </section>
    </div>
  );
}
