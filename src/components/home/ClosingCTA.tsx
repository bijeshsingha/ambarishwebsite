"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight, Phone } from "lucide-react";
import { HOTEL_INFO } from "@/data/hotel-info";

export default function ClosingCTA() {
  return (
    <section className="bg-[#0C0B0B] text-[#F5EBDD] py-24 sm:py-32 px-4 sm:px-6 lg:px-8 border-t border-white/10">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <p className="text-xs uppercase tracking-[0.28em] text-[#B4872F] font-medium">
          Direct Reservations
        </p>

        <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal leading-tight text-[#F5EBDD]">
          Plan Your Stay in Guwahati
        </h2>

        <p className="text-[#F5EBDD]/75 text-sm sm:text-base font-light max-w-xl mx-auto leading-relaxed">
          Book directly on our official website for guaranteed best rates, flexible check-in assistance, and immediate reservation confirmation.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            href="/booking"
            className="group inline-flex items-center justify-center px-9 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-white bg-[#B62576] hover:bg-[#9A1D62] rounded-full transition-all duration-200 shadow-xl active:scale-[0.98]"
          >
            <span>Check Availability &amp; Rates</span>
            <ArrowUpRight className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>

          <a
            href={`tel:${HOTEL_INFO.phoneRaw}`}
            className="inline-flex items-center justify-center px-8 py-4 text-xs font-medium uppercase tracking-[0.16em] text-[#F5EBDD] bg-white/5 hover:bg-white/10 border border-white/20 hover:border-[#B4872F] rounded-full transition-colors"
          >
            <Phone className="w-3.5 h-3.5 mr-2 text-[#B4872F]" />
            <span>Call Front Desk</span>
          </a>
        </div>
      </div>
    </section>
  );
}
