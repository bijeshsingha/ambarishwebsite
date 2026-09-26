import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Phone, Mail, MapPin } from "lucide-react";
import { HOTEL_INFO } from "@/data/hotel-info";

export default function Footer() {
  return (
    <footer className="bg-[#191614] text-[#FAF8F5] border-t border-[#8F6B2A]/25">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-28 sm:py-20">
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
            <p className="text-xs sm:text-sm text-[#FAF8F5]/75 font-light leading-relaxed max-w-sm">
              A 3-star business and transit hotel in Paltan Bazaar, Guwahati. Direct booking confidence, authentic Assamese hospitality, and 250m railway station access.
            </p>
            <div className="text-[11px] text-[#B3863E] tracking-wider uppercase font-semibold">
              3-Star Approved Property • Paltan Bazaar, Guwahati
            </div>
          </div>

          {/* Col 2: Navigation (3 Cols) */}
          <div className="lg:col-span-3 space-y-4">
            <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#B3863E] block">
              Hotel Directory
            </span>
            <ul className="space-y-2.5 text-xs text-[#FAF8F5]/80 font-light">
              <li>
                <Link href="/rooms" className="hover:text-[#B3863E] transition-colors">
                  Rooms &amp; Suites
                </Link>
              </li>
              <li>
                <Link href="/dining" className="hover:text-[#B3863E] transition-colors">
                  The Ambarish Restaurant
                </Link>
              </li>
              <li>
                <Link href="/dining#pavillion-bar" className="hover:text-[#B3863E] transition-colors">
                  Pavillion Bar
                </Link>
              </li>
              <li>
                <Link href="/meetings-events" className="hover:text-[#B3863E] transition-colors">
                  Meetings &amp; Banquets
                </Link>
              </li>
              <li>
                <Link href="/booking" className="hover:text-[#B3863E] transition-colors">
                  Special Offers &amp; Direct Rates
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-[#B3863E] transition-colors">
                  Photo Archive
                </Link>
              </li>
              <li>
                <Link href="/location" className="hover:text-[#B3863E] transition-colors">
                  Location &amp; Directions
                </Link>
              </li>
              <li>
                <Link href="/policies" className="hover:text-[#B3863E] transition-colors">
                  Policies &amp; FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Direct Contact (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#B3863E] block">
              Reservations &amp; Front Desk
            </span>
            <div className="space-y-3 text-xs text-[#FAF8F5]/80 font-light">
              <p className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#B3863E] shrink-0 mt-0.5" />
                <span>{HOTEL_INFO.address.full}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#B3863E] shrink-0" />
                <a href={`tel:${HOTEL_INFO.phoneRaw}`} className="text-[#FAF8F5] hover:text-[#B3863E] font-sans font-semibold tracking-wider transition-colors">
                  {HOTEL_INFO.phone}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#B3863E] shrink-0" />
                <a href={`mailto:${HOTEL_INFO.email}`} className="text-[#FAF8F5] hover:text-[#B3863E] transition-colors">
                  {HOTEL_INFO.email}
                </a>
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/booking"
                className="inline-flex items-center text-xs uppercase tracking-[0.14em] text-[#B3863E] hover:text-[#FAF8F5] font-semibold transition-colors group"
              >
                <span>Online Reservation Desk</span>
                <ArrowUpRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Sub-Footer */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-[#FAF8F5]/60 font-light">
          <p>© {new Date().getFullYear()} Hotel Ambarish Grand Residency by Divine View. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link href="/policies" className="hover:text-[#B3863E] transition-colors">
              Privacy &amp; Policies
            </Link>
            <Link href="/location" className="hover:text-[#B3863E] transition-colors">
              Transit Map
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
