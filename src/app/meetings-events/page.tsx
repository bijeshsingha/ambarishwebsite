"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  CheckCircle,
  Phone,
  Mail,
  Send,
  ArrowUpRight,
  AlertCircle,
  Loader2,
  Users,
  Projector,
  Sparkles,
  Info,
  Calendar,
  Layers,
  Percent,
} from "lucide-react";
import { BANQUET_HALL } from "@/data/meetings";
import { HOTEL_INFO } from "@/data/hotel-info";

const hallAngles = [
  {
    src: "/images/polished/banquet-meeting-in-use.webp",
    alt: "Corporate conference in session at Hotel Ambarish banquet hall",
    title: "Corporate Conference Setup",
    subtitle: "Theatre & Seminar Layout (Up to 150 Pax)",
  },
  {
    src: "/images/polished/banquet-event-ceremony.webp",
    alt: "Banquet hall arranged for Annaprashan and family social celebration with balloon decor",
    title: "Social Celebration & Ceremonies",
    subtitle: "Annaprashan, Birthdays, Receptions (Up to 120 Pax)",
  },
  {
    src: "/images/polished/banquet-boardroom-wide.webp",
    alt: "Executive boardroom table layout in the banquet hall",
    title: "Executive Boardroom Setup",
    subtitle: "U-Shape & Boardroom Meetings (Up to 45 Pax)",
  },
  {
    src: "/images/polished/banquet-boardroom-front.webp",
    alt: "Front view of executive setup in the banquet hall",
    title: "Presentation & Stage View",
    subtitle: "Pillar-free Hall with Central Air-Conditioning",
  },
];

