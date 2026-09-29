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

            {/* Social Media Links */}
            <div className="pt-1">
              <span className="text-[10px] uppercase font-semibold tracking-widest text-[#FAF8F5]/60 block mb-2">
                Connect With Us
              </span>
              <div className="flex flex-wrap items-center gap-2.5">
                <a
                  href={HOTEL_INFO.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-[#8F6B2A]/20 border border-white/10 hover:border-[#B3863E]/40 text-xs text-[#FAF8F5]/85 hover:text-[#FAF8F5] transition-all group"
                  aria-label="Hotel Ambarish Grand Residency on Instagram"
                >
                  <svg className="w-3.5 h-3.5 text-[#B3863E] group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                  <span className="text-[11px] font-medium tracking-wide">Instagram</span>
                </a>

                <a
                  href={HOTEL_INFO.socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-[#8F6B2A]/20 border border-white/10 hover:border-[#B3863E]/40 text-xs text-[#FAF8F5]/85 hover:text-[#FAF8F5] transition-all group"
                  aria-label="Hotel Ambarish Grand Residency on Facebook"
                >
                  <svg className="w-3.5 h-3.5 text-[#B3863E] group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span className="text-[11px] font-medium tracking-wide">Facebook</span>
                </a>
              </div>
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
