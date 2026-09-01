"use client";

import React, { useEffect, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { GalleryImage } from "@/data/gallery";

interface LightboxModalProps {
  images: GalleryImage[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (newIndex: number) => void;
}

export default function LightboxModal({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
}: LightboxModalProps) {
  const currentImage = images[currentIndex] || images[0];

  const handlePrev = useCallback(() => {
    if (images.length === 0) return;
    const newIdx = (currentIndex - 1 + images.length) % images.length;
    onNavigate(newIdx);
  }, [currentIndex, images.length, onNavigate]);

  const handleNext = useCallback(() => {
    if (images.length === 0) return;
    const newIdx = (currentIndex + 1) % images.length;
    onNavigate(newIdx);
  }, [currentIndex, images.length, onNavigate]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose, handlePrev, handleNext]);

  if (!isOpen || !currentImage) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image gallery lightbox preview"
      className="fixed inset-0 z-[100] bg-black/95 flex flex-col justify-between p-4 sm:p-6 animate-fade-in"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between text-white z-10">
        <div className="text-xs font-mono tracking-widest text-[#B4872F] uppercase">
          {currentIndex + 1} / {images.length} • {currentImage.categoryLabel}
        </div>

        <button
          onClick={onClose}
          aria-label="Close lightbox"
          className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Image Area */}
      <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
        {/* Prev Button */}
        {images.length > 1 && (
          <button
            onClick={handlePrev}
            aria-label="Previous photo"
            className="absolute left-2 sm:left-6 z-10 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/10 transition-all backdrop-blur-sm"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {/* The Image */}
        <div className="relative w-full h-full max-w-5xl max-h-[75vh]">
          <Image
            src={currentImage.src}
            alt={currentImage.alt || currentImage.title}
            fill
            className="object-contain"
            priority
            sizes="100vw"
          />
        </div>

        {/* Next Button */}
        {images.length > 1 && (
          <button
            onClick={handleNext}
            aria-label="Next photo"
            className="absolute right-2 sm:right-6 z-10 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/10 transition-all backdrop-blur-sm"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Bottom Caption */}
      <div className="text-center z-10 max-w-2xl mx-auto space-y-1">
        <h3 className="font-serif text-lg sm:text-xl text-[#F5EBDD] font-normal">
          {currentImage.title}
        </h3>
        {currentImage.caption && (
          <p className="text-xs text-[#F5EBDD]/60 font-light">
            {currentImage.caption}
          </p>
        )}
      </div>
    </div>
  );
}
