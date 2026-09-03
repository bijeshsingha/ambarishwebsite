"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Building2,
  Briefcase,
  Receipt,
  CreditCard,
  MapPin,
  Wifi,
  Clock,
  ShieldCheck,
  CheckCircle2,
  PhoneCall,
  Mail,
  Send,
  Loader2,
  AlertCircle,
  FileCheck,
  Users,
  ChevronRight,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { HOTEL_INFO } from "@/data/hotel-info";
import { ROOMS } from "@/data/rooms";
import { formatCurrencyINR } from "@/lib/formatters";

const corporateBenefits = [
  {
    icon: ShieldCheck,
    title: "Negotiated Corporate Tariffs",
    desc: "Guaranteed fixed ceiling tariffs year-round, shielding your business from seasonal surge pricing and peak travel inflation.",
  },
  {
    icon: Receipt,
    title: "100% Compliant GST Invoicing",
    desc: "Seamless B2B GST tax invoices with your company's GSTIN and state SAC codes (996311) for full input tax credit (ITC) claims.",
  },
  {
    icon: CreditCard,
    title: "Flexible Billing & Credit (BTC)",
    desc: "Approved corporate accounts enjoy Bill-to-Company (BTC) credit lines, company purchase order (PO) acceptance, or guest self-settlement.",
  },
  {
    icon: MapPin,
    title: "Prime Transit & Commercial Hub",
    desc: "Located on MD Shah Road, Paltan Bazaar — just 200m (3-minute walk) from Guwahati Railway Station and minutes from commercial hubs.",
  },
  {
    icon: Wifi,
    title: "Business-Ready Amenities",
    desc: "Complimentary high-speed fiber Wi-Fi, in-room work desks, hot beverage kettles, 24/7 front desk assistance, and on-site laundry.",
  },
  {
    icon: Briefcase,
    title: "Dedicated Relationship Manager",
    desc: "A single point of contact for corporate room blocks, executive VIP arrivals, billing reconciliations, and tailored event banquets.",
  },
];

