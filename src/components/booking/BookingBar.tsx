"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Tag, Users, Calendar, BedDouble, ChevronDown, Baby } from "lucide-react";
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
      <div className="bg-[#FFFFFF] border border-[#0C0B0B]/10 rounded-2xl lg:rounded-full p-3 sm:p-3.5 lg:p-2.5 shadow-2xl shadow-black/25">
        <form onSubmit={handleSearch}>
          {/* Desktop View (>= lg): Single Fluid Strip */}
          <div className="hidden lg:flex items-center divide-x divide-black/10">
            {/* 1. Check-In */}
            <div className="flex-1 min-w-[120px] px-3.5 py-1.5 flex flex-col justify-center">
              <label className="flex items-center text-[10px] font-mono font-bold tracking-[0.16em] uppercase text-[#B4872F] mb-0.5">
                <Calendar className="w-3 h-3 mr-1 text-[#B4872F] shrink-0" />
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
                className="w-full bg-transparent text-xs xl:text-sm text-[#0C0B0B] font-semibold focus:outline-none cursor-pointer"
              />
            </div>

            {/* 2. Check-Out */}
            <div className="flex-1 min-w-[120px] px-3.5 py-1.5 flex flex-col justify-center">
              <label className="flex items-center text-[10px] font-mono font-bold tracking-[0.16em] uppercase text-[#B4872F] mb-0.5">
                <Calendar className="w-3 h-3 mr-1 text-[#B4872F] shrink-0" />
                Check-Out
              </label>
              <input
                type="date"
                min={checkIn || getTodayDate()}
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                required
                className="w-full bg-transparent text-xs xl:text-sm text-[#0C0B0B] font-semibold focus:outline-none cursor-pointer"
              />
            </div>

            {/* 3. Rooms (1 to 4) */}
            <div className="flex-1 min-w-[95px] px-3 py-1.5 flex flex-col justify-center">
              <label className="flex items-center text-[10px] font-mono font-bold tracking-[0.16em] uppercase text-[#B4872F] mb-0.5">
                <BedDouble className="w-3 h-3 mr-1 text-[#B4872F] shrink-0" />
                Rooms
              </label>
              <div className="relative flex items-center">
                <select
                  value={roomsCount}
                  onChange={(e) => handleRoomsChange(e.target.value)}
                  className="w-full bg-transparent text-xs xl:text-sm text-[#0C0B0B] font-semibold focus:outline-none cursor-pointer pr-4 appearance-none"
                >
                  <option value="1">1 Room</option>
                  <option value="2">2 Rooms</option>
                  <option value="3">3 Rooms</option>
                  <option value="4">4 Rooms</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#0C0B0B]/50 absolute right-0 pointer-events-none" />
              </div>
            </div>

            {/* 4. Adults (1 to 8) */}
            <div className="flex-1 min-w-[100px] px-3 py-1.5 flex flex-col justify-center">
              <label className="flex items-center text-[10px] font-mono font-bold tracking-[0.16em] uppercase text-[#B4872F] mb-0.5">
                <Users className="w-3 h-3 mr-1 text-[#B4872F] shrink-0" />
                Adults
              </label>
              <div className="relative flex items-center">
                <select
                  value={adults}
                  onChange={(e) => setAdults(e.target.value)}
                  className="w-full bg-transparent text-xs xl:text-sm text-[#0C0B0B] font-semibold focus:outline-none cursor-pointer pr-4 appearance-none"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 10].map((num) => (
                    <option key={num} value={String(num)}>
                      {num} {num === 1 ? "Adult" : "Adults"}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#0C0B0B]/50 absolute right-0 pointer-events-none" />
              </div>
            </div>

            {/* 5. Children (0 to 4 - Free) */}
            <div className="flex-1 min-w-[100px] px-3 py-1.5 flex flex-col justify-center">
              <label className="flex items-center text-[10px] font-mono font-bold tracking-[0.16em] uppercase text-[#B4872F] mb-0.5">
                <Baby className="w-3 h-3 mr-1 text-emerald-700 shrink-0" />
                Children
              </label>
              <div className="relative flex items-center">
                <select
                  value={children}
                  onChange={(e) => setChildren(e.target.value)}
                  className="w-full bg-transparent text-xs xl:text-sm text-[#0C0B0B] font-semibold focus:outline-none cursor-pointer pr-4 appearance-none"
                >
                  <option value="0">0 Children</option>
                  <option value="1">1 Child (Free)</option>
                  <option value="2">2 Children (Free)</option>
                  <option value="3">3 Children (Free)</option>
                  <option value="4">4 Children (Free)</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#0C0B0B]/50 absolute right-0 pointer-events-none" />
              </div>
            </div>

            {/* 6. Promo Code */}
            <div className="flex-1 min-w-[110px] px-3 py-1.5 flex flex-col justify-center">
              <label className="flex items-center text-[10px] font-mono font-bold tracking-[0.16em] uppercase text-[#B4872F] mb-0.5">
                <Tag className="w-3 h-3 mr-1 text-[#B4872F] shrink-0" />
                Promo
              </label>
              <input
                type="text"
                placeholder="Optional"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                className="w-full bg-transparent text-xs xl:text-sm text-[#0C0B0B] font-bold uppercase placeholder:font-normal placeholder:text-black/35 focus:outline-none"
              />
            </div>

            {/* 7. Action Button */}
            <div className="shrink-0 p-1">
              <button
                type="submit"
                className="py-3 px-6 rounded-full bg-gradient-to-r from-[#B62576] to-[#92185C] hover:from-[#C72E84] hover:to-[#A71C67] text-white text-xs font-bold uppercase tracking-[0.14em] flex items-center justify-center space-x-2 transition-all duration-200 shadow-lg shadow-[#B62576]/30 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Search className="w-3.5 h-3.5 shrink-0" />
                <span>Check Rates</span>
              </button>
            </div>
          </div>

          {/* Mobile & Tablet View (< lg): Fluid 2-Row Responsive Card */}
          <div className="lg:hidden space-y-2.5">
            {/* Row 1: Check-in & Check-out */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-[#FAF7F2] p-2.5 rounded-xl border border-[#E6DED3]">
                <label className="flex items-center text-[9px] font-mono font-bold tracking-wider uppercase text-[#B4872F] mb-0.5">
                  <Calendar className="w-3 h-3 mr-1 text-[#B4872F]" />
                  Check-In
                </label>
                <input
                  type="date"
                  min={getTodayDate()}
                  value={checkIn}
                  onChange={(e) => {
                    setCheckIn(e.target.value);
                    if (new Date(e.target.value) >= new Date(checkOut)) {
                      const next = new Date(e.target.value);
                      next.setDate(next.getDate() + 1);
                      setCheckOut(next.toISOString().split("T")[0]);
                    }
                  }}
                  required
                  className="w-full bg-transparent text-xs text-[#0C0B0B] font-semibold focus:outline-none cursor-pointer"
                />
              </div>

              <div className="bg-[#FAF7F2] p-2.5 rounded-xl border border-[#E6DED3]">
                <label className="flex items-center text-[9px] font-mono font-bold tracking-wider uppercase text-[#B4872F] mb-0.5">
                  <Calendar className="w-3 h-3 mr-1 text-[#B4872F]" />
                  Check-Out
                </label>
                <input
                  type="date"
                  min={checkIn || getTodayDate()}
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  required
                  className="w-full bg-transparent text-xs text-[#0C0B0B] font-semibold focus:outline-none cursor-pointer"
                />
              </div>
            </div>

            {/* Row 2: Rooms, Adults, Children & Promo */}
            <div className="grid grid-cols-4 gap-1.5">
              <div className="bg-[#FAF7F2] p-1.5 rounded-xl border border-[#E6DED3]">
                <label className="flex items-center text-[8px] font-mono font-bold tracking-wider uppercase text-[#B4872F] mb-0.5">
                  Rooms
                </label>
                <div className="relative flex items-center">
                  <select
                    value={roomsCount}
                    onChange={(e) => handleRoomsChange(e.target.value)}
                    className="w-full bg-transparent text-xs text-[#0C0B0B] font-semibold focus:outline-none cursor-pointer pr-2 appearance-none"
                  >
                    <option value="1">1 Rm</option>
                    <option value="2">2 Rms</option>
                    <option value="3">3 Rms</option>
                    <option value="4">4 Rms</option>
                  </select>
                  <ChevronDown className="w-2.5 h-2.5 text-[#0C0B0B]/50 absolute right-0 pointer-events-none" />
                </div>
              </div>

              <div className="bg-[#FAF7F2] p-1.5 rounded-xl border border-[#E6DED3]">
                <label className="flex items-center text-[8px] font-mono font-bold tracking-wider uppercase text-[#B4872F] mb-0.5">
                  Adults
                </label>
                <div className="relative flex items-center">
                  <select
                    value={adults}
                    onChange={(e) => setAdults(e.target.value)}
                    className="w-full bg-transparent text-xs text-[#0C0B0B] font-semibold focus:outline-none cursor-pointer pr-2 appearance-none"
                  >
                    {[1, 2, 3, 4, 5, 6, 8].map((num) => (
                      <option key={num} value={String(num)}>
                        {num} Adt
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-2.5 h-2.5 text-[#0C0B0B]/50 absolute right-0 pointer-events-none" />
                </div>
              </div>

              <div className="bg-[#FAF7F2] p-1.5 rounded-xl border border-[#E6DED3]">
                <label className="flex items-center text-[8px] font-mono font-bold tracking-wider uppercase text-emerald-700 mb-0.5">
                  Children
                </label>
                <div className="relative flex items-center">
                  <select
                    value={children}
                    onChange={(e) => setChildren(e.target.value)}
                    className="w-full bg-transparent text-xs text-[#0C0B0B] font-semibold focus:outline-none cursor-pointer pr-2 appearance-none"
                  >
                    <option value="0">0</option>
                    <option value="1">1 (Free)</option>
                    <option value="2">2 (Free)</option>
                    <option value="3">3 (Free)</option>
                  </select>
                  <ChevronDown className="w-2.5 h-2.5 text-[#0C0B0B]/50 absolute right-0 pointer-events-none" />
                </div>
              </div>

              <div className="bg-[#FAF7F2] p-1.5 rounded-xl border border-[#E6DED3]">
                <label className="flex items-center text-[8px] font-mono font-bold tracking-wider uppercase text-[#B4872F] mb-0.5">
                  Promo
                </label>
                <input
                  type="text"
                  placeholder="Code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  className="w-full bg-transparent text-xs text-[#0C0B0B] font-bold uppercase placeholder:font-normal placeholder:text-black/35 focus:outline-none"
                />
              </div>
            </div>

            {/* Row 3: Action Button */}
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#B62576] to-[#92185C] hover:from-[#C72E84] hover:to-[#A71C67] text-white text-xs font-bold uppercase tracking-[0.14em] flex items-center justify-center space-x-2 shadow-lg shadow-[#B62576]/30 active:scale-[0.98] transition-all"
            >
              <Search className="w-4 h-4 shrink-0" />
              <span>Check Rates &amp; Availability</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
