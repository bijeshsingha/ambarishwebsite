"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, CalendarCheck } from "lucide-react";
import { HOTEL_INFO } from "@/data/hotel-info";

export default function MobileStickyBar() {
  const pathname = usePathname();

  // Hide the global sticky CTA bar on booking and checkout pages to avoid overlapping the booking engine dock
  if (pathname?.startsWith("/booking") || pathname?.startsWith("/checkout")) {
    return null;
  }

  return (
    <aside
      aria-label="Quick mobile booking and contact bar"
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#0A0909]/95 backdrop-blur-xl border-t border-[#B4872F]/25 px-4 pt-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom,0px))] sm:hidden flex items-center justify-between gap-3 shadow-[0_-8px_25px_rgba(0,0,0,0.8)]"
    >
      <a
        href={`tel:${HOTEL_INFO.phoneRaw}`}
        className="flex-1 flex items-center justify-center py-2.5 px-3 text-xs font-semibold text-[#F5EBDD] bg-white/5 hover:bg-white/10 rounded-full transition-colors border border-white/15 active:scale-95"
      >
        <span className="relative flex h-2 w-2 mr-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B4872F] opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#B4872F]" />
        </span>
        <Phone className="w-3.5 h-3.5 mr-1.5 text-[#B4872F]" />
        <span>Call Desk</span>
      </a>

      <Link
        href="/booking"
        className="flex-1 flex items-center justify-center py-2.5 px-3 text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-[#B62576] to-[#92185C] hover:from-[#C72E84] hover:to-[#A71C67] rounded-full transition-all shadow-lg shadow-[#B62576]/30 active:scale-95 border border-white/15"
      >
        <CalendarCheck className="w-3.5 h-3.5 mr-1.5 text-[#F5EBDD]" />
        <span>Book Direct</span>
      </Link>
    </aside>
  );
}
