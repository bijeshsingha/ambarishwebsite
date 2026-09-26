"use client";

import React, { useState } from "react";
import Image from "next/image";
import { GALLERY_IMAGES } from "@/data/gallery";
import LightboxModal from "@/components/gallery/LightboxModal";

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  const categories = [
    { id: "all", label: "All" },
    { id: "rooms", label: "Rooms" },
    { id: "suites", label: "Suites" },
    { id: "bar", label: "Pavillion Bar" },
    { id: "dining", label: "Restaurant" },
    { id: "reception", label: "Lobby" },
    { id: "building", label: "Building" },
    { id: "meetings", label: "Banquets" },
  ];

  const filteredImages = GALLERY_IMAGES.filter((img) => {
    if (activeCategory === "all") return true;
    return img.category === activeCategory;
  });

  const openLightbox = (index: number) => {
    setActiveImgIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="bg-[#FAF8F5] text-[#1C1917] min-h-screen pb-20">
      {/* Header */}
      <section className="py-20 sm:py-28 bg-[#F4EFE6] border-b border-[#E7E2D9] text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#8F6B2A] block">
            Visual Archive
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-medium text-[#1C1917]">
            Authentic Photo Gallery
          </h1>
          <p className="text-sm sm:text-base text-[#44403C] max-w-xl mx-auto font-light leading-relaxed">
            Real photography of guest rooms, suites, restaurant, reception, and event venues at Hotel Ambarish Grand Residency.
          </p>
        </div>
      </section>

      {/* Main Gallery */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
        {/* Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              className={`px-4 py-2 rounded-full text-xs transition-all ${
                activeCategory === c.id
                  ? "bg-[#1C1917] text-[#FAF8F5] font-semibold shadow-md"
                  : "bg-[#FFFFFF] text-[#44403C] hover:text-[#1C1917] border border-[#E7E2D9]"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages.map((img, idx) => (
            <div
              key={img.id}
              onClick={() => openLightbox(idx)}
              className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer bg-[#FFFFFF] border border-[#E7E2D9] shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                <span className="text-sm font-serif font-light text-white">{img.title}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <LightboxModal
        images={filteredImages}
        currentIndex={activeImgIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={(newIdx) => setActiveImgIndex(newIdx)}
      />
    </div>
  );
}