export default function MeetingsEventsPage() {
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  const [formData, setFormData] = useState({
    eventType: "Corporate Seminar",
    eventDate: "",
    attendees: "50",
    seatingLayout: "Theatre",
    needProjectorAudio: "No",
    cateringPlan: "Lunch Buffet",
    name: "",
    email: "",
    phone: "",
    notes: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/v1/events/enquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          notes: `[AV Request: ${formData.needProjectorAudio} | Catering: ${formData.cateringPlan}] ${formData.notes}`,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSubmitted(true);
      } else {
        setErrorMessage(data.error || "Failed to submit enquiry. Please try again or call us directly.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "A network error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FAF7F2] text-[#1A1715] min-h-screen pb-20">
      {/* Header Banner */}
      <section className="py-20 sm:py-28 bg-[#F5EFEB] hairline-b text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#A27520] block">
            Banquet &amp; Event Venue
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-normal text-[#1A1715]">
            The Grand Residency Banquet Hall
          </h1>
          <p className="text-sm sm:text-base text-[#4A443F] max-w-2xl mx-auto font-light leading-relaxed">
            A single, versatile pillar-free air-conditioned hall in Paltan Bazaar custom-configurable for corporate conferences, seminars, executive meetings, and social celebrations.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* Single Hall Interactive Photography & Layout Showcase */}
        <div className="p-8 sm:p-12 rounded-3xl bg-[#FFFFFF] border border-[#E6DED3] shadow-md space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left: Interactive Multi-Layout Photography */}
            <div className="lg:col-span-7 space-y-4">
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-[#FAF7F2] border border-[#E6DED3] shadow-inner group">
                <Image
                  src={hallAngles[activePhotoIdx].src}
                  alt={hallAngles[activePhotoIdx].alt}
                  fill
                  className="object-cover transition-all duration-500 hover:scale-105"
                  priority
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3.5 py-1.5 bg-[#FFFFFF]/95 backdrop-blur-md text-xs font-mono font-semibold text-[#1A1715] rounded-full shadow-sm border border-black/5">
                    Single Multipurpose Hall • Up to 150 Pax
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4 bg-black/75 backdrop-blur-md p-3 rounded-xl text-white">
                  <span className="text-[10px] font-mono text-[#B4872F] uppercase tracking-wider block">
                    {hallAngles[activePhotoIdx].subtitle}
                  </span>
                  <h4 className="font-serif text-base text-white">
                    {hallAngles[activePhotoIdx].title}
                  </h4>
                </div>
              </div>

              {/* Photo Thumbnails */}
              <div className="grid grid-cols-4 gap-2.5">
                {hallAngles.map((angle, idx) => (
                  <button
                    key={angle.src}
                    onClick={() => setActivePhotoIdx(idx)}
                    className={`relative aspect-[16/11] rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                      activePhotoIdx === idx
                        ? "border-[#B62576] ring-2 ring-[#B62576]/30 scale-[1.02]"
                        : "border-black/10 opacity-70 hover:opacity-100 hover:border-[#B4872F]/50"
                    }`}
                    aria-label={`View ${angle.title}`}
                  >
                    <Image
                      src={angle.src}
                      alt={angle.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 25vw, 15vw"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Hall Specifications & Versatility */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-2">
                <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#A27520] block">
                  One Hall • Multiple Arrangements
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#1A1715]">
                  {BANQUET_HALL.name}
                </h2>
                <p className="text-xs sm:text-sm text-[#787069] font-light leading-relaxed">
                  {BANQUET_HALL.description}
                </p>
              </div>

              {/* Layout Capacities */}
              <div className="space-y-2.5">
                <span className="text-[10px] uppercase tracking-wider text-[#A27520] font-semibold block">
                  Flexible Seating Layouts:
                </span>
                <div className="grid grid-cols-2 gap-2.5">
                  {BANQUET_HALL.layouts.map((l, i) => (
                    <div key={i} className="p-3 rounded-xl bg-[#FAF7F2] border border-[#EDE7DE] space-y-0.5">
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] font-semibold text-[#1A1715]">{l.name}</span>
                        <span className="font-serif text-sm font-bold text-[#A27520]">{l.capacity} Pax</span>
                      </div>
                      {l.description && (
                        <span className="text-[9px] text-[#787069] block leading-tight">{l.description}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#4A443F] pt-1">
                {BANQUET_HALL.features.map((f, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 bg-[#A27520] rounded-full shrink-0" />
                    <span className="truncate">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Important Notices: AV on Request & Negotiable Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-[#E6DED3]">
            {/* AV Policy Card */}
            <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#EDE7DE] flex items-start space-x-3.5">
              <div className="w-9 h-9 rounded-xl bg-[#EFE8DE] flex items-center justify-center text-[#A27520] shrink-0 mt-0.5">
                <Projector className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <h4 className="font-serif text-base font-semibold text-[#1A1715]">
                  Projector &amp; Audio on Request
                </h4>
                <p className="text-xs text-[#787069] font-light leading-relaxed">
                  HD Projector, presentation screen, sound system, collar &amp; handheld microphones are <strong>available on advance request</strong>. Equipment rental charges apply and rates may vary based on your specific requirements.
                </p>
              </div>
            </div>

            {/* Pricing Policy Card */}
            <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#EDE7DE] flex items-start space-x-3.5">
              <div className="w-9 h-9 rounded-xl bg-[#EFE8DE] flex items-center justify-center text-[#A27520] shrink-0 mt-0.5">
                <Percent className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <h4 className="font-serif text-base font-semibold text-[#1A1715]">
                  Negotiable &amp; Customized Pricing
                </h4>
                <p className="text-xs text-[#787069] font-light leading-relaxed">
                  Hall standard tariffs are <strong>fully negotiable and customized</strong> according to your event duration, guest count, seating setup, and catering requirements. Submit an enquiry below or call us for best rates.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive RFP Form */}
        <div className="p-8 sm:p-12 rounded-3xl bg-[#FFFFFF] border border-[#E6DED3] shadow-lg space-y-8" id="rfp-form">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#A27520]">Proposal &amp; Tariff Request</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#1A1715]">
              Request Event Availability &amp; Negotiated Quote
            </h2>
            <p className="text-xs text-[#787069] font-light">
              Share your requirements. Our banquet manager will review your date, guest count, and catering needs to provide a tailored quote.
            </p>
          </div>

          {submitted ? (
            <div className="p-8 rounded-2xl bg-[#F5EFEB] border border-emerald-600/30 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#1A1715]">Enquiry Delivered to Banquet Desk</h3>
              <p className="text-xs text-[#4A443F] max-w-md mx-auto leading-relaxed">
                Thank you, <strong>{formData.name}</strong>! Your event enquiry for <strong>{formData.eventType}</strong> ({formData.attendees} Pax) on <strong>{formData.eventDate || "your requested date"}</strong> has been delivered. Our banquet manager will contact you on <strong>{formData.phone}</strong> or <strong>{formData.email}</strong> shortly with customized pricing.
              </p>
              <div className="pt-2 flex flex-wrap justify-center gap-3">
                <a
                  href={`tel:${HOTEL_INFO.phoneRaw}`}
                  className="px-5 py-2.5 text-xs font-semibold text-[#1A1715] bg-[#FFFFFF] border border-[#E6DED3] rounded-full hover:bg-white/80 shadow-sm"
                >
                  Instant Call: {HOTEL_INFO.phone}
                </a>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      eventType: "Corporate Seminar",
                      eventDate: "",
                      attendees: "50",
                      seatingLayout: "Theatre",
                      needProjectorAudio: "No",
                      cateringPlan: "Lunch Buffet",
                      name: "",
                      email: "",
                      phone: "",
                      notes: "",
                    });
                  }}
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-[#1A1715] rounded-full hover:bg-[#A27520] transition-colors shadow-sm"
                >
                  Submit another request
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
              {errorMessage && (
                <div className="sm:col-span-2 lg:col-span-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center space-x-2 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#A27520]">
                  Event Category *
                </label>
                <select
                  value={formData.eventType}
                  onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#E6DED3] rounded-xl p-3 text-xs text-[#1A1715] focus:outline-none focus:border-[#A27520]"
                >
                  <option value="Corporate Seminar">Corporate Seminar / Conference</option>
                  <option value="Executive Board Meeting">Executive Boardroom Meeting</option>
                  <option value="Dealer & Sales Meet">Dealer &amp; Sales Meet</option>
                  <option value="Training Workshop">Training Workshop</option>
                  <option value="Annaprashan Ceremony">Annaprashan Ceremony</option>
                  <option value="Birthday & Social Celebration">Birthday &amp; Social Celebration</option>
                  <option value="Ring Ceremony / Family Reception">Ring Ceremony / Family Reception</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#A27520]">
                  Target Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.eventDate}
                  onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#E6DED3] rounded-xl p-3 text-xs text-[#1A1715] focus:outline-none focus:border-[#A27520]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#A27520]">
                  Estimated Attendees *
                </label>
                <select
                  value={formData.attendees}
                  onChange={(e) => setFormData({ ...formData, attendees: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#E6DED3] rounded-xl p-3 text-xs text-[#1A1715] focus:outline-none focus:border-[#A27520]"
                >
                  <option value="15-30">15 – 30 Pax (Boardroom)</option>
                  <option value="30-60">30 – 60 Pax</option>
                  <option value="60-100">60 – 100 Pax</option>
                  <option value="100-150">100 – 150 Pax (Full Hall)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#A27520]">
                  Preferred Seating Layout
                </label>
                <select
                  value={formData.seatingLayout}
                  onChange={(e) => setFormData({ ...formData, seatingLayout: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#E6DED3] rounded-xl p-3 text-xs text-[#1A1715] focus:outline-none focus:border-[#A27520]"
                >
                  <option value="Theatre">Theatre Style (Up to 150 Pax)</option>
                  <option value="Social & Ceremonies">Social Celebration / Ceremonies (Up to 120 Pax)</option>
                  <option value="Classroom">Classroom Setup (Up to 80 Pax)</option>
                  <option value="U-Shape">U-Shape / Boardroom (Up to 45 Pax)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#A27520]">
                  Projector / Audio System (On Request)
                </label>
                <select
                  value={formData.needProjectorAudio}
                  onChange={(e) => setFormData({ ...formData, needProjectorAudio: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#E6DED3] rounded-xl p-3 text-xs text-[#1A1715] focus:outline-none focus:border-[#A27520]"
                >
                  <option value="No">No AV Needed</option>
                  <option value="Projector & Screen Only">Projector &amp; Screen (Rates on Request)</option>
                  <option value="Full AV & Microphones">Full AV: Projector, Screen &amp; Mics</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#A27520]">
                  Food &amp; Catering Plan
                </label>
                <select
                  value={formData.cateringPlan}
                  onChange={(e) => setFormData({ ...formData, cateringPlan: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#E6DED3] rounded-xl p-3 text-xs text-[#1A1715] focus:outline-none focus:border-[#A27520]"
                >
                  <option value="Lunch Buffet">Full Multi-Cuisine Lunch Buffet</option>
                  <option value="Dinner Buffet">Dinner Buffet Package</option>
                  <option value="Hi-Tea & Snacks">Hi-Tea &amp; Snacks Only</option>
                  <option value="No Catering / Hall Only">Hall Only (No Catering)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#A27520]">
                  Contact Person *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#E6DED3] rounded-xl p-3 text-xs text-[#1A1715] focus:outline-none focus:border-[#A27520]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#A27520]">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9876543210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#E6DED3] rounded-xl p-3 text-xs text-[#1A1715] focus:outline-none focus:border-[#A27520]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#A27520]">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. rahul@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#E6DED3] rounded-xl p-3 text-xs text-[#1A1715] focus:outline-none focus:border-[#A27520]"
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-3 space-y-1.5">
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#A27520]">
                  Special Requests / Additional Details (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Specify event timing, decoration preferences, budget considerations, or specific menu items..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#E6DED3] rounded-xl p-3 text-xs text-[#1A1715] focus:outline-none focus:border-[#A27520]"
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-3 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 text-xs font-bold uppercase tracking-[0.14em] text-white bg-[#1A1715] hover:bg-[#A27520] rounded-full shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending Event Enquiry...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Event Proposal Request</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
