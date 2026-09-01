export interface CorporateBenefit {
  title: string;
  description: string;
  icon: string;
}

export const CORPORATE_PERKS: CorporateBenefit[] = [
  {
    title: "100% GST ITC Compliant",
    description: "Itemized SAC 996311 tax invoice with your company's 15-digit GSTIN for input tax credit.",
    icon: "Receipt",
  },
  {
    title: "Contracted B2B Tariff",
    description: "20% corporate rate across Double Deluxe, Executive, and Presidential Suites.",
    icon: "Percent",
  },
  {
    title: "Express Check-In & Priority Billing",
    description: "Zero-wait check-in with company credentials and centralized corporate billing support.",
    icon: "Zap",
  },
  {
    title: "Complimentary Business Amenities",
    description: "High-speed optical fiber Wi-Fi, executive workspace, and optional boardroom credits.",
    icon: "Briefcase",
  },
];

export interface GroupServiceFeature {
  title: string;
  description: string;
}

export const GROUP_SERVICES: GroupServiceFeature[] = [
  {
    title: "Custom Negotiated Group Rates",
    description: "Speak directly with our reservation team for tailored room rates matching your dates and group size.",
  },
  {
    title: "Dedicated Group Coordinator",
    description: "A single point of contact to manage rooming lists, airport/station transit, and special meal requests.",
  },
  {
    title: "Integrated Banquets & Meal Plans",
    description: "Combine multi-room blocks with private dining halls, buffet packages, and conference facilities.",
  },
  {
    title: "Flexible Allocation & Terms",
    description: "Guaranteed same-floor allocations, staggered check-in/out assistance, and transparent billing.",
  },
];

export function calculateB2BRate(
  basePricePerNight: number,
  roomsCount: number,
  nights: number,
  bookingType: "INDIVIDUAL" | "CORPORATE" | "GROUP"
): {
  grossTariff: number;
  discountPercentage: number;
  discountAmount: number;
  effectiveBase: number;
  tierLabel: string;
  promoCodeApplied?: string;
} {
  const grossTariff = basePricePerNight * roomsCount * nights;
  let discountPercentage = 0;
  let tierLabel = "Standard Direct Rate";
  let promoCodeApplied: string | undefined;

  if (bookingType === "CORPORATE") {
    discountPercentage = 20;
    tierLabel = "B2B Corporate Contract Rate (20% OFF)";
    promoCodeApplied = "CORP20";
  }

  const discountAmount = Math.round((grossTariff * discountPercentage) / 100);
  const effectiveBase = grossTariff - discountAmount;

  return {
    grossTariff,
    discountPercentage,
    discountAmount,
    effectiveBase,
    tierLabel,
    promoCodeApplied,
  };
}
