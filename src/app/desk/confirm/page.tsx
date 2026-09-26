"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle2,
  AlertCircle,
  PhoneCall,
  MessageCircle,
  ShieldCheck,
  Calendar,
  Clock,
  User,
  CreditCard,
  Building,
  Check,
  X,
  ExternalLink,
  Printer,
} from "lucide-react";
import { HOTEL_INFO } from "@/data/hotel-info";
import { formatCurrencyINR } from "@/lib/formatters";

interface DeskReservation {
  id: string;
  bookingReference: string;
  status: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  rooms: number;
  adults: number;
  children: number;
  guestName: string;
  guestPhone: string;
  guestEmail: string;
  guestCity?: string;
  guestState?: string;
  paymentMethod: string;
  bookedRooms: Array<{
    roomName?: string;
    bedType?: string;
    ratePlanName?: string;
    pricePerNight?: number;
    quantity?: number;
  }>;
  baseAmount: number;
  discountAmount?: number;
  taxAmount: number;
  totalAmount: number;
}

function DeskConfirmContent() {
  const searchParams = useSearchParams();
  const reference = (searchParams.get("reference") || "").trim().toUpperCase();
  const token = (searchParams.get("token") || "").trim();

  const [reservation, setReservation] = useState<DeskReservation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form inputs
  const [allocatedRoom, setAllocatedRoom] = useState("");
  const [staffName, setStaffName] = useState("Reception Desk");
  const [staffNotes, setStaffNotes] = useState("");
  const [availabilityChecked, setAvailabilityChecked] = useState(false);
  const [guestContacted, setGuestContacted] = useState(false);

  // Modal prompt state
  const [showPromptModal, setShowPromptModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedSuccess, setConfirmedSuccess] = useState(false);
  const [cancelledSuccess, setCancelledSuccess] = useState(false);

  // Fetch reservation details
  useEffect(() => {
    if (!reference || !token) {
      setError("Missing booking reference or authorization token.");
      setLoading(false);
      return;
    }

    async function loadData() {
      try {
        const res = await fetch(
          `/api/v1/desk/confirm?reference=${encodeURIComponent(reference)}&token=${encodeURIComponent(token)}`
        );
        const data = await res.json();

        if (!res.ok || !data.success) {
          setError(data.message || "Failed to load reservation details.");
        } else {
          setReservation(data.reservation);
          if (data.reservation.status === "CONFIRMED") {
            setConfirmedSuccess(true);
          } else if (data.reservation.status === "CANCELLED") {
            setCancelledSuccess(true);
          }
        }
      } catch (err: any) {
        setError(err.message || "Network error loading reservation.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [reference, token]);

  // Execute Final Confirmation
  const handleFinalConfirm = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/v1/desk/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reference,
          token,
          action: "CONFIRM",
          allocatedRoom,
          staffName,
          notes: staffNotes,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.message || "Failed to confirm reservation.");
      } else {
        setShowPromptModal(false);
        setConfirmedSuccess(true);
        if (reservation) {
          setReservation({ ...reservation, status: "CONFIRMED" });
        }
      }
    } catch (err: any) {
      alert("Error confirming reservation: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Execute Cancellation
  const handleFinalCancel = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/v1/desk/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reference,
          token,
          action: "CANCEL",
          notes: staffNotes,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.message || "Failed to cancel reservation.");
      } else {
        setShowCancelModal(false);
        setCancelledSuccess(true);
        if (reservation) {
          setReservation({ ...reservation, status: "CANCELLED" });
        }
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format WhatsApp Link
  const cleanPhoneDigits = (reservation?.guestPhone || "").replace(/[^0-9]/g, "");
  const waPhone = cleanPhoneDigits.length === 10 ? `91${cleanPhoneDigits}` : cleanPhoneDigits;
  const waConfirmedMessage = encodeURIComponent(
    `Namaste ${reservation?.guestName}, your reservation at Hotel Ambarish Grand Residency, Guwahati is CONFIRMED & GUARANTEED! Booking Reference: #${reservation?.bookingReference}. Check-in: ${reservation?.checkIn} (12:00 PM • Free early check-in from 5:00 AM available). View your official confirmed voucher here: ${typeof window !== "undefined" ? window.location.origin : ""}/booking/confirmation/${reservation?.bookingReference}`
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-[#9A7228] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold uppercase tracking-widest text-[#7D756E]">
            Verifying Front Desk Credentials...
          </p>
        </div>
      </div>
    );
  }

  if (error || !reservation) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-4 text-[#1C1917]">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-[#E7E2D9] text-center shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-700 mx-auto flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-xl font-medium text-[#1C1917]">Front Desk Verification</h2>
          <p className="text-xs text-[#78716C] leading-relaxed">
            {error || "Unable to authorize confirmation for this booking."}
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-block py-2.5 px-5 bg-[#1C1917] text-white rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-[#8F6B2A] transition-colors"
            >
              Return to Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C1917] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-5">
        
        {/* Header with Official Logo */}
        <div className="bg-white rounded-3xl p-6 border border-[#E7E2D9] text-center shadow-sm space-y-3">
          <div className="relative h-12 w-48 mx-auto">
            <Image
              src="/images/logo.png"
              alt="Hotel Ambarish Grand Residency by Divine View"
              fill
              sizes="192px"
              className="object-contain"
              priority
            />
          </div>
          <div>
            <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#8F6B2A] block">
              Front Desk Operations Portal
            </span>
            <h1 className="font-serif text-xl sm:text-2xl font-medium text-[#1C1917] pt-0.5">
              Reservation Confirmation Desk
            </h1>
          </div>
        </div>

        {/* ALREADY CONFIRMED STATE */}
        {confirmedSuccess ? (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-200 shadow-sm space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 text-emerald-900 border border-emerald-200">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <Check className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 block">
                  Reservation Confirmed &amp; Guaranteed
                </span>
                <p className="text-xs text-emerald-700">
                  Booking <strong>#{reservation.bookingReference}</strong> is officially confirmed. The guaranteed voucher has been dispatched to <strong>{reservation.guestEmail}</strong>.
                </p>
              </div>
            </div>

            {/* Quick Action Hub */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <a
                href={`https://wa.me/${waPhone}?text=${waConfirmedMessage}`}
                target="_blank"
                rel="noreferrer"
                className="py-3 px-4 rounded-xl bg-[#25D366] text-white font-semibold text-xs flex items-center justify-center gap-2 hover:opacity-95 transition-opacity shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Send WhatsApp Voucher</span>
              </a>

              <Link
                href={`/booking/confirmation/${reservation.bookingReference}`}
                target="_blank"
                className="py-3 px-4 rounded-xl bg-[#1A1715] text-white font-semibold text-xs flex items-center justify-center gap-2 hover:bg-[#9A7228] transition-colors shadow-sm"
              >
                <ExternalLink className="w-4 h-4" />
                <span>View Live Guest Voucher</span>
              </Link>
            </div>
          </div>
        ) : cancelledSuccess ? (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-200 shadow-sm space-y-5 animate-in fade-in duration-300">
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-rose-50 text-rose-900 border border-rose-200">
              <div className="w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center shrink-0">
                <X className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-800 block">
                  Reservation Cancelled &amp; Notice Dispatched
                </span>
                <p className="text-xs text-rose-700">
                  Booking <strong>#{reservation.bookingReference}</strong> has been cancelled. An official cancellation notification email has been dispatched to <strong>{reservation.guestEmail}</strong>.
                </p>
              </div>
            </div>

            {/* Quick Action Hub for Alternate Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <a
                href={`https://wa.me/${waPhone}?text=${encodeURIComponent(
                  `Namaste ${reservation?.guestName}, regarding your booking request #${reservation?.bookingReference} at Hotel Ambarish Grand Residency, Guwahati: We regret to inform you that our rooms are fully booked for these dates. Would you like to check alternative dates?`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="py-3 px-4 rounded-xl bg-[#25D366] text-white font-semibold text-xs flex items-center justify-center gap-2 hover:opacity-95 transition-opacity shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Offer Alternate Dates (WhatsApp)</span>
              </a>

              <a
                href={`tel:${reservation.guestPhone}`}
                className="py-3 px-4 rounded-xl bg-[#1A1715] text-white font-semibold text-xs flex items-center justify-center gap-2 hover:bg-[#9A7228] transition-colors shadow-sm"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call Guest ({reservation.guestPhone})</span>
              </a>
            </div>
          </div>
        ) : (
          /* PENDING CONFIRMATION & VERIFICATION PROMPT */
          <div className="space-y-5">
            
            {/* Reservation Summary Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E6DFD5] shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E6DFD5]">
                <div>
                  <span className="text-[10px] font-sans uppercase tracking-wider text-[#7D756E] block font-semibold">
                    Booking Reference
                  </span>
                  <span className="font-sans text-xl font-bold text-[#9A7228]">
                    #{reservation.bookingReference}
                  </span>
                </div>
                <div className="sm:text-right">
                  <span className="text-[10px] font-sans uppercase tracking-wider text-[#7D756E] block font-semibold">
                    Total Tariff (Pay at Desk)
                  </span>
                  <span className="font-serif text-xl font-bold text-[#1A1715]">
                    {formatCurrencyINR(reservation.totalAmount)}
                  </span>
                </div>
              </div>

              {/* Guest Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1 p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EDE7DE]">
                  <span className="font-semibold text-[10px] uppercase text-[#9A7228] block tracking-wider">
                    Primary Guest
                  </span>
                  <p className="font-medium text-sm text-[#1A1715]">{reservation.guestName}</p>
                  <p className="text-[#5C554E] flex items-center gap-1.5 pt-0.5">
                    <PhoneCall className="w-3.5 h-3.5 text-[#9A7228]" />
                    <a href={`tel:${reservation.guestPhone}`} className="font-semibold hover:underline">
                      {reservation.guestPhone}
                    </a>
                  </p>
                  <p className="text-[#7D756E] truncate">{reservation.guestEmail}</p>
                </div>

                <div className="space-y-1 p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EDE7DE]">
                  <span className="font-semibold text-[10px] uppercase text-[#9A7228] block tracking-wider">
                    Stay Schedule
                  </span>
                  <p className="font-medium text-[#1A1715]">
                    {reservation.checkIn} &rarr; {reservation.checkOut} ({reservation.nights} {reservation.nights === 1 ? "Night" : "Nights"})
                  </p>
                  <p className="text-[#5C554E]">
                    {reservation.rooms} Room(s) &bull; {reservation.adults} Adults
                  </p>
                  <p className="text-[#7D756E]">
                    Policy Check-in: 12:00 PM | Check-out: 12:00 PM | Free Early Check-in: 5:00 AM+
                  </p>
                </div>
              </div>

              {/* Room Breakdown */}
              <div className="space-y-2">
                <span className="font-semibold text-[10px] uppercase text-[#9A7228] block tracking-wider">
                  Booked Categories
                </span>
                <div className="rounded-2xl border border-[#EDE7DE] divide-y divide-[#EDE7DE] overflow-hidden">
                  {reservation.bookedRooms.map((rm, idx) => (
                    <div key={idx} className="p-3 bg-[#FFFFFF] flex justify-between items-center text-xs">
                      <div>
                        <span className="font-semibold text-[#1A1715]">{rm.quantity}&times; {rm.roomName}</span>
                        <span className="text-[11px] text-[#7D756E] block">{rm.ratePlanName}</span>
                      </div>
                      <span className="font-sans font-bold text-[#1A1715]">
                        {formatCurrencyINR((rm.pricePerNight || 0) * (rm.quantity || 1))}/n
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Front Desk Verification Form & Prompt */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#D8C3A5] shadow-md space-y-5">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#9A7228]" />
                  <h3 className="font-serif text-lg font-medium text-[#1A1715]">
                    Front Desk Verification Checklist
                  </h3>
                </div>
                <p className="text-xs text-[#5C554E] leading-relaxed">
                  Before officially guaranteeing this reservation, complete the operational verification steps below:
                </p>
              </div>

              {/* Verification Checkboxes */}
              <div className="space-y-2.5 p-4 rounded-2xl bg-[#FAF7F2] border border-[#E6DFD5] text-xs">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={availabilityChecked}
                    onChange={(e) => setAvailabilityChecked(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded text-[#9A7228] focus:ring-[#9A7228]"
                  />
                  <span className="text-[#1A1715] font-medium leading-relaxed">
                    I have checked our physical room register and verified that <strong>{reservation.rooms} room(s)</strong> are available for these stay dates.
                  </span>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer pt-1 border-t border-[#EDE7DE]">
                  <input
                    type="checkbox"
                    checked={guestContacted}
                    onChange={(e) => setGuestContacted(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded text-[#9A7228] focus:ring-[#9A7228]"
                  />
                  <span className="text-[#1A1715] font-medium leading-relaxed">
                    I have contacted <strong>{reservation.guestName}</strong> at <strong>{reservation.guestPhone}</strong> to confirm their arrival and settlement details.
                  </span>
                </label>
              </div>

              {/* Allocation Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold uppercase text-[#7D756E]">
                    Allocated Room Number (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Room 204"
                    value={allocatedRoom}
                    onChange={(e) => setAllocatedRoom(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#E6DFD5] bg-[#FAF7F2] text-xs font-medium text-[#1A1715] focus:outline-none focus:border-[#9A7228]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold uppercase text-[#7D756E]">
                    Front Desk Staff Name / ID
                  </label>
                  <input
                    type="text"
                    placeholder="Reception Staff"
                    value={staffName}
                    onChange={(e) => setStaffName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#E6DFD5] bg-[#FAF7F2] text-xs font-medium text-[#1A1715] focus:outline-none focus:border-[#9A7228]"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[10px] font-semibold uppercase text-[#7D756E]">
                    Internal Front Desk Notes (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Guest arriving at 2 PM by train, payment via UPI at check-in"
                    value={staffNotes}
                    onChange={(e) => setStaffNotes(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#E6DFD5] bg-[#FAF7F2] text-xs text-[#1A1715] focus:outline-none focus:border-[#9A7228]"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  disabled={!availabilityChecked || !guestContacted}
                  onClick={() => setShowPromptModal(true)}
                  className="flex-1 py-3.5 px-5 rounded-full bg-[#1A1715] hover:bg-[#9A7228] disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Confirm Booking &bull; Send Voucher</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowCancelModal(true)}
                  className="py-3.5 px-5 rounded-full bg-[#FAF7F2] hover:bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                  Mark Unavailable / Cancel
                </button>
              </div>

              {(!availabilityChecked || !guestContacted) && (
                <p className="text-[11px] text-center text-[#7D756E]">
                  * Check both verification boxes above to enable confirmation.
                </p>
              )}
            </div>
          </div>
        )}

        {/* CONFIRMATION PROMPT MODAL */}
        {showPromptModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-7 border border-[#E6DFD5] shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-12 h-12 rounded-full bg-amber-50 text-[#9A7228] mx-auto flex items-center justify-center">
                <Check className="w-6 h-6" />
              </div>

              <div className="text-center space-y-1">
                <h3 className="font-serif text-xl font-medium text-[#1A1715]">
                  Confirm Reservation #{reservation.bookingReference}?
                </h3>
                <p className="text-xs text-[#5C554E] leading-relaxed">
                  Please review before proceeding. Confirming this reservation will:
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EDE7DE] text-xs space-y-1.5 text-[#1A1715]">
                <p className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9A7228]" />
                  <span>Update status to <strong>CONFIRMED</strong> in hotel database.</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9A7228]" />
                  <span>Email the official guaranteed voucher to <strong>{reservation.guestEmail}</strong>.</span>
                </p>
                {allocatedRoom && (
                  <p className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#9A7228]" />
                    <span>Assign room: <strong>{allocatedRoom}</strong>.</span>
                  </p>
                )}
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleFinalConfirm}
                  className="flex-1 py-3 px-4 rounded-full bg-[#1A1715] hover:bg-[#9A7228] text-white text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-60"
                >
                  {isSubmitting ? "Confirming..." : "Yes, Finalize Confirmation"}
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setShowPromptModal(false)}
                  className="py-3 px-5 rounded-full bg-[#FAF7F2] text-[#7D756E] hover:text-[#1A1715] text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CANCELLATION PROMPT MODAL */}
        {showCancelModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-7 border border-[#E6DFD5] shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-700 mx-auto flex items-center justify-center">
                <AlertCircle className="w-6 h-6" />
              </div>

              <div className="text-center space-y-1">
                <h3 className="font-serif text-xl font-medium text-[#1A1715]">
                  Cancel Reservation #{reservation.bookingReference}?
                </h3>
                <p className="text-xs text-[#5C554E] leading-relaxed">
                  Are you sure you want to cancel this booking request? This will mark the booking as Cancelled in the database.
                </p>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleFinalCancel}
                  className="flex-1 py-3 px-4 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-60"
                >
                  {isSubmitting ? "Cancelling..." : "Yes, Mark Cancelled"}
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setShowCancelModal(false)}
                  className="py-3 px-5 rounded-full bg-[#FAF7F2] text-[#7D756E] hover:text-[#1A1715] text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default function DeskConfirmPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#9A7228] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <DeskConfirmContent />
    </Suspense>
  );
}
