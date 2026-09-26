"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Utensils,
  Clock,
  Phone,
  ArrowUpRight,
  Check,
  Search,
  Wine,
  MapPin,
  Flame,
  GlassWater,
  ShieldCheck,
} from "lucide-react";
import { DINING_INFO, PAVILLION_BAR_INFO } from "@/data/dining";
import { HOTEL_INFO } from "@/data/hotel-info";

export default function DiningPage() {
  const [activePhotoIdx, setActivePhotoIdx] = useState<number>(0);
  const [activeBarPhotoIdx, setActiveBarPhotoIdx] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [vegOnly, setVegOnly] = useState<boolean>(false);

  const categories = [
    "All",
    "Breakfast",
    "Snacks & Starters",
    "Chinese",
    "Main Course",
    "Rice & Biryani",
    "Salads & Raita",
    "Beverages",
  ];

  const filteredMenu = DINING_INFO.fullMenu.filter((item) => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesVeg = vegOnly ? item.isVeg : true;
    return matchesCategory && matchesSearch && matchesVeg;
  });

  return (
    <div className="bg-[#FAF8F5] text-[#1C1917] min-h-screen pb-24">
      {/* Header Banner */}
      <section className="py-20 sm:py-28 bg-[#F4EFE6] border-b border-[#E7E2D9] text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#8F6B2A] block">
            Culinary &amp; Lounge Experiences
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-medium text-[#1C1917]">
            Dining &amp; Pavillion Bar
          </h1>
          <p className="text-sm sm:text-base text-[#44403C] max-w-2xl mx-auto font-light leading-relaxed">
            Wholesome multi-cuisine flavors at The Ambarish Restaurant and relaxing evenings with fine spirits at the Pavillion Bar.
          </p>

          {/* Quick Anchor Switcher */}
          <div className="pt-4 flex flex-wrap justify-center gap-3">
            <a
              href="#restaurant"
              className="px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#1C1917] text-white hover:bg-[#8F6B2A] transition-all shadow-sm"
            >
              The Ambarish Restaurant &rarr;
            </a>
            <a
              href="#pavillion-bar"
              className="px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#8F6B2A] text-white hover:bg-[#73551E] transition-all shadow-sm flex items-center gap-1.5"
            >
              <Wine className="w-3.5 h-3.5" />
              <span>Pavillion Bar &rarr;</span>
            </a>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-28">
        
        {/* ========================================================================= */}
        {/* SECTION 1: THE AMBARISH RESTAURANT */}
        {/* ========================================================================= */}
        <div id="restaurant" className="space-y-16 scroll-mt-24">
          {/* Restaurant Photography & Narrative */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Main Authentic Restaurant Photo Gallery */}
            <div className="lg:col-span-7 space-y-4">
              <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-[#F4EFE6] border border-[#E7E2D9] shadow-md group">
                <Image
                  src={DINING_INFO.images[activePhotoIdx % DINING_INFO.images.length]}
                  alt="The Ambarish Restaurant Dining Hall - Hotel Ambarish Guwahati"
                  fill
                  className="object-cover transition-all duration-500 ease-out group-hover:scale-105"
                  priority
                />
                <div className="absolute top-4 left-4">
                  <span className="text-[10px] font-sans uppercase tracking-widest text-[#1C1917] bg-[#FFFFFF]/95 backdrop-blur-md px-3 py-1 rounded-full border border-[#E7E2D9] font-semibold shadow-sm">
                    Dining Hall • Photo {activePhotoIdx + 1} of {DINING_INFO.images.length}
                  </span>
                </div>
              </div>

              {/* Thumbnails */}
              <div className="grid grid-cols-5 gap-2.5">
                {DINING_INFO.images.map((imgSrc, idx) => (
                  <button
                    key={imgSrc}
                    onClick={() => setActivePhotoIdx(idx)}
                    className={`relative aspect-[16/11] rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                      activePhotoIdx === idx
                        ? "border-[#8F6B2A] ring-2 ring-[#8F6B2A]/30 scale-[1.02]"
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={imgSrc}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="150px"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Narrative Info */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-3">
                <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#8F6B2A] block">
                  Fresh &amp; Authentic
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-medium text-[#1C1917] leading-tight">
                  The Ambarish Restaurant
                </h2>
                <p className="text-xs sm:text-sm text-[#44403C] font-light leading-relaxed">
                  {DINING_INFO.description}
                </p>
              </div>

              {/* Intercom Direct Dial Box */}
              <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E7E2D9] space-y-3 shadow-sm text-xs">
                <span className="font-semibold text-[#8F6B2A] uppercase text-[10px] tracking-wider block">
                  Room Service &amp; Kitchen Orders
                </span>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[#78716C] block">Intercom Dial:</span>
                    <span className="font-sans text-base font-bold text-[#1C1917]">Ext 9 / Ext 555</span>
                  </div>
                  <div>
                    <span className="text-[#78716C] block">Prep Time:</span>
                    <span className="font-serif text-sm font-semibold text-[#8F6B2A]">~40 Minutes</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={`tel:${HOTEL_INFO.phoneRaw}`}
                  className="btn-heritage-primary inline-flex items-center text-xs tracking-wider"
                >
                  <Phone className="w-3.5 h-3.5 mr-2" />
                  <span>Call Restaurant: {HOTEL_INFO.phone}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Timings */}
          <div className="space-y-6">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8F6B2A]">Service Schedule</span>
              <h3 className="font-serif text-3xl font-medium text-[#1C1917]">Service Hours</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {DINING_INFO.timings.map((t, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E7E2D9] space-y-3 shadow-sm hover:shadow-md transition-shadow"
                >
                  <span className="text-[10px] uppercase font-sans tracking-widest text-[#8F6B2A] font-bold block">
                    {t.hours}
                  </span>
                  <h4 className="font-serif text-xl font-medium text-[#1C1917]">{t.meal}</h4>
                  <p className="text-xs text-[#78716C] font-light leading-relaxed">{t.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Chef's Signature Dishes Section */}
          <div className="space-y-8 pt-4">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8F6B2A] block">
                Culinary Signatures
              </span>
              <h3 className="font-serif text-3xl sm:text-4xl font-medium text-[#1C1917]">
                Chef&apos;s Signature House Specialties
              </h3>
              <p className="text-xs sm:text-sm text-[#78716C] font-light leading-relaxed">
                Cooked fresh to order using traditional Assamese spices and rich regional flavors.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {DINING_INFO.featuredDishes.map((dish) => (
                <div
                  key={dish.id}
                  className="group rounded-3xl bg-[#FFFFFF] border border-[#E7E2D9] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F4EFE6]">
                    <Image
                      src={dish.image}
                      alt={dish.name}
                      fill
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] font-sans font-semibold uppercase tracking-wider bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-[#1C1917] shadow-sm border border-[#E7E2D9]">
                        {dish.tag}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span
                        className={`w-4 h-4 border rounded-sm flex items-center justify-center bg-white/95 shadow-sm ${
                          dish.isVeg ? "border-green-600" : "border-red-600"
                        }`}
                        title={dish.isVeg ? "Vegetarian" : "Non-Vegetarian"}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            dish.isVeg ? "bg-green-600" : "bg-red-600"
                          }`}
                        />
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <span className="text-[10px] font-sans text-[#8F6B2A] uppercase tracking-wider font-semibold block">
                        {dish.category}
                      </span>
                      <h4 className="font-serif text-lg font-medium text-[#1C1917] mt-0.5">
                        {dish.name}
                      </h4>
                      <p className="text-xs text-[#78716C] font-light leading-relaxed mt-1 line-clamp-2">
                        {dish.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#E7E2D9] flex items-center justify-between">
                      <span className="text-xs text-[#78716C] font-sans">Price:</span>
                      <span className="font-serif text-xl font-bold text-[#8F6B2A]">
                        ₹{dish.price}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Full A La Carte Menu Section */}
          <div className="space-y-6 pt-4">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#B4872F]">
                Full À La Carte Menu
              </span>
              <h3 className="font-serif text-3xl sm:text-4xl font-medium text-[#0C0B0B]">
                Explore Our 70+ Item Menu
              </h3>
              <p className="text-xs sm:text-sm text-[#7A7067] font-light leading-relaxed">
                Filter by cuisine category or search for your favorite dish.
              </p>
            </div>

            {/* Controls: Search + Veg Filter */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Search */}
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-[#78716C] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search dishes (e.g. Biryani, Paneer)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-full bg-[#FFFFFF] border border-[#E7E2D9] text-xs text-[#1C1917] placeholder-[#78716C] focus:outline-none focus:border-[#8F6B2A] shadow-sm"
                />
              </div>

              {/* Veg Toggle */}
              <div className="flex items-center space-x-3">
                <label className="flex items-center space-x-2 cursor-pointer text-xs font-semibold bg-[#FFFFFF] px-4 py-2 rounded-full border border-[#E7E2D9] shadow-sm">
                  <input
                    type="checkbox"
                    checked={vegOnly}
                    onChange={(e) => setVegOnly(e.target.checked)}
                    className="rounded text-green-700 focus:ring-green-600"
                  />
                  <span className="text-stone-800 flex items-center">
                    <span className="w-2.5 h-2.5 border border-green-700 rounded-sm flex items-center justify-center mr-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-700" />
                    </span>
                    Pure Veg Only
                  </span>
                </label>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 pb-2 overflow-x-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                    selectedCategory === cat
                      ? "bg-[#1C1917] text-[#FAF8F5] font-semibold shadow-md"
                      : "bg-[#FFFFFF] text-[#44403C] hover:text-[#1C1917] border border-[#E7E2D9]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Menu Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMenu.map((item, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E7E2D9] shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-sans text-[#8F6B2A] font-semibold">
                        {item.category}
                      </span>
                      <span
                        className={`w-3.5 h-3.5 border rounded-sm flex items-center justify-center ${
                          item.isVeg ? "border-green-600" : "border-red-600"
                        }`}
                        title={item.isVeg ? "Vegetarian" : "Non-Vegetarian"}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            item.isVeg ? "bg-green-600" : "bg-red-600"
                          }`}
                        />
                      </span>
                    </div>

                    <div className="flex justify-between items-baseline">
                      <h4 className="font-serif text-lg font-medium text-[#1C1917]">{item.name}</h4>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#E7E2D9] flex justify-between items-baseline text-xs">
                    <span className="text-[#78716C]">Rate:</span>
                    <span className="font-serif text-lg font-bold text-[#8F6B2A]">₹{item.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION 2: PAVILLION BAR */}
        {/* ========================================================================= */}
        <div id="pavillion-bar" className="scroll-mt-24 pt-8">
          <div className="bg-[#1F1C1A] text-[#FAF8F5] rounded-[2.5rem] p-8 sm:p-14 lg:p-16 border border-[#332D28] shadow-2xl space-y-14">
            
            {/* Bar Header */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              {/* Text Narrative */}
              <div className="lg:col-span-6 space-y-6">
                <div className="space-y-3">
                  <div className="inline-flex items-center space-x-2 bg-[#2B2622] border border-[#8F6B2A]/40 px-3.5 py-1.5 rounded-full">
                    <Wine className="w-3.5 h-3.5 text-[#8F6B2A]" />
                    <span className="text-[10px] uppercase font-sans tracking-widest text-[#B3863E] font-semibold">
                      Hotel Lounge &amp; Bar • 2nd Floor
                    </span>
                  </div>

                  <h2 className="font-serif text-4xl sm:text-5xl font-medium text-white leading-tight">
                    {PAVILLION_BAR_INFO.name}
                  </h2>

                  <p className="text-[#C4BDB5] text-sm sm:text-base font-light leading-relaxed">
                    {PAVILLION_BAR_INFO.description}
                  </p>
                </div>

                {/* Location & Timing Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-[#26221F] border border-[#38322D] space-y-1">
                    <div className="flex items-center space-x-2 text-[#B3863E] font-semibold">
                      <Clock className="w-4 h-4" />
                      <span>Operating Hours</span>
                    </div>
                    <p className="text-white font-medium">{PAVILLION_BAR_INFO.hours}</p>
                    <p className="text-[11px] text-[#A8A29E]">Cocktails &amp; bar bites served</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#26221F] border border-[#38322D] space-y-1">
                    <div className="flex items-center space-x-2 text-[#B3863E] font-semibold">
                      <MapPin className="w-4 h-4" />
                      <span>Location</span>
                    </div>
                    <p className="text-white font-medium">{PAVILLION_BAR_INFO.location}</p>
                    <p className="text-[11px] text-[#A8A29E]">2nd Floor elevator &amp; staircase access</p>
                  </div>
                </div>

                {/* Features Checklist */}
                <div className="space-y-2.5 pt-2">
                  {PAVILLION_BAR_INFO.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start space-x-3 text-xs text-[#E7E2D9]">
                      <div className="w-4 h-4 rounded-full bg-[#8F6B2A]/30 text-[#B3863E] flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <a
                    href={`tel:${HOTEL_INFO.phoneRaw}`}
                    className="btn-heritage-primary inline-flex items-center text-xs tracking-wider"
                  >
                    <Phone className="w-3.5 h-3.5 mr-2" />
                    <span>Inquire or Reserve: {HOTEL_INFO.phone}</span>
                  </a>
                </div>
              </div>

              {/* Interactive Bar Photo Gallery */}
              <div className="lg:col-span-6 space-y-4">
                <div className="relative aspect-[16/10] sm:aspect-[4/3] w-full rounded-2xl overflow-hidden bg-[#26221F] border border-[#38322D] shadow-2xl group">
                  <Image
                    src={PAVILLION_BAR_INFO.images[activeBarPhotoIdx].src}
                    alt={PAVILLION_BAR_INFO.images[activeBarPhotoIdx].alt}
                    fill
                    className="object-cover transition-all duration-500 ease-out group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                    <div>
                      <span className="text-[10px] font-sans uppercase tracking-widest text-[#B3863E] block">
                        Pavillion Bar View
                      </span>
                      <p className="text-xs sm:text-sm text-white font-medium">
                        {PAVILLION_BAR_INFO.images[activeBarPhotoIdx].caption}
                      </p>
                    </div>
                    <span className="text-[10px] font-sans text-[#D6D3D1] bg-black/60 px-2.5 py-1 rounded-full backdrop-blur-sm border border-white/10">
                      {activeBarPhotoIdx + 1} / {PAVILLION_BAR_INFO.images.length}
                    </span>
                  </div>
                </div>

                {/* 5 Thumbnails */}
                <div className="grid grid-cols-5 gap-2.5">
                  {PAVILLION_BAR_INFO.images.map((img, idx) => (
                    <button
                      key={img.src}
                      onClick={() => setActiveBarPhotoIdx(idx)}
                      className={`relative aspect-[16/11] rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                        activeBarPhotoIdx === idx
                          ? "border-[#8F6B2A] ring-2 ring-[#8F6B2A]/40 scale-[1.03]"
                          : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                      aria-label={`View photo ${idx + 1}`}
                    >
                      <Image
                        src={img.src}
                        alt={img.alt}
                        fill
                        className="object-cover"
                        sizes="120px"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Highlights Grid */}
            <div className="pt-10 border-t border-[#332D28] space-y-6">
              <div className="text-center max-w-xl mx-auto space-y-1.5">
                <span className="text-[10px] uppercase font-sans tracking-widest text-[#B3863E] font-semibold">
                  What We Offer
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-medium text-white">
                  Signature Lounge Experiences
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {PAVILLION_BAR_INFO.highlights.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-6 rounded-2xl bg-[#26221F] border border-[#38322D] space-y-2 hover:border-[#8F6B2A]/50 transition-colors"
                  >
                    <span className="text-[10px] font-sans uppercase tracking-wider text-[#B3863E] font-bold block">
                      {item.category}
                    </span>
                    <h4 className="font-serif text-lg text-white font-medium">{item.name}</h4>
                    <p className="text-xs text-[#A8A29E] font-light leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
