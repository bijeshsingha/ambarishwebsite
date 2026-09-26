"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle,
  Printer,
  QrCode,
  AlertCircle,
  PhoneCall,
  ArrowLeft,
  Calendar,
  Clock,
  Download,
  Lock,
} from "lucide-react";
import { HOTEL_INFO } from "@/data/hotel-info";
import { ReservationData } from "@/lib/hotel-os-client";
import { formatCurrencyINR } from "@/lib/formatters";

function ConfirmationContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const reference = (params?.id as string) || "";
  const token = searchParams.get("token") || "";

  const [reservation, setReservation] = useState<ReservationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!reference) {
      setLoading(false);
      setNotFound(true);
      return;
    }

    // SEC 07: Query official server API with high-entropy token
    async function fetchReservation() {
      try {
        const queryUrl = token
          ? `/api/v1/reservations?reference=${encodeURIComponent(reference)}&token=${encodeURIComponent(token)}`
          : `/api/v1/reservations?reference=${encodeURIComponent(reference)}`;

        const res = await fetch(queryUrl);
        if (res.ok) {
          const data = await res.json();
          if (data.reservation) {
            setReservation(data.reservation);
            setNotFound(false);
            return;
          }
        }
        setNotFound(true);
      } catch (err) {
        console.error("Failed to load reservation from server:", err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }

    fetchReservation();
  }, [reference, token]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center text-[#1C1917]">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#8F6B2A] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-light text-[#78716C]">Loading confirmed voucher...</p>
        </div>
      </div>
    );
  }

  if (notFound || !reservation) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] py-20 px-4 sm:px-6 text-[#1C1917] flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-[#E7E2D9] text-center shadow-sm space-y-5">
          <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-700 mx-auto flex items-center justify-center">
            <AlertCircle className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <h1 className="font-serif text-2xl font-medium text-[#1C1917]">Reservation Lookup</h1>
            <p className="text-xs text-[#78716C]">
              We could not find active records for reference{" "}
              <strong className="font-sans font-bold text-[#8F6B2A]">{reference}</strong>.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E7E2D9] text-left text-xs space-y-2 text-[#44403C]">
            <p>If you recently placed this booking:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Check your email inbox for the booking confirmation.</li>
              <li>Or contact our 24/7 hotel front desk with your phone number.</li>
            </ul>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <a
              href={`tel:${HOTEL_INFO.phone}`}
              className="btn-heritage-primary w-full py-2.5 px-4 text-xs font-semibold tracking-wider flex items-center justify-center gap-2"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Call Front Desk ({HOTEL_INFO.phone})</span>
            </a>
            <Link
              href="/"
              className="w-full py-2.5 px-4 bg-[#FAF8F5] text-[#1C1917] border border-[#E7E2D9] rounded-full text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#F4EFE6] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Home</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF8F5] text-[#1C1917] min-h-screen py-8 sm:py-14 px-3 sm:px-6 lg:px-8 print:bg-white print:p-0 print:m-0">
      {/* Strict 1-Page Print Stylesheet (Mobile & Desktop) */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @page {
              size: A4 portrait;
              margin: 6mm 8mm;
            }
            @media print {
              *, *::before, *::after {
                box-sizing: border-box !important;
              }
              html, body {
                width: 100% !important;
                height: 100% !important;
                max-height: 100% !important;
                margin: 0 !important;
                padding: 0 !important;
                background: #FFFFFF !important;
                color: #000000 !important;
                overflow: hidden !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              header, footer, nav, .print-hide {
                display: none !important;
                visibility: hidden !important;
              }
              body * {
                visibility: hidden !important;
              }
              #printable-voucher, #printable-voucher * {
                visibility: visible !important;
              }
              #printable-voucher {
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                right: 0 !important;
                width: 100% !important;
                max-width: 100% !important;
                margin: 0 !important;
                padding: 12px 16px !important;
                border: 1px solid #D1C7BD !important;
                border-radius: 12px !important;
                background: #FFFFFF !important;
                box-shadow: none !important;
                page-break-inside: avoid !important;
                page-break-before: avoid !important;
                page-break-after: avoid !important;
                break-inside: avoid !important;
              }
              .voucher-flex-row {
                display: flex !important;
                flex-direction: row !important;
                gap: 10px !important;
              }
              .voucher-flex-row > div {
                flex: 1 1 50% !important;
                min-width: 0 !important;
              }
              .voucher-compact-text {
                font-size: 11px !important;
                line-height: 1.3 !important;
              }
              .voucher-header-logo {
                height: 36px !important;
                width: 150px !important;
              }
            }
          `,
        }}
      />

      <div className="max-w-3xl mx-auto space-y-5 print:max-w-none print:m-0 print:space-y-0">
        {/* Success / Pending Alert */}
        <div className="print-hide p-5 sm:p-6 rounded-3xl bg-[#FFFFFF] border border-[#E7E2D9] text-center space-y-3 shadow-sm">
          {reservation.status === "CONFIRMED" ? (
            <>
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 mx-auto flex items-center justify-center border border-emerald-200">
                <CheckCircle className="w-6 h-6 text-emerald-700" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-sans uppercase tracking-widest px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-bold border border-emerald-300">
                  ✓ Official Reservation Confirmed &bull; Guaranteed
                </span>
                <h1 className="font-serif text-2xl sm:text-3xl font-medium text-[#1C1917] pt-1">
                  Booking Confirmed &amp; Guaranteed
                </h1>
              </div>
              <p className="text-xs text-[#57534E] max-w-lg mx-auto font-light leading-relaxed">
                Your reservation reference <strong className="text-[#1C1917] font-sans font-bold">#{reservation.bookingReference}</strong> is officially guaranteed by Hotel Ambarish Grand Residency. Please present this voucher or reference code at the front desk upon check-in.
              </p>
            </>
          ) : reservation.status === "CANCELLED" ? (
            <>
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-700 mx-auto flex items-center justify-center border border-rose-200">
                <AlertCircle className="w-6 h-6 text-rose-700" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-sans uppercase tracking-widest px-3 py-1 rounded-full bg-rose-100 text-rose-900 font-bold border border-rose-300">
                  ✗ Reservation Cancelled
                </span>
                <h1 className="font-serif text-2xl sm:text-3xl font-medium text-[#1C1917] pt-1">
                  Reservation Cancelled / Unavailable
                </h1>
              </div>
              <p className="text-xs text-[#57534E] max-w-lg mx-auto font-light leading-relaxed">
                This booking request could not be accommodated and has been marked as cancelled. Zero charges have been billed.
              </p>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-700 mx-auto flex items-center justify-center border border-amber-200">
                <PhoneCall className="w-6 h-6 text-amber-700" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-sans uppercase tracking-widest px-3 py-1 rounded-full bg-amber-100/80 text-amber-900 font-bold border border-amber-300">
                  Confirmation Pending &bull; Call Verification
                </span>
                <h1 className="font-serif text-2xl sm:text-3xl font-medium text-[#1C1917] pt-1">
                  Booking Request Received
                </h1>
              </div>
              <p className="text-xs text-[#57534E] max-w-lg mx-auto font-light leading-relaxed">
                Thank you for choosing Hotel Ambarish Grand Residency. Your booking request reference is{" "}
                <strong className="text-[#1C1917] font-sans font-bold">{reservation.bookingReference}</strong>. Our front desk team will call you shortly at{" "}
                <strong className="text-[#1C1917]">{reservation.guestPhone}</strong> to verify live room availability and confirm your reservation &amp; payment details over the phone.
              </p>

              {/* Direct Call to Hotel Box */}
              <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E7E2D9] flex flex-col sm:flex-row items-center justify-between gap-3 max-w-lg mx-auto text-xs text-left">
                <div className="space-y-0.5 text-center sm:text-left">
                  <span className="text-[10px] font-sans uppercase tracking-wider text-[#8F6B2A] font-bold block">
                    Prefer Instant Confirmation?
                  </span>
                  <span className="text-[#57534E]">Call our 24/7 Hotel Front Desk directly:</span>
                </div>
                <a
                  href={`tel:${HOTEL_INFO.phoneRaw || HOTEL_INFO.phone}`}
                  className="px-4 py-2 rounded-full bg-[#1C1917] text-white text-xs font-semibold hover:bg-[#8F6B2A] transition-colors flex items-center gap-2 shadow-sm shrink-0"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-[#C29D4C]" />
                  <span>Call {HOTEL_INFO.phone}</span>
                </a>
              </div>
            </>
          )}
        </div>

        {/* Actions Bar */}
        <div className="print-hide flex justify-between items-center gap-3">
          <Link
            href="/"
            className="text-xs uppercase tracking-wider text-[#57534E] hover:text-[#1C1917] flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Return to Home</span>
            <span className="sm:hidden">Home</span>
          </Link>

          <button
            onClick={handlePrint}
            className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-[#1C1917] hover:bg-[#8F6B2A] rounded-full shadow-md flex items-center space-x-2 transition-all active:scale-[0.98]"
          >
            <Printer className="w-4 h-4" />
            <span>Print Voucher / PDF</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* PRINTABLE 1-PAGE VOUCHER CARD */}
        {/* ========================================================================= */}
        <div
          id="printable-voucher"
          className="p-5 sm:p-8 rounded-3xl bg-[#FFFFFF] border border-[#E7E2D9] shadow-md space-y-4 print:p-4 print:space-y-3 print:border print:border-[#E7E2D9] print:shadow-none print:rounded-xl"
        >
          {/* Header */}
          <div className="flex justify-between items-center hairline-b pb-3.5 print:pb-2.5">
            <div className="relative h-10 w-44 sm:h-12 sm:w-48 voucher-header-logo">
              <Image
                src="/images/logo.png"
                alt="Hotel Ambarish Grand Residency by Divine View"
                fill
                sizes="192px"
                className="object-contain object-left"
                priority
              />
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-sans tracking-widest text-[#8F6B2A] block font-semibold">
                Booking Reference
              </span>
              <strong className="font-sans text-base sm:text-lg font-bold text-[#1C1917]">
                {reservation.bookingReference || reference}
              </strong>
            </div>
          </div>

          {/* Guest & Stay Details (2-Column Flex in Print to prevent vertical stacking) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs voucher-flex-row print:gap-2.5">
            {/* Guest Details */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-[#FAF8F5] border border-[#E7E2D9] space-y-1.5 print:p-2.5 print:rounded-xl">
              <span className="font-semibold text-[10px] uppercase text-[#8F6B2A] block tracking-wider">
                Guest &amp; Corporate Details
              </span>
              <p className="font-medium text-sm text-[#1C1917] capitalize">{reservation.guestName}</p>
              <p className="text-[#57534E] voucher-compact-text">Phone: {reservation.guestPhone}</p>
              <p className="text-[#57534E] voucher-compact-text truncate">Email: {reservation.guestEmail}</p>
              {(reservation.companyName || reservation.b2b?.companyName) && (
                <div className="pt-1.5 border-t border-[#E7E2D9] text-[11px] voucher-compact-text">
                  <p className="font-semibold text-[#1C1917]">🏢 {reservation.companyName || reservation.b2b?.companyName}</p>
                  {reservation.guestGstin && (
                    <p className="font-sans font-semibold text-[#8F6B2A]">GSTIN: {reservation.guestGstin}</p>
                  )}
                </div>
              )}
            </div>

            {/* Stay & Room Details */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-[#FAF8F5] border border-[#E7E2D9] space-y-1.5 print:p-2.5 print:rounded-xl">
              <span className="font-semibold text-[10px] uppercase text-[#8F6B2A] block tracking-wider">
                Stay &amp; Reserved Rooms
              </span>
              {reservation.bookedRooms && reservation.bookedRooms.length > 0 ? (
                <div className="space-y-1 pb-1">
                  {reservation.bookedRooms.map((rm, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs voucher-compact-text">
                      <div>
                        <span className="font-medium text-[#1C1917]">{rm.quantity}&times; {rm.roomName}</span>
                        <span className="text-[10px] text-[#78716C] block">{rm.ratePlanName}</span>
                      </div>
                      <span className="font-sans text-[#8F6B2A] font-semibold">
                        {formatCurrencyINR((rm.pricePerNight || 0) * (rm.quantity || 1))}/n
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="voucher-compact-text">
                  <p className="font-medium text-sm text-[#1C1917]">{reservation.roomName || "Double Deluxe Room"}</p>
                  <p className="text-[#8F6B2A] font-semibold">{reservation.ratePlanName || "Standard Rate"}</p>
                </div>
              )}

              <p className="text-[#57534E] text-xs pt-1 border-t border-[#E7E2D9] voucher-compact-text">
                {reservation.checkIn} &rarr; {reservation.checkOut} ({reservation.nights || 1} {(reservation.nights || 1) === 1 ? "Night" : "Nights"})
              </p>

              {/* Official Hotel Policy Times */}
              <div className="space-y-1 pt-1 border-t border-[#E7E2D9]/60 text-[11px] voucher-compact-text">
                <div className="flex items-center justify-between text-[#78716C]">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#8F6B2A]" />
                    Check-in: <strong className="text-[#1C1917]">12:00 PM</strong>
                  </span>
                  <span>
                    Check-out: <strong className="text-[#1C1917]">12:00 PM</strong>
                  </span>
                </div>
                <p className="text-[10px] text-[#8F6B2A] font-medium">
                  Free Early Check-in available from 05:00 AM onwards (no extra charge, subject to availability).
                </p>
              </div>
            </div>
          </div>

          {/* Pricing Summary */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-[#FAF8F5] border border-[#E7E2D9] space-y-2 text-xs print:p-2.5 print:rounded-xl">
            <div className="text-[10px] font-sans uppercase tracking-widest text-[#8F6B2A] font-bold pb-1 border-b border-[#E7E2D9] flex justify-between items-center">
              <span>Detailed Tariff &amp; Price Breakup</span>
              <span>{reservation.rooms || 1} Room(s) &bull; {reservation.nights || 1} {(reservation.nights || 1) === 1 ? "Night" : "Nights"}</span>
            </div>

            {/* Base Room Tariff */}
            <div className="flex justify-between text-[#57534E] voucher-compact-text">
              <span>Base Room Tariff:</span>
              <span className="font-medium text-[#1C1917]">{formatCurrencyINR(reservation.baseAmount || 0)}</span>
            </div>

            {/* Promo / Discount Line */}
            {(reservation.discountAmount || 0) > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold voucher-compact-text">
                <span>Special Promo Discount {reservation.promoCode ? `(${reservation.promoCode})` : ""}:</span>
                <span>-{formatCurrencyINR(reservation.discountAmount || 0)}</span>
              </div>
            )}

            {/* Net Taxable Subtotal */}
            {(reservation.discountAmount || 0) > 0 && (
              <div className="flex justify-between text-[#78716C] text-[11px] voucher-compact-text">
                <span>Net Taxable Room Tariff:</span>
                <span>{formatCurrencyINR((reservation.baseAmount || 0) - (reservation.discountAmount || 0))}</span>
              </div>
            )}

            {/* Taxes */}
            <div className="flex justify-between text-[#57534E] voucher-compact-text">
              <span>Taxes (GST 12% SAC 996311):</span>
              <span className="font-medium text-[#1C1917]">{formatCurrencyINR(reservation.taxAmount || 0)}</span>
            </div>

            {/* Grand Total */}
            <div className="pt-1.5 hairline-t flex justify-between items-baseline font-bold text-sm text-[#1C1917]">
              <span>Total Amount Payable</span>
              <span className="font-serif text-base sm:text-lg text-[#8F6B2A]">
                {formatCurrencyINR(reservation.totalAmount || 0)}
              </span>
            </div>

            {/* Payment & Booking Status Badge */}
            <div className="pt-1.5 border-t border-[#E7E2D9] flex justify-between items-center text-[11px] voucher-compact-text">
              <span className="text-[#78716C]">Payment &amp; Booking Status:</span>
              <div className="text-right">
                {reservation.status === "CONFIRMED" ? (
                  <div>
                    <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                      ✓ Confirmed &amp; Guaranteed {reservation.paymentMethod === "RAZORPAY" ? "(Paid Online)" : "(Pay at Hotel)"}
                    </span>
                    <span className="block text-[10px] text-emerald-700 mt-0.5">
                      {reservation.paymentMethod === "RAZORPAY"
                        ? `Payment settled via Razorpay (Ref: ${reservation.paymentId || "Online"})`
                        : `Guaranteed by Front Desk • Pay ${formatCurrencyINR(reservation.totalAmount || 0)} at check-in`}
                    </span>
                  </div>
                ) : reservation.status === "CANCELLED" ? (
                  <div>
                    <span className="px-2.5 py-0.5 rounded-md bg-rose-100 text-rose-800 font-bold border border-rose-300">
                      ✗ Cancelled / Unavailable
                    </span>
                    <span className="block text-[10px] text-rose-600 mt-0.5">
                      Reservation cancelled • Zero charges billed
                    </span>
                  </div>
                ) : reservation.paymentMethod === "RAZORPAY" ? (
                  <div>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                      ✓ Paid Online (Razorpay)
                    </span>
                    {reservation.paymentId && (
                      <span className="block font-sans text-[10px] text-[#78716C] mt-0.5">
                        Ref: {reservation.paymentId}
                      </span>
                    )}
                  </div>
                ) : (
                  <div>
                    <span className="px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-800 font-bold border border-amber-300">
                      ⏳ Confirmation Pending (Pay at Hotel)
                    </span>
                    <span className="block text-[10px] text-[#78716C] mt-0.5">
                      Front desk will call to verify availability &bull; Advance payment may be requested on call
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* QR Code & Front Desk Footer */}
          <div className="pt-2.5 hairline-t flex justify-between items-center text-xs text-[#78716C] print:pt-2">
            <div className="flex items-center space-x-2">
              <div className="p-1 bg-[#FAF8F5] rounded-lg border border-[#E7E2D9] text-[#1C1917]">
                <QrCode className="w-7 h-7 print:w-5 print:h-5" />
              </div>
              <span className="text-[11px] voucher-compact-text">
                Present voucher at front desk for express check-in
              </span>
            </div>

            <div className="text-right voucher-compact-text">
              <span className="block font-medium text-[#1C1917]">Hotel Helpdesk</span>
              <span className="font-sans font-semibold text-xs">{HOTEL_INFO.phone}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 border-2 border-[#8F6B2A] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-medium text-[#78716C]">Loading your secure reservation voucher...</p>
          </div>
        </div>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}
