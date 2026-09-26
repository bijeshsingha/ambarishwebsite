"use client";

import React from "react";
import { Train, ShieldCheck, Utensils, Building2 } from "lucide-react";

const brandPillars = [
  {
    icon: Train,
    title: "Prime Transit Hub",
    subtitle: "250m to Railway Station",
    description:
      "A 3-minute stroll from Guwahati Railway Station's Paltan Bazaar entrance. Immediate access to regional taxis and ASTC bus stand.",
  },
  {
    icon: ShieldCheck,
    title: "24-Hour Dependability",
    subtitle: "Continuous Power & Care",
    description:
      "Free early check-in from 5:00 AM, 24-hour generator backup, 24/7 front desk hospitality, secure covered parking, and daily housekeeping.",
  },
  {
    icon: Utensils,
    title: "The Ambarish Kitchen",
    subtitle: "Authentic Multi-Cuisine",
    description:
      "Freshly prepared breakfast, wholesome North Indian gravies, Chinese wok dishes, and authentic Assamese traditional meals.",
  },
  {
    icon: Building2,
    title: "Banquets & Meetings",
    subtitle: "Up to 150 Attendees",
    description:
      "Full-service air-conditioned conference hall, executive boardroom, high-speed business Wi-Fi, and custom event catering.",
  },
];

export default function TrustStrip() {
  return (
    <section className="bg-[#F4EFE6] border-t border-b border-[#E7E2D9] py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 lg:divide-x lg:divide-[#E7E2D9]">
          {brandPillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="lg:px-8 first:pl-0 last:pr-0 space-y-3"
              >
                <div className="w-11 h-11 rounded-lg bg-[#FFFFFF] border border-[#E7E2D9] flex items-center justify-center text-[#8F6B2A] mb-4 shadow-sm">
                  <Icon className="w-5 h-5" />
                </div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#8F6B2A]">
                  {pillar.subtitle}
                </p>
                <h3 className="font-serif text-xl text-[#1C1917] font-medium">
                  {pillar.title}
                </h3>
                <p className="text-xs sm:text-[13px] text-[#44403C] font-normal leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
