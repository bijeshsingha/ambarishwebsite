export interface MeetingLayout {
  name: string;
  capacity: number;
  description?: string;
}

export interface MeetingSpace {
  id: string;
  name: string;
  tagline: string;
  description: string;
  images: string[];
  capacityMax: number;
  areaSqFt: number;
  layouts: MeetingLayout[];
  features: string[];
  pricingNote: string;
  avPolicy: string;
}

export const BANQUET_HALL: MeetingSpace = {
  id: "grand-banquet-hall",
  name: "The Grand Residency Banquet & Multi-Purpose Hall",
  tagline: "Single spacious air-conditioned hall custom-configurable for corporate conferences, seminars, executive meetings, and social celebrations.",
  description:
    "Hotel Ambarish features a versatile pillar-free banquet hall in Paltan Bazaar that adapts to your exact event requirements — from corporate conferences and boardroom discussions to family celebrations (Annaprashan, birthdays, ring ceremonies, and receptions).",
  images: [
    "/images/polished/banquet-meeting-in-use.webp",
    "/images/polished/banquet-event-ceremony.webp",
    "/images/polished/banquet-boardroom-wide.webp",
    "/images/polished/banquet-boardroom-front.webp",
  ],
  capacityMax: 150,
  areaSqFt: 1800,
  pricingNote: "Hall pricing is fully negotiable & tailored according to your event duration, attendee count, seating setup, and catering requirements. Please submit an enquiry for customized quotes.",
  avPolicy: "HD Projector, presentation screen, sound system, collar & handheld microphones are available on advance request (charges apply and rates may vary based on equipment needs).",
  layouts: [
    { name: "Theatre Style", capacity: 150, description: "Ideal for corporate addresses, seminars, and presentations" },
    { name: "Social & Ceremonies", capacity: 120, description: "Celebrations, Annaprashan, family gatherings & receptions" },
    { name: "Classroom Setup", capacity: 80, description: "Workshops, corporate training, and delegation meets" },
    { name: "U-Shape / Boardroom", capacity: 45, description: "Executive leadership discussions and committee meetings" },
  ],
  features: [
    "Single versatile hall with flexible layout configurations",
    "Centralized climate control and powerful air conditioning",
    "High-speed dedicated business Wi-Fi",
    "Projector & Screen setup (available on request, rates vary)",
    "Audio system, collar & handheld mics (available on request)",
    "Customizable multi-cuisine buffet & hi-tea catering",
    "Full 24-hour generator power backup",
    "Dedicated on-site banquet coordinator",
  ],
};

export const MEETING_SPACES: MeetingSpace[] = [BANQUET_HALL];
