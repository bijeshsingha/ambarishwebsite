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

    // 2. Query official server / PMS gateway
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
            <p>If you recently made this booking, please note:</p>
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
    <div className="bg-[#FAF7F2] text-[#1A1715] min-h-screen py-10 sm:py-14 px-4 sm:px-6 lg:px-8 print:bg-white print:p-0 print:min-h-0 print:py-0 print:px-0">
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media print {
              @page {
                size: A4 portrait;
                margin: 8mm 10mm;
              }
              html, body {
                background: #FFFFFF !important;
                color: #000000 !important;
                margin: 0 !important;
                padding: 0 !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                height: auto !important;
                overflow: visible !important;
              }
              .print-voucher-card {
                page-break-after: avoid !important;
                page-break-inside: avoid !important;
                break-inside: avoid !important;
                margin: 0 auto !important;
                max-width: 100% !important;
                box-shadow: none !important;
              }
            }
          `,
        }}
      />
      <div className="max-w-3xl mx-auto space-y-6 print:max-w-none print:m-0 print:space-y-0">
        {/* Success Alert */}
        <div className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#E6DED3] text-center space-y-2 shadow-sm print:hidden">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 mx-auto flex items-center justify-center">
            <CheckCircle className="w-6 h-6" />
          </div>
          <h1 className="font-serif text-3xl font-normal text-[#1A1715]">
            Booking Confirmed &amp; Guaranteed
          </h1>
          <p className="text-xs text-[#787069] max-w-md mx-auto font-light">
            Your reservation has been registered in the hotel Property Management System.
          </p>
        </div>

        {/* Actions Bar */}
        <div className="flex justify-between items-center print:hidden">
          <Link
            href="/"
            className="text-xs uppercase tracking-wider text-[#4A443F] hover:text-[#1A1715] flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Home</span>
          </Link>

          <button
            onClick={handlePrint}
            className="px-5 py-2 text-xs font-bold uppercase tracking-wider text-white bg-[#1A1715] hover:bg-[#A27520] rounded-full shadow-md flex items-center space-x-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Voucher / PDF</span>
          </button>
        </div>

        {/* Printable Voucher Card */}
        <div className="print-voucher-card p-6 sm:p-10 rounded-3xl bg-[#FFFFFF] border border-[#E6DED3] shadow-md space-y-5 print:p-5 print:space-y-3.5 print:border print:border-[#E6DED3] print:shadow-none print:rounded-2xl">
          {/* Header */}
          <div className="flex justify-between items-center hairline-b pb-4 print:pb-2.5">
            <div className="relative h-10 w-44 sm:h-12 sm:w-48 print:h-9 print:w-40">
              <Image
                src="/images/logo.png"
                alt="Hotel Ambarish Grand Residency by Divine View"
                fill
                sizes="192px"
                className="object-contain object-left"
              />
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#A27520] block">
                Booking Reference
              </span>
              <strong className="font-mono text-base font-bold text-[#1A1715]">
                {reservation.bookingReference || reference}
              </strong>
            </div>
          </div>

          {/* Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs print:grid-cols-2 print:gap-3">
            <div className="p-3.5 sm:p-4 rounded-2xl bg-[#FAF7F2] border border-[#EDE7DE] space-y-1.5 print:p-2.5 print:rounded-xl">
              <span className="font-semibold text-[10px] uppercase text-[#A27520] block">Guest &amp; Corporate Details</span>
              <p className="font-medium text-sm text-[#1A1715] capitalize">{reservation.guestName}</p>
              <p className="text-[#4A443F]">Phone: {reservation.guestPhone}</p>
              <p className="text-[#4A443F]">Email: {reservation.guestEmail}</p>
              {(reservation.companyName || reservation.b2b?.companyName) && (
                <div className="pt-1.5 border-t border-[#EDE7DE] text-[11px]">
                  <p className="font-semibold text-[#1A1715]">🏢 {reservation.companyName || reservation.b2b?.companyName}</p>
                  {reservation.guestGstin && (
                    <p className="font-mono text-[#A27520]">GSTIN: {reservation.guestGstin}</p>
                  )}
                </div>
              )}
            </div>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-[#FAF7F2] border border-[#EDE7DE] space-y-1.5 print:p-2.5 print:rounded-xl">
              <span className="font-semibold text-[10px] uppercase text-[#A27520] block">Stay &amp; Reserved Rooms</span>
              {reservation.bookedRooms && reservation.bookedRooms.length > 0 ? (
                <div className="space-y-1 pb-1">
                  {reservation.bookedRooms.map((rm, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs">
                      <div>
                        <span className="font-medium text-[#1A1715]">{rm.quantity}&times; {rm.roomName}</span>
                        <span className="text-[10px] text-[#787069] block">{rm.ratePlanName}</span>
                      </div>
                      <span className="font-mono text-[#A27520] font-semibold">{formatCurrencyINR((rm.pricePerNight || 0) * (rm.quantity || 1))}/n</span>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <p className="font-medium text-sm text-[#1A1715]">{reservation.roomName || "Double Deluxe Room"}</p>
                  <p className="text-[#A27520] font-semibold">{reservation.ratePlanName || "Standard Rate"}</p>
                </>
              )}
              <p className="text-[#4A443F] text-xs pt-1 border-t border-[#EDE7DE]">
                {reservation.checkIn} &rarr; {reservation.checkOut} ({reservation.nights} {reservation.nights === 1 ? "Night" : "Nights"})
              </p>
              <div className="text-[11px] font-semibold text-[#1A1715]">
                <span>Total: {reservation.rooms || 1} {((reservation.rooms || 1) === 1) ? "Room" : "Rooms"} • {reservation.adults || 2} Guests</span>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-[#FAF7F2] border border-[#EDE7DE] space-y-1.5 text-xs print:p-2.5 print:rounded-xl">
            <div className="flex justify-between text-[#4A443F]">
              <span>Base Tariff:</span>
              <span>{formatCurrencyINR(reservation.baseAmount || 0)}</span>
            </div>
            {reservation.promoCode && (reservation.discountAmount || 0) > 0 && (
              <div className="flex justify-between text-emerald-700 font-medium">
                <span>Promo Discount ({reservation.promoCode}):</span>
                <span>-{formatCurrencyINR(reservation.discountAmount || 0)}</span>
              </div>
            )}
            <div className="flex justify-between text-[#4A443F]">
              <span>Taxes (GST SAC 996311):</span>
              <span>{formatCurrencyINR(reservation.taxAmount || 0)}</span>
            </div>
            <div className="pt-1.5 hairline-t flex justify-between items-baseline font-bold text-sm text-[#1A1715]">
              <span>Grand Total</span>
              <span className="font-serif text-base sm:text-lg text-[#A27520]">
                {formatCurrencyINR(reservation.totalAmount || 0)}
              </span>
            </div>
          </div>

          {/* QR Code & Helpdesk */}
          <div className="pt-3 hairline-t flex justify-between items-center text-xs text-[#787069] print:pt-2">
            <div className="flex items-center space-x-2.5">
              <div className="p-1 bg-[#FAF7F2] rounded-lg border border-[#EDE7DE] text-[#1A1715]">
                <QrCode className="w-8 h-8 print:w-6 print:h-6" />
              </div>
              <span className="text-[11px]">Present at front desk for instant express check-in</span>
            </div>

            <div className="text-right">
              <span className="block font-medium text-[#1A1715]">Hotel Helpdesk</span>
              <span className="font-mono text-xs">{HOTEL_INFO.phone}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
