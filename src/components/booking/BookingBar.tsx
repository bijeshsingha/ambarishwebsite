"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Tag, Users, Calendar, BedDouble, ChevronDown, Baby, Clock } from "lucide-react";
import { getTodayDate, getTomorrowDate } from "@/lib/formatters";
import { saveStaySession, getStaySession } from "@/lib/session";

interface BookingBarProps {
  initialRoomId?: string;
  initialPromo?: string;
  className?: string;
}

export default function BookingBar({
  initialRoomId,
  initialPromo = "",
  className = "",
}: BookingBarProps) {
  const router = useRouter();

  // Load saved stay from session cookie on mount if available
  const [checkIn, setCheckIn] = useState(getTodayDate());
  const [checkOut, setCheckOut] = useState(getTomorrowDate());
  const [roomsCount, setRoomsCount] = useState("1");
  const [adults, setAdults] = useState("2");
  const [children, setChildren] = useState("0");
  const [promoCode, setPromoCode] = useState(initialPromo);

  useEffect(() => {
    const saved = getStaySession();
    if (saved) {
      if (saved.checkIn) setCheckIn(saved.checkIn);
      if (saved.checkOut) setCheckOut(saved.checkOut);
      if (saved.rooms) setRoomsCount(String(saved.rooms));
      if (saved.adults) setAdults(String(saved.adults));
      if (saved.children !== undefined) setChildren(String(saved.children));
      if (saved.promoCode && !initialPromo) setPromoCode(saved.promoCode);
    }
  }, [initialPromo]);

  const handleRoomsChange = (newRooms: string) => {
    setRoomsCount(newRooms);
    const r = Math.max(1, parseInt(newRooms, 10) || 1);
    const currentAdults = parseInt(adults, 10) || 2;
    const minAdults = r * 1;
    const maxAdults = r * 3;
    if (currentAdults < minAdults || currentAdults > maxAdults) {
      setAdults(String(r * 2));
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPromo = promoCode.trim().toUpperCase();

    // Persist stay search parameters into session cookies
    saveStaySession({
      checkIn,
      checkOut,
      rooms: parseInt(roomsCount, 10) || 1,
      adults: parseInt(adults, 10) || 2,
      children: parseInt(children, 10) || 0,
      promoCode: cleanPromo || undefined,
    });

    const query = new URLSearchParams({
      checkIn,
      checkOut,
      rooms: roomsCount,
      adults,
      children,
      type: "individual",
      ...(initialRoomId && initialRoomId !== "all" ? { room: initialRoomId } : {}),
      ...(cleanPromo ? { promo: cleanPromo } : {}),
    });

    router.push(`/booking?${query.toString()}`);
  };

  return (
    <div className={`w-full max-w-6xl mx-auto ${className}`}>
      <div className="bg-[#FFFFFF] border border-[#E7E2D9] rounded-2xl lg:rounded-xl p-3 sm:p-4 lg:p-2.5 shadow-xl text-[#1C1917]">
        <form onSubmit={handleSearch}>
          {/* Desktop View (>= lg): Single Fluid Strip */}
          <div className="hidden lg:flex items-center divide-x divide-[#E7E2D9]">
            {/* 1. Check-In */}
            <div className="flex-1 min-w-[125px] px-3.5 py-1.5 flex flex-col justify-center">
              <label className="flex items-center text-[10px] font-sans font-semibold tracking-[0.16em] uppercase text-[#8F6B2A] mb-0.5">
                <Calendar className="w-3 h-3 mr-1 text-[#8F6B2A] shrink-0" />
                Check-In
              </label>
              <input
                type="date"
                min={getTodayDate()}
                value={checkIn}
                onChange={(e) => {
                  setCheckIn(e.target.value);
                  if (new Date(e.target.value) >= new Date(checkOut)) {
                    const nextDay = new Date(e.target.value);
                    nextDay.setDate(nextDay.getDate() + 1);
                    setCheckOut(nextDay.toISOString().split("T")[0]);
                  }
                }}
                required
                className="w-full bg-transparent text-xs xl:text-sm text-[#1C1917] font-semibold focus:outline-none cursor-pointer"
              />
            </div>

            {/* 2. Check-Out */}
            <div className="flex-1 min-w-[125px] px-3.5 py-1.5 flex flex-col justify-center">
              <label className="flex items-center text-[10px] font-sans font-semibold tracking-[0.16em] uppercase text-[#8F6B2A] mb-0.5">
                <Calendar className="w-3 h-3 mr-1 text-[#8F6B2A] shrink-0" />
                Check-Out
              </label>
              <input
                type="date"
                min={checkIn || getTodayDate()}
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                required
                className="w-full bg-transparent text-xs xl:text-sm text-[#1C1917] font-semibold focus:outline-none cursor-pointer"
              />
            </div>

            {/* 3. Rooms */}
            <div className="flex-1 min-w-[95px] px-3 py-1.5 flex flex-col justify-center">
              <label className="flex items-center text-[10px] font-sans font-semibold tracking-[0.16em] uppercase text-[#8F6B2A] mb-0.5">
                <BedDouble className="w-3 h-3 mr-1 text-[#8F6B2A] shrink-0" />
                Rooms
              </label>
              <div className="relative flex items-center">
                <select
                  value={roomsCount}
                  onChange={(e) => handleRoomsChange(e.target.value)}
                  className="w-full bg-transparent text-xs xl:text-sm text-[#1C1917] font-semibold focus:outline-none cursor-pointer pr-4 appearance-none"
                >
                  <option value="1">1 Room</option>
                  <option value="2">2 Rooms</option>
                  <option value="3">3 Rooms</option>
                  <option value="4">4 Rooms</option>
                </select>
                <ChevronDown className="w-3 h-3 text-[#78716C] pointer-events-none absolute right-0" />
              </div>
            </div>

            {/* 4. Adults */}
            <div className="flex-1 min-w-[95px] px-3 py-1.5 flex flex-col justify-center">
              <label className="flex items-center text-[10px] font-sans font-semibold tracking-[0.16em] uppercase text-[#8F6B2A] mb-0.5">
                <Users className="w-3 h-3 mr-1 text-[#8F6B2A] shrink-0" />
                Adults
              </label>
              <div className="relative flex items-center">
                <select
                  value={adults}
                  onChange={(e) => setAdults(e.target.value)}
                  className="w-full bg-transparent text-xs xl:text-sm text-[#1C1917] font-semibold focus:outline-none cursor-pointer pr-4 appearance-none"
                >
                  {Array.from(
                    { length: Math.max(1, parseInt(roomsCount, 10) * 3 - Math.max(1, parseInt(roomsCount, 10) * 1) + 1) },
                    (_, i) => Math.max(1, parseInt(roomsCount, 10) * 1) + i
                  ).map((count) => (
                    <option key={count} value={String(count)}>
                      {count} {count === 1 ? "Adult" : "Adults"}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3 h-3 text-[#78716C] pointer-events-none absolute right-0" />
              </div>
            </div>

            {/* 5. Children */}
            <div className="flex-1 min-w-[95px] px-3 py-1.5 flex flex-col justify-center">
              <label className="flex items-center text-[10px] font-sans font-semibold tracking-[0.16em] uppercase text-[#8F6B2A] mb-0.5">
                <Baby className="w-3 h-3 mr-1 text-[#8F6B2A] shrink-0" />
                Kids (0-12)
              </label>
              <div className="relative flex items-center">
                <select
                  value={children}
                  onChange={(e) => setChildren(e.target.value)}
                  className="w-full bg-transparent text-xs xl:text-sm text-[#1C1917] font-semibold focus:outline-none cursor-pointer pr-4 appearance-none"
                >
                  {[0, 1, 2, 3, 4].map((count) => (
                    <option key={count} value={String(count)}>
                      {count} {count === 1 ? "Child" : "Children"}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3 h-3 text-[#78716C] pointer-events-none absolute right-0" />
              </div>
            </div>

            {/* 6. Promo Code */}
            <div className="flex-1 min-w-[120px] px-3.5 py-1.5 flex flex-col justify-center">
              <label className="flex items-center text-[10px] font-sans font-semibold tracking-[0.16em] uppercase text-[#8F6B2A] mb-0.5">
                <Tag className="w-3 h-3 mr-1 text-[#8F6B2A] shrink-0" />
                Promo Code
              </label>
              <input
                type="text"
                placeholder="Optional"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                className="w-full bg-transparent text-xs xl:text-sm text-[#1C1917] font-bold uppercase placeholder:font-normal placeholder:text-[#78716C]/60 focus:outline-none"
              />
            </div>

            {/* 7. CTA Search Button */}
            <div className="pl-3 py-1 flex items-center shrink-0">
              <button
                type="submit"
                className="btn-heritage-primary py-3 px-5 xl:px-6 rounded-lg text-xs font-semibold tracking-wider flex items-center space-x-2"
              >
                <Search className="w-3.5 h-3.5 shrink-0" />
                <span className="whitespace-nowrap">Check Rates</span>
              </button>
            </div>
          </div>

          {/* Mobile & Tablet View (< lg): Responsive Form Grid */}
          <div className="flex lg:hidden flex-col space-y-3">
            {/* Row 1: Check-In & Check-Out */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-[#FAF8F5] p-2.5 rounded-lg border border-[#E7E2D9] flex flex-col">
                <label className="text-[10px] uppercase font-semibold text-[#8F6B2A] mb-0.5 flex items-center">
                  <Calendar className="w-3 h-3 mr-1 text-[#8F6B2A]" />
                  Check-In
                </label>
                <input
                  type="date"
                  min={getTodayDate()}
                  value={checkIn}
                  onChange={(e) => {
                    setCheckIn(e.target.value);
                    if (new Date(e.target.value) >= new Date(checkOut)) {
                      const nextDay = new Date(e.target.value);
                      nextDay.setDate(nextDay.getDate() + 1);
                      setCheckOut(nextDay.toISOString().split("T")[0]);
                    }
                  }}
                  className="bg-transparent text-xs text-[#1C1917] font-semibold focus:outline-none"
                />
              </div>

              <div className="bg-[#FAF8F5] p-2.5 rounded-lg border border-[#E7E2D9] flex flex-col">
                <label className="text-[10px] uppercase font-semibold text-[#8F6B2A] mb-0.5 flex items-center">
                  <Calendar className="w-3 h-3 mr-1 text-[#8F6B2A]" />
                  Check-Out
                </label>
                <input
                  type="date"
                  min={checkIn || getTodayDate()}
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="bg-transparent text-xs text-[#1C1917] font-semibold focus:outline-none"
                />
              </div>
            </div>

            {/* Row 2: Occupancy & Promo */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-[#FAF8F5] p-2 rounded-lg border border-[#E7E2D9] flex flex-col">
                <label className="text-[9px] uppercase font-semibold text-[#8F6B2A] mb-0.5">Rooms</label>
                <select
                  value={roomsCount}
                  onChange={(e) => handleRoomsChange(e.target.value)}
                  className="bg-transparent text-xs text-[#1C1917] font-semibold focus:outline-none cursor-pointer"
                >
                  <option value="1">1 Room</option>
                  <option value="2">2 Rooms</option>
                  <option value="3">3 Rooms</option>
                  <option value="4">4 Rooms</option>
                </select>
              </div>

              <div className="bg-[#FAF8F5] p-2 rounded-lg border border-[#E7E2D9] flex flex-col">
                <label className="text-[9px] uppercase font-semibold text-[#8F6B2A] mb-0.5">Adults</label>
                <select
                  value={adults}
                  onChange={(e) => setAdults(e.target.value)}
                  className="bg-transparent text-xs text-[#1C1917] font-semibold focus:outline-none cursor-pointer"
                >
                  {[1, 2, 3, 4, 6, 8].map((c) => (
                    <option key={c} value={String(c)}>
                      {c} {c === 1 ? "Adult" : "Adults"}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-[#FAF8F5] p-2 rounded-lg border border-[#E7E2D9] flex flex-col">
                <label className="text-[9px] uppercase font-semibold text-[#8F6B2A] mb-0.5">Promo</label>
                <input
                  type="text"
                  placeholder="Optional"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  className="w-full bg-transparent text-xs text-[#1C1917] font-bold uppercase placeholder:font-normal placeholder:text-[#78716C]/60 focus:outline-none"
                />
              </div>
            </div>

            {/* Row 3: Action Button */}
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-lg btn-heritage-primary text-xs font-semibold tracking-wider flex items-center justify-center space-x-2"
            >
              <Search className="w-4 h-4 shrink-0" />
              <span>Check Rates &amp; Availability</span>
            </button>
          </div>
        </form>
      </div>

      {/* Direct Booking Early Check-in Offer Strip (No AI sparkles) */}
      <div className="mt-3 flex items-center justify-center">
        <div className="inline-flex items-center justify-center gap-2.5 px-4 py-2 rounded-full bg-[#FAF8F5]/95 backdrop-blur-md border border-[#E7E2D9] shadow-sm text-xs text-[#1C1917] flex-wrap font-medium text-center">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FAF5EB] text-[#8F6B2A] border border-[#DFD5C0] text-[10px] font-semibold uppercase tracking-wider">
            <Clock className="w-3 h-3 text-[#8F6B2A]" />
            Special Direct Offer
          </span>
          <span className="text-[#1C1917]">
            Free Early Check-in from <strong className="text-[#8F6B2A] font-semibold">5:00 AM onwards</strong> with zero extra charge!
          </span>
          <span className="text-[#A8A29E] hidden sm:inline">•</span>
          <span className="text-[#57534E] hidden sm:inline">
            Standard Check-in &amp; Check-out: <strong>12:00 Noon</strong>
          </span>
        </div>
      </div>
    </div>
  );
}
