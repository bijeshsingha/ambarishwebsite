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
  Bed,
  Layers,
  Plus,
  Minus,
  Check,
  Baby,
  Clock,
  ChevronRight,
} from "lucide-react";
import { ROOMS, RoomCategory } from "@/data/rooms";
import { HOTEL_INFO } from "@/data/hotel-info";
import { calculateRoomGST } from "@/lib/gst";
import { formatCurrencyINR, calculateNights, getTodayDate, getTomorrowDate } from "@/lib/formatters";
import { AVAILABLE_PROMOS, validateAndApplyPromo, PromoCode } from "@/data/promos";
import { saveStaySession, getStaySession } from "@/lib/session";
import { getMaxRoomCapacity, getBedTypeOptions, PHYSICAL_ROOM_CAPACITIES } from "@/data/inventory";

interface RoomSelectionState {
  planCode: string;
  bedType: "KING" | "TWIN";
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

  // Live Inventory State
  const [liveInventory, setLiveInventory] = useState<Record<string, Record<string, number>> | null>(null);
  const [isLoadingInventory, setIsLoadingInventory] = useState(false);

  // Fetch Live Inventory from PMS
  useEffect(() => {
    async function loadInventory() {
      setIsLoadingInventory(true);
      try {
        const res = await fetch(`/api/v1/availability/quote?checkIn=${checkIn}&checkOut=${checkOut}`);
        if (!res.ok) return;
        const data = await res.json();
        
        const categories = Array.isArray(data.categories)
          ? data.categories
          : Array.isArray(data.availableRooms)
          ? data.availableRooms
          : [];

        if (categories.length > 0) {
          const newInv: Record<string, Record<string, number>> = {
            "deluxe-room": {
              KING: getMaxRoomCapacity("deluxe-room", "KING"),
              TWIN: getMaxRoomCapacity("deluxe-room", "TWIN"),
            },
            "executive-room": {
              KING: getMaxRoomCapacity("executive-room", "KING"),
              TWIN: getMaxRoomCapacity("executive-room", "TWIN"),
            },
            "suite-room": {
              KING: getMaxRoomCapacity("suite-room", "KING"),
              TWIN: getMaxRoomCapacity("suite-room", "TWIN"),
            },
          };

          categories.forEach((cat: any) => {
            const code = (cat.roomTypeCode || cat.category || cat.code || "").toUpperCase();
            const count =
              typeof cat.availableCount === "number"
                ? cat.availableCount
                : typeof cat.available === "number"
                ? cat.available
                : 0;

            if (code === "DELUXE_KING") {
              newInv["deluxe-room"].KING = count;
            } else if (code === "DELUXE_TWIN") {
              newInv["deluxe-room"].TWIN = count;
            } else if (code === "EXEC_KING") {
              newInv["executive-room"].KING = count;
            } else if (code === "EXEC_TWIN") {
              newInv["executive-room"].TWIN = count;
            } else if (code === "SUITE") {
              newInv["suite-room"].KING = count;
              newInv["suite-room"].TWIN = count;
            } else if (cat.bedType && cat.category) {
              const slug = cat.category.toLowerCase() + "-room";
              if (!newInv[slug]) newInv[slug] = {};
              newInv[slug][cat.bedType] = count;
            }
          });

          setLiveInventory(newInv);
        }
      } catch (err) {
        console.error("Failed to fetch live inventory", err);
      } finally {
        setIsLoadingInventory(false);
      }
    }
    loadInventory();
  }, [checkIn, checkOut]);

