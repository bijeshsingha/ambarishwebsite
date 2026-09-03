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
  Users,
  Sparkles,
  ShieldCheck,
  Zap,
  Tag,
} from "lucide-react";
import { HOTEL_INFO } from "@/data/hotel-info";
import { getTodayDate, getTomorrowDate, calculateNights, formatCurrencyINR } from "@/lib/formatters";
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
    { label: "Offers & Promos", href: "/booking" },
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
      {/* Prominent Luxury Navigation Bar */}
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? "bg-[#0A0909]/95 backdrop-blur-2xl border-b border-[#B4872F]/30 shadow-xl shadow-black/80 py-2 sm:py-2.5"
            : "bg-[#0A0909]/90 backdrop-blur-xl border-b border-white/10 py-2.5 sm:py-3"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 lg:gap-6">
          {/* 1. Left: Brand Logo (Sleek & Balanced) */}
          <Link href="/" className="flex items-center group shrink-0">
            <div className="relative h-9 w-36 sm:h-10 sm:w-44 lg:h-11 lg:w-48 transition-transform duration-200 group-hover:scale-[1.02]">
              <Image
                src="/images/logo.png"
                alt="Hotel Ambarish Grand Residency by Divine View"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
          </Link>

          {/* 2. Center: Clean, Spaced Navigation Links */}
          <nav className="hidden lg:flex items-center justify-center space-x-5 xl:space-x-7 flex-1">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href.includes("corporate") && pathname === "/booking");
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`text-[11px] xl:text-[12px] tracking-[0.12em] uppercase font-medium transition-all duration-150 relative py-1.5 whitespace-nowrap ${
                    isActive
                      ? "text-[#B4872F] font-bold"
                      : "text-[#F5EBDD]/90 hover:text-[#B4872F]"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute -bottom-0.5 left-0 w-full h-[2px] bg-gradient-to-r from-[#B4872F] to-[#D4A74F] rounded-full shadow-sm shadow-[#B4872F]/70" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* 3. Right: Sleek Action CTAs */}
          <div className="hidden sm:flex items-center space-x-3 shrink-0">
            {/* Phone Hotline Pill */}
            <a
              href={`tel:${HOTEL_INFO.phoneRaw}`}
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#F5EBDD] hover:text-[#B4872F] hover:bg-white/5 border border-white/20 transition-all flex items-center whitespace-nowrap shadow-sm group"
              aria-label="Call front desk"
            >
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B4872F] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#B4872F]"></span>
              </span>
              <Phone className="w-3.5 h-3.5 mr-1.5 text-[#B4872F] group-hover:rotate-12 transition-transform" />
              <span>{HOTEL_INFO.phone}</span>
            </a>

            {/* Primary Book Direct Button */}
            <Link
              href="/booking"
              className="group inline-flex items-center justify-center px-4.5 py-2 sm:px-5 sm:py-2 text-xs font-bold uppercase tracking-[0.12em] text-white bg-gradient-to-r from-[#B62576] to-[#92185C] hover:from-[#C72E84] hover:to-[#A71C67] rounded-full transition-all duration-200 shadow-md shadow-[#B62576]/30 hover:shadow-lg hover:shadow-[#B62576]/40 hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap border border-white/15"
            >
              <span>Book Direct</span>
              <ArrowUpRight className="w-3.5 h-3.5 ml-1 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex lg:hidden items-center space-x-2.5">
            {!isCheckoutOrConfirmation && (
              <button
                onClick={() => setShowQuickBookModal(true)}
                className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white bg-[#B62576] rounded-full sm:hidden shadow-sm"
              >
                Book Now
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#F5EBDD] hover:text-[#B4872F] transition-colors rounded-xl bg-white/5 border border-white/10"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 text-[#B4872F]" />}
            </button>
          </div>
        </div>
      </header>

      {/* DYNAMIC SCROLL-DOWN FLOATING ISLAND POP-UP (Desktop & Tablet) */}
      <div
        className={`hidden sm:block fixed bottom-6 right-6 lg:bottom-8 lg:right-8 z-40 transition-all duration-500 ease-out transform ${
          showScrollDock
            ? "translate-y-0 opacity-100 scale-100 pointer-events-auto"
            : "translate-y-10 opacity-0 scale-90 pointer-events-none"
        }`}
      >
        <div className="flex items-center gap-1.5 p-1 rounded-full bg-[#0A0909]/95 backdrop-blur-xl border border-[#B4872F]/40 shadow-2xl shadow-black/90">
          <button
            onClick={() => setShowQuickBookModal(true)}
            className="px-4 py-2.5 rounded-full bg-gradient-to-r from-[#B62576] to-[#92185C] hover:from-[#C72E84] hover:to-[#A71C67] text-white text-xs font-bold uppercase tracking-wider flex items-center space-x-2 shadow-lg shadow-[#B62576]/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Calendar className="w-3.5 h-3.5 text-[#F5EBDD]" />
            <span>Check Rates &amp; Book</span>
            <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
          </button>

          <a
            href={`tel:${HOTEL_INFO.phoneRaw}`}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-[#B4872F] text-[#F5EBDD] hover:text-white transition-all border border-white/10 shrink-0"
            title="Call Front Desk 24/7"
            aria-label="Call Front Desk"
          >
            <Phone className="w-3.5 h-3.5 text-[#B4872F] hover:text-white" />
          </a>
        </div>
      </div>

      {/* MOBILE STICKY FLOATING QUICK BOOK DOCK */}
      {!isCheckoutOrConfirmation && (
        <div
          className={`sm:hidden fixed bottom-3 left-3 right-3 z-40 transition-all duration-500 ease-out transform ${
            showScrollDock
              ? "translate-y-0 opacity-100 scale-100 pointer-events-auto"
              : "translate-y-12 opacity-0 scale-95 pointer-events-none"
          }`}
        >
          <div className="flex items-center justify-between gap-2 p-1.5 rounded-full bg-[#0A0909]/95 backdrop-blur-2xl border border-[#B4872F]/50 shadow-2xl shadow-black/90">
            <button
              onClick={() => setShowQuickBookModal(true)}
              className="flex-1 py-3 px-4 rounded-full bg-gradient-to-r from-[#B62576] to-[#92185C] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg shadow-[#B62576]/30 active:scale-[0.98]"
            >
              <Calendar className="w-3.5 h-3.5 text-[#F5EBDD]" />
              <span>Quick Book Direct</span>
              <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
            </button>

            <a
              href={`tel:${HOTEL_INFO.phoneRaw}`}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-[#B4872F] border border-white/10 shrink-0 active:scale-95"
              title="Call Front Desk"
            >
              <Phone className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}

      {/* INSTANT RESERVATION & DATES POP-UP MODAL (Mobile Bottom Sheet + Desktop Modal) */}
      {showQuickBookModal && !isCheckoutOrConfirmation && (
        <div className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-[#FFFFFF] text-[#1A1715] rounded-t-[2rem] sm:rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto p-5 sm:p-8 space-y-5 shadow-2xl border border-[#E6DED3] relative animate-in slide-in-from-bottom-6 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200">
            {/* Mobile Sheet Grab Handle */}
            <div className="w-12 h-1 rounded-full bg-black/15 mx-auto -mt-1 mb-2 sm:hidden" />

            {/* Modal Header */}
            <div className="flex justify-between items-start border-b border-[#E6DED3] pb-3.5">
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#B4872F] uppercase block">
                  Best Direct Rate Guarantee
                </span>
                <h3 className="font-serif text-2xl font-normal text-[#1A1715]">
                  Quick Reservation
                </h3>
              </div>
              <button
                onClick={() => setShowQuickBookModal(false)}
                className="p-2 rounded-full hover:bg-black/5 text-[#787069] transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Booking Form */}
            <form onSubmit={handleQuickBookSubmit} className="space-y-4 text-xs">
              {/* Hotel Check-in Policy Pill */}
              <div className="flex items-center justify-between text-[11px] text-[#A27520] bg-[#FAF7F2] border border-[#EDE7DE] px-3.5 py-2 rounded-xl">
                <span>Check-in: <strong>11:00 AM</strong></span>
                <span>•</span>
                <span>Check-out: <strong>12:00 PM</strong></span>
                <span>•</span>
                <span className="text-emerald-700 font-semibold">Free Cancellation</span>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-semibold text-[#787069]">Check-In</label>
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
                    className="w-full p-3 rounded-xl bg-[#FAF7F2] border border-[#E6DED3] text-xs font-semibold text-[#1A1715] focus:outline-none focus:border-[#B62576]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-semibold text-[#787069]">Check-Out</label>
                  <input
                    type="date"
                    min={checkIn || getTodayDate()}
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    required
                    className="w-full p-3 rounded-xl bg-[#FAF7F2] border border-[#E6DED3] text-xs font-semibold text-[#1A1715] focus:outline-none focus:border-[#B62576]"
                  />
                </div>
              </div>

              {/* Room Choice */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-semibold text-[#787069]">Select Room Category</label>
                <select
                  value={selectedRoomSlug}
                  onChange={(e) => setSelectedRoomSlug(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[#FAF7F2] border border-[#E6DED3] text-xs font-semibold text-[#1A1715] focus:outline-none focus:border-[#B62576] cursor-pointer"
                >
                  {ROOMS.map((r) => (
                    <option key={r.id} value={r.slug}>
                      {r.name} • {r.bedType} (From {formatCurrencyINR(r.basePrice)}/nt)
                    </option>
                  ))}
                </select>
              </div>

              {/* Rooms & Guests */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-semibold text-[#787069]">Rooms Count</label>
                  <select
                    value={roomsCount}
                    onChange={(e) => setRoomsCount(e.target.value)}
                    className="w-full p-3 rounded-xl bg-[#FAF7F2] border border-[#E6DED3] text-xs font-semibold text-[#1A1715] focus:outline-none focus:border-[#B62576] cursor-pointer"
                  >
                    <option value="1">1 Room</option>
                    <option value="2">2 Rooms</option>
                    <option value="3">3 Rooms</option>
                    <option value="4">4 Rooms</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-semibold text-[#787069]">Adults</label>
                  <select
                    value={adults}
                    onChange={(e) => setAdults(e.target.value)}
                    className="w-full p-3 rounded-xl bg-[#FAF7F2] border border-[#E6DED3] text-xs font-semibold text-[#1A1715] focus:outline-none focus:border-[#B62576] cursor-pointer"
                  >
                    <option value="1">1 Adult</option>
                    <option value="2">2 Adults</option>
                    <option value="3">3 Adults</option>
                    <option value="4">4 Adults</option>
                  </select>
                </div>
              </div>

              {/* Promo Code Option */}
              <div className="pt-1 border-t border-[#E6DED3] space-y-1">
                <label className="text-[10px] uppercase font-semibold text-[#A27520]">
                  Have a Promo Code? (Optional)
                </label>
                <div className="relative">
                  <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#A27520]" />
                  <input
                    type="text"
                    placeholder="e.g. DIRECT10, AMBARISH15"
                    value={customPromo}
                    onChange={(e) => setCustomPromo(e.target.value.toUpperCase())}
                    className="w-full pl-8 pr-3 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E6DED3] text-xs font-bold uppercase text-[#1A1715] placeholder:font-normal placeholder:text-[#787069]/60 focus:outline-none focus:border-[#B62576]"
                  />
                </div>
              </div>

              {/* Instant Action Button */}
              <button
                type="submit"
                className="w-full py-4 rounded-full bg-gradient-to-r from-[#B62576] to-[#92185C] hover:from-[#C72E84] hover:to-[#A71C67] text-white text-xs font-bold uppercase tracking-[0.14em] shadow-xl transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center space-x-2"
              >
                <span>Proceed to Quick Checkout</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center space-x-4 text-[10px] text-[#787069] pt-1">
                <span className="flex items-center">
                  <ShieldCheck className="w-3 h-3 text-[#B4872F] mr-1" />
                  Free Cancellation
                </span>
                <span>•</span>
                <span>Pay Online or at Hotel</span>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Full-Screen Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-[#0C0B0B] flex flex-col justify-between p-6 lg:hidden animate-in fade-in duration-200 text-[#F5EBDD]">
          <div>
            <div className="flex justify-between items-center pb-6 border-b border-white/10">
              <div className="relative h-12 w-52">
                <Image
                  src="/images/logo.png"
                  alt="Hotel Ambarish Grand Residency by Divine View"
                  fill
                  className="object-contain object-left"
                />
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-[#F5EBDD] hover:text-[#B4872F] transition-colors rounded-full bg-white/5"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="mt-8 flex flex-col space-y-5">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-xl font-serif tracking-wide py-1 transition-colors flex items-center justify-between ${
                      isActive
                        ? "text-[#B4872F] font-bold"
                        : "text-[#FFFFFF] hover:text-[#B4872F]"
                    }`}
                  >
                    <span>{link.label}</span>
                    {isActive && (
                      <span className="w-2 h-2 rounded-full bg-[#B4872F]" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="space-y-3 pt-6 border-t border-white/10">
            <a
              href={`tel:${HOTEL_INFO.phoneRaw}`}
              className="w-full flex items-center justify-center py-3.5 text-xs font-semibold uppercase tracking-wider text-[#F5EBDD] bg-[#171414] rounded-full border border-white/10"
            >
              <Phone className="w-3.5 h-3.5 mr-2 text-[#B4872F]" />
              Call Desk: {HOTEL_INFO.phone}
            </a>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setShowQuickBookModal(true);
              }}
              className="w-full flex items-center justify-center py-4 text-xs font-bold uppercase tracking-[0.14em] text-white bg-gradient-to-r from-[#B62576] to-[#92185C] rounded-full shadow-xl"
            >
              <span>Instant Quick Rates</span>
              <ArrowUpRight className="w-4 h-4 ml-1.5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
