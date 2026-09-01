"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import { HOTEL_POLICIES, FAQS } from "@/data/policies";
import { HOTEL_INFO } from "@/data/hotel-info";

export default function PoliciesPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  return (
    <div className="bg-[#FAF7F2] text-[#1A1715] min-h-screen pb-20">
      {/* Header */}
      <section className="py-20 sm:py-28 bg-[#F5EFEB] hairline-b text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#A27520] block">
            Policies & Guidance
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-normal text-[#1A1715]">
            Hotel Policies & FAQs
          </h1>
          <p className="text-sm sm:text-base text-[#4A443F] max-w-xl mx-auto font-light leading-relaxed">
            Essential information regarding check-in timings, mandatory ID verification, cancellation terms, and child policies.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* Policies */}
        <div className="space-y-6">
          {HOTEL_POLICIES.map((section, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-[#FFFFFF] border border-[#E6DED3] shadow-sm space-y-4"
            >
              <h3 className="font-serif text-2xl font-normal text-[#1A1715] flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-[#A27520] mr-3 shrink-0" />
                {section.title}
              </h3>
              <ul className="space-y-2.5 text-xs sm:text-sm text-[#4A443F] font-light pl-5 list-disc marker:text-[#A27520]">
                {section.items.map((item, i) => (
                  <li key={i} className="leading-relaxed">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* FAQs */}
        <div className="space-y-6 pt-6 hairline-t">
          <div className="text-center space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#A27520]">Got Questions?</span>
            <h2 className="font-serif text-3xl font-normal text-[#1A1715]">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-[#FFFFFF] border border-[#E6DED3] overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-5 text-left flex justify-between items-center text-sm font-medium text-[#1A1715] hover:text-[#A27520] transition-colors"
                  >
                    <span>{faq.question}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-[#A27520] shrink-0 ml-2" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#A27520] shrink-0 ml-2" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-[#4A443F] font-light leading-relaxed hairline-t pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
