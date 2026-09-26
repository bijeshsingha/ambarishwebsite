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
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-t border-[#E7E2D9] px-4 pt-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom,0px))] sm:hidden flex items-center justify-between gap-3 shadow-lg shadow-black/10"
    >
      <a
        href={`tel:${HOTEL_INFO.phoneRaw}`}
        className="flex-1 flex items-center justify-center py-2.5 px-3 text-xs font-semibold text-[#1C1917] bg-[#FAF5EB] hover:bg-[#F4EFE6] rounded-lg transition-colors border border-[#E7E2D9] active:scale-95"
      >
        <Phone className="w-3.5 h-3.5 mr-1.5 text-[#8F6B2A]" />
        <span>Call Desk</span>
      </a>

      <Link
        href="/booking"
        className="btn-heritage-primary flex-1 flex items-center justify-center py-2.5 px-3 text-xs font-semibold tracking-wider rounded-lg active:scale-95"
      >
        <CalendarCheck className="w-3.5 h-3.5 mr-1.5" />
        <span>Book Direct</span>
      </Link>
    </aside>
  );
}
