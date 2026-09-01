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
    <div className="bg-[#FAF7F2] text-[#1A1715] min-h-screen pb-20">
      {/* Header */}
      <section className="py-20 sm:py-28 bg-[#F5EFEB] hairline-b text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#A27520] block">
            Location & Transit
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-normal text-[#1A1715]">
            Arrival & Connectivity Guide
          </h1>
          <p className="text-sm sm:text-base text-[#4A443F] max-w-xl mx-auto font-light leading-relaxed">
            Located in Paltan Bazaar, just 250 meters (3-minute walk) from the main exit of Guwahati Railway Station.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Map */}
          <div className="lg:col-span-8 rounded-3xl overflow-hidden border border-[#E6DED3] min-h-[420px] bg-[#FFFFFF] shadow-md relative">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3580.457814881026!2d91.7516!3d26.1824!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x375a597a7e800001%3A0x29f5f0b5d92a0000!2sHotel%20Ambarish%20Grand%20Residency!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "450px" }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            />
          </div>

          {/* Address Card */}
          <div className="lg:col-span-4 p-8 rounded-3xl bg-[#FFFFFF] border border-[#E6DED3] shadow-md flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#A27520] block hairline-b pb-2">
                Property Coordinates
              </span>
              <div className="space-y-3 text-xs text-[#4A443F] font-light">
                <div>
                  <strong className="text-[#1A1715] font-semibold block">{HOTEL_INFO.name}</strong>
                  <span>{HOTEL_INFO.address.full}</span>
                  <span className="text-[#A27520] mt-1 block font-medium">Landmark: {HOTEL_INFO.address.landmark}</span>
                </div>

                <div className="pt-2">
                  <span className="text-[#787069] block">Phone:</span>
                  <a href={`tel:${HOTEL_INFO.phoneRaw}`} className="text-[#1A1715] font-semibold text-sm hover:underline">
                    {HOTEL_INFO.phone}
                  </a>
                </div>

                <div>
                  <span className="text-[#787069] block">Email:</span>
                  <a href={`mailto:${HOTEL_INFO.email}`} className="text-[#1A1715] hover:underline">
                    {HOTEL_INFO.email}
                  </a>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EDE7DE] space-y-1 text-xs">
              <div className="flex items-center space-x-2 text-[#A27520] font-semibold">
                <Car className="w-4 h-4" />
                <span>Complimentary On-Site Parking</span>
              </div>
              <p className="text-[11px] text-[#787069]">
                Covered garage parking available for resident cars and two-wheelers.
              </p>
            </div>
          </div>
        </div>

        {/* Proximity Grid */}
        <div className="space-y-6">
          <h2 className="font-serif text-3xl font-normal text-[#1A1715]">
            Transit Proximities & Landmarks
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {HOTEL_INFO.transportDistances.map((item, idx) => {
              const Icon = getIcon(item.type);
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E6DED3] flex items-center justify-between shadow-sm"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2.5 rounded-xl bg-[#FAF7F2] text-[#A27520]">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-[#1A1715]">{item.name}</h4>
                      <p className="text-[11px] text-[#787069] mt-0.5">{item.time}</p>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-semibold text-[#A27520]">{item.distance}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
