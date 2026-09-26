"use client";

import React, { useState, Suspense, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import {
  Lock,
  ArrowUpRight,
  AlertCircle,
  ShieldCheck,
  Tag,
  CheckCircle2,
  XCircle,
  Percent,
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
  Phone,
} from "lucide-react";
import { ROOMS, RoomCategory } from "@/data/rooms";
import { HOTEL_INFO } from "@/data/hotel-info";
import { calculateRoomGST } from "@/lib/gst";
import { formatCurrencyINR, calculateNights, getTodayDate, getTomorrowDate } from "@/lib/formatters";
import { AVAILABLE_PROMOS, validateAndApplyPromo, PromoCode } from "@/data/promos";
import { BookedRoomItem } from "@/lib/hotel-os-client";
import { purgeLegacyGuestPII } from "@/lib/session";

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && (window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

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

  const totalRoomsCount = useMemo(() => {
    return bookedRoomsList.reduce((acc, curr) => acc + curr.quantity, 0);
  }, [bookedRoomsList]);

  // Form states
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestCity, setGuestCity] = useState("");
  const [guestState, setGuestState] = useState("");
  const [wantsGstInvoice, setWantsGstInvoice] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [guestGstin, setGuestGstin] = useState("");
  const [isB2bBooking, setIsB2bBooking] = useState(false);
  const [corporateEmail, setCorporateEmail] = useState("");
  const [poNumber, setPoNumber] = useState("");
  const [billingInstruction, setBillingInstruction] = useState("BILL_TO_COMPANY");

  // Promo code
  const [promoInput, setPromoInput] = useState(urlPromo);
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [promoMsg, setPromoMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Auto-apply promo from URL or session
  useEffect(() => {
    if (urlPromo) {
      const res = validateAndApplyPromo(urlPromo, 3000);
      if (res.isValid && res.promo) {
        setAppliedPromo(res.promo);
        setPromoMsg({
          type: "success",
          text: `"${res.promo.code}" applied. ${res.promo.description}`,
        });
      }
    }
  }, [urlPromo]);

  // Calculate pricing breakdown
  const grossRoomsBase = useMemo(() => {
    return bookedRoomsList.reduce((acc, curr) => acc + curr.pricePerNight * curr.quantity * nights, 0);
  }, [bookedRoomsList, nights]);

  const baseIncludedAdults = totalRoomsCount * 2;
  const extraPaxCount = Math.max(0, adults - baseIncludedAdults);
  const extraPaxCharge = extraPaxCount * 500 * nights;

  const combinedGross = grossRoomsBase + extraPaxCharge;

  let discountAmount = 0;
  if (appliedPromo && combinedGross > 0) {
    if (appliedPromo.type === "PERCENTAGE") {
      discountAmount = (combinedGross * appliedPromo.value) / 100;
      if (appliedPromo.maxDiscount) {
        discountAmount = Math.min(discountAmount, appliedPromo.maxDiscount);
      }
    } else if (appliedPromo.type === "FLAT") {
      discountAmount = Math.min(combinedGross, appliedPromo.value);
    }
  }

  const netBaseAmount = Math.max(0, combinedGross - discountAmount);
  const gstRate = 0.12;
  const taxAmount = Math.round(netBaseAmount * gstRate);
  const totalAmount = netBaseAmount + taxAmount;

  const handleApplyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (!code) {
      setPromoMsg({ type: "error", text: "Please enter a valid promo code." });
      return;
    }
    const res = validateAndApplyPromo(code, combinedGross);
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
        text: res.errorMessage || `Invalid promo code "${code}". Try DIRECT10.`,
      });
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoInput("");
    setPromoMsg(null);
  };

  const [specialRequests, setSpecialRequests] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<"ONLINE" | "PAY_AT_HOTEL">("PAY_AT_HOTEL");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Purge any legacy PII cookies on mount
  useEffect(() => {
    purgeLegacyGuestPII();
  }, []);

  const updateGuestName = (val: string) => setGuestName(val);
  const updateGuestEmail = (val: string) => setGuestEmail(val);
  const updateGuestPhone = (val: string) => setGuestPhone(val);
  const updateGuestCity = (val: string) => setGuestCity(val);
  const updateCompanyName = (val: string) => setCompanyName(val);
  const updateGuestGstin = (val: string) => setGuestGstin(val);
  const updateSpecialRequests = (val: string) => setSpecialRequests(val);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) {
      setErrorMsg("Please accept the booking and cancellation policy to proceed.");
      return;
    }
    if (!guestName.trim() || !guestEmail.trim() || !guestPhone.trim()) {
      setErrorMsg("Please enter guest name, valid email, and contact phone number.");
      return;
    }
    setErrorMsg("");
    setIsProcessing(true);

    const readSafeJson = async (res: Response): Promise<{ ok: boolean; data: any }> => {
      try {
        const text = await res.text();
        if (!text || text.trim() === "") {
          return { ok: res.ok, data: { message: `Empty response from server (Status: ${res.status})` } };
        }
        const data = JSON.parse(text);
        return { ok: res.ok, data };
      } catch {
        return { ok: false, data: { message: `Unable to parse server response (${res.status}). Please check network or contact front desk.` } };
      }
    };

    try {
      // 1. Initialize checkout session
      const checkoutItems = bookedRoomsList.map((rm) => ({
        roomTypeId: rm.roomSlug,
        ratePlanCode: rm.ratePlanCode,
        quantity: rm.quantity || 1,
      }));

      const checkoutRes = await fetch("/api/v1/checkouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          checkIn,
          checkOut,
          occupancy: { adults, children, rooms: totalRoomsCount },
          items: checkoutItems,
          promoCode: appliedPromo?.code,
          isB2b: isB2bBooking,
          corporateDetails: isB2bBooking
            ? {
                companyName,
                gstin: guestGstin,
                corporateEmail,
                poNumber,
                billingInstruction,
              }
            : undefined,
        }),
      });

      const { ok: coOk, data: checkoutData } = await readSafeJson(checkoutRes);

      if (!coOk || !checkoutData?.checkoutId) {
        throw new Error(checkoutData?.error || "Unable to reserve rooms. Please try again.");
      }

      const { checkoutId, accessToken } = checkoutData;

      const guestPayload = {
        name: guestName.trim().toUpperCase(),
        email: guestEmail.trim().toLowerCase(),
        phone: guestPhone.trim(),
        city: guestCity.trim() || undefined,
        state: guestState.trim() || undefined,
        gstin: wantsGstInvoice && guestGstin.trim() ? guestGstin.trim().toUpperCase() : undefined,
        companyName: wantsGstInvoice && companyName.trim() ? companyName.trim().toUpperCase() : undefined,
        specialRequests: specialRequests.trim() || undefined,
      };

      if (paymentMethod === "ONLINE") {
        // 2A. Razorpay Online Payment Gateway Flow
        const isLoaded = await loadRazorpayScript();
        if (!isLoaded || !(window as any).Razorpay) {
          throw new Error("Unable to initialize secure Razorpay gateway. Please check your internet connection or choose 'Pay at Hotel'.");
        }

        // Initialize server-side Razorpay order
        const orderRes = await fetch("/api/v1/payment/order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ checkoutId, accessToken }),
        });

        const { ok: ordOk, data: orderData } = await readSafeJson(orderRes);
        if (!ordOk || !orderData?.orderId) {
          throw new Error(orderData?.message || orderData?.error || "Failed to initialize payment gateway order.");
        }

        const razorpayKey =
          orderData.keyId ||
          process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
          "rzp_test_TXYTOcrBe519et";

        const options = {
          key: razorpayKey,
          amount: orderData.amount,
          currency: orderData.currency || "INR",
          name: "Hotel Ambarish Grand Residency",
          description: `Booking #${checkoutId.slice(0, 8).toUpperCase()} • ${totalRoomsCount} Room(s)`,
          image: "/images/logo.png",
          order_id: orderData.orderId,
          prefill: {
            name: guestPayload.name,
            email: guestPayload.email,
            contact: guestPayload.phone,
          },
          notes: {
            checkoutId,
            checkIn,
            checkOut,
          },
          theme: {
            color: "#8F6B2A", // Refined Antique Bronze brand color
          },
          modal: {
            ondismiss: () => {
              setIsProcessing(false);
              setErrorMsg("Payment was dismissed. You can retry or switch to 'Pay at Hotel' to guarantee your room.");
            },
          },
          handler: async (response: any) => {
            try {
              setIsProcessing(true);
              setErrorMsg("");

              // Verify cryptographic HMAC SHA-256 signature on server
              const verifyRes = await fetch("/api/v1/payment/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  checkoutId,
                  accessToken,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              });

              const { ok: verOk, data: verifyData } = await readSafeJson(verifyRes);
              if (!verOk || !verifyData?.verified) {
                throw new Error(verifyData?.message || "Payment verification could not be confirmed. Please contact hotel front desk.");
              }

              // Finalize reservation with guaranteed payment
              const finRes = await fetch("/api/v1/reservations/finalize", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  checkoutId,
                  accessToken,
                  guest: guestPayload,
                  paymentMethod: "RAZORPAY",
                }),
              });

              const { ok: finOk, data: finData } = await readSafeJson(finRes);
              if (finOk && finData?.success && finData?.reservation) {
                router.push(
                  `/booking/confirmation/${finData.reservation.bookingReference}?token=${finData.reservation.lookupToken}`
                );
              } else {
                throw new Error(finData?.message || finData?.error || "Reservation finalization failed after payment.");
              }
            } catch (err: any) {
              setErrorMsg(err.message || "Payment verification failed. Please contact the front desk with your payment ID.");
              setIsProcessing(false);
            }
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on("payment.failed", (response: any) => {
          setIsProcessing(false);
          setErrorMsg(response?.error?.description || "Payment was rejected by bank. Please try another card or UPI.");
        });
        rzp.open();
      } else {
        // 2B. Pay at Hotel Flow
        const finRes = await fetch("/api/v1/reservations/finalize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            checkoutId,
            accessToken,
            guest: guestPayload,
            paymentMethod: "PAY_AT_HOTEL",
          }),
        });

        const { ok: finOk, data: finData } = await readSafeJson(finRes);
        if (finOk && finData?.success && finData?.reservation) {
          router.push(
            `/booking/confirmation/${finData.reservation.bookingReference}?token=${finData.reservation.lookupToken}`
          );
        } else {
          throw new Error(finData?.message || finData?.error || "Reservation finalization failed.");
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || "A network error occurred. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-[#FAF8F5] text-[#1C1917] min-h-screen pb-24">
      {/* Official Razorpay Checkout Script */}
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      {/* Hospitality Booking Progress Stepper */}
      <div className="bg-[#FFFFFF] border-b border-[#E7E2D9] py-3.5 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Link
              href={`/booking?checkIn=${checkIn}&checkOut=${checkOut}&rooms=${totalRoomsCount}&adults=${adults}&children=${children}`}
              className="flex items-center space-x-1.5 text-emerald-800 font-semibold hover:underline"
            >
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[11px]">✓</span>
              <span>Rooms Selected</span>
            </Link>
            <ChevronRight className="w-4 h-4 text-[#78716C]" />
            <span className="flex items-center space-x-1.5 font-semibold text-[#8F6B2A]">
              <span className="w-5 h-5 rounded-full bg-[#8F6B2A] text-white flex items-center justify-center text-[11px]">2</span>
              <span>Guest Details &amp; Guarantee</span>
            </span>
            <ChevronRight className="w-4 h-4 text-[#78716C] hidden sm:inline" />
            <span className="items-center space-x-1.5 text-[#78716C] hidden sm:flex">
              <span className="w-5 h-5 rounded-full bg-[#E7E2D9] text-[#78716C] flex items-center justify-center text-[11px]">3</span>
              <span>Confirmation</span>
            </span>
          </div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-[#8F6B2A] bg-[#FAF5EB] px-3.5 py-1.5 rounded-lg border border-[#DFD5C0] shadow-sm">
            <Lock className="w-3.5 h-3.5" />
            <span>Secure Direct Booking</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleBookingSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Guest Details & Payment (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {errorMsg && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center space-x-2 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* 1. Primary Guest Details */}
            <div className="bg-[#FFFFFF] p-6 sm:p-8 rounded-2xl border border-[#E7E2D9] shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-[#E7E2D9] pb-3">
                <h3 className="font-serif text-xl font-medium text-[#1C1917]">
                  1. Primary Guest Information
                </h3>
                <span className="text-[11px] text-[#78716C]">
                  * Required for hotel check-in
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#8F6B2A]">
                    Full Name (As on Photo ID) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BIJESH SHARMA"
                    value={guestName}
                    onChange={(e) => updateGuestName(e.target.value.toUpperCase())}
                    className="w-full p-2.5 rounded-lg bg-[#FAF8F5] border border-[#E7E2D9] text-xs font-semibold text-[#1C1917] focus:outline-none focus:border-[#8F6B2A] uppercase"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#8F6B2A]">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. guest@email.com"
                    value={guestEmail}
                    onChange={(e) => updateGuestEmail(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-[#FAF8F5] border border-[#E7E2D9] text-xs font-semibold text-[#1C1917] focus:outline-none focus:border-[#8F6B2A]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#8F6B2A]">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9876543210"
                    value={guestPhone}
                    onChange={(e) => updateGuestPhone(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-[#FAF8F5] border border-[#E7E2D9] text-xs font-semibold text-[#1C1917] focus:outline-none focus:border-[#8F6B2A]"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#8F6B2A]">
                    City of Residence
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. GUWAHATI"
                    value={guestCity}
                    onChange={(e) => updateGuestCity(e.target.value.toUpperCase())}
                    className="w-full p-2.5 rounded-lg bg-[#FAF8F5] border border-[#E7E2D9] text-xs font-semibold text-[#1C1917] focus:outline-none focus:border-[#8F6B2A] uppercase"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#8F6B2A]">
                    State
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ASSAM"
                    value={guestState}
                    onChange={(e) => setGuestState(e.target.value.toUpperCase())}
                    className="w-full p-2.5 rounded-lg bg-[#FAF8F5] border border-[#E7E2D9] text-xs font-semibold text-[#1C1917] focus:outline-none focus:border-[#8F6B2A] uppercase"
                  />
                </div>
              </div>

              {/* Optional GST Invoice / B2B */}
              <div className="pt-3 border-t border-[#E7E2D9] space-y-4">
                <div className="space-y-3">
                  <label className="flex items-center space-x-2.5 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={wantsGstInvoice && !isB2bBooking}
                      onChange={(e) => {
                        setWantsGstInvoice(e.target.checked);
                        if (e.target.checked) setIsB2bBooking(false);
                      }}
                      className="w-4 h-4 rounded text-[#8F6B2A] focus:ring-[#8F6B2A]"
                    />
                    <span className="text-[#44403C] font-medium">
                      I need a GST tax invoice for Input Tax Credit (Optional)
                    </span>
                  </label>

                  <label className="flex items-center space-x-2.5 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={isB2bBooking}
                      onChange={(e) => {
                        setIsB2bBooking(e.target.checked);
                        if (e.target.checked) setWantsGstInvoice(false);
                      }}
                      className="w-4 h-4 rounded text-[#8F6B2A] focus:ring-[#8F6B2A]"
                    />
                    <span className="text-[#44403C] font-medium">
                      Booking on behalf of Company / Travel Agency (B2B)
                    </span>
                  </label>
                </div>

                {(wantsGstInvoice || isB2bBooking) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs animate-fade-in">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-semibold text-[#78716C]">
                        Company / Business Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Company name"
                        value={companyName}
                        onChange={(e) => updateCompanyName(e.target.value.toUpperCase())}
                        className="w-full p-2.5 rounded-lg bg-[#FAF8F5] border border-[#E7E2D9] text-xs font-semibold text-[#1C1917] uppercase"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-semibold text-[#78716C]">
                        15-Digit GSTIN
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 18AAAAA0000A1Z5"
                        value={guestGstin}
                        onChange={(e) => updateGuestGstin(e.target.value.toUpperCase())}
                        className="w-full p-2.5 rounded-lg bg-[#FAF8F5] border border-[#E7E2D9] text-xs font-semibold text-[#1C1917] uppercase"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 2. Special Requests */}
            <div className="bg-[#FFFFFF] p-6 sm:p-8 rounded-2xl border border-[#E7E2D9] shadow-sm space-y-4">
              <h3 className="font-serif text-xl font-medium text-[#1C1917] border-b border-[#E7E2D9] pb-3">
                2. Special Requests &amp; Arrival Notes
              </h3>
              <div className="space-y-2 text-xs">
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#8F6B2A]">
                  Estimated Arrival Time or Requests
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Free 5 AM Early Check-in requested, quiet room on higher floor, train arrival time..."
                  value={specialRequests}
                  onChange={(e) => updateSpecialRequests(e.target.value)}
                  className="w-full p-3 rounded-lg bg-[#FAF8F5] border border-[#E7E2D9] text-xs font-normal text-[#1C1917] focus:outline-none focus:border-[#8F6B2A]"
                />
                <p className="text-[11px] text-[#78716C]">
                  Special requests are subject to availability upon check-in. Our 24/7 reception desk will note your preferences.
                </p>
              </div>
            </div>

            {/* 3. Payment Method & Guarantee */}
            <div className="bg-[#FFFFFF] p-6 sm:p-8 rounded-2xl border border-[#E7E2D9] shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-[#E7E2D9] pb-3">
                <h3 className="font-serif text-xl font-medium text-[#1C1917]">
                  3. Payment Method &amp; Guarantee
                </h3>
                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                  {paymentMethod === "ONLINE" ? "Instant Guarantee" : "Zero Upfront Fee"}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Option 1: Pay Online (Razorpay) */}
                <div
                  onClick={() => setPaymentMethod("ONLINE")}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer space-y-1.5 ${
                    paymentMethod === "ONLINE"
                      ? "border-[#8F6B2A] bg-[#FAF5EB]"
                      : "border-[#E7E2D9] bg-[#FAF8F5] hover:border-[#8F6B2A]/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CreditCard className="w-4 h-4 text-[#8F6B2A]" />
                      <span className="text-xs font-semibold text-[#1C1917]">Pay Online (Razorpay)</span>
                    </div>
                    {paymentMethod === "ONLINE" ? (
                      <span className="w-4 h-4 rounded-full bg-[#8F6B2A] text-white flex items-center justify-center text-[10px] font-bold">
                        ✓
                      </span>
                    ) : (
                      <span className="text-[9px] uppercase font-sans tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                        Instant
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#44403C] font-normal leading-relaxed">
                    Instant confirmation via UPI (GPay, PhonePe, Paytm), Cards &amp; NetBanking. 100% secure.
                  </p>
                </div>

                {/* Option 2: Pay at Hotel */}
                <div
                  onClick={() => setPaymentMethod("PAY_AT_HOTEL")}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer space-y-1.5 ${
                    paymentMethod === "PAY_AT_HOTEL"
                      ? "border-[#8F6B2A] bg-[#FAF5EB]"
                      : "border-[#E7E2D9] bg-[#FAF8F5] hover:border-[#8F6B2A]/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Building className="w-4 h-4 text-[#8F6B2A]" />
                      <span className="text-xs font-semibold text-[#1C1917]">Pay at Hotel</span>
                    </div>
                    {paymentMethod === "PAY_AT_HOTEL" ? (
                      <span className="w-4 h-4 rounded-full bg-[#8F6B2A] text-white flex items-center justify-center text-[10px] font-bold">
                        ✓
                      </span>
                    ) : (
                      <span className="text-[9px] uppercase font-sans tracking-wider px-2 py-0.5 rounded bg-stone-200 text-stone-700 font-semibold">
                        Zero Advance
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#44403C] font-normal leading-relaxed">
                    Reserve without upfront payment. Settle your tariff via Cash, UPI, or Card upon arrival at the front desk.
                  </p>
                </div>
              </div>

              {/* Policy agreement */}
              <div className="pt-2">
                <label className="flex items-start space-x-2.5 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    required
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded text-[#8F6B2A] focus:ring-[#8F6B2A]"
                  />
                  <span className="text-[#44403C] leading-relaxed">
                    I agree to the hotel policy (Standard Check-in: 12:00 PM, Check-out: 12:00 PM • Free Early Check-in from 5:00 AM onwards upon request). Zero advance payment is subject to availability and demand; advance payment may be requested on call to guarantee confirmation. Valid Government Photo ID required for all adult guests.
                  </span>
                </label>
              </div>

              {/* Submit CTA */}
              <div className="space-y-2 pt-1">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="btn-heritage-primary w-full py-4 text-xs font-semibold tracking-wider rounded-lg shadow-md flex items-center justify-center space-x-2 disabled:opacity-60"
                >
                  {isProcessing ? (
                    <span>
                      {paymentMethod === "ONLINE"
                        ? "Connecting to Razorpay..."
                        : "Submitting Reservation Request..."}
                    </span>
                  ) : paymentMethod === "ONLINE" ? (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Pay &amp; Guarantee Reservation • {formatCurrencyINR(totalAmount)}</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <span>Submit Reservation • Pay at Hotel • {formatCurrencyINR(totalAmount)}</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </>
                  )}
                </button>
                <p className="text-center text-[11px] text-[#78716C] flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#8F6B2A]" />
                  <span>
                    {paymentMethod === "ONLINE"
                      ? "100% secure 256-bit SSL encryption. Official instant voucher generated."
                      : "Zero upfront fee to submit. Guaranteed reservation confirmation from our front desk."}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary with Multi-Room Breakdown (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#FFFFFF] p-6 sm:p-7 rounded-2xl border border-[#E7E2D9] shadow-sm space-y-5 sticky top-24">
              <div className="flex items-center justify-between border-b border-[#E7E2D9] pb-3">
                <h3 className="font-serif text-xl font-medium text-[#1C1917]">
                  Reservation Summary
                </h3>
                <Link
                  href={`/booking?checkIn=${checkIn}&checkOut=${checkOut}&rooms=${totalRoomsCount}&adults=${adults}&children=${children}`}
                  className="text-xs font-semibold text-[#8F6B2A] hover:underline"
                >
                  Edit Rooms
                </Link>
              </div>

              {/* Itemized Rooms List */}
              <div className="space-y-2.5">
                <span className="text-[10px] uppercase font-semibold tracking-wider text-[#8F6B2A] block">
                  Booked Rooms ({totalRoomsCount} {totalRoomsCount === 1 ? "Room" : "Rooms"}):
                </span>
                <div className="space-y-2">
                  {bookedRoomsList.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-[#FAF8F5] border border-[#E7E2D9] flex items-center justify-between space-x-3"
                    >
                      <div className="space-y-0.5">
                        <span className="text-[9px] font-sans uppercase tracking-wider text-[#8F6B2A] font-bold block">
                          {item.quantity}× {item.categoryCode} {item.bedType ? `• ${item.bedType}` : ""}
                        </span>
                        <h4 className="font-serif text-sm font-semibold text-[#1C1917] leading-snug">
                          {item.roomName}
                        </h4>
                        <span className="text-[10px] text-[#78716C] block">
                          {item.ratePlanName}
                        </span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-serif text-sm font-bold text-[#1C1917] block">
                          {formatCurrencyINR(item.pricePerNight * item.quantity * nights)}
                        </span>
                        <span className="text-[10px] text-[#78716C]">
                          {formatCurrencyINR(item.pricePerNight)}/rm/n
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stay Breakdown Details */}
              <div className="space-y-2 text-xs text-[#44403C] py-3 border-t border-b border-[#E7E2D9]">
                <div className="flex justify-between">
                  <span className="text-[#78716C]">Dates:</span>
                  <span className="font-semibold text-[#1C1917]">
                    {checkIn} to {checkOut}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#78716C]">Duration:</span>
                  <span className="font-semibold text-[#1C1917]">
                    {nights} {nights === 1 ? "Night" : "Nights"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#78716C]">Rooms:</span>
                  <span className="font-semibold text-[#1C1917]">
                    {totalRoomsCount} {totalRoomsCount === 1 ? "Room" : "Rooms"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#78716C]">Guests:</span>
                  <span className="font-semibold text-[#1C1917]">
                    {adults} {adults === 1 ? "Adult" : "Adults"}
                    {children > 0 ? `, ${children} ${children === 1 ? "Child" : "Children"} (Free)` : ""}
                  </span>
                </div>
              </div>

              {/* Promo Code Input on Checkout */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-semibold text-[#8F6B2A] block">
                  Have a Promo Code?
                </label>
                <div className="flex space-x-1.5">
                  <input
                    type="text"
                    placeholder="e.g. DIRECT10"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                    className="w-full p-2.5 rounded-lg bg-[#FAF8F5] border border-[#E7E2D9] text-xs font-bold uppercase text-[#1C1917] focus:outline-none focus:border-[#8F6B2A]"
                  />
                  {appliedPromo ? (
                    <button
                      type="button"
                      onClick={handleRemovePromo}
                      className="px-3 bg-red-50 text-red-700 font-bold rounded-lg text-xs border border-red-200"
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

                {promoMsg && (
                  <div
                    className={`text-xs font-medium px-2.5 py-1 rounded-md flex items-center space-x-1.5 ${
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

              {/* Itemized Calculations */}
              <div className="space-y-2 pt-2 border-t border-[#E7E2D9] text-xs">
                <div className="flex justify-between">
                  <span className="text-[#78716C]">
                    Room Tariff ({totalRoomsCount} {totalRoomsCount === 1 ? "Room" : "Rooms"} × {nights}N):
                  </span>
                  <span className="font-semibold text-[#1C1917]">
                    {formatCurrencyINR(grossRoomsBase)}
                  </span>
                </div>

                {extraPaxCount > 0 && (
                  <div className="flex justify-between text-[#8F6B2A] font-semibold">
                    <span>
                      Extra Adult (+{extraPaxCount} Pax × ₹500/nt × {nights}N):
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
                  <span className="text-[#78716C]">
                    Net Taxable Base:
                  </span>
                  <span className="font-semibold text-[#1C1917]">
                    {formatCurrencyINR(netBaseAmount)}
                  </span>
                </div>

                <div className="flex justify-between text-[#78716C]">
                  <span>GST (12%):</span>
                  <span>+{formatCurrencyINR(taxAmount)}</span>
                </div>

                <div className="pt-3 border-t border-[#E7E2D9] flex items-baseline justify-between">
                  <div>
                    <span className="text-xs uppercase font-bold text-[#1C1917] block">
                      Total Payable:
                    </span>
                    <span className="text-[10px] text-[#78716C]">
                      Inclusive of all taxes
                    </span>
                  </div>
                  <span className="font-serif text-2xl sm:text-3xl font-semibold text-[#8F6B2A]">
                    {formatCurrencyINR(totalAmount)}
                  </span>
                </div>
              </div>

              {/* Direct Booking Guarantees */}
              <div className="p-3.5 rounded-xl bg-[#FAF5EB] border border-[#DFD5C0] space-y-2 text-[11px] text-[#44403C]">
                <div className="flex items-center space-x-2 text-[#8F6B2A] font-semibold">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>Direct Guest Benefits</span>
                </div>
                <ul className="space-y-1 pl-5 list-disc text-[#78716C]">
                  <li>Instant confirmation voucher &amp; SMS</li>
                  <li>Free cancellation up to 24h before check-in</li>
                  <li><strong className="text-emerald-800 font-medium">Free Early Check-in from 5:00 AM</strong> (no extra charge)</li>
                  <li>Standard Check-in: 12:00 PM • Check-out: 12:00 PM</li>
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
        <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-8">
          <div className="text-center space-y-3">
            <div className="w-8 h-8 border-2 border-[#8F6B2A] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-[#78716C] uppercase tracking-wider font-sans font-medium">
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
