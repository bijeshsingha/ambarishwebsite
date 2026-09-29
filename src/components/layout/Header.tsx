"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Phone,
  Menu,
  X,
  ArrowUpRight,
  Calendar,
  ShieldCheck,
  Tag,
  Clock,
  Sparkles,
  MapPin,
} from "lucide-react";
import { HOTEL_INFO } from "@/data/hotel-info";
import { getTodayDate, getTomorrowDate, formatCurrencyINR } from "@/lib/formatters";
import { ROOMS } from "@/data/rooms";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const isCheckoutOrConfirmation =
    pathname?.startsWith("/checkout") ||
    pathname?.startsWith("/booking/confirmation");

  const [isScrolled, setIsScrolled] = useState(false);
  const [showScrollDock, setShowScrollDock] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showQuickBookModal, setShowQuickBookModal] = useState(false);

  // Quick Book State
  const [checkIn, setCheckIn] = useState(getTodayDate());
  const [checkOut, setCheckOut] = useState(getTomorrowDate());
  const [adults, setAdults] = useState("2");
  const [roomsCount, setRoomsCount] = useState("1");
  const [selectedRoomSlug, setSelectedRoomSlug] = useState("deluxe-room");
  const [customPromo, setCustomPromo] = useState("");

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          setIsScrolled(scrollY > 24);
          setShowScrollDock(scrollY > 300);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen || showQuickBookModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen, showQuickBookModal]);

  const navLinks = [
    { label: "Rooms & Suites", href: "/rooms" },
    { label: "Dining & Bar", href: "/dining" },
    { label: "Banquets", href: "/meetings-events" },
    { label: "Special Offers", href: "/booking" },
    { label: "Gallery", href: "/gallery" },
    { label: "Location", href: "/location" },
  ];

  const handleQuickBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowQuickBookModal(false);
    const query = new URLSearchParams({
      room: selectedRoomSlug,
      plan: "EP",
      checkIn,
      checkOut,
      adults,
      rooms: roomsCount,
      ...(customPromo.trim() ? { promo: customPromo.trim().toUpperCase() } : {}),
    });
    router.push(`/checkout?${query.toString()}`);
  };

  return (
    <>
      {/* 1. Ultra-Refined Top Micro Strip */}
      <div className="bg-[#141211] border-b border-[#8F6B2A]/20 py-1.5 px-4 text-center text-[11px] sm:text-xs text-[#FAF8F5] flex items-center justify-center gap-2 sm:gap-4 flex-wrap z-50 relative select-none">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#8F6B2A]/30 to-[#B3863E]/20 text-[#EADBCA] border border-[#8F6B2A]/35 text-[10px] uppercase tracking-widest font-semibold shadow-[0_1px_4px_rgba(0,0,0,0.25)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
          <span>Direct Privilege</span>
        </div>
        <span className="font-normal text-[#FAF8F5]/90 tracking-wide text-[11.5px]">
          Free Early Check-in from <strong className="text-[#D4AF37] font-medium">5:00 AM onwards</strong> with zero extra charge!
        </span>
        <span className="hidden md:inline text-[#8F6B2A]/40">•</span>
        <span className="hidden md:inline text-[#FAF8F5]/70 text-[11px] tracking-wide">
          Standard Check-in &amp; Check-out: <strong className="text-[#FAF8F5]/90 font-medium">12:00 Noon</strong>
        </span>
      </div>

      {/* 2. Main Ultra-Luxury Floating Glass Header */}
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isScrolled
            ? "bg-white/90 backdrop-blur-2xl border-b border-[#8F6B2A]/20 shadow-[0_12px_32px_-4px_rgba(28,25,23,0.08),0_2px_6px_-1px_rgba(28,25,23,0.03)] py-2 sm:py-2.5"
            : "bg-[#FAF8F5]/85 backdrop-blur-xl border-b border-[#E7E2D9]/75 py-3 sm:py-3.5"
        }`}
      >
        {/* Subtle top rim light sheen */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 lg:gap-8">
          {/* Brand Logo */}
          <Link
            href="/"
            className="flex items-center group shrink-0"
            aria-label="Hotel Ambarish Grand Residency Home"
          >
            <div className="relative h-10 w-40 sm:h-11 sm:w-44 lg:h-11 lg:w-48 xl:h-12 xl:w-52 transition-transform duration-300 group-hover:scale-[1.02]">
              <Image
                src="/images/logo.png"
                alt="Hotel Ambarish Grand Residency by Divine View"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
          </Link>

          {/* Center: Editorial Luxury Navigation Links */}
          <nav className="hidden lg:flex items-center justify-center space-x-1 xl:space-x-1.5 flex-1">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href.includes("corporate") && pathname === "/booking");
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`text-[11.5px] xl:text-[12.5px] tracking-[0.16em] uppercase font-medium transition-all duration-200 py-1.5 px-3 xl:px-3.5 rounded-full relative group whitespace-nowrap ${
                    isActive
                      ? "text-[#8F6B2A] font-semibold bg-[#8F6B2A]/[0.08]"
                      : "text-[#44403C] hover:text-[#1C1917] hover:bg-[#8F6B2A]/[0.05]"
                  }`}
                >
                  <span className="relative z-10">{link.label}</span>
                  {isActive ? (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#8F6B2A] shadow-[0_0_6px_rgba(143,107,42,0.45)]" />
                  ) : (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#8F6B2A]/0 group-hover:bg-[#8F6B2A]/40 transition-all duration-200" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right: Front Desk Capsule & Luxury Pill Book CTA */}
          <div className="hidden sm:flex items-center space-x-3 shrink-0">
            {/* Front Desk Hotline Capsule */}
            <a
              href={`tel:${HOTEL_INFO.phoneRaw}`}
              className="group px-3.5 py-1.5 rounded-full text-xs font-medium text-[#44403C] hover:text-[#1C1917] bg-white/70 hover:bg-[#FAF5EB] border border-[#E7E2D9] hover:border-[#8F6B2A]/40 transition-all duration-200 flex items-center whitespace-nowrap shadow-sm"
              aria-label="Call front desk"
            >
              <div className="w-5 h-5 rounded-full bg-[#8F6B2A]/10 flex items-center justify-center mr-2 text-[#8F6B2A] group-hover:scale-110 group-hover:bg-[#8F6B2A]/20 transition-all duration-200">
                <Phone className="w-2.5 h-2.5 text-[#8F6B2A]" />
              </div>
              <span className="tracking-wide text-[11.5px] font-semibold">{HOTEL_INFO.phone}</span>
            </a>

            {/* Primary Book Direct Pill CTA */}
            <Link
              href="/booking"
              className="group relative inline-flex items-center justify-center gap-1.5 px-5 py-2 rounded-full text-xs font-semibold tracking-wider text-white bg-gradient-to-r from-[#8F6B2A] via-[#A07931] to-[#8F6B2A] bg-[length:200%_auto] hover:bg-right shadow-[inset_0_1px_1px_rgba(255,255,255,0.35),0_4px_14px_rgba(143,107,42,0.28)] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.45),0_6px_20px_rgba(143,107,42,0.38)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 whitespace-nowrap"
            >
              <span>Book Direct</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
            </Link>
          </div>

          {/* Mobile Menu Trigger & Quick Book */}
          <div className="flex lg:hidden items-center space-x-2">
            {!isCheckoutOrConfirmation && (
              <button
                onClick={() => setShowQuickBookModal(true)}
                className="px-3.5 py-1.5 text-xs font-semibold tracking-wider rounded-full bg-gradient-to-r from-[#8F6B2A] to-[#A07931] text-white shadow-sm sm:hidden hover:opacity-95 transition-opacity"
              >
                Book
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-9 h-9 rounded-full flex items-center justify-center text-[#1C1917] hover:text-[#8F6B2A] transition-colors bg-white/80 border border-[#E7E2D9] shadow-sm hover:border-[#8F6B2A]/40"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4 text-[#8F6B2A]" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* 3. Floating Action Dock (Desktop & Tablet) */}
      <div
        className={`hidden sm:block fixed bottom-6 right-6 lg:bottom-8 lg:right-8 z-40 transition-all duration-300 ease-out transform ${
          showScrollDock
            ? "translate-y-0 opacity-100 scale-100 pointer-events-auto"
            : "translate-y-8 opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <div className="flex items-center gap-2 p-1.5 rounded-full bg-white/90 backdrop-blur-xl border border-[#E7E2D9] shadow-[0_12px_36px_rgba(28,25,23,0.12)] text-[#1C1917]">
          <button
            onClick={() => setShowQuickBookModal(true)}
            className="px-4 py-2 rounded-full text-xs font-semibold tracking-wider flex items-center space-x-2 text-white bg-gradient-to-r from-[#8F6B2A] via-[#A07931] to-[#8F6B2A] shadow-sm hover:opacity-95 transition-opacity"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Check Rates &amp; Book</span>
            <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
          </button>

          <a
            href={`tel:${HOTEL_INFO.phoneRaw}`}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-[#FAF5EB] hover:bg-[#F4EFE6] text-[#8F6B2A] border border-[#E7E2D9] transition-all shadow-sm"
            title="Call Front Desk 24/7"
            aria-label="Call Front Desk"
          >
            <Phone className="w-3.5 h-3.5 text-[#8F6B2A]" />
          </a>
        </div>
      </div>

      {/* 4. Quick Reservation Modal */}
      {showQuickBookModal && !isCheckoutOrConfirmation && (
        <div className="fixed inset-0 z-[110] bg-[#1C1917]/65 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-[#FFFFFF] text-[#1C1917] rounded-t-3xl sm:rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto p-5 sm:p-7 space-y-5 shadow-2xl border border-[#E7E2D9] relative animate-fade-in">
            {/* Mobile Sheet Grab Handle */}
            <div className="w-10 h-1 rounded-full bg-[#1C1917]/15 mx-auto -mt-1 mb-2 sm:hidden" />

            {/* Modal Header */}
            <div className="flex justify-between items-start border-b border-[#E7E2D9] pb-3.5">
              <div>
                <span className="text-[10px] font-sans font-semibold tracking-widest text-[#8F6B2A] uppercase block">
                  Best Direct Rate Guarantee
                </span>
                <h3 className="font-serif text-2xl font-medium text-[#1C1917] mt-0.5">
                  Quick Reservation
                </h3>
              </div>
              <button
                onClick={() => setShowQuickBookModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#FAF5EB] text-[#78716C] transition-colors border border-transparent hover:border-[#E7E2D9]"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Booking Form */}
            <form onSubmit={handleQuickBookSubmit} className="space-y-4 text-xs">
              {/* Hotel Check-in Policy Banner */}
              <div className="flex flex-wrap items-center justify-between gap-1 text-[11px] text-[#8F6B2A] bg-[#FAF5EB] border border-[#DFD5C0] px-3.5 py-2.5 rounded-xl">
                <span>Check-in: <strong>12:00 PM</strong></span>
                <span>•</span>
                <span>Check-out: <strong>12:00 PM</strong></span>
                <span>•</span>
                <span className="text-emerald-800 font-semibold">Free 5 AM Early Check-in</span>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-semibold text-[#78716C]">Check-In</label>
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
                    className="w-full p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E7E2D9] text-xs font-semibold text-[#1C1917] focus:outline-none focus:border-[#8F6B2A]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-semibold text-[#78716C]">Check-Out</label>
                  <input
                    type="date"
                    min={checkIn || getTodayDate()}
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E7E2D9] text-xs font-semibold text-[#1C1917] focus:outline-none focus:border-[#8F6B2A]"
                  />
                </div>
              </div>

              {/* Room Choice */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-semibold text-[#78716C]">Select Room Category</label>
                <select
                  value={selectedRoomSlug}
                  onChange={(e) => setSelectedRoomSlug(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E7E2D9] text-xs font-semibold text-[#1C1917] focus:outline-none focus:border-[#8F6B2A] cursor-pointer"
                >
                  {ROOMS.map((r) => (
                    <option key={r.id} value={r.slug}>
                      {r.name} • {r.bedType} (From {formatCurrencyINR(r.basePrice)}/night)
                    </option>
                  ))}
                </select>
              </div>

              {/* Rooms & Guests */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-semibold text-[#78716C]">Rooms Count</label>
                  <select
                    value={roomsCount}
                    onChange={(e) => setRoomsCount(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E7E2D9] text-xs font-semibold text-[#1C1917] focus:outline-none focus:border-[#8F6B2A] cursor-pointer"
                  >
                    <option value="1">1 Room</option>
                    <option value="2">2 Rooms</option>
                    <option value="3">3 Rooms</option>
                    <option value="4">4 Rooms</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-semibold text-[#78716C]">Adults</label>
                  <select
                    value={adults}
                    onChange={(e) => setAdults(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E7E2D9] text-xs font-semibold text-[#1C1917] focus:outline-none focus:border-[#8F6B2A] cursor-pointer"
                  >
                    <option value="1">1 Adult</option>
                    <option value="2">2 Adults</option>
                    <option value="3">3 Adults</option>
                    <option value="4">4 Adults</option>
                  </select>
                </div>
              </div>

              {/* Promo Code Option */}
              <div className="pt-1 border-t border-[#E7E2D9] space-y-1">
                <label className="text-[10px] uppercase font-semibold text-[#8F6B2A]">
                  Promo Code (Optional)
                </label>
                <div className="relative">
                  <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8F6B2A]" />
                  <input
                    type="text"
                    placeholder="e.g. DIRECT10"
                    value={customPromo}
                    onChange={(e) => setCustomPromo(e.target.value.toUpperCase())}
                    className="w-full pl-8 pr-3 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E7E2D9] text-xs font-bold uppercase text-[#1C1917] placeholder:font-normal placeholder:text-[#78716C]/60 focus:outline-none focus:border-[#8F6B2A]"
                  />
                </div>
              </div>

              {/* Action Button */}
              <button
                type="submit"
                className="w-full py-3.5 rounded-full text-xs font-semibold tracking-wider flex items-center justify-center space-x-2 text-white bg-gradient-to-r from-[#8F6B2A] via-[#A07931] to-[#8F6B2A] shadow-md hover:shadow-lg hover:opacity-95 transition-all"
              >
                <span>Proceed to Reservation</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center space-x-4 text-[11px] text-[#78716C] pt-1">
                <span className="flex items-center">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#8F6B2A] mr-1" />
                  Free Cancellation
                </span>
                <span>•</span>
                <span>Pay at Hotel Available</span>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Mobile Luxury Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-[#FAF8F5]/98 backdrop-blur-2xl flex flex-col justify-between p-6 lg:hidden animate-fade-in text-[#1C1917]">
          <div>
            <div className="flex justify-between items-center pb-5 border-b border-[#E7E2D9]">
              <div className="relative h-11 w-44">
                <Image
                  src="/images/logo.png"
                  alt="Hotel Ambarish Grand Residency by Divine View"
                  fill
                  className="object-contain object-left"
                />
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-9 h-9 rounded-full flex items-center justify-center text-[#1C1917] hover:text-[#8F6B2A] transition-colors bg-white border border-[#E7E2D9] shadow-sm"
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <nav className="mt-6 flex flex-col space-y-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-lg font-serif tracking-wide py-3 px-3 rounded-xl transition-all flex items-center justify-between ${
                      isActive
                        ? "text-[#8F6B2A] font-semibold bg-[#8F6B2A]/[0.08]"
                        : "text-[#1C1917] hover:text-[#8F6B2A] hover:bg-white"
                    }`}
                  >
                    <span>{link.label}</span>
                    {isActive ? (
                      <span className="w-2 h-2 rounded-full bg-[#8F6B2A] shadow-[0_0_6px_rgba(143,107,42,0.5)]" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4 text-[#78716C]/40" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="space-y-3 pt-6 border-t border-[#E7E2D9]">
            <div className="p-3 rounded-2xl bg-white border border-[#E7E2D9] text-xs text-[#78716C] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#8F6B2A] shrink-0" />
              <span>Md. Shah Road, Paltan Bazaar, Guwahati (3 min from Station)</span>
            </div>

            <a
              href={`tel:${HOTEL_INFO.phoneRaw}`}
              className="w-full flex items-center justify-center py-3 text-xs font-semibold uppercase tracking-wider text-[#1C1917] bg-white rounded-full border border-[#E7E2D9] shadow-sm hover:border-[#8F6B2A]/40 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 mr-2 text-[#8F6B2A]" />
              Call Desk: {HOTEL_INFO.phone}
            </a>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setShowQuickBookModal(true);
              }}
              className="w-full flex items-center justify-center py-3.5 text-xs font-semibold tracking-wider rounded-full text-white bg-gradient-to-r from-[#8F6B2A] via-[#A07931] to-[#8F6B2A] shadow-md hover:opacity-95 transition-opacity"
            >
              <span>Check Rates &amp; Book Direct</span>
              <ArrowUpRight className="w-4 h-4 ml-1.5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
