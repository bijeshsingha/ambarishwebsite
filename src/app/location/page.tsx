import React from "react";
import {
  MapPin,
  Train,
  Plane,
  Bus,
  Compass,
  Phone,
  Mail,
  Car,
  ExternalLink,
  Navigation,
  Clock,
} from "lucide-react";
import { HOTEL_INFO } from "@/data/hotel-info";

export default function LocationPage() {
  const getIcon = (type: string) => {
    switch (type) {
      case "rail":
        return Train;
      case "air":
        return Plane;
      case "bus":
        return Bus;
      default:
        return Compass;
    }
  };

  return (
    <div className="bg-[#FAF8F5] text-[#1C1917] min-h-screen pb-20">
      {/* Header */}
      <section className="py-20 sm:py-28 bg-[#F4EFE6] border-b border-[#E7E2D9] text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#8F6B2A] block">
            Location &amp; Transit
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-medium text-[#1C1917]">
            Arrival &amp; Connectivity Guide
          </h1>
          <p className="text-sm sm:text-base text-[#44403C] max-w-xl mx-auto font-light leading-relaxed">
            Located in Paltan Bazaar, just 250 meters (3-minute walk) from the main exit of Guwahati Railway Station.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Map */}
          <div className="lg:col-span-8 rounded-3xl overflow-hidden border border-[#E7E2D9] min-h-[450px] bg-[#F4EFE6] shadow-md relative">
            <iframe
              title="Hotel Ambarish Grand Residency Location Map"
              src="https://maps.google.com/maps?q=Hotel+Ambarish+Grand+Residency,+Md+Shah+Road,+Paltan+Bazaar,+Guwahati,+Assam+781008&t=&z=16&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "450px" }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            />
            <div className="absolute top-4 right-4 z-10">
              <a
                href="https://maps.google.com/?q=Hotel+Ambarish+Grand+Residency+Paltan+Bazaar+Guwahati"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/95 text-[#1C1917] hover:text-[#8F6B2A] hover:bg-white text-xs font-medium shadow-md backdrop-blur-sm border border-[#E7E2D9] transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#8F6B2A]" />
                <span>Open in Google Maps</span>
              </a>
            </div>
          </div>

          {/* Address Card */}
          <div className="lg:col-span-4 p-8 rounded-3xl bg-[#FFFFFF] border border-[#E7E2D9] shadow-md flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8F6B2A] block border-b border-[#E7E2D9] pb-2">
                Property Coordinates
              </span>
              <div className="space-y-3 text-xs text-[#44403C] font-light">
                <div>
                  <strong className="text-[#1C1917] font-semibold block">{HOTEL_INFO.name}</strong>
                  <span>{HOTEL_INFO.address.full}</span>
                  <span className="text-[#8F6B2A] mt-1 block font-medium">Landmark: {HOTEL_INFO.address.landmark}</span>
                </div>

                <div className="pt-2">
                  <span className="text-[#78716C] block">Phone:</span>
                  <a href={`tel:${HOTEL_INFO.phoneRaw}`} className="text-[#1C1917] font-semibold text-sm hover:underline">
                    {HOTEL_INFO.phone}
                  </a>
                </div>

                <div>
                  <span className="text-[#78716C] block">Email:</span>
                  <a href={`mailto:${HOTEL_INFO.email}`} className="text-[#1C1917] hover:underline">
                    {HOTEL_INFO.email}
                  </a>
                </div>

                <div className="pt-2 border-t border-[#E7E2D9]">
                  <span className="text-[#78716C] block text-[10px] uppercase font-semibold tracking-wider">
                    Follow Our Updates
                  </span>
                  <div className="flex items-center gap-3 mt-1.5 text-xs">
                    <a
                      href={HOTEL_INFO.socials.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#8F6B2A] hover:text-[#684E1E] font-medium underline inline-flex items-center gap-1"
                    >
                      Instagram
                    </a>
                    <span className="text-[#D6CEBE]">•</span>
                    <a
                      href={HOTEL_INFO.socials.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#8F6B2A] hover:text-[#684E1E] font-medium underline inline-flex items-center gap-1"
                    >
                      Facebook
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E7E2D9] space-y-1 text-xs">
              <div className="flex items-center space-x-2 text-[#8F6B2A] font-semibold">
                <Car className="w-4 h-4" />
                <span>Complimentary On-Site Parking</span>
              </div>
              <p className="text-[11px] text-[#78716C]">
                Covered garage parking available for resident cars and two-wheelers.
              </p>
            </div>
          </div>
        </div>

        {/* Proximity Grid */}
        <div className="space-y-6">
          <h2 className="font-serif text-3xl font-medium text-[#1C1917]">
            Transit Proximities &amp; Landmarks
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {HOTEL_INFO.transportDistances.map((item, idx) => {
              const Icon = getIcon(item.type);
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E7E2D9] flex items-center justify-between shadow-sm"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2.5 rounded-xl bg-[#FAF8F5] text-[#8F6B2A]">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-[#1C1917]">{item.name}</h4>
                      <p className="text-[11px] text-[#78716C] mt-0.5">{item.time}</p>
                    </div>
                  </div>
                  <span className="font-sans text-xs font-semibold text-[#8F6B2A]">{item.distance}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
