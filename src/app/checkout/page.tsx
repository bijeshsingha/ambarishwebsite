"use client";

import React, { useState, Suspense, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Lock,
  ArrowUpRight,
  AlertCircle,
  ShieldCheck,
  Tag,
  CheckCircle2,
  XCircle,
  Percent,
  Sparkles,
  Receipt,
  CreditCard,
  Building,
  Bed,
  Calendar,
  Users,
  Clock,
  MapPin,
  Check,
  ChevronRight,
} from "lucide-react";
import { ROOMS, RoomCategory } from "@/data/rooms";
import { HOTEL_INFO } from "@/data/hotel-info";
import { calculateRoomGST } from "@/lib/gst";
import { formatCurrencyINR, calculateNights, getTodayDate, getTomorrowDate } from "@/lib/formatters";
import { AVAILABLE_PROMOS, validateAndApplyPromo, PromoCode } from "@/data/promos";
import { BookedRoomItem } from "@/lib/hotel-os-client";
import { saveGuestSession, getGuestSession } from "@/lib/session";

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const checkIn = searchParams.get("checkIn") || getTodayDate();
  const checkOut = searchParams.get("checkOut") || getTomorrowDate();
  const adults = parseInt(searchParams.get("adults") || "2", 10);
  const children = parseInt(searchParams.get("children") || "0", 10);
  const urlPromo = searchParams.get("promo") || "";
  const nights = Math.max(1, calculateNights(checkIn, checkOut));

  // Parse multi-room configuration
  const bookedRoomsList: BookedRoomItem[] = useMemo(() => {
    const rawRoomsData = searchParams.get("rooms_data");
    if (rawRoomsData) {
      try {
        const parsed = JSON.parse(rawRoomsData) as { slug: string; plan: string; bedType?: string; quantity: number }[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          const list: BookedRoomItem[] = [];
          parsed.forEach((p) => {
            const room = ROOMS.find((r) => r.slug === p.slug);
            if (room && p.quantity > 0) {
              const plan = room.ratePlans.find((pl) => pl.code === p.plan) || room.ratePlans[0];
              list.push({
                roomSlug: room.slug,
                roomName: room.name,
                categoryCode: room.categoryCode,
                bedType: p.bedType || (room.bedType.includes("Twin") ? "Twin Bed" : "King Bed"),
                ratePlanCode: plan.code,
                ratePlanName: plan.name,
                pricePerNight: plan.pricePerNight,
                quantity: p.quantity,
              });
            }
          });
          if (list.length > 0) return list;
        }
      } catch (err) {
        console.error("Failed to parse rooms_data:", err);
      }
    }

    // Fallback to legacy single room params
    const roomSlug = searchParams.get("room") || "deluxe-room";
    const planCode = searchParams.get("plan") || "EP";
    const bedTypeParam = searchParams.get("bedType") || "King Bed";
    const roomsCount = Math.max(1, parseInt(searchParams.get("rooms") || "1", 10));
    const room = ROOMS.find((r) => r.slug === roomSlug) || ROOMS[0];
    const plan = room.ratePlans.find((p) => p.code === planCode) || room.ratePlans[0];

    return [
      {
        roomSlug: room.slug,
        roomName: room.name,
        categoryCode: room.categoryCode,
        bedType: bedTypeParam,
        ratePlanCode: plan.code,
        ratePlanName: plan.name,
        pricePerNight: plan.pricePerNight,
        quantity: roomsCount,
      },
    ];
  }, [searchParams]);

  const totalRoomsCount = bookedRoomsList.reduce((sum, item) => sum + item.quantity, 0);

  // Promo Code State
  const [promoInput, setPromoInput] = useState(urlPromo);
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [promoMsg, setPromoMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Gross Base Tariff calculation across all rooms
  const grossRoomsBase = bookedRoomsList.reduce(
    (sum, item) => sum + item.pricePerNight * item.quantity * nights,
    0
  );

  // Extra adult calculation (+500/night beyond standard double occupancy of 2 adults per room)
  const standardCapacity = totalRoomsCount * 2;
  const extraPaxCount = Math.max(0, adults - standardCapacity);
  const extraPaxCharge = extraPaxCount * 500 * nights;

  const grossBaseTariff = grossRoomsBase + extraPaxCharge;

  useEffect(() => {
    if (urlPromo && grossBaseTariff > 0) {
      const res = validateAndApplyPromo(urlPromo, grossBaseTariff);
      if (res.isValid && res.promo) {
        setAppliedPromo(res.promo);
        setPromoMsg({
          type: "success",
          text: `Promo "${res.promo.code}" applied (${res.promo.badgeText})`,
        });
      }
    }
  }, [urlPromo, grossBaseTariff]);

  const handleApplyPromo = (codeToApply?: string) => {
    const code = (codeToApply || promoInput).trim().toUpperCase();
    if (!code) {
      setPromoMsg({ type: "error", text: "Please enter a valid promo code." });
      return;
    }

    const res = validateAndApplyPromo(code, grossBaseTariff);
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
        text: res.errorMessage || `Invalid code "${code}". Try DIRECT10 or AMBARISH15.`,
      });
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoInput("");
    setPromoMsg(null);
  };

  // Math Calculations
  let discountAmount = 0;
  if (appliedPromo) {
    const res = validateAndApplyPromo(appliedPromo.code, grossBaseTariff);
    if (res.isValid) {
      discountAmount = res.discountAmount;
    }
  }

  const netBaseAmount = Math.max(0, grossBaseTariff - discountAmount);
  const taxAmount = Math.round(netBaseAmount * 0.05); // 5% GST
  const totalAmount = netBaseAmount + taxAmount;

  // Form state with session cookie prefill
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestCity, setGuestCity] = useState("");
  const [wantsGstInvoice, setWantsGstInvoice] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [guestGstin, setGuestGstin] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<"ONLINE" | "PAY_AT_HOTEL">("ONLINE");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Load saved guest profile on mount
  useEffect(() => {
    const saved = getGuestSession();
    if (saved) {
      if (saved.guestName) setGuestName(saved.guestName);
      if (saved.guestEmail) setGuestEmail(saved.guestEmail);
      if (saved.guestPhone) setGuestPhone(saved.guestPhone);
      if (saved.guestCity) setGuestCity(saved.guestCity);
      if (saved.companyName) {
        setCompanyName(saved.companyName);
        setWantsGstInvoice(true);
      }
      if (saved.gstin) {
        setGuestGstin(saved.gstin);
        setWantsGstInvoice(true);
      }
      if (saved.specialRequests) setSpecialRequests(saved.specialRequests);
    }
  }, []);

  // Sync guest inputs to session cookie
  const updateGuestName = (val: string) => { setGuestName(val); saveGuestSession({ guestName: val }); };
  const updateGuestEmail = (val: string) => { setGuestEmail(val); saveGuestSession({ guestEmail: val }); };
  const updateGuestPhone = (val: string) => { setGuestPhone(val); saveGuestSession({ guestPhone: val }); };
  const updateGuestCity = (val: string) => { setGuestCity(val); saveGuestSession({ guestCity: val }); };
  const updateCompanyName = (val: string) => { setCompanyName(val); saveGuestSession({ companyName: val }); };
  const updateGuestGstin = (val: string) => { setGuestGstin(val); saveGuestSession({ gstin: val }); };
  const updateSpecialRequests = (val: string) => { setSpecialRequests(val); saveGuestSession({ specialRequests: val }); };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) {
      setErrorMsg("Please accept the booking and cancellation policy to proceed.");
      return;
    }
    setErrorMsg("");
    setIsProcessing(true);

    try {
      const primaryRoom = bookedRoomsList[0];
      const res = await fetch("/api/v1/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomSlug: primaryRoom.roomSlug,
          roomName: primaryRoom.roomName,
          ratePlanCode: primaryRoom.ratePlanCode,
          ratePlanName: primaryRoom.ratePlanName,
          bookedRooms: bookedRoomsList,
          checkIn,
          checkOut,
          nights,
          rooms: totalRoomsCount,
          adults,
          children,
          bookingType: "INDIVIDUAL",
          guestName,
          guestEmail,
          guestPhone,
          guestCity,
          guestGstin: wantsGstInvoice ? guestGstin : undefined,
          companyName: wantsGstInvoice ? companyName : undefined,
          specialRequests,
          promoCode: appliedPromo?.code || undefined,
          discountAmount,
          baseAmount: netBaseAmount,
          taxAmount,
          totalAmount,
          paymentMethod: paymentMethod === "ONLINE" ? "RAZORPAY" : "PAY_AT_HOTEL",
          paymentId:
            paymentMethod === "ONLINE"
              ? `rzp_pay_${Date.now()}`
              : "PAY_AT_HOTEL",
        }),
      });

      const data = await res.json();
      if (data.success && data.reservation) {
        router.push(`/booking/confirmation/${data.reservation.bookingReference}`);
      } else {
        setErrorMsg(data.error || "Reservation failed. Please try again or call our front desk.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "A network error occurred. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-[#FAF7F2] text-[#1A1715] min-h-screen pb-24">
      {/* Header */}
      <section className="bg-[#F5EFEB] hairline-b py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#A27520] block">
              Direct Guaranteed Booking &bull; {totalRoomsCount} {totalRoomsCount === 1 ? "Room" : "Rooms"}
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-normal text-[#1A1715]">
              Confirm Your Stay Reservation
            </h1>
          </div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200 shadow-sm">
            <Lock className="w-3.5 h-3.5" />
            <span>256-Bit Encrypted Direct Booking</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleBookingSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Guest Details & Payment (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {errorMsg && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 flex items-center space-x-2 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* 1. Primary Guest Details */}
            <div className="bg-[#FFFFFF] p-6 sm:p-8 rounded-3xl border border-[#E6DED3] shadow-md space-y-5">
              <div className="flex items-center justify-between border-b border-[#E6DED3] pb-3">
                <h3 className="font-serif text-xl font-normal text-[#1A1715]">
                  1. Primary Guest Information
                </h3>
                <span className="text-[11px] text-[#787069] font-light">
                  * Required for check-in
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#A27520]">
                    Full Name (As on Photo ID) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bijesh Sharma"
                    value={guestName}
                    onChange={(e) => updateGuestName(e.target.value)}
                    className="w-full p-3 rounded-xl bg-[#FAF7F2] border border-[#E6DED3] text-xs font-semibold text-[#1A1715] focus:outline-none focus:border-[#B62576]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#A27520]">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. bijesh@gmail.com"
                    value={guestEmail}
                    onChange={(e) => updateGuestEmail(e.target.value)}
                    className="w-full p-3 rounded-xl bg-[#FAF7F2] border border-[#E6DED3] text-xs font-semibold text-[#1A1715] focus:outline-none focus:border-[#B62576]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#A27520]">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9876543210"
                    value={guestPhone}
                    onChange={(e) => updateGuestPhone(e.target.value)}
                    className="w-full p-3 rounded-xl bg-[#FAF7F2] border border-[#E6DED3] text-xs font-semibold text-[#1A1715] focus:outline-none focus:border-[#B62576]"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#A27520]">
                    City of Residence
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Guwahati / Kolkata / Delhi"
                    value={guestCity}
                    onChange={(e) => updateGuestCity(e.target.value)}
                    className="w-full p-3 rounded-xl bg-[#FAF7F2] border border-[#E6DED3] text-xs font-semibold text-[#1A1715] focus:outline-none focus:border-[#B62576]"
                  />
                </div>
              </div>

              {/* Optional GST Invoice */}
              <div className="pt-3 border-t border-[#E6DED3]/60 space-y-3">
                <label className="flex items-center space-x-2.5 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={wantsGstInvoice}
                    onChange={(e) => setWantsGstInvoice(e.target.checked)}
                    className="w-4 h-4 rounded text-[#B62576] focus:ring-[#B62576]"
                  />
                  <span className="text-[#4A443F] font-medium">
                    I need a GST tax invoice for Input Tax Credit (Optional)
                  </span>
                </label>

                {wantsGstInvoice && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs animate-in fade-in duration-200">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-semibold text-[#787069]">
                        Company / Business Name
                      </label>
                      <input
                        type="text"
                        placeholder="Company name"
                        value={companyName}
                        onChange={(e) => updateCompanyName(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E6DED3] text-xs font-semibold text-[#1A1715]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-semibold text-[#787069]">
                        15-Digit GSTIN
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 18AAAAA0000A1Z5"
                        value={guestGstin}
                        onChange={(e) => updateGuestGstin(e.target.value.toUpperCase())}
                        className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E6DED3] text-xs font-semibold text-[#1A1715] uppercase"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 2. Special Requests */}
            <div className="bg-[#FFFFFF] p-6 sm:p-8 rounded-3xl border border-[#E6DED3] shadow-md space-y-4">
              <h3 className="font-serif text-xl font-normal text-[#1A1715]">
                2. Special Requests (Optional)
              </h3>
              <textarea
                rows={2}
                placeholder="E.g., adjacent rooms requested, early check-in preference, extra towels..."
                value={specialRequests}
                onChange={(e) => updateSpecialRequests(e.target.value)}
                className="w-full p-3 rounded-xl bg-[#FAF7F2] border border-[#E6DED3] text-xs text-[#1A1715] focus:outline-none focus:border-[#B62576]"
              />
            </div>

            {/* 3. Payment Method */}
            <div className="bg-[#FFFFFF] p-6 sm:p-8 rounded-3xl border border-[#E6DED3] shadow-md space-y-5">
              <h3 className="font-serif text-xl font-normal text-[#1A1715]">
                3. Select Payment Option
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("ONLINE")}
                  className={`p-4 rounded-2xl border-2 text-left transition-all space-y-2 ${
                    paymentMethod === "ONLINE"
                      ? "border-[#B62576] bg-[#FFF8FA] shadow-sm"
                      : "border-[#E6DED3] bg-[#FAF7F2] hover:border-[#A27520]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CreditCard className="w-4 h-4 text-[#B62576]" />
                      <span className="text-xs font-bold text-[#1A1715]">Pay Online (Instant)</span>
                    </div>
                    {paymentMethod === "ONLINE" && (
                      <span className="w-4 h-4 rounded-full bg-[#B62576] text-white flex items-center justify-center text-[10px]">
                        ✓
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#787069] font-light leading-relaxed">
                    UPI (GPay / PhonePe / Paytm), Debit/Credit Cards, Net Banking. Instant reservation lock.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("PAY_AT_HOTEL")}
                  className={`p-4 rounded-2xl border-2 text-left transition-all space-y-2 ${
                    paymentMethod === "PAY_AT_HOTEL"
                      ? "border-[#B62576] bg-[#FFF8FA] shadow-sm"
                      : "border-[#E6DED3] bg-[#FAF7F2] hover:border-[#A27520]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Building className="w-4 h-4 text-[#A27520]" />
                      <span className="text-xs font-bold text-[#1A1715]">Pay at Hotel</span>
                    </div>
                    {paymentMethod === "PAY_AT_HOTEL" && (
                      <span className="w-4 h-4 rounded-full bg-[#B62576] text-white flex items-center justify-center text-[10px]">
                        ✓
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#787069] font-light leading-relaxed">
                    Zero advance payment. Pay directly at the front desk upon check-in with Cash, UPI, or Card.
                  </p>
                </button>
              </div>

              {/* Policy agreement */}
              <div className="pt-2">
                <label className="flex items-start space-x-2.5 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    required
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded text-[#B62576] focus:ring-[#B62576]"
                  />
                  <span className="text-[#787069] leading-relaxed">
                    I agree to the hotel check-in policy (Check-in: 12:00 PM, Check-out: 11:00 AM) and free cancellation up to 24 hours prior to arrival. Valid Government Photo ID required for all adult guests.
                  </span>
                </label>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-4 rounded-full bg-gradient-to-r from-[#B62576] to-[#92185C] hover:from-[#C72E84] hover:to-[#A71C67] text-white text-xs font-bold uppercase tracking-[0.14em] shadow-xl shadow-[#B62576]/30 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center space-x-2 disabled:opacity-60"
              >
                {isProcessing ? (
                  <span>Processing Reservation...</span>
                ) : (
                  <>
                    <span>Confirm &amp; Book {totalRoomsCount} {totalRoomsCount === 1 ? "Room" : "Rooms"} &bull; {formatCurrencyINR(totalAmount)}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Order Summary with Multi-Room Breakdown (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#FFFFFF] p-6 sm:p-8 rounded-3xl border border-[#E6DED3] shadow-md space-y-6 sticky top-24">
              <div className="flex items-center justify-between border-b border-[#E6DED3] pb-3">
                <h3 className="font-serif text-xl font-normal text-[#1A1715]">
                  Reservation Summary
                </h3>
                <Link
                  href={`/booking?checkIn=${checkIn}&checkOut=${checkOut}&rooms=${totalRoomsCount}&adults=${adults}&children=${children}`}
                  className="text-[11px] font-semibold text-[#B62576] hover:underline"
                >
                  Edit Rooms &rarr;
                </Link>
              </div>

              {/* Itemized Rooms List */}
              <div className="space-y-3">
                <span className="text-[10px] uppercase font-semibold tracking-wider text-[#A27520] block">
                  Booked Rooms ({totalRoomsCount} {totalRoomsCount === 1 ? "Room" : "Rooms"}):
                </span>
                <div className="space-y-2.5">
                  {bookedRoomsList.map((item, idx) => {
                    const roomObj = ROOMS.find((r) => r.slug === item.roomSlug);
                    return (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EDE7DE] flex items-center justify-between space-x-3"
                      >
                        <div className="space-y-0.5">
                          <span className="text-[9px] font-mono uppercase tracking-wider text-[#A27520] font-bold block">
                            {item.quantity}&times; {item.categoryCode} {item.bedType ? `• ${item.bedType}` : ""}
                          </span>
                          <h4 className="font-serif text-sm font-semibold text-[#1A1715] leading-snug">
                            {item.roomName}
                          </h4>
                          <span className="text-[10px] text-[#787069] block">
                            {item.ratePlanName}
                          </span>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="font-serif text-sm font-bold text-[#1A1715] block">
                            {formatCurrencyINR(item.pricePerNight * item.quantity * nights)}
                          </span>
                          <span className="text-[9px] text-[#787069]">
                            {formatCurrencyINR(item.pricePerNight)}/rm/n
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Stay Breakdown Details */}
              <div className="space-y-2.5 text-xs text-[#4A443F] py-3 border-t border-b border-[#E6DED3]/70">
                <div className="flex justify-between">
                  <span className="text-[#787069]">Dates:</span>
                  <span className="font-semibold text-[#1A1715]">
                    {checkIn} &rarr; {checkOut}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#787069]">Duration:</span>
                  <span className="font-semibold text-[#1A1715]">
                    {nights} {nights === 1 ? "Night" : "Nights"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#787069]">Rooms:</span>
                  <span className="font-semibold text-[#1A1715]">
                    {totalRoomsCount} {totalRoomsCount === 1 ? "Room" : "Rooms"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#787069]">Guests:</span>
                  <span className="font-semibold text-[#1A1715]">
                    {adults} {adults === 1 ? "Adult" : "Adults"}
                    {children > 0 ? `, ${children} ${children === 1 ? "Child" : "Children"} (Free)` : ""}
                  </span>
                </div>
              </div>

              {/* Promo Code Input on Checkout */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-semibold text-[#A27520] block">
                  Have a Promo Code?
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="e.g. DIRECT10, AMBARISH15"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                    className="w-full p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E6DED3] text-xs font-bold uppercase text-[#1A1715] focus:outline-none focus:border-[#B62576]"
                  />
                  {appliedPromo ? (
                    <button
                      type="button"
                      onClick={handleRemovePromo}
                      className="px-3 bg-red-100 text-red-700 font-bold rounded-xl text-xs"
                    >
                      ✕
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleApplyPromo()}
                      className="px-4 bg-[#1A1715] hover:bg-[#A27520] text-white font-bold uppercase tracking-wider text-xs rounded-xl transition-colors shrink-0"
                    >
                      Apply
                    </button>
                  )}
                </div>

                {promoMsg && (
                  <div
                    className={`text-xs font-medium px-2.5 py-1 rounded-lg flex items-center space-x-1.5 ${
                      promoMsg.type === "success"
                        ? "bg-emerald-50 text-emerald-800"
                        : "bg-red-50 text-red-800"
                    }`}
                  >
                    {promoMsg.type === "success" ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                    )}
                    <span>{promoMsg.text}</span>
                  </div>
                )}
              </div>

              {/* Exact Itemized Math */}
              <div className="space-y-2.5 pt-2 border-t border-[#E6DED3] text-xs">
                <div className="flex justify-between">
                  <span className="text-[#787069]">
                    Room Tariff ({totalRoomsCount} {totalRoomsCount === 1 ? "Room" : "Rooms"} &times; {nights}N):
                  </span>
                  <span className="font-semibold text-[#1A1715]">
                    {formatCurrencyINR(grossRoomsBase)}
                  </span>
                </div>

                {extraPaxCount > 0 && (
                  <div className="flex justify-between text-[#A27520] font-semibold">
                    <span>
                      Extra Adult (+{extraPaxCount} Pax &times; ₹500/nt &times; {nights}N):
                    </span>
                    <span>+{formatCurrencyINR(extraPaxCharge)}</span>
                  </div>
                )}

                <div className="flex justify-between text-emerald-800 text-[11px] font-medium">
                  <span>👶 Children (Existing Bedding):</span>
                  <span className="font-bold">FREE (₹0)</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span className="flex items-center">
                      <Tag className="w-3 h-3 mr-1" />
                      Promo Discount ({appliedPromo?.code}):
                    </span>
                    <span>-{formatCurrencyINR(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-[#787069]">
                    Net Taxable Base:
                  </span>
                  <span className="font-semibold text-[#1A1715]">
                    {formatCurrencyINR(netBaseAmount)}
                  </span>
                </div>

                <div className="flex justify-between text-[#787069]">
                  <span>GST (5% SAC 996311):</span>
                  <span>+{formatCurrencyINR(taxAmount)}</span>
                </div>

                <div className="pt-3 border-t border-[#E6DED3] flex items-baseline justify-between">
                  <div>
                    <span className="text-xs uppercase font-bold text-[#1A1715] block">
                      Total Payable:
                    </span>
                    <span className="text-[10px] text-[#787069]">
                      Inclusive of all taxes
                    </span>
                  </div>
                  <span className="font-serif text-2xl sm:text-3xl font-bold text-[#B62576]">
                    {formatCurrencyINR(totalAmount)}
                  </span>
                </div>
              </div>

              {/* Direct Booking Guarantees */}
              <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E6DED3] space-y-2 text-[11px] text-[#4A443F]">
                <div className="flex items-center space-x-2 text-[#A27520] font-semibold">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>Direct Guest Benefits</span>
                </div>
                <ul className="space-y-1 pl-6 list-disc text-[#787069]">
                  <li>Instant confirmation voucher &amp; SMS</li>
                  <li>Free cancellation up to 24h before check-in</li>
                  <li>Priority room allocation &amp; early check-in support</li>
                </ul>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-8">
          <div className="text-center space-y-3">
            <div className="w-8 h-8 border-2 border-[#B62576] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-[#787069] uppercase tracking-wider font-mono">
              Loading Checkout...
            </p>
          </div>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
