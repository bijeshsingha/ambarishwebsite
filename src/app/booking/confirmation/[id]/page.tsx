"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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
} from "lucide-react";
import { HOTEL_INFO } from "@/data/hotel-info";
import { ReservationData } from "@/lib/hotel-os-client";
import { formatCurrencyINR } from "@/lib/formatters";

export default function ConfirmationPage() {
  const params = useParams();
  const reference = (params?.id as string) || "";

  const [reservation, setReservation] = useState<ReservationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!reference) {
      setLoading(false);
      setNotFound(true);
      return;
    }

    // 1. Check local session cache first for instant render
    let cachedRes: ReservationData | null = null;
    if (typeof window !== "undefined") {
      try {
        const stored = sessionStorage.getItem(`hag_res_${reference}`);
        if (stored) {
          cachedRes = JSON.parse(stored);
          setReservation(cachedRes);
          setLoading(false);
        }
      } catch {
        // Ignore JSON or session errors
      }
    }

    // 2. Query official server API
    async function fetchReservation() {
      try {
        const res = await fetch(`/api/v1/reservations?reference=${encodeURIComponent(reference)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.reservation) {
            setReservation(data.reservation);
            setNotFound(false);
            return;
          }
        }
        
        // If not in API and not in session cache, mark not found
        if (!cachedRes) {
          setNotFound(true);
        }
      } catch (err) {
        console.error("Failed to load reservation from server:", err);
        if (!cachedRes) {
          setNotFound(true);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchReservation();
  }, [reference]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center text-[#1A1715]">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#A27520] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-light text-[#787069]">Loading confirmed voucher...</p>
        </div>
      </div>
    );
  }

  if (notFound || !reservation) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] py-20 px-4 sm:px-6 text-[#1A1715] flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-[#E6DED3] text-center shadow-sm space-y-5">
          <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-700 mx-auto flex items-center justify-center">
            <AlertCircle className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <h1 className="font-serif text-2xl font-normal text-[#1A1715]">Reservation Lookup</h1>
            <p className="text-xs text-[#787069]">
              We could not find active records for reference{" "}
              <strong className="font-mono text-[#A27520]">{reference}</strong>.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#EDE7DE] text-left text-xs space-y-2 text-[#4A443F]">
            <p>If you recently placed this booking:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Check your email inbox for the booking confirmation.</li>
              <li>Or contact our 24/7 hotel front desk with your phone number.</li>
            </ul>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <a
              href={`tel:${HOTEL_INFO.phone}`}
              className="w-full py-2.5 px-4 bg-[#1A1715] text-white rounded-full text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#A27520] transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Call Front Desk ({HOTEL_INFO.phone})</span>
            </a>
            <Link
              href="/"
              className="w-full py-2.5 px-4 bg-[#FAF7F2] text-[#1A1715] border border-[#EDE7DE] rounded-full text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#EDE7DE] transition-colors"
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
    <div className="bg-[#FAF7F2] text-[#1A1715] min-h-screen py-8 sm:py-14 px-3 sm:px-6 lg:px-8 print:bg-white print:p-0 print:m-0">
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
        {/* Success Alert */}
        <div className="print-hide p-5 sm:p-6 rounded-3xl bg-[#FFFFFF] border border-[#E6DED3] text-center space-y-2 shadow-sm">
          <div className="w-11 h-11 rounded-full bg-emerald-50 text-emerald-700 mx-auto flex items-center justify-center">
            <CheckCircle className="w-6 h-6" />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-normal text-[#1A1715]">
            Booking Confirmed &amp; Guaranteed
          </h1>
          <p className="text-xs text-[#787069] max-w-md mx-auto font-light leading-relaxed">
            Your reservation reference is confirmed. An email copy has been sent to{" "}
            <strong className="text-[#1A1715]">{reservation.guestEmail}</strong>.
          </p>
        </div>

        {/* Actions Bar */}
        <div className="print-hide flex justify-between items-center gap-3">
          <Link
            href="/"
            className="text-xs uppercase tracking-wider text-[#4A443F] hover:text-[#1A1715] flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Return to Home</span>
            <span className="sm:hidden">Home</span>
          </Link>

          <button
            onClick={handlePrint}
            className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-[#1A1715] hover:bg-[#A27520] rounded-full shadow-md flex items-center space-x-2 transition-all active:scale-[0.98]"
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
          className="p-5 sm:p-8 rounded-3xl bg-[#FFFFFF] border border-[#E6DED3] shadow-md space-y-4 print:p-4 print:space-y-3 print:border print:border-[#E6DED3] print:shadow-none print:rounded-xl"
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
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#A27520] block font-semibold">
                Booking Reference
              </span>
              <strong className="font-mono text-base sm:text-lg font-bold text-[#1A1715]">
                {reservation.bookingReference || reference}
              </strong>
            </div>
          </div>

          {/* Guest & Stay Details (2-Column Flex in Print to prevent vertical stacking) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs voucher-flex-row print:gap-2.5">
            {/* Guest Details */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-[#FAF7F2] border border-[#EDE7DE] space-y-1.5 print:p-2.5 print:rounded-xl">
              <span className="font-semibold text-[10px] uppercase text-[#A27520] block tracking-wider">
                Guest &amp; Corporate Details
              </span>
              <p className="font-medium text-sm text-[#1A1715] capitalize">{reservation.guestName}</p>
              <p className="text-[#4A443F] voucher-compact-text">Phone: {reservation.guestPhone}</p>
              <p className="text-[#4A443F] voucher-compact-text truncate">Email: {reservation.guestEmail}</p>
              {(reservation.companyName || reservation.b2b?.companyName) && (
                <div className="pt-1.5 border-t border-[#EDE7DE] text-[11px] voucher-compact-text">
                  <p className="font-semibold text-[#1A1715]">🏢 {reservation.companyName || reservation.b2b?.companyName}</p>
                  {reservation.guestGstin && (
                    <p className="font-mono text-[#A27520]">GSTIN: {reservation.guestGstin}</p>
                  )}
                </div>
              )}
            </div>

            {/* Stay & Room Details */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-[#FAF7F2] border border-[#EDE7DE] space-y-1.5 print:p-2.5 print:rounded-xl">
              <span className="font-semibold text-[10px] uppercase text-[#A27520] block tracking-wider">
                Stay &amp; Reserved Rooms
              </span>
              {reservation.bookedRooms && reservation.bookedRooms.length > 0 ? (
                <div className="space-y-1 pb-1">
                  {reservation.bookedRooms.map((rm, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs voucher-compact-text">
                      <div>
                        <span className="font-medium text-[#1A1715]">{rm.quantity}&times; {rm.roomName}</span>
                        <span className="text-[10px] text-[#787069] block">{rm.ratePlanName}</span>
                      </div>
                      <span className="font-mono text-[#A27520] font-semibold">
                        {formatCurrencyINR((rm.pricePerNight || 0) * (rm.quantity || 1))}/n
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="voucher-compact-text">
                  <p className="font-medium text-sm text-[#1A1715]">{reservation.roomName || "Double Deluxe Room"}</p>
                  <p className="text-[#A27520] font-semibold">{reservation.ratePlanName || "Standard Rate"}</p>
                </div>
              )}

              <p className="text-[#4A443F] text-xs pt-1 border-t border-[#EDE7DE] voucher-compact-text">
                {reservation.checkIn} &rarr; {reservation.checkOut} ({reservation.nights} {reservation.nights === 1 ? "Night" : "Nights"})
              </p>

              {/* Official Hotel Policy Times */}
              <div className="flex items-center justify-between text-[11px] text-[#787069] pt-1 border-t border-[#EDE7DE]/60 voucher-compact-text">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#A27520]" />
                  Check-in: <strong className="text-[#1A1715]">11:00 AM</strong>
                </span>
                <span>
                  Check-out: <strong className="text-[#1A1715]">12:00 PM</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Pricing Summary */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-[#FAF7F2] border border-[#EDE7DE] space-y-1.5 text-xs print:p-2.5 print:rounded-xl">
            <div className="flex justify-between text-[#4A443F] voucher-compact-text">
              <span>Base Room Tariff:</span>
              <span>{formatCurrencyINR(reservation.baseAmount || 0)}</span>
            </div>
            {reservation.promoCode && (reservation.discountAmount || 0) > 0 && (
              <div className="flex justify-between text-emerald-700 font-medium voucher-compact-text">
                <span>Promo Discount ({reservation.promoCode}):</span>
                <span>-{formatCurrencyINR(reservation.discountAmount || 0)}</span>
              </div>
            )}
            <div className="flex justify-between text-[#4A443F] voucher-compact-text">
              <span>Taxes (GST SAC 996311):</span>
              <span>{formatCurrencyINR(reservation.taxAmount || 0)}</span>
            </div>
            <div className="pt-1.5 hairline-t flex justify-between items-baseline font-bold text-sm text-[#1A1715]">
              <span>Grand Total</span>
              <span className="font-serif text-base sm:text-lg text-[#A27520]">
                {formatCurrencyINR(reservation.totalAmount || 0)}
              </span>
            </div>
            <div className="pt-1.5 border-t border-[#EDE7DE] flex justify-between items-center text-[11px] voucher-compact-text">
              <span className="text-[#787069]">Payment Mode &amp; Status:</span>
              <div className="text-right">
                {reservation.paymentMethod === "RAZORPAY" ? (
                  <div>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                      ✓ Paid Online (Razorpay)
                    </span>
                    {reservation.paymentId && (
                      <span className="block font-mono text-[10px] text-[#787069] mt-0.5">
                        Ref: {reservation.paymentId}
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 font-bold border border-amber-200">
                    Pay at Hotel (Front Desk Settlement)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* QR Code & Front Desk Footer */}
          <div className="pt-2.5 hairline-t flex justify-between items-center text-xs text-[#787069] print:pt-2">
            <div className="flex items-center space-x-2">
              <div className="p-1 bg-[#FAF7F2] rounded-lg border border-[#EDE7DE] text-[#1A1715]">
                <QrCode className="w-7 h-7 print:w-5 print:h-5" />
              </div>
              <span className="text-[11px] voucher-compact-text">
                Present voucher at front desk for express check-in
              </span>
            </div>

            <div className="text-right voucher-compact-text">
              <span className="block font-medium text-[#1A1715]">Hotel Helpdesk</span>
              <span className="font-mono text-xs">{HOTEL_INFO.phone}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
