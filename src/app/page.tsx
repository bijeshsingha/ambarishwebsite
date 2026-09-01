import React from "react";
import HeroSection from "@/components/home/HeroSection";
import TrustStrip from "@/components/home/TrustStrip";
import FeaturedRooms from "@/components/home/FeaturedRooms";
import SuiteSpotlight from "@/components/home/SuiteSpotlight";
import DiningPreview from "@/components/home/DiningPreview";
import BusinessPreview from "@/components/home/BusinessPreview";
import LocationPreview from "@/components/home/LocationPreview";
import GalleryProof from "@/components/home/GalleryProof";
import ClosingCTA from "@/components/home/ClosingCTA";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* 1 & 2: Utility Header + Hero with Booking Bar */}
      <HeroSection />

      {/* 3: Trust Strip */}
      <TrustStrip />

      {/* 4: Rooms Preview */}
      <FeaturedRooms />

      {/* 5: Suite Feature */}
      <SuiteSpotlight />

      {/* 6: Dining Preview */}
      <DiningPreview />

      {/* 7: Business Ready */}
      <BusinessPreview />

      {/* 8: Location & Transit */}
      <LocationPreview />

      {/* 9: Gallery / Proof */}
      <GalleryProof />

      {/* 10: Closing CTA */}
      <ClosingCTA />
    </div>
  );
}
