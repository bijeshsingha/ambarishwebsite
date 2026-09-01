import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { HOTEL_INFO } from "@/data/hotel-info";

export default function Footer() {
  return (
    <footer className="bg-[#0C0B0B] text-[#F5EBDD] hairline-dark-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Col 1: Logo & Statement (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative h-12 w-52 sm:h-14 sm:w-60">
              <Image
                src="/images/logo.png"
                alt="Hotel Ambarish Grand Residency by Divine View"
                fill
                sizes="(max-width: 640px) 208px, 240px"
                className="object-contain object-left"
              />
            </div>
            <p className="text-xs sm:text-sm text-[#F5EBDD]/70 font-light leading-relaxed max-w-sm">
              A modern 3-star business & transit hotel in Paltan Bazaar, Guwahati. Direct booking confidence, authentic hospitality, and seamless railway access.
            </p>
            <div className="text-[11px] text-[#B4872F] tracking-wider uppercase font-semibold">
              3-Star Approved Property • Paltan Bazaar, Guwahati
            </div>
          </div>

          {/* Col 2: Navigation (3 Cols) */}
          <div className="lg:col-span-3 space-y-4">
            <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#B4872F] block">
              Hotel
            </span>
            <ul className="space-y-2.5 text-xs text-[#F5EBDD]/75 font-light">
              <li>
                <Link href="/rooms" className="hover:text-[#F5EBDD] transition-colors">
                  Rooms & Suites
                </Link>
              </li>
              <li>
                <Link href="/dining" className="hover:text-[#F5EBDD] transition-colors">
                  The Ambarish Restaurant
                </Link>
              </li>
              <li>
                <Link href="/meetings-events" className="hover:text-[#F5EBDD] transition-colors">
                  Meetings & Banquets
                </Link>
              </li>
              <li>
                <Link href="/booking" className="hover:text-[#F5EBDD] transition-colors">
                  Special Offers & Direct Rates
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-[#F5EBDD] transition-colors">
                  Photo Archive
                </Link>
              </li>
              <li>
                <Link href="/location" className="hover:text-[#F5EBDD] transition-colors">
                  Location & Directions
                </Link>
              </li>
              <li>
                <Link href="/policies" className="hover:text-[#F5EBDD] transition-colors">
                  Policies & FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Direct Contact (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#B4872F] block">
              Reservations & Inquiries
            </span>
            <div className="space-y-3 text-xs text-[#F5EBDD]/75 font-light">
              <p>{HOTEL_INFO.address.full}</p>
              <p>
                <strong className="text-[#F5EBDD] font-medium">Phone: </strong>
                <a href={`tel:${HOTEL_INFO.phoneRaw}`} className="text-[#B4872F] hover:underline font-mono font-semibold">
                  {HOTEL_INFO.phone}
                </a>
              </p>
              <p>
                <strong className="text-[#F5EBDD] font-medium">Email: </strong>
                <a href={`mailto:${HOTEL_INFO.email}`} className="text-[#F5EBDD] hover:underline">
                  {HOTEL_INFO.email}
                </a>
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/booking"
                className="inline-flex items-center text-xs uppercase tracking-[0.14em] text-[#B4872F] hover:text-[#F5EBDD] font-semibold transition-colors group"
              >
                <span>Online reservation desk</span>
                <ArrowUpRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Sub-Footer */}
        <div className="mt-16 pt-8 hairline-dark-t flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-[#F5EBDD]/40 font-light">
          <p>© {new Date().getFullYear()} Hotel Ambarish Grand Residency by Divine View. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link href="/policies" className="hover:text-[#F5EBDD]">
              Privacy & Policies
            </Link>
            <Link href="/location" className="hover:text-[#F5EBDD]">
              Transit Map
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
