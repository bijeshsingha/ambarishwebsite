"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight, Phone } from "lucide-react";
import { HOTEL_INFO } from "@/data/hotel-info";

export default function ClosingCTA() {
  return (
    <section className="bg-[#FAF8F5] text-[#1C1917] py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-t border-[#E7E2D9]">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <p className="text-[11px] uppercase tracking-[0.24em] text-[#8F6B2A] font-semibold">
          Direct Reservations
        </p>

        <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-medium leading-tight text-[#1C1917]">
          Plan Your Stay in Guwahati
        </h2>

        <p className="text-[#44403C] text-sm sm:text-base font-normal max-w-xl mx-auto leading-relaxed">
          Book directly on our official website for guaranteed best rates, free 5:00 AM early check-in assistance, and immediate reservation confirmation.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            href="/booking"
            className="btn-heritage-primary px-8 py-3.5 text-xs font-semibold tracking-wider rounded-lg inline-flex items-center"
          >
            <span>Check Availability &amp; Rates</span>
            <ArrowUpRight className="w-4 h-4 ml-1.5" />
          </Link>

          <a
            href={`tel:${HOTEL_INFO.phoneRaw}`}
            className="inline-flex items-center justify-center px-7 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#1C1917] bg-[#FAF5EB] hover:bg-[#F4EFE6] border border-[#E7E2D9] rounded-lg transition-colors"
          >
            <Phone className="w-3.5 h-3.5 mr-2 text-[#8F6B2A]" />
            <span>Call Front Desk</span>
          </a>
        </div>
      </div>
    </section>
  );
}
