"use client";

import React, { useState, Suspense, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  Users,
  ShieldCheck,
  ArrowUpRight,
  Tag,
  CheckCircle2,
  XCircle,
  Percent,
  Sparkles,
  Bed,
  Layers,
  Plus,
  Minus,
  Check,
  ShoppingBag,
  Trash2,
  Baby,
} from "lucide-react";
import { ROOMS, RoomCategory } from "@/data/rooms";
import { HOTEL_INFO } from "@/data/hotel-info";
import { calculateRoomGST } from "@/lib/gst";
import { formatCurrencyINR, calculateNights, getTodayDate, getTomorrowDate } from "@/lib/formatters";
import { AVAILABLE_PROMOS, validateAndApplyPromo, PromoCode } from "@/data/promos";
import { saveStaySession, getStaySession } from "@/lib/session";

interface RoomSelectionState {
  planCode: string;
  quantity: number;
}

function BookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Load saved session preferences if query params are not explicitly provided
  const savedStay = typeof window !== "undefined" ? getStaySession() : null;

  const [checkIn, setCheckIn] = useState(
    searchParams.get("checkIn") || savedStay?.checkIn || getTodayDate()
  );
  const [checkOut, setCheckOut] = useState(
    searchParams.get("checkOut") || savedStay?.checkOut || getTomorrowDate()
  );
  const [adults, setAdults] = useState(
    searchParams.get("adults") || (savedStay?.adults ? String(savedStay.adults) : "2")
  );
  const [children, setChildren] = useState(
    searchParams.get("children") || (savedStay?.children !== undefined ? String(savedStay.children) : "0")
  );

  const targetRoomsParam = Math.max(1, parseInt(searchParams.get("rooms") || "1", 10));
  const initialPromo = searchParams.get("promo") || savedStay?.promoCode || "";
  const selectedRoomSlug = searchParams.get("room");

  const nights = Math.max(1, calculateNights(checkIn, checkOut));

  // Multi-room selection map: { [slug]: { planCode: "EP" | "CP", quantity: number } }
  const [roomSelections, setRoomSelections] = useState<Record<string, RoomSelectionState>>(() => {
    const initial: Record<string, RoomSelectionState> = {};
    ROOMS.forEach((r) => {
      const isTarget = selectedRoomSlug === r.slug || (!selectedRoomSlug && r.slug === "deluxe-room");
      initial[r.slug] = {
        planCode: "EP",
        quantity: isTarget ? targetRoomsParam : 0,
      };
    });
    return initial;
  });

  // Promo Code States
  const [promoInput, setPromoInput] = useState(initialPromo);
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [promoMsg, setPromoMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Initialize promo on load
  useEffect(() => {
    if (initialPromo) {
      const res = validateAndApplyPromo(initialPromo, 3000);
      if (res.isValid && res.promo) {
        setAppliedPromo(res.promo);
        setPromoMsg({
          type: "success",
          text: `"${res.promo.code}" applied! ${res.promo.description}`,
        });
      }
    }
  }, [initialPromo]);

  // Persist stay parameters in session cookies
  useEffect(() => {
    saveStaySession({
      checkIn,
      checkOut,
      adults: parseInt(adults, 10) || 2,
      children: parseInt(children, 10) || 0,
      promoCode: appliedPromo?.code || promoInput || undefined,
    });
  }, [checkIn, checkOut, adults, children, appliedPromo, promoInput]);

  const handleApplyPromo = (codeToApply?: string) => {
    const code = (codeToApply || promoInput).trim().toUpperCase();
    if (!code) {
      setPromoMsg({ type: "error", text: "Please enter a valid promo code." });
      return;
    }

    const res = validateAndApplyPromo(code, 3000);
    if (res.isValid && res.promo) {
      setAppliedPromo(res.promo);
      setPromoInput(res.promo.code);
      setPromoMsg({
        type: "success",
        text: `Promo "${res.promo.code}" applied! ${res.promo.description}`,
      });
    } else {
      setPromoMsg({
        type: "error",
        text: res.errorMessage || `Invalid promo code "${code}". Try DIRECT10 or AMBARISH15.`,
      });
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoInput("");
    setPromoMsg(null);
  };

  // Quantity and plan modifiers
  const handleQuantityChange = (slug: string, delta: number) => {
    setRoomSelections((prev) => {
      const current = prev[slug] || { planCode: "EP", quantity: 0 };
      const nextQty = Math.max(0, Math.min(6, current.quantity + delta));
      return {
        ...prev,
        [slug]: { ...current, quantity: nextQty },
      };
    });
  };

  const handlePlanChange = (slug: string, planCode: string) => {
    setRoomSelections((prev) => {
      const current = prev[slug] || { planCode: "EP", quantity: 0 };
      return {
        ...prev,
        [slug]: { ...current, planCode },
      };
    });
  };

  // Calculate live multi-room cart totals with Extra Pax (+500/night beyond 2 adults/room) and Free Children
  const cartSummary = useMemo(() => {
    let totalRoomsCount = 0;
    let grossBaseTariff = 0;
    const items: {
      room: RoomCategory;
      planCode: string;
      planName: string;
      pricePerNight: number;
      quantity: number;
      lineTotal: number;
    }[] = [];

    ROOMS.forEach((r) => {
      const sel = roomSelections[r.slug];
      if (sel && sel.quantity > 0) {
        const plan = r.ratePlans.find((p) => p.code === sel.planCode) || r.ratePlans[0];
        const lineTotal = plan.pricePerNight * sel.quantity * nights;
        totalRoomsCount += sel.quantity;
        grossBaseTariff += lineTotal;
        items.push({
          room: r,
          planCode: plan.code,
          planName: plan.name,
          pricePerNight: plan.pricePerNight,
          quantity: sel.quantity,
          lineTotal,
        });
      }
    });

    const parsedAdults = parseInt(adults, 10) || 2;
    const standardCapacity = totalRoomsCount * 2;
    const extraPaxCount = Math.max(0, parsedAdults - standardCapacity);
    const extraPaxCharge = extraPaxCount * 500 * nights;

    const grossBaseTotal = grossBaseTariff + extraPaxCharge;

    let discountAmount = 0;
    if (appliedPromo && grossBaseTotal > 0) {
      const res = validateAndApplyPromo(appliedPromo.code, grossBaseTotal);
      if (res.isValid) {
        discountAmount = res.discountAmount;
      }
    }

    const netBaseAmount = Math.max(0, grossBaseTotal - discountAmount);
    const gstAmount = Math.round(netBaseAmount * 0.05); // 5% GST under SAC 996311
    const grandTotal = netBaseAmount + gstAmount;

    return {
      totalRoomsCount,
      grossBaseTariff,
      extraPaxCount,
      extraPaxCharge,
      grossBaseTotal,
      discountAmount,
      netBaseAmount,
      gstAmount,
      grandTotal,
      items,
    };
  }, [roomSelections, nights, adults, appliedPromo]);

  // Handle Checkout Click
  const handleProceedToCheckout = () => {
    if (cartSummary.totalRoomsCount === 0) return;

    const roomsConfig = cartSummary.items.map((item) => ({
      slug: item.room.slug,
      plan: item.planCode,
      quantity: item.quantity,
    }));

    const query = new URLSearchParams({
      checkIn,
      checkOut,
      adults,
      children,
      rooms: String(cartSummary.totalRoomsCount),
      rooms_data: JSON.stringify(roomsConfig),
      ...(appliedPromo ? { promo: appliedPromo.code } : {}),
    });

    router.push(`/checkout?${query.toString()}`);
  };

  const parsedChildren = parseInt(children, 10) || 0;

  return (
    <div className="bg-[#FAF7F2] text-[#1A1715] min-h-screen pb-32 sm:pb-36">
      {/* Top Search & Filter Banner */}
      <section className="bg-[#F5EFEB] hairline-b py-5 sm:py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] sm:text-[11px] font-semibold tracking-[0.18em] uppercase text-[#A27520] block">
                Direct Rates &amp; Multi-Room Booking
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-normal text-[#1A1715]">
                Select Rooms &amp; Rates
              </h1>
            </div>

            {/* Quick Stay Dates Tag */}
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-[#FFFFFF] rounded-xl border border-[#E6DED3] text-xs shadow-sm self-start sm:self-auto">
              <Calendar className="w-3.5 h-3.5 text-[#A27520]" />
              <span>
                <strong>{checkIn}</strong> &rarr; <strong>{checkOut}</strong> ({nights}N)
              </span>
              <span className="text-black/20">•</span>
              <span className="font-medium text-[#1A1715]">
                {adults} {parseInt(adults, 10) === 1 ? "Adult" : "Adults"}
                {parsedChildren > 0 ? `, ${parsedChildren} ${parsedChildren === 1 ? "Child" : "Children"} (Free)` : ""}
              </span>
            </div>
          </div>

          {/* Interactive Date, Adult, Child & Promo Card */}
          <div className="bg-[#FFFFFF] p-3.5 sm:p-5 rounded-2xl border border-[#E6DED3] shadow-sm space-y-3">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 items-center">
              {/* 1. Check-In */}
              <div className="space-y-1">
                <label className="text-[9px] sm:text-[10px] uppercase tracking-wider font-semibold text-[#A27520]">
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
                  className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E6DED3] text-xs font-semibold text-[#1A1715] focus:outline-none focus:border-[#B62576]"
                />
              </div>

              {/* 2. Check-Out */}
              <div className="space-y-1">
                <label className="text-[9px] sm:text-[10px] uppercase tracking-wider font-semibold text-[#A27520]">
                  Check-Out
                </label>
                <input
                  type="date"
                  min={checkIn || getTodayDate()}
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E6DED3] text-xs font-semibold text-[#1A1715] focus:outline-none focus:border-[#B62576]"
                />
              </div>

              {/* 3. Adults (18+ Yrs) */}
              <div className="space-y-1">
                <label className="text-[9px] sm:text-[10px] uppercase tracking-wider font-semibold text-[#A27520] flex items-center justify-between">
                  <span>Adults</span>
                  <span className="text-[9px] text-[#787069] lowercase font-normal">(18+ yrs)</span>
                </label>
                <div className="relative">
                  <select
                    value={adults}
                    onChange={(e) => setAdults(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E6DED3] text-xs font-semibold text-[#1A1715] focus:outline-none focus:border-[#B62576] appearance-none cursor-pointer pr-8"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12].map((count) => (
                      <option key={count} value={String(count)}>
                        {count} {count === 1 ? "Adult" : "Adults"}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#787069]">
                    <Users className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* 4. Children (0-17 Yrs - Free) */}
              <div className="space-y-1">
                <label className="text-[9px] sm:text-[10px] uppercase tracking-wider font-semibold text-[#A27520] flex items-center justify-between">
                  <span>Children</span>
                  <span className="text-[9px] text-emerald-700 font-bold uppercase">Free</span>
                </label>
                <div className="relative">
                  <select
                    value={children}
                    onChange={(e) => setChildren(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E6DED3] text-xs font-semibold text-[#1A1715] focus:outline-none focus:border-[#B62576] appearance-none cursor-pointer pr-8"
                  >
                    {[0, 1, 2, 3, 4, 5].map((count) => (
                      <option key={count} value={String(count)}>
                        {count === 0 ? "0 Children" : `${count} ${count === 1 ? "Child" : "Children"} (Free)`}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#787069]">
                    <Baby className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* 5. Promo Code Input */}
              <div className="col-span-2 md:col-span-1 space-y-1">
                <label className="text-[9px] sm:text-[10px] uppercase tracking-wider font-semibold text-[#A27520]">
                  Promo Code
                </label>
                <div className="flex space-x-1.5">
                  <input
                    type="text"
                    placeholder="e.g. DIRECT10"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                    className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E6DED3] text-xs font-bold uppercase text-[#1A1715] placeholder:font-normal placeholder:text-black/35 focus:outline-none focus:border-[#B62576]"
                  />
                  {appliedPromo ? (
                    <button
                      type="button"
                      onClick={handleRemovePromo}
                      className="px-3 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-bold rounded-xl transition-colors"
                      title="Remove promo"
                    >
                      ✕
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleApplyPromo()}
                      className="px-3.5 bg-[#1A1715] hover:bg-[#A27520] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shrink-0"
                    >
                      Apply
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Instant Promo Badges (Horizontal Scroll on Mobile) */}
            <div className="pt-2 border-t border-[#E6DED3]/60 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-[9px] uppercase font-semibold text-[#787069] whitespace-nowrap">
                  Promos:
                </span>
                {AVAILABLE_PROMOS.map((promo) => (
                  <button
                    key={promo.code}
                    onClick={() => handleApplyPromo(promo.code)}
                    className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold tracking-wider whitespace-nowrap transition-all ${
                      appliedPromo?.code === promo.code
                        ? "bg-[#B62576] text-white shadow-sm ring-1 ring-[#B62576]"
                        : "bg-[#FAF7F2] hover:bg-[#EFE8DE] text-[#A27520] border border-[#E6DED3]"
                    }`}
                  >
                    🏷️ {promo.code} ({promo.badgeText})
                  </button>
                ))}
              </div>

              {promoMsg && (
                <div
                  className={`text-[10px] font-medium px-2 py-0.5 rounded-lg flex items-center space-x-1 whitespace-nowrap shrink-0 ${
                    promoMsg.type === "success"
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      : "bg-red-50 text-red-800 border border-red-200"
                  }`}
                >
                  {promoMsg.type === "success" ? (
                    <CheckCircle2 className="w-3 h-3 shrink-0 text-emerald-600" />
                  ) : (
                    <XCircle className="w-3 h-3 shrink-0 text-red-600" />
                  )}
                  <span>{promoMsg.text}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Room Listing Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 sm:space-y-8">
        <div className="space-y-6">
          {ROOMS.map((room) => {
            const currentSelection = roomSelections[room.slug] || { planCode: "EP", quantity: 0 };
            const currentPlan =
              room.ratePlans.find((p) => p.code === currentSelection.planCode) || room.ratePlans[0];
            const isSelected = currentSelection.quantity > 0;

            return (
              <div
                key={room.id}
                className={`bg-[#FFFFFF] rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border-2 ${
                  isSelected ? "border-[#B62576] ring-1 ring-[#B62576]/30" : "border-[#E6DED3]"
                }`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                  {/* Left Column: Imagery (5 Cols) */}
                  <div className="lg:col-span-5 relative aspect-[16/10] lg:aspect-auto min-h-[220px] sm:min-h-[260px] bg-[#FAF7F2]">
                    <Image
                      src={room.coverImage}
                      alt={room.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 40vw"
                    />
                    <div className="absolute top-3 left-3 flex flex-col space-y-1">
                      <span className="px-2.5 py-0.5 bg-[#1A1715]/85 backdrop-blur-md text-white text-[9px] font-mono uppercase tracking-wider rounded-full">
                        {room.categoryCode} • {room.sizeSqFt} Sq Ft
                      </span>
                    </div>

                    {isSelected && (
                      <div className="absolute bottom-3 left-3 bg-[#B62576] text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center space-x-1.5">
                        <Check className="w-3.5 h-3.5" />
                        <span>{currentSelection.quantity} {currentSelection.quantity === 1 ? "Room" : "Rooms"} Selected</span>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Details, Plans & Quantity Stepper (7 Cols) */}
                  <div className="lg:col-span-7 p-4 sm:p-6 lg:p-8 flex flex-col justify-between space-y-4 sm:space-y-6">
                    <div className="space-y-3 sm:space-y-4">
                      {/* Title */}
                      <div className="space-y-0.5">
                        <h3 className="font-serif text-xl sm:text-2xl lg:text-3xl text-[#1A1715] font-normal">
                          {room.name}
                        </h3>
                        <p className="text-xs text-[#787069] font-light leading-relaxed line-clamp-2 sm:line-clamp-none">
                          {room.shortDescription}
                        </p>
                      </div>

                      {/* Specs Row */}
                      <div className="flex flex-wrap items-center gap-3 text-[11px] sm:text-xs text-[#4A443F] py-1.5 border-t border-b border-[#E6DED3]/60">
                        <span className="flex items-center">
                          <Bed className="w-3.5 h-3.5 text-[#A27520] mr-1" />
                          {room.bedType}
                        </span>
                        <span>•</span>
                        <span className="flex items-center">
                          <Users className="w-3.5 h-3.5 text-[#A27520] mr-1" />
                          Max {room.capacity.maxGuests} Guests
                        </span>
                        <span>•</span>
                        <span className="flex items-center">
                          <ShieldCheck className="w-3.5 h-3.5 text-[#A27520] mr-1" />
                          {room.acType}
                        </span>
                      </div>

                      {/* Meal Plan Options */}
                      <div className="space-y-2">
                        <span className="text-[9px] sm:text-[10px] uppercase font-semibold tracking-wider text-[#A27520] block">
                          Select Rate / Meal Plan:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {room.ratePlans.map((plan) => {
                            const isPlanActive = plan.code === currentSelection.planCode;
                            return (
                              <button
                                key={plan.id}
                                type="button"
                                onClick={() => handlePlanChange(room.slug, plan.code)}
                                className={`p-3 rounded-xl text-left border-2 transition-all flex flex-col justify-between space-y-1.5 ${
                                  isPlanActive
                                    ? "border-[#B62576] bg-[#FFF8FA] shadow-sm"
                                    : "border-[#E6DED3] bg-[#FAF7F2] hover:border-[#A27520]/50"
                                }`}
                              >
                                <div>
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-[#1A1715]">
                                      {plan.name}
                                    </span>
                                    {isPlanActive && (
                                      <span className="w-3.5 h-3.5 rounded-full bg-[#B62576] text-white flex items-center justify-center text-[9px]">
                                        ✓
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[10px] text-[#787069] mt-0.5 font-light">
                                    {plan.description}
                                  </p>
                                </div>
                                <div className="pt-1 flex items-baseline justify-between border-t border-black/5">
                                  <span className="text-[9px] text-[#787069]">Tariff per night:</span>
                                  <span className="font-serif text-sm sm:text-base font-bold text-[#1A1715]">
                                    {formatCurrencyINR(plan.pricePerNight)}
                                  </span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Room Quantity Controller */}
                    <div className="pt-3 border-t border-[#E6DED3] flex items-center justify-between gap-3">
                      <div>
                        <span className="text-[9px] sm:text-[10px] uppercase tracking-wider font-semibold text-[#787069] block">
                          Quantity:
                        </span>
                        <div className="flex items-baseline space-x-1.5">
                          <span className="font-serif text-lg sm:text-xl font-bold text-[#1A1715]">
                            {currentSelection.quantity > 0
                              ? `${currentSelection.quantity} ${currentSelection.quantity === 1 ? "Room" : "Rooms"}`
                              : "0 Selected"}
                          </span>
                          {currentSelection.quantity > 0 && (
                            <span className="text-[10px] text-[#787069]">
                              ({formatCurrencyINR(currentPlan.pricePerNight * currentSelection.quantity * nights)} for {nights}N)
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Stepper Buttons */}
                      <div className="flex items-center space-x-1.5">
                        {currentSelection.quantity === 0 ? (
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(room.slug, 1)}
                            className="px-5 py-2.5 rounded-full bg-[#1A1715] hover:bg-[#B62576] text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-1 shadow-sm"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add Room</span>
                          </button>
                        ) : (
                          <div className="flex items-center space-x-1.5 bg-[#FAF7F2] p-1 rounded-full border border-[#E6DED3]">
                            <button
                              type="button"
                              onClick={() => handleQuantityChange(room.slug, -1)}
                              className="w-7 h-7 rounded-full bg-white hover:bg-red-50 text-black hover:text-red-700 flex items-center justify-center font-bold border border-[#E6DED3] shadow-sm transition-colors"
                              title="Decrease rooms"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="font-mono font-bold text-xs sm:text-sm px-2 text-[#1A1715]">
                              {currentSelection.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleQuantityChange(room.slug, 1)}
                              disabled={currentSelection.quantity >= 6}
                              className="w-7 h-7 rounded-full bg-[#B62576] hover:bg-[#9A1D62] text-white flex items-center justify-center font-bold shadow-sm transition-colors disabled:opacity-50"
                              title="Add more rooms"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Multi-Room Cart Sticky Checkout Dock */}
      {cartSummary.totalRoomsCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0C0B0B] border-t-2 border-[#B4872F]/50 text-white px-4 sm:px-6 py-3.5 sm:py-4 pb-[calc(0.875rem+env(safe-area-inset-bottom,0px))] shadow-[0_-12px_40px_rgba(0,0,0,0.95)] animate-in slide-in-from-bottom duration-300">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-6">
            {/* Left side: Selected rooms summary */}
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#B62576] text-white text-[10px] font-mono font-bold uppercase tracking-wider">
                  {cartSummary.totalRoomsCount} {cartSummary.totalRoomsCount === 1 ? "Room Selected" : "Rooms Selected"}
                </span>
                <span className="text-xs text-[#F5EBDD] font-medium">
                  &bull; {nights} {nights === 1 ? "Night" : "Nights"} ({checkIn} &rarr; {checkOut}) &bull; {adults} {parseInt(adults, 10) === 1 ? "Adult" : "Adults"}
                  {parsedChildren > 0 ? `, ${parsedChildren} ${parsedChildren === 1 ? "Child" : "Children"}` : ""}
                </span>
                {cartSummary.extraPaxCount > 0 && (
                  <span className="px-2 py-0.5 rounded-md bg-[#B4872F] text-white text-[10px] font-bold">
                    +{cartSummary.extraPaxCount} Extra Pax (+₹500/nt)
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-x-2 text-xs text-[#C4B9A9]">
                {cartSummary.items.map((item, idx) => (
                  <span key={idx}>
                    <strong className="text-white">{item.quantity}&times;</strong> {item.room.name} ({item.planCode})
                    {idx < cartSummary.items.length - 1 ? "," : ""}
                  </span>
                ))}
              </div>
            </div>

            {/* Right side: Price & Direct Checkout Button */}
            <div className="flex items-center justify-between md:justify-end gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/15">
              <div className="text-left md:text-right">
                <div className="flex items-baseline space-x-1.5">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-[#A27520] font-bold">
                    Total:
                  </span>
                  <span className="font-serif text-2xl sm:text-3xl font-bold text-[#F5EBDD]">
                    {formatCurrencyINR(cartSummary.grandTotal)}
                  </span>
                </div>
                <span className="text-[10px] text-[#C4B9A9] block">
                  (Incl. GST &bull; Best Rate Guarantee)
                </span>
              </div>

              <button
                type="button"
                onClick={handleProceedToCheckout}
                className="px-7 py-3 sm:px-9 sm:py-3.5 rounded-full bg-gradient-to-r from-[#B62576] to-[#92185C] hover:from-[#C72E84] hover:to-[#A71C67] text-white text-xs font-bold uppercase tracking-[0.14em] flex items-center space-x-2 shadow-xl shadow-[#B62576]/30 active:scale-95 transition-all shrink-0 border border-white/10"
              >
                <span>Checkout</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-8">
          <div className="text-center space-y-3">
            <div className="w-8 h-8 border-2 border-[#B62576] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-[#787069] uppercase tracking-wider font-mono">
              Loading Room Tariffs...
            </p>
          </div>
        </div>
      }
    >
      <BookingContent />
    </Suspense>
  );
}
