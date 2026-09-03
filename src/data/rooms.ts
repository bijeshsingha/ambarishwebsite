export interface RatePlan {
  id: string;
  code: string;
  name: string;
  mealPlan: "EP" | "CP" | "MAP";
  description: string;
  pricePerNight: number;
  inclusions: string[];
}

export interface RoomCategory {
  id: string;
  slug: string;
  name: string;
  categoryCode: string;
  tagline: string;
  shortDescription: string;
  fullDescription: string;
  coverImage: string;
  images: string[];
  bedType: string;
  capacity: {
    adults: number;
    children: number;
    maxGuests: number;
  };
  sizeSqFt: number;
  view: string;
  acType: "Split Air Conditioning" | "Central AC" | "Dual AC";
  smokingPolicy: "Non-Smoking";
  basePrice: number; // Base EP price
  ratePlans: RatePlan[];
  amenities: {
    iconName: string;
    label: string;
  }[];
  highlights: string[];
  houseRules: string[];
}

export const ROOMS: RoomCategory[] = [
  {
    id: "rt-deluxe-king",
    slug: "deluxe-room",
    name: "Double Deluxe Room",
    categoryCode: "DLX",
    tagline: "Spacious comfort with premium bedding in King or Twin configurations.",
    shortDescription:
      "Modern 240 sq ft air-conditioned sanctuary featuring a plush King Bed or Twin Beds, workspace desk, 43\" LED TV, and fast Wi-Fi.",
    fullDescription:
      "Designed specifically for corporate travelers and transit guests who value peace, cleanliness, and comfort. The Double Deluxe Room offers generous natural light, crisp premium linens (available in King or Twin bed layouts), an executive work table, split air conditioning, and a sparkling private bathroom with high-pressure hot geyser shower.",
    coverImage: "/images/polished/deluxe-king.webp",
    images: [
      "/images/polished/deluxe-king.webp",
      "/images/polished/deluxe-twin-wide.webp",
      "/images/polished/deluxe-twin-portrait.webp",
      "/images/polished/suite-bathroom.webp",
    ],
    bedType: "1 King Bed or 2 Twin Beds",
    capacity: {
      adults: 2,
      children: 1,
      maxGuests: 3,
    },
    sizeSqFt: 240,
    view: "City View / Paltan Bazaar",
    acType: "Split Air Conditioning",
    smokingPolicy: "Non-Smoking",
    basePrice: 2000,
    ratePlans: [
      {
        id: "plan-dlx-ep",
        code: "EP",
        name: "European Plan (Room Only)",
        mealPlan: "EP",
        description: "Stay only, pay for meals as you order from our multi-cuisine restaurant.",
        pricePerNight: 2000,
        inclusions: ["High-speed Wi-Fi", "Daily housekeeping", "Complimentary mineral water bottle", "Tea/Coffee maker"],
      },
      {
        id: "plan-dlx-cp",
        code: "CP",
        name: "Continental Plan (With Buffet Breakfast)",
        mealPlan: "CP",
        description: "Includes freshly prepared multi-cuisine buffet breakfast at The Ambarish Restaurant.",
        pricePerNight: 2400,
        inclusions: [
          "Delicious buffet breakfast (7:30 AM - 10:30 AM)",
          "High-speed Wi-Fi",
          "Daily housekeeping",
          "Complimentary mineral water bottle",
          "Tea/Coffee maker",
        ],
      },
    ],
    amenities: [
      { iconName: "Wind", label: "Split Air Conditioning" },
      { iconName: "Wifi", label: "Free High-Speed Wi-Fi" },
      { iconName: "Tv", label: "43\" HD Smart LED TV" },
      { iconName: "Coffee", label: "Electric Kettle & Tea/Coffee Bar" },
      { iconName: "Briefcase", label: "Work Desk & Ergonomic Chair" },
      { iconName: "Bath", label: "Attached Bathroom with 24/7 Geyser" },
      { iconName: "ShieldCheck", label: "Intercom & Electronic Lock" },
      { iconName: "Sparkles", label: "Daily Fresh Housekeeping & Toiletries" },
    ],
    highlights: [
      "Most popular choice for business executives and transit guests",
      "Available in King Bed or Twin Bed options",
      "Ergonomic work desk with convenient power sockets",
      "Sound-insulated glass to ensure peaceful sleep",
      "Just 3 minutes walk from Guwahati Railway Station",
    ],
    houseRules: [
      "Check-in: 11:00 AM | Check-out: 12:00 PM",
      "Valid Government Photo ID required for all adult guests (Aadhaar / Passport / Driving License)",
      "Non-smoking room throughout",
      "Extra adult (pax): ₹500/night with extra mattress | Children stay free (using existing bedding)",
    ],
  },
  {
    id: "rt-executive",
    slug: "executive-room",
    name: "Executive King Room",
    categoryCode: "EXE",
    tagline: "Elevated elegance with upgraded amenities and dedicated lounge seating.",
    shortDescription:
      "A premium 290 sq ft room featuring an ultra-comfortable King Bed, sofa seating area, Smart TV, tea & coffee station, and complimentary high-speed internet.",
    fullDescription:
      "The Executive Room offers enhanced spaciousness and sophisticated decor for senior professionals and couples seeking that extra touch of refinement. Equipped with a sofa lounge, dedicated executive workstation, electric tea/coffee maker, and premium bathroom fittings with plush bath towels.",
    coverImage: "/images/polished/executive-king-wide.webp",
    images: [
      "/images/polished/executive-king-wide.webp",
      "/images/polished/executive-king-feature.webp",
      "/images/polished/suite-bathroom.webp",
    ],
    bedType: "1 Extra-Comfort King Bed",
    capacity: {
      adults: 2,
      children: 1,
      maxGuests: 3,
    },
    sizeSqFt: 290,
    view: "Panoramic City View",
    acType: "Split Air Conditioning",
    smokingPolicy: "Non-Smoking",
    basePrice: 2500,
    ratePlans: [
      {
        id: "plan-exe-ep",
        code: "EP",
        name: "European Plan (Room Only)",
        mealPlan: "EP",
        description: "Executive accommodation with room-only flexibility.",
        pricePerNight: 2500,
        inclusions: ["High-speed Wi-Fi", "Daily housekeeping", "Complimentary mineral water", "Tea/Coffee maker"],
      },
      {
        id: "plan-exe-cp",
        code: "CP",
        name: "Continental Plan (With Buffet Breakfast)",
        mealPlan: "CP",
        description: "Executive stay inclusive of hearty buffet breakfast.",
        pricePerNight: 2950,
        inclusions: [
          "Multi-cuisine buffet breakfast",
          "High-speed Wi-Fi",
          "Daily housekeeping",
          "Tea/Coffee bar",
          "Complimentary mineral water",
        ],
      },
    ],
    amenities: [
      { iconName: "Wind", label: "Powerful Split AC" },
      { iconName: "Wifi", label: "High-Speed Business Wi-Fi" },
      { iconName: "Tv", label: "50\" 4K Smart TV with Streaming" },
      { iconName: "Armchair", label: "Plush Sofa Seating Lounge" },
      { iconName: "ShieldCheck", label: "Intercom & Electronic Lock" },
      { iconName: "Coffee", label: "Premium Tea & Coffee Facility" },
      { iconName: "Bath", label: "Designer Bathroom with Rain Geyser" },
      { iconName: "Briefcase", label: "Spacious Executive Work Desk" },
    ],
    highlights: [
      "Plush lounge seating for private discussions or relaxing",
      "Larger floor plan with warm ambient lighting",
      "Priority check-in & late check-out support (subject to availability)",
      "Electric kettle with complimentary tea & coffee kit",
    ],
    houseRules: [
      "Check-in: 11:00 AM | Check-out: 12:00 PM",
      "Valid Government Photo ID required at check-in",
      "Non-smoking room",
      "Extra adult (pax): ₹500/night with extra mattress | Children stay free (using existing bedding)",
    ],
  },
  {
    id: "rt-presidential-suite",
    slug: "suite-room",
    name: "Presidential Luxury Suite",
    categoryCode: "SUI",
    tagline: "Separate living salon, master bedroom, and unmatched spaciousness.",
    shortDescription:
      "A grand 460 sq ft two-room suite featuring a dedicated guest drawing room, dining nook, master King bedroom, dual ACs, and bespoke furniture.",
    fullDescription:
      "The pinnacle of accommodation at Hotel Ambarish Grand Residency by Divine View. The Presidential Suite provides complete separation between your private master bedroom and an elegant living room, making it ideal for visiting dignitaries, business leaders hosting brief meetings, or families desiring expansive comfort in the heart of Guwahati.",
    coverImage: "/images/polished/suite-living-wide.webp",
    images: [
      "/images/polished/suite-living-wide.webp",
      "/images/polished/suite-bedroom-wide.webp",
      "/images/polished/suite-bedroom-full.webp",
      "/images/polished/suite-bedroom-close.webp",
      "/images/polished/suite-living-portrait.webp",
      "/images/polished/suite-bathroom.webp",
    ],
    bedType: "1 Grand King Bed + Living Room Sofa Couch",
    capacity: {
      adults: 3,
      children: 2,
      maxGuests: 4,
    },
    sizeSqFt: 460,
    view: "Guwahati Skyline & Hill View",
    acType: "Dual AC",
    smokingPolicy: "Non-Smoking",
    basePrice: 3500,
    ratePlans: [
      {
        id: "plan-sui-ep",
        code: "EP",
        name: "European Plan (Room Only)",
        mealPlan: "EP",
        description: "Exclusive suite access with flexibility to order a-la-carte room service.",
        pricePerNight: 3500,
        inclusions: ["Separate living room & bedroom", "55\" 4K Smart TV", "High-speed Wi-Fi", "Express check-in", "Daily housekeeping"],
      },
      {
        id: "plan-sui-cp",
        code: "CP",
        name: "Continental Plan (With Buffet Breakfast)",
        mealPlan: "CP",
        description: "Suite experience with complimentary buffet breakfast for all registered occupants.",
        pricePerNight: 4100,
        inclusions: [
          "Buffet breakfast for all suite guests",
          "Separate living room & master bedroom",
          "55\" 4K Smart TV",
          "High-speed Wi-Fi",
          "Tea & coffee hamper",
        ],
      },
    ],
    amenities: [
      { iconName: "Layers", label: "Separate Living Drawing Room & Master Bedroom" },
      { iconName: "Wind", label: "Dual Split Air Conditioners" },
      { iconName: "Tv", label: "55\" Smart 4K TV" },
      { iconName: "Armchair", label: "Full 5-Seater Sofa Set with Coffee Table" },
      { iconName: "Coffee", label: "Gourmet Tea/Coffee Station" },
      { iconName: "ShieldCheck", label: "Intercom & 24/7 Room Service Ext 9" },
      { iconName: "Bath", label: "Luxury Ensuite Bathroom with Premium Toiletries" },
      { iconName: "Sparkles", label: "Turndown Service & Daily Linen Refresh" },
    ],
    highlights: [
      "Total privacy with independent drawing room and bedroom",
      "Accommodates small family or private business consultations comfortably",
      "Dedicated butler call bell & 24-hour room service",
      "Panoramic views overlooking Paltan Bazaar and hills",
    ],
    houseRules: [
      "Check-in: 11:00 AM | Check-out: 12:00 PM",
      "Valid Photo ID required for all adult guests",
      "Strictly Non-Smoking",
      "Extra adult (pax): ₹500/night with extra mattress | Children stay free",
    ],
  },
];
