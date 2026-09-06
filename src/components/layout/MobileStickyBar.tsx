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
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#0A0909]/95 backdrop-blur-xl border-t border-[#9E8255]/30 px-4 pt-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom,0px))] sm:hidden flex items-center justify-between gap-3 shadow-lg shadow-black/20"
    >
      <a
        href={`tel:${HOTEL_INFO.phoneRaw}`}
        className="flex-1 flex items-center justify-center py-2.5 px-3 text-xs font-semibold text-[#FAF8F5] bg-white/5 hover:bg-white/10 rounded-full transition-colors border border-white/15 active:scale-95"
      >
        <Phone className="w-3.5 h-3.5 mr-1.5 text-[#9E8255]" />
        <span>Call Desk</span>
      </a>

      <Link
        href="/booking"
        className="flex-1 flex items-center justify-center py-2.5 px-3 text-xs font-semibold uppercase tracking-wider text-[#0C0B0A] bg-[#9E8255] hover:bg-[#BFA058] rounded-full transition-all shadow-md active:scale-95"
      >
        <CalendarCheck className="w-3.5 h-3.5 mr-1.5 text-[#0C0B0A]" />
        <span>Book Direct</span>
      </Link>
    </aside>
  );
}
