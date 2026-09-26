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
          setIsScrolled(scrollY > 30);
          setShowScrollDock(scrollY > 260);
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
      {/* Top Announcement Strip: Heritage Bronze & Warm Stone */}
      <div className="bg-[#1C1917] border-b border-[#8F6B2A]/30 py-2 px-4 text-center text-[11px] sm:text-xs text-[#FAF8F5] flex items-center justify-center gap-2 sm:gap-3 flex-wrap z-50 relative">
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-[#8F6B2A]/30 text-[#FAF8F5] font-semibold text-[10px] uppercase tracking-wider border border-[#8F6B2A]/40">
          <Clock className="w-3 h-3 text-[#B3863E]" />
          Direct Benefit
        </span>
        <span className="font-normal text-[#FAF8F5]/90">
          Free Early Check-in from <strong className="text-[#B3863E] font-medium">5:00 AM onwards</strong> with zero extra charge!
        </span>
        <span className="hidden sm:inline text-white/30">•</span>
        <span className="hidden sm:inline text-[#FAF8F5]/75">
          Standard Check-in &amp; Check-out: <strong>12:00 Noon</strong>
        </span>
      </div>

      {/* Main Warm Heritage Navigation Bar */}
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? "bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E7E2D9] shadow-sm py-2.5 sm:py-3"
            : "bg-[#FAF8F5]/90 backdrop-blur-sm border-b border-[#E7E2D9] py-3 sm:py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 lg:gap-8">
          {/* 1. Left: Brand Logo */}
          <Link href="/" className="flex items-center group shrink-0" aria-label="Hotel Ambarish Grand Residency Home">
            <div className="relative h-10 w-40 sm:h-11 sm:w-48 lg:h-12 lg:w-52 transition-transform duration-200 group-hover:scale-[1.01]">
              <Image
                src="/images/logo.png"
                alt="Hotel Ambarish Grand Residency by Divine View"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
          </Link>

          {/* 2. Center: Editorial Navigation Links */}
          <nav className="hidden lg:flex items-center justify-center space-x-6 xl:space-x-8 flex-1">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href.includes("corporate") && pathname === "/booking");
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`text-[12px] xl:text-[13px] tracking-[0.14em] uppercase font-medium transition-colors duration-150 relative py-1.5 whitespace-nowrap ${
                    isActive
                      ? "text-[#8F6B2A] font-semibold"
                      : "text-[#292524] hover:text-[#8F6B2A]"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-[#8F6B2A] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* 3. Right: Contact & Primary Action */}
          <div className="hidden sm:flex items-center space-x-3 shrink-0">
            {/* Phone Hotline */}
            <a
              href={`tel:${HOTEL_INFO.phoneRaw}`}
              className="px-3.5 py-2 rounded-lg text-xs font-semibold text-[#1C1917] hover:text-[#8F6B2A] hover:bg-[#FAF5EB] border border-[#E7E2D9] transition-all flex items-center whitespace-nowrap"
              aria-label="Call front desk"
            >
              <Phone className="w-3.5 h-3.5 mr-2 text-[#8F6B2A]" />
              <span>{HOTEL_INFO.phone}</span>
            </a>

            {/* Primary Book Direct Button */}
            <Link
              href="/booking"
              className="btn-heritage-primary px-5 py-2 rounded-lg text-xs font-semibold tracking-wider whitespace-nowrap"
            >
              <span>Book Direct</span>
              <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>

          {/* Mobile Menu Trigger & Book CTA */}
          <div className="flex lg:hidden items-center space-x-2.5">
            {!isCheckoutOrConfirmation && (
              <button
                onClick={() => setShowQuickBookModal(true)}
                className="btn-heritage-primary px-3.5 py-1.5 text-xs font-semibold tracking-wider rounded-lg sm:hidden"
              >
                Book
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#1C1917] hover:text-[#8F6B2A] transition-colors rounded-lg bg-[#FAF5EB] border border-[#E7E2D9]"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 text-[#8F6B2A]" />}
            </button>
          </div>
        </div>
      </header>

      {/* FLOATING ACTION DOCK (Desktop & Tablet) */}
      <div
        className={`hidden sm:block fixed bottom-6 right-6 lg:bottom-8 lg:right-8 z-40 transition-all duration-300 ease-out transform ${
          showScrollDock
            ? "translate-y-0 opacity-100 scale-100 pointer-events-auto"
            : "translate-y-8 opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <div className="flex items-center gap-2 p-1.5 rounded-xl bg-[#FFFFFF] border border-[#E7E2D9] shadow-xl text-[#1C1917]">
          <button
            onClick={() => setShowQuickBookModal(true)}
            className="btn-heritage-primary px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wider flex items-center space-x-2"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Check Rates &amp; Book</span>
            <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
          </button>

          <a
            href={`tel:${HOTEL_INFO.phoneRaw}`}
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#FAF5EB] hover:bg-[#F4EFE6] text-[#8F6B2A] border border-[#E7E2D9] transition-all"
            title="Call Front Desk 24/7"
            aria-label="Call Front Desk"
          >
            <Phone className="w-3.5 h-3.5 text-[#8F6B2A]" />
          </a>
        </div>
      </div>

      {/* QUICK RESERVATION MODAL */}
      {showQuickBookModal && !isCheckoutOrConfirmation && (
        <div className="fixed inset-0 z-[110] bg-[#1C1917]/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-[#FFFFFF] text-[#1C1917] rounded-t-2xl sm:rounded-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto p-5 sm:p-7 space-y-5 shadow-2xl border border-[#E7E2D9] relative animate-fade-in">
            {/* Mobile Sheet Grab Handle */}
            <div className="w-10 h-1 rounded-full bg-[#1C1917]/15 mx-auto -mt-1 mb-2 sm:hidden" />

            {/* Modal Header */}
            <div className="flex justify-between items-start border-b border-[#E7E2D9] pb-3.5">
              <div>
                <span className="text-[11px] font-sans font-semibold tracking-widest text-[#8F6B2A] uppercase block">
                  Best Direct Rate Guarantee
                </span>
                <h3 className="font-serif text-2xl font-medium text-[#1C1917] mt-0.5">
                  Quick Reservation
                </h3>
              </div>
              <button
                onClick={() => setShowQuickBookModal(false)}
                className="p-1.5 rounded-lg hover:bg-[#FAF5EB] text-[#78716C] transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Booking Form */}
            <form onSubmit={handleQuickBookSubmit} className="space-y-4 text-xs">
              {/* Hotel Check-in Policy Banner */}
              <div className="flex flex-wrap items-center justify-between gap-1 text-[11px] text-[#8F6B2A] bg-[#FAF5EB] border border-[#DFD5C0] px-3.5 py-2.5 rounded-lg">
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
                    className="w-full p-2.5 rounded-lg bg-[#FAF8F5] border border-[#E7E2D9] text-xs font-semibold text-[#1C1917] focus:outline-none focus:border-[#8F6B2A]"
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
                    className="w-full p-2.5 rounded-lg bg-[#FAF8F5] border border-[#E7E2D9] text-xs font-semibold text-[#1C1917] focus:outline-none focus:border-[#8F6B2A]"
                  />
                </div>
              </div>

              {/* Room Choice */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-semibold text-[#78716C]">Select Room Category</label>
                <select
                  value={selectedRoomSlug}
                  onChange={(e) => setSelectedRoomSlug(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-[#FAF8F5] border border-[#E7E2D9] text-xs font-semibold text-[#1C1917] focus:outline-none focus:border-[#8F6B2A] cursor-pointer"
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
                    className="w-full p-2.5 rounded-lg bg-[#FAF8F5] border border-[#E7E2D9] text-xs font-semibold text-[#1C1917] focus:outline-none focus:border-[#8F6B2A] cursor-pointer"
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
                    className="w-full p-2.5 rounded-lg bg-[#FAF8F5] border border-[#E7E2D9] text-xs font-semibold text-[#1C1917] focus:outline-none focus:border-[#8F6B2A] cursor-pointer"
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
                    className="w-full pl-8 pr-3 py-2.5 rounded-lg bg-[#FAF8F5] border border-[#E7E2D9] text-xs font-bold uppercase text-[#1C1917] placeholder:font-normal placeholder:text-[#78716C]/60 focus:outline-none focus:border-[#8F6B2A]"
                  />
                </div>
              </div>

              {/* Instant Action Button */}
              <button
                type="submit"
                className="w-full py-3.5 rounded-lg btn-heritage-primary text-xs font-semibold tracking-wider flex items-center justify-center space-x-2"
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

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-[#FAF8F5] flex flex-col justify-between p-6 lg:hidden animate-fade-in text-[#1C1917]">
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
                className="p-2 text-[#1C1917] hover:text-[#8F6B2A] transition-colors rounded-lg bg-[#FAF5EB] border border-[#E7E2D9]"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="mt-8 flex flex-col space-y-4">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-lg font-serif tracking-wide py-2 transition-colors flex items-center justify-between border-b border-[#E7E2D9]/50 ${
                      isActive
                        ? "text-[#8F6B2A] font-semibold"
                        : "text-[#1C1917] hover:text-[#8F6B2A]"
                    }`}
                  >
                    <span>{link.label}</span>
                    {isActive && (
                      <span className="w-2 h-2 rounded-full bg-[#8F6B2A]" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="space-y-3 pt-6 border-t border-[#E7E2D9]">
            <a
              href={`tel:${HOTEL_INFO.phoneRaw}`}
              className="w-full flex items-center justify-center py-3 text-xs font-semibold uppercase tracking-wider text-[#1C1917] bg-[#FAF5EB] rounded-lg border border-[#E7E2D9]"
            >
              <Phone className="w-3.5 h-3.5 mr-2 text-[#8F6B2A]" />
              Call Desk: {HOTEL_INFO.phone}
            </a>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setShowQuickBookModal(true);
              }}
              className="w-full flex items-center justify-center py-3.5 text-xs font-semibold tracking-wider btn-heritage-primary rounded-lg"
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