export default function B2bCorporatePage() {
  // B2B page is currently disabled by admin request
  redirect("/");

  const [formData, setFormData] = useState({
    companyName: "",
    accountType: "CORPORATE",
    contactPerson: "",
    designation: "",
    email: "",
    phone: "",
    gstin: "",
    city: "Guwahati",
    state: "Assam",
    estimatedMonthlyRoomNights: "10-25",
    requiredMealPlans: ["EP (Room Only)", "CP (Room + Breakfast)"],
    billingPreference: "BILL_TO_COMPANY",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleMealPlanToggle = (plan: string) => {
    setFormData((prev) => {
      const exists = prev.requiredMealPlans.includes(plan);
      const updated = exists
        ? prev.requiredMealPlans.filter((p) => p !== plan)
        : [...prev.requiredMealPlans, plan];
      return { ...prev, requiredMealPlans: updated };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/v1/b2b/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit B2B corporate inquiry.");
      }

      setSubmitted(true);
    } catch (err: any) {
      setErrorMessage(err.message || "A network error occurred. Please call our sales team directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FAF7F2] text-[#1A1715] min-h-screen">
      {/* 1. Hero Section */}
      <section className="relative py-20 sm:py-28 bg-[#0C0B0B] text-[#F5EBDD] overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-25">
          <Image
            src="/images/polished/suite-living-wide.webp"
            alt="Corporate Stays at Hotel Ambarish Grand Residency Guwahati"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0C0B0B] via-[#0C0B0B]/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
          <div className="inline-flex items-center space-x-2 bg-white/10 border border-[#B4872F]/40 px-4 py-1.5 rounded-full backdrop-blur-md">
            <Building2 className="w-3.5 h-3.5 text-[#B4872F]" />
            <span className="text-[11px] font-mono tracking-widest uppercase text-[#F5EBDD] font-semibold">
              Corporate &bull; Travel Agents &bull; Government Tie-ups
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal leading-tight max-w-4xl mx-auto text-white">
            B2B &amp; Corporate Travel Partnerships
          </h1>

          <p className="text-sm sm:text-base text-[#D1C7BD] max-w-2xl mx-auto font-light leading-relaxed">
            Preferred room tariffs, 100% compliant GST input credit invoices, flexible Bill-To-Company (BTC) credit lines, and express check-in right at Guwahati&apos;s primary commercial junction.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <a
              href="#b2b-form"
              className="px-8 py-4 rounded-full bg-gradient-to-r from-[#B62576] to-[#92185C] text-white text-xs font-bold uppercase tracking-[0.14em] shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center space-x-2"
            >
              <span>Apply for Corporate Rates</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>

            <a
              href={`tel:${HOTEL_INFO.phoneRaw}`}
              className="px-6 py-4 rounded-full bg-white/10 hover:bg-white/20 text-[#F5EBDD] border border-white/15 text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-2"
            >
              <PhoneCall className="w-4 h-4 text-[#B4872F]" />
              <span>Corporate Desk: {HOTEL_INFO.phone}</span>
            </a>
          </div>

          {/* Key Stat Badges */}
          <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto text-left text-xs">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <span className="text-[#B4872F] font-mono text-base font-bold block">200m</span>
              <span className="text-[#A89F96] text-[11px]">From Guwahati Railway Station</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <span className="text-[#B4872F] font-mono text-base font-bold block">SAC 996311</span>
              <span className="text-[#A89F96] text-[11px]">Direct GST ITC Invoicing</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <span className="text-[#B4872F] font-mono text-base font-bold block">BTC Credit</span>
              <span className="text-[#A89F96] text-[11px]">Monthly Billing Facilities</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <span className="text-[#B4872F] font-mono text-base font-bold block">150 Pax</span>
              <span className="text-[#A89F96] text-[11px]">Banquet &amp; Seminar Halls</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Corporate Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <span className="text-[10px] font-mono tracking-widest text-[#A27520] uppercase font-semibold block">
            Why Corporates Choose Hotel Ambarish
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#1A1715] font-normal">
            Designed for Seamless Business Travel
          </h2>
          <p className="text-xs sm:text-sm text-[#787069] max-w-xl mx-auto font-light">
            We simplify hospitality procurement for companies, PSUs, medical professionals, and travel management companies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {corporateBenefits.map((b, idx) => {
            const Icon = b.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-white border border-[#E6DED3] hover:border-[#B4872F]/50 shadow-sm hover:shadow-md transition-all space-y-3"
              >
                <div className="w-11 h-11 rounded-2xl bg-[#FAF7F2] border border-[#EDE7DE] text-[#B62576] flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg text-[#1A1715] font-medium">{b.title}</h3>
                <p className="text-xs text-[#787069] font-light leading-relaxed">{b.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Rooms & Stays for Business Travellers */}
      <section className="py-16 bg-[#F5EFEB] hairline-y">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-[10px] font-mono tracking-widest text-[#A27520] uppercase font-semibold block">
                Executive Accommodations
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#1A1715]">
                Tailored for Single Executives &amp; Project Teams
              </h2>
            </div>
            <Link
              href="/rooms"
              className="text-xs font-bold uppercase tracking-wider text-[#B62576] hover:text-[#92185C] flex items-center gap-1"
            >
              <span>Explore All Rooms</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ROOMS.slice(0, 3).map((room) => (
              <div
                key={room.id}
                className="bg-white rounded-3xl overflow-hidden border border-[#E6DED3] shadow-sm flex flex-col justify-between"
              >
                <div className="relative h-48 w-full bg-[#EDE7DE]">
                  <Image
                    src={room.coverImage || room.images[0] || "/images/polished/suite-bedroom-full.webp"}
                    alt={room.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-[#0C0B0B]/85 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-mono font-bold text-[#F5EBDD]">
                    {room.bedType}
                  </div>
                </div>

                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <h3 className="font-serif text-lg font-medium text-[#1A1715]">{room.name}</h3>
                    <p className="text-xs text-[#787069] line-clamp-2 font-light">{room.shortDescription}</p>
                  </div>

                  <div className="pt-2 border-t border-[#EDE7DE] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[#787069] block">Standard Rate</span>
                      <strong className="font-mono text-sm text-[#A27520]">
                        {formatCurrencyINR(room.basePrice)}/nt
                      </strong>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#B62576] bg-[#FFF8FA] border border-[#B62576]/20 px-2.5 py-1 rounded-lg">
                      Special B2B Tariff Available
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Corporate Partnership Application Form */}
      <section id="b2b-form" className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E6DED3] shadow-lg space-y-8">
          <div className="text-center space-y-2 pb-4 border-b border-[#E6DED3]">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF8FA] text-[#B62576] flex items-center justify-center mx-auto mb-2">
              <FileCheck className="w-6 h-6" />
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#1A1715]">
              Request a Corporate Rate Contract
            </h2>
            <p className="text-xs text-[#787069] max-w-md mx-auto font-light">
              Submit your company details below. Our corporate sales team will review your estimated room volume and issue your company&apos;s custom rate matrix within 4 business hours.
            </p>
          </div>

          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl text-[#1A1715]">Corporate Application Received</h3>
              <p className="text-xs text-[#787069] max-w-md mx-auto leading-relaxed">
                Thank you, <strong>{formData.contactPerson}</strong>. Your corporate rate request for <strong>{formData.companyName}</strong> has been logged. A formal corporate agreement and preferential tariff card will be sent to <strong>{formData.email}</strong> shortly.
              </p>
              <div className="pt-4 flex justify-center gap-3">
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 rounded-full bg-[#1A1715] text-white text-xs uppercase tracking-wider font-bold hover:bg-[#A27520] transition-colors"
                >
                  Submit Another Inquiry
                </button>
                <Link
                  href="/"
                  className="px-6 py-2.5 rounded-full bg-[#FAF7F2] text-[#1A1715] border border-[#EDE7DE] text-xs uppercase tracking-wider font-bold hover:bg-[#EDE7DE] transition-colors"
                >
                  Return to Home
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 text-xs">
              {errorMessage && (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Step 1: Organization Details */}
              <div className="space-y-4">
                <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-[#A27520] border-b border-[#EDE7DE] pb-1.5">
                  1. Organization &amp; Account Category
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-semibold text-[#787069]">
                      Company / Organization Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tata Consultancy Services / Travel Agency Ltd"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      className="w-full p-3 rounded-xl bg-[#FAF7F2] border border-[#E6DED3] text-xs font-semibold text-[#1A1715] focus:outline-none focus:border-[#B62576]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-semibold text-[#787069]">
                      Account Type *
                    </label>
                    <select
                      value={formData.accountType}
                      onChange={(e) => setFormData({ ...formData, accountType: e.target.value })}
                      className="w-full p-3 rounded-xl bg-[#FAF7F2] border border-[#E6DED3] text-xs font-semibold text-[#1A1715] focus:outline-none focus:border-[#B62576] cursor-pointer"
                    >
                      <option value="CORPORATE">Corporate Enterprise / Private Ltd</option>
                      <option value="TRAVEL_AGENT">Travel Agency / DMC / Tour Operator</option>
                      <option value="GOVERNMENT">Government / PSU / Defence / Public Sector</option>
                      <option value="EVENT_ORGANIZER">Event Management / Production Company</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-semibold text-[#787069]">
                      Company GSTIN (For ITC)
                    </label>
                    <input
                      type="text"
                      placeholder="18AAAAA0000A1Z5"
                      value={formData.gstin}
                      onChange={(e) => setFormData({ ...formData, gstin: e.target.value.toUpperCase() })}
                      className="w-full p-3 rounded-xl bg-[#FAF7F2] border border-[#E6DED3] text-xs font-mono font-bold uppercase text-[#1A1715] focus:outline-none focus:border-[#B62576]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-semibold text-[#787069]">City</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full p-3 rounded-xl bg-[#FAF7F2] border border-[#E6DED3] text-xs font-semibold text-[#1A1715] focus:outline-none focus:border-[#B62576]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-semibold text-[#787069]">State</label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full p-3 rounded-xl bg-[#FAF7F2] border border-[#E6DED3] text-xs font-semibold text-[#1A1715] focus:outline-none focus:border-[#B62576]"
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Contact Person */}
              <div className="space-y-4 pt-2">
                <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-[#A27520] border-b border-[#EDE7DE] pb-1.5">
                  2. Authorized Contact Representative
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-semibold text-[#787069]">
                      Contact Person Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Sharma"
                      value={formData.contactPerson}
                      onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                      className="w-full p-3 rounded-xl bg-[#FAF7F2] border border-[#E6DED3] text-xs font-semibold text-[#1A1715] focus:outline-none focus:border-[#B62576]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-semibold text-[#787069]">
                      Designation / Role
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Travel Desk Manager / HR Head / Admin"
                      value={formData.designation}
                      onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                      className="w-full p-3 rounded-xl bg-[#FAF7F2] border border-[#E6DED3] text-xs font-semibold text-[#1A1715] focus:outline-none focus:border-[#B62576]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-semibold text-[#787069]">
                      Official Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. travel@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full p-3 rounded-xl bg-[#FAF7F2] border border-[#E6DED3] text-xs font-semibold text-[#1A1715] focus:outline-none focus:border-[#B62576]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-semibold text-[#787069]">
                      Phone / WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full p-3 rounded-xl bg-[#FAF7F2] border border-[#E6DED3] text-xs font-semibold text-[#1A1715] focus:outline-none focus:border-[#B62576]"
                    />
                  </div>
                </div>
              </div>

              {/* Step 3: Travel Volume & Billing Preference */}
              <div className="space-y-4 pt-2">
                <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-[#A27520] border-b border-[#EDE7DE] pb-1.5">
                  3. Travel Requirements &amp; Billing Preference
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-semibold text-[#787069]">
                      Estimated Monthly Room Nights
                    </label>
                    <select
                      value={formData.estimatedMonthlyRoomNights}
                      onChange={(e) => setFormData({ ...formData, estimatedMonthlyRoomNights: e.target.value })}
                      className="w-full p-3 rounded-xl bg-[#FAF7F2] border border-[#E6DED3] text-xs font-semibold text-[#1A1715] focus:outline-none focus:border-[#B62576] cursor-pointer"
                    >
                      <option value="5-10">5 – 10 Room Nights / Month</option>
                      <option value="10-25">10 – 25 Room Nights / Month</option>
                      <option value="25-50">25 – 50 Room Nights / Month</option>
                      <option value="50+">50+ Bulk Enterprise Volume</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-semibold text-[#787069]">
                      Billing &amp; Settlement Preference
                    </label>
                    <select
                      value={formData.billingPreference}
                      onChange={(e) => setFormData({ ...formData, billingPreference: e.target.value })}
                      className="w-full p-3 rounded-xl bg-[#FAF7F2] border border-[#E6DED3] text-xs font-semibold text-[#1A1715] focus:outline-none focus:border-[#B62576] cursor-pointer"
                    >
                      <option value="BILL_TO_COMPANY">Bill-To-Company (BTC Monthly Credit Invoice)</option>
                      <option value="DIRECT_PAYMENT_BY_GUEST">Direct Settlement by Guest (Card / UPI / Cash)</option>
                      <option value="COMPANY_PURCHASE_ORDER">Company PO / Release Order (Advance Wire)</option>
                    </select>
                  </div>
                </div>

                {/* Meal Plans Checkboxes */}
                <div className="space-y-1.5 pt-1">
                  <label className="text-[10px] uppercase font-semibold text-[#787069] block">
                    Preferred Meal Inclusions
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "EP (Room Only)",
                      "CP (Room + Breakfast)",
                      "MAP (Room + Breakfast & Dinner)",
                      "AP (All Meals Included)",
                    ].map((plan) => {
                      const checked = formData.requiredMealPlans.includes(plan);
                      return (
                        <button
                          key={plan}
                          type="button"
                          onClick={() => handleMealPlanToggle(plan)}
                          className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                            checked
                              ? "bg-[#FFF8FA] border-[#B62576] text-[#B62576]"
                              : "bg-[#FAF7F2] border-[#EDE7DE] text-[#4A443F]"
                          }`}
                        >
                          {checked ? "✓ " : "+ "} {plan}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Additional Notes */}
                <div className="space-y-1 pt-1">
                  <label className="text-[10px] uppercase font-semibold text-[#787069]">
                    Special Requirements / Upcoming Project Blocks (Optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tell us about your upcoming project stay, expected check-in dates, conference hall requirements, or customized billing cycles..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full p-3 rounded-xl bg-[#FAF7F2] border border-[#E6DED3] text-xs font-light text-[#1A1715] focus:outline-none focus:border-[#B62576]"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-full bg-gradient-to-r from-[#B62576] to-[#92185C] hover:from-[#C72E84] hover:to-[#A71C67] text-white text-xs font-bold uppercase tracking-[0.14em] shadow-xl transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center space-x-2 disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Transmitting Corporate Request...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Corporate Tie-Up Request</span>
                  </>
                )}
              </button>

              <p className="text-[11px] text-center text-[#787069]">
                🔒 Your corporate information is secure and handled directly by Hotel Ambarish sales administration.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* 5. Direct Helpdesk Strip */}
      <section className="py-12 bg-[#0C0B0B] text-[#F5EBDD] border-t border-white/10 text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-3">
          <h3 className="font-serif text-xl sm:text-2xl font-normal text-white">
            Need an Immediate Corporate Room Block for Tonight or Tomorrow?
          </h3>
          <p className="text-xs text-[#A89F96] font-light max-w-lg mx-auto">
            Contact our 24/7 Front Office &amp; Corporate Sales Hotline directly for urgent room bookings and invoice assistance.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a
              href={`tel:${HOTEL_INFO.phoneRaw}`}
              className="px-6 py-2.5 rounded-full bg-[#B4872F] hover:bg-[#966E22] text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Call: {HOTEL_INFO.phone}</span>
            </a>
            <a
              href={`mailto:${HOTEL_INFO.email}?subject=Corporate%20Tie-Up%20Inquiry`}
              className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-[#F5EBDD] border border-white/15 text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email Sales Desk</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