  // Multi-room selection map: { [slug]: { planCode: "EP" | "CP", bedType: "KING" | "TWIN", quantity: number } }
  const [roomSelections, setRoomSelections] = useState<Record<string, RoomSelectionState>>(() => {
    const initial: Record<string, RoomSelectionState> = {};
    ROOMS.forEach((r) => {
      const isTarget = selectedRoomSlug === r.slug || (!selectedRoomSlug && r.slug === "deluxe-room");
      const defaultBedType: "KING" | "TWIN" = "KING";
      const maxCap = getMaxRoomCapacity(r.slug, defaultBedType);
      initial[r.slug] = {
        planCode: "EP",
        bedType: defaultBedType,
        quantity: isTarget ? Math.min(targetRoomsParam, maxCap) : 0,
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
          text: `"${res.promo.code}" applied. ${res.promo.description}`,
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
        text: `Promo "${res.promo.code}" applied. ${res.promo.description}`,
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

  // Quantity and plan modifiers respecting exact physical inventory
  const handleQuantityChange = (slug: string, delta: number) => {
    setRoomSelections((prev) => {
      const current = prev[slug] || { planCode: "EP", bedType: "KING", quantity: 0 };
      const maxCapacity = liveInventory ? (liveInventory[slug]?.[current.bedType] || 0) : getMaxRoomCapacity(slug, current.bedType);
      const nextQty = Math.max(0, Math.min(maxCapacity, current.quantity + delta));
      return {
        ...prev,
        [slug]: { ...current, quantity: nextQty },
      };
    });
  };

  const handleBedTypeChange = (slug: string, bedType: "KING" | "TWIN") => {
    setRoomSelections((prev) => {
      const current = prev[slug] || { planCode: "EP", bedType: "KING", quantity: 0 };
      const maxCapacity = liveInventory ? (liveInventory[slug]?.[bedType] || 0) : getMaxRoomCapacity(slug, bedType);
      const nextQty = Math.min(current.quantity, maxCapacity);
      return {
        ...prev,
        [slug]: { ...current, bedType, quantity: nextQty },
      };
    });
  };

  const handlePlanChange = (slug: string, planCode: string) => {
    setRoomSelections((prev) => {
      const current = prev[slug] || { planCode: "EP", bedType: "KING", quantity: 0 };
      return {
        ...prev,
        [slug]: { ...current, planCode },
      };
    });
  };

  // Calculate live multi-room cart totals with Extra Pax
  const cartSummary = useMemo(() => {
    let subtotal = 0;
    let totalRoomsCount = 0;
    const items: {
      room: RoomCategory;
      quantity: number;
      bedType: "KING" | "TWIN";
      planCode: string;
      planPrice: number;
      roomSubtotal: number;
    }[] = [];

    ROOMS.forEach((r) => {
      const sel = roomSelections[r.slug];
      if (sel && sel.quantity > 0) {
        const plan = r.ratePlans.find((p) => p.code === sel.planCode) || r.ratePlans[0];
        const cost = plan.pricePerNight * sel.quantity * nights;
        subtotal += cost;
        totalRoomsCount += sel.quantity;
        items.push({
          room: r,
          quantity: sel.quantity,
          bedType: sel.bedType,
          planCode: sel.planCode,
          planPrice: plan.pricePerNight,
          roomSubtotal: cost,
        });
      }
    });

    const parsedAdults = parseInt(adults, 10) || 2;
    const baseIncludedAdults = totalRoomsCount * 2;
    const extraPaxCount = Math.max(0, parsedAdults - baseIncludedAdults);
    const extraPaxCostPerNight = extraPaxCount * 500;
    const totalExtraPaxCost = extraPaxCostPerNight * nights;

    const combinedSubtotal = subtotal + totalExtraPaxCost;

    let discountAmount = 0;
    if (appliedPromo && combinedSubtotal > 0) {
      const pType = appliedPromo.discountType || appliedPromo.type;
      const pVal = appliedPromo.discountValue ?? appliedPromo.value ?? 0;
      if (pType === "PERCENTAGE") {
        discountAmount = (combinedSubtotal * pVal) / 100;
        if (appliedPromo.maxDiscount) {
          discountAmount = Math.min(discountAmount, appliedPromo.maxDiscount);
        }
      } else if (pType === "FLAT") {
        discountAmount = Math.min(combinedSubtotal, pVal);
      }
    }

    const netTaxable = Math.max(0, combinedSubtotal - discountAmount);
    const gstRate = 0.12;
    const gstAmount = Math.round(netTaxable * gstRate);
    const grandTotal = netTaxable + gstAmount;

    return {
      items,
      totalRoomsCount,
      subtotal,
      extraPaxCount,
      totalExtraPaxCost,
      discountAmount,
      gstAmount,
      grandTotal,
    };
  }, [roomSelections, nights, adults, appliedPromo]);

  // Proceed to checkout with complete parameters
  const handleProceedToCheckout = () => {
    if (cartSummary.totalRoomsCount === 0) return;

    const multiRoomsPayload = cartSummary.items.map((i) => ({
      slug: i.room.slug,
      plan: i.planCode,
      bedType: i.bedType,
      quantity: i.quantity,
    }));

    const query = new URLSearchParams({
      checkIn,
      checkOut,
      adults,
      children,
      rooms: String(cartSummary.totalRoomsCount),
      rooms_data: JSON.stringify(multiRoomsPayload),
      ...(appliedPromo ? { promo: appliedPromo.code } : {}),
    });

    router.push(`/checkout?${query.toString()}`);
  };

  const parsedChildren = parseInt(children, 10) || 0;

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-32 text-[#1C1917]">
      {/* Hospitality Booking Progress Stepper */}
      <div className="bg-[#FFFFFF] border-b border-[#E7E2D9] py-3.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <span className="flex items-center space-x-1.5 font-semibold text-[#8F6B2A]">
              <span className="w-5 h-5 rounded-full bg-[#8F6B2A] text-white flex items-center justify-center text-[11px]">1</span>
              <span>Select Rooms &amp; Rates</span>
            </span>
            <ChevronRight className="w-4 h-4 text-[#78716C]" />
            <span className="flex items-center space-x-1.5 text-[#78716C]">
              <span className="w-5 h-5 rounded-full bg-[#E7E2D9] text-[#78716C] flex items-center justify-center text-[11px]">2</span>
              <span>Guest Details</span>
            </span>
            <ChevronRight className="w-4 h-4 text-[#78716C] hidden sm:inline" />
            <span className="items-center space-x-1.5 text-[#78716C] hidden sm:flex">
              <span className="w-5 h-5 rounded-full bg-[#E7E2D9] text-[#78716C] flex items-center justify-center text-[11px]">3</span>
              <span>Confirmation</span>
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-2 text-[11px] text-[#78716C]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#8F6B2A]" />
            <span>Official Direct Booking Guarantee</span>
          </div>
        </div>
      </div>

      {/* Stay Parameters Control Strip */}
      <section className="bg-[#FAF8F5] pt-6 pb-2 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-sans uppercase tracking-[0.2em] text-[#8F6B2A] font-semibold block">
                Hotel Ambarish Grand Residency by Divine View
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-medium text-[#1C1917] mt-0.5">
                Available Rooms &amp; Direct Tariffs
              </h1>
            </div>

            {/* Quick Stay Dates Summary Tag */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 bg-[#FFFFFF] rounded-lg border border-[#E7E2D9] text-xs shadow-sm self-start sm:self-auto">
              <Calendar className="w-3.5 h-3.5 text-[#8F6B2A]" />
              <span>
                <strong>{checkIn}</strong> to <strong>{checkOut}</strong> ({nights} {nights === 1 ? "night" : "nights"})
              </span>
              <span className="text-black/20">•</span>
              <span className="font-medium text-[#1C1917]">
                {adults} {parseInt(adults, 10) === 1 ? "Adult" : "Adults"}
                {parsedChildren > 0 ? `, ${parsedChildren} ${parsedChildren === 1 ? "Child" : "Children"}` : ""}
              </span>
            </div>
          </div>

          {/* Interactive Date, Adult, Child & Promo Card */}
          <div className="bg-[#FFFFFF] p-4 sm:p-5 rounded-xl border border-[#E7E2D9] shadow-sm space-y-3.5">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 items-center">
              {/* 1. Check-In */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider font-semibold text-[#8F6B2A] block">
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
                  className="w-full p-2.5 rounded-lg bg-[#FAF8F5] border border-[#E7E2D9] text-xs font-semibold text-[#1C1917] focus:outline-none focus:border-[#8F6B2A]"
                />
              </div>

              {/* 2. Check-Out */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider font-semibold text-[#8F6B2A] block">
                  Check-Out
                </label>
                <input
                  type="date"
                  min={checkIn || getTodayDate()}
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-[#FAF8F5] border border-[#E7E2D9] text-xs font-semibold text-[#1C1917] focus:outline-none focus:border-[#8F6B2A]"
                />
              </div>

              {/* 3. Adults */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider font-semibold text-[#8F6B2A] block">
                  Adults
                </label>
                <div className="relative">
                  <select
                    value={adults}
                    onChange={(e) => setAdults(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-[#FAF8F5] border border-[#E7E2D9] text-xs font-semibold text-[#1C1917] focus:outline-none focus:border-[#8F6B2A] appearance-none cursor-pointer pr-8"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12].map((count) => (
                      <option key={count} value={String(count)}>
                        {count} {count === 1 ? "Adult" : "Adults"}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#78716C]">
                    <Users className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* 4. Children */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider font-semibold text-[#8F6B2A] block">
                  Children
                </label>
                <div className="relative">
                  <select
                    value={children}
                    onChange={(e) => setChildren(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-[#FAF8F5] border border-[#E7E2D9] text-xs font-semibold text-[#1C1917] focus:outline-none focus:border-[#8F6B2A] appearance-none cursor-pointer pr-8"
                  >
                    {[0, 1, 2, 3, 4, 5].map((count) => (
                      <option key={count} value={String(count)}>
                        {count === 0 ? "0 Children" : `${count} ${count === 1 ? "Child" : "Children"}`}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#78716C]">
                    <Baby className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* 5. Promo Code Input */}
              <div className="col-span-2 md:col-span-1 space-y-1">
                <label className="text-[10px] uppercase tracking-wider font-semibold text-[#8F6B2A] block">
                  Promo Code
                </label>
                <div className="flex space-x-1.5">
                  <input
                    type="text"
                    placeholder="e.g. DIRECT10"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                    className="w-full p-2.5 rounded-lg bg-[#FAF8F5] border border-[#E7E2D9] text-xs font-bold uppercase text-[#1C1917] placeholder:font-normal placeholder:text-[#78716C]/60 focus:outline-none focus:border-[#8F6B2A]"
                  />
                  {appliedPromo ? (
                    <button
                      type="button"
                      onClick={handleRemovePromo}
                      className="px-3 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-lg transition-colors border border-red-200"
                      title="Remove promo"
                    >
                      ✕
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleApplyPromo()}
                      className="px-3.5 btn-heritage-dark text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors shrink-0"
                    >
                      Apply
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Promo Pills & Feedback */}
            <div className="pt-2 border-t border-[#E7E2D9] flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] text-[#78716C] font-medium">Quick Direct Codes:</span>
                {AVAILABLE_PROMOS.filter((p) => p.isPublic).map((p) => (
                  <button
                    key={p.code}
                    type="button"
                    onClick={() => handleApplyPromo(p.code)}
                    className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-md bg-[#FAF5EB] hover:bg-[#F4EFE6] border border-[#DFD5C0] text-[10px] font-semibold text-[#8F6B2A] transition-colors"
                  >
                    <Tag className="w-2.5 h-2.5" />
                    <span>{p.code}</span>
                    <span className="text-[#78716C]">({p.discountText})</span>
                  </button>
                ))}
              </div>

              {promoMsg && (
                <div
                  className={`text-xs font-semibold flex items-center space-x-1.5 ${
                    promoMsg.type === "success" ? "text-emerald-700" : "text-red-600"
                  }`}
                >
                  {promoMsg.type === "success" ? (
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-700" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 shrink-0 text-red-600" />
                  )}
                  <span>{promoMsg.text}</span>
                </div>
              )}
            </div>

            {/* Special Early Check-in Offer Banner (No sparkles) */}
            <div className="pt-2 border-t border-[#E7E2D9] flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1.5 text-[#1C1917] font-medium">
                <Clock className="w-3.5 h-3.5 text-[#8F6B2A] shrink-0" />
                <span>
                  <strong className="text-[#8F6B2A]">Special Direct Benefit:</strong> Free Early Check-in from <strong>5:00 AM onwards</strong> with zero extra charge!
                </span>
              </div>
              <div className="text-[11px] text-[#78716C]">
                Standard Check-in &amp; Check-out: <strong>12:00 Noon</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Room Listing Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 sm:space-y-8">
        {ROOMS.map((room) => {
          const currentSelection =
            roomSelections[room.slug] || { planCode: "EP", bedType: "KING", quantity: 0 };
          const currentPlan =
            room.ratePlans.find((p) => p.code === currentSelection.planCode) || room.ratePlans[0];
          const isSelected = currentSelection.quantity > 0;
          const bedOptions = getBedTypeOptions(room.slug);
          const maxAvailableForBed = liveInventory 
            ? (liveInventory[room.slug]?.[currentSelection.bedType] ?? getMaxRoomCapacity(room.slug, currentSelection.bedType)) 
            : getMaxRoomCapacity(room.slug, currentSelection.bedType);
            
          const isEntireCategorySoldOut = liveInventory 
            ? bedOptions.every(b => (liveInventory[room.slug]?.[b.type] ?? getMaxRoomCapacity(room.slug, b.type)) === 0)
            : false;

          return (
            <div
              key={room.id}
              className={`bg-[#FFFFFF] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border-2 ${
                isSelected ? "border-[#8F6B2A] ring-1 ring-[#8F6B2A]/30" : "border-[#E7E2D9]"
              } ${isEntireCategorySoldOut ? "opacity-50 grayscale" : ""}`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                {/* Left Column: Imagery (5 Cols) */}
                <div className="lg:col-span-5 relative aspect-[16/10] lg:aspect-auto min-h-[220px] sm:min-h-[260px] bg-[#F4EFE6]">
                  <Image
                    src={room.coverImage}
                    alt={room.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                  <div className="absolute top-3 left-3 flex flex-col space-y-1">
                    <span className="px-2.5 py-0.5 bg-[#1C1917]/85 backdrop-blur-md text-white text-[10px] font-sans font-semibold uppercase tracking-wider rounded-md">
                      {room.categoryCode} • {room.sizeSqFt} Sq Ft
                    </span>
                  </div>

                  {isSelected && (
                    <div className="absolute bottom-3 left-3 bg-[#8F6B2A] text-white px-3 py-1 rounded-md text-xs font-semibold shadow-md flex items-center space-x-1.5">
                      <Check className="w-3.5 h-3.5" />
                      <span>
                        {currentSelection.quantity} {currentSelection.quantity === 1 ? "Room" : "Rooms"} ({currentSelection.bedType === "KING" ? "King" : "Twin"})
                      </span>
                    </div>
                  )}
                </div>

                {/* Right Column: Details, Bed Type, Plans & Quantity Stepper (7 Cols) */}
                <div className="lg:col-span-7 p-4 sm:p-6 lg:p-7 flex flex-col justify-between space-y-4 sm:space-y-6">
                  <div className="space-y-3 sm:space-y-4">
                    {/* Title */}
                    <div className="space-y-0.5">
                      <h3 className="font-serif text-xl sm:text-2xl lg:text-3xl text-[#1C1917] font-medium">
                        {room.name}
                      </h3>
                      <p className="text-xs text-[#44403C] font-normal leading-relaxed line-clamp-2 sm:line-clamp-none">
                        {room.shortDescription}
                      </p>
                    </div>

                    {/* Specs Row */}
                    <div className="flex flex-wrap items-center gap-3 text-[11px] sm:text-xs text-[#44403C] py-1.5 border-t border-b border-[#E7E2D9]">
                      <span className="flex items-center">
                        <Users className="w-3.5 h-3.5 text-[#8F6B2A] mr-1" />
                        Max {room.capacity.maxGuests} Guests
                      </span>
                      <span>•</span>
                      <span className="flex items-center">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#8F6B2A] mr-1" />
                        {room.acType}
                      </span>
                      <span>•</span>
                      <span className="text-[#8F6B2A] font-semibold">
                        {maxAvailableForBed} Available for Selection
                      </span>
                    </div>

                    {/* Bed Configuration Selector */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-semibold tracking-wider text-[#8F6B2A]">
                          Select Bed Type:
                        </span>
                        <span className="text-[10px] text-[#78716C]">
                          {maxAvailableForBed} Total in Hotel
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {bedOptions.map((b) => {
                          const isBedActive = currentSelection.bedType === b.type;
                          const bedCount = liveInventory 
                            ? (liveInventory[room.slug]?.[b.type] ?? b.maxCapacity)
                            : b.maxCapacity;
                          const isBedSoldOut = bedCount === 0;

                          return (
                            <button
                              key={b.type}
                              type="button"
                              disabled={isBedSoldOut}
                              onClick={() => handleBedTypeChange(room.slug, b.type)}
                              className={`p-2.5 rounded-lg text-left border-2 transition-all flex items-center justify-between ${
                                isBedActive
                                  ? "border-[#8F6B2A] bg-[#FAF5EB] text-[#1C1917] shadow-sm"
                                  : "border-[#E7E2D9] bg-[#FAF8F5] text-[#44403C] hover:border-[#8F6B2A]/50"
                              } ${isBedSoldOut ? "opacity-40 cursor-not-allowed" : ""}`}
                            >
                              <div className="flex items-center space-x-2">
                                <Bed className={`w-4 h-4 ${isBedActive ? "text-[#8F6B2A]" : "text-[#78716C]"}`} />
                                <div>
                                  <span className="text-xs font-semibold block">{b.label}</span>
                                  <span className="text-[10px] text-[#78716C] block">
                                    {isBedSoldOut ? "Sold Out" : `${bedCount} available`}
                                  </span>
                                </div>
                              </div>
                              {isBedActive && (
                                <span className="w-4 h-4 rounded-full bg-[#8F6B2A] text-white flex items-center justify-center text-[10px] shrink-0 font-bold">
                                  ✓
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Meal Plan Options */}
                    <div className="space-y-2">
                      <span className="text-[10px] uppercase font-semibold tracking-wider text-[#8F6B2A] block">
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
                              className={`p-3 rounded-lg text-left border-2 transition-all flex flex-col justify-between space-y-1.5 ${
                                isPlanActive
                                  ? "border-[#8F6B2A] bg-[#FAF5EB] shadow-sm"
                                  : "border-[#E7E2D9] bg-[#FAF8F5] hover:border-[#8F6B2A]/50"
                              }`}
                            >
                              <div>
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-semibold text-[#1C1917]">
                                    {plan.name}
                                  </span>
                                  {isPlanActive && (
                                    <span className="w-4 h-4 rounded-full bg-[#8F6B2A] text-white flex items-center justify-center text-[10px] font-bold">
                                      ✓
                                    </span>
                                  )}
                                </div>
                                <p className="text-[10px] text-[#78716C] mt-0.5 font-normal">
                                  {plan.description}
                                </p>
                              </div>
                              <div className="pt-1 flex items-baseline justify-between border-t border-[#E7E2D9]">
                                <span className="text-[9px] text-[#78716C]">Tariff per night:</span>
                                <span className="font-serif text-sm sm:text-base font-semibold text-[#8F6B2A]">
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
                  <div className="pt-3 border-t border-[#E7E2D9] flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-[#78716C] block">
                        Quantity (Max {maxAvailableForBed}):
                      </span>
                      <div className="flex items-baseline space-x-1.5">
                        <span className="font-serif text-lg sm:text-xl font-semibold text-[#1C1917]">
                          {currentSelection.quantity > 0
                            ? `${currentSelection.quantity} ${currentSelection.quantity === 1 ? "Room" : "Rooms"}`
                            : "0 Selected"}
                        </span>
                        {currentSelection.quantity > 0 && (
                          <span className="text-[11px] text-[#78716C]">
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
                          disabled={maxAvailableForBed === 0}
                          onClick={() => handleQuantityChange(room.slug, 1)}
                          className="btn-heritage-primary px-5 py-2 rounded-lg text-xs font-semibold tracking-wider flex items-center space-x-1 shadow-sm disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>{maxAvailableForBed === 0 ? "Sold Out" : "Add Room"}</span>
                        </button>
                      ) : (
                        <div className="flex items-center space-x-1.5 bg-[#FAF8F5] p-1 rounded-lg border border-[#E7E2D9]">
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(room.slug, -1)}
                            className="w-7 h-7 rounded-md bg-white hover:bg-red-50 text-[#1C1917] hover:text-red-700 flex items-center justify-center font-bold border border-[#E7E2D9] shadow-sm transition-colors"
                            title="Decrease rooms"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-sans font-semibold text-xs sm:text-sm px-2 text-[#1C1917]">
                            {currentSelection.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(room.slug, 1)}
                            disabled={currentSelection.quantity >= maxAvailableForBed}
                            className="w-7 h-7 rounded-md bg-[#8F6B2A] hover:bg-[#73541E] text-white flex items-center justify-center font-bold shadow-sm transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            title={currentSelection.quantity >= maxAvailableForBed ? `Maximum ${maxAvailableForBed} rooms available` : "Add more rooms"}
                          >
                            <Plus className="w-3 h-3" />
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

      {/* Floating Multi-Room Cart Sticky Checkout Dock */}
      {cartSummary.totalRoomsCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#1C1917] text-[#FAF8F5] border-t border-[#8F6B2A]/40 px-4 sm:px-6 py-3 sm:py-3.5 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] shadow-xl animate-fade-in">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-6">
            {/* Left side: Selected rooms summary */}
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded bg-[#8F6B2A] text-white text-[10px] font-sans font-semibold uppercase tracking-wider">
                  {cartSummary.totalRoomsCount} {cartSummary.totalRoomsCount === 1 ? "Room Selected" : "Rooms Selected"}
                </span>
                <span className="text-xs text-[#FAF8F5]/90 font-medium">
                  • {nights} {nights === 1 ? "Night" : "Nights"} ({checkIn} to {checkOut}) • {adults} {parseInt(adults, 10) === 1 ? "Adult" : "Adults"}
                  {parsedChildren > 0 ? `, ${parsedChildren} ${parsedChildren === 1 ? "Child" : "Children"}` : ""}
                </span>
                {cartSummary.extraPaxCount > 0 && (
                  <span className="px-2 py-0.5 rounded bg-[#8F6B2A]/20 text-[#B3863E] border border-[#8F6B2A]/40 text-[10px] font-semibold">
                    +{cartSummary.extraPaxCount} Extra Pax (+₹500/nt)
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-x-2 text-xs text-[#FAF8F5]/70">
                {cartSummary.items.map((item, idx) => (
                  <span key={idx}>
                    <strong className="text-white">{item.quantity}×</strong> {item.room.name} ({item.bedType}, {item.planCode})
                    {idx < cartSummary.items.length - 1 ? "," : ""}
                  </span>
                ))}
              </div>
            </div>

            {/* Right side: Price & Direct Checkout Button */}
            <div className="flex items-center justify-between md:justify-end gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10">
              <div className="text-left md:text-right">
                <div className="flex items-baseline space-x-1.5">
                  <span className="text-[10px] uppercase font-sans tracking-wider text-[#B3863E] font-semibold">
                    Total:
                  </span>
                  <span className="font-serif text-2xl sm:text-3xl font-semibold text-[#FAF8F5]">
                    {formatCurrencyINR(cartSummary.grandTotal)}
                  </span>
                </div>
                <span className="text-[10px] text-[#FAF8F5]/65 block">
                  (Incl. GST • Best Direct Rate)
                </span>
              </div>

              <button
                type="button"
                onClick={handleProceedToCheckout}
                className="btn-heritage-primary px-7 py-3 rounded-lg text-xs font-semibold tracking-wider flex items-center space-x-2 shrink-0"
              >
                <span>Proceed to Guest Details</span>
                <ArrowUpRight className="w-4 h-4 ml-1" />
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
        <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-8">
          <div className="text-center space-y-3">
            <div className="w-8 h-8 border-2 border-[#8F6B2A] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-[#78716C] uppercase tracking-wider font-sans font-medium">
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
