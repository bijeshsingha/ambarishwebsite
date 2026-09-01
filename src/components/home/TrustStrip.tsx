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
      "Dedicated 24-hour generator power backup, 24/7 active reception desk, secure covered parking, and daily fresh housekeeping.",
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
    <section className="bg-[#0C0B0B] border-t border-b border-white/10 py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 lg:divide-x lg:divide-white/10">
          {brandPillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="lg:px-8 first:pl-0 last:pr-0 space-y-3"
              >
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[#B4872F] mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#B4872F]">
                  {pillar.subtitle}
                </p>
                <h3 className="font-serif text-xl text-[#F5EBDD] font-normal">
                  {pillar.title}
                </h3>
                <p className="text-xs text-[#F5EBDD]/65 font-light leading-relaxed">
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
