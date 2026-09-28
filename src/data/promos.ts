export interface PromoCode {
  code: string;
  name: string;
  discountType: "PERCENTAGE" | "FLAT";
  discountValue: number; // e.g. 10 for 10%, 500 for ₹500
  description: string;
  minSpend?: number;
  badgeText?: string;
  maxDiscount?: number;
  isPublic?: boolean;
  type?: "PERCENTAGE" | "FLAT";
  value?: number;
  discountText?: string;
}

export const AVAILABLE_PROMOS: PromoCode[] = [
  {
    code: "DIRECT10",
    name: "Direct Booking Special",
    discountType: "PERCENTAGE",
    type: "PERCENTAGE",
    discountValue: 10,
    value: 10,
    description: "Get 10% instant discount on all direct bookings",
    badgeText: "10% OFF",
    discountText: "10% OFF",
    isPublic: true,
  },
  {
    code: "AMBARISH15",
    name: "Grand Residency Offer",
    discountType: "PERCENTAGE",
    type: "PERCENTAGE",
    discountValue: 15,
    value: 15,
    description: "Special 15% discount on direct website reservations",
    badgeText: "15% OFF",
    discountText: "15% OFF",
    isPublic: true,
  },
  {
    code: "WELCOME500",
    name: "Welcome Guest Credit",
    discountType: "FLAT",
    type: "FLAT",
    discountValue: 500,
    value: 500,
    description: "Flat ₹500 off on total stay bill",
    minSpend: 2500,
    badgeText: "₹500 OFF",
    discountText: "₹500 OFF",
    isPublic: true,
  },
  {
    code: "DIVINE20",
    name: "Divine View VIP",
    discountType: "PERCENTAGE",
    type: "PERCENTAGE",
    discountValue: 20,
    value: 20,
    description: "Exclusive 20% privilege rate for executive and suite guests",
    badgeText: "20% OFF",
    discountText: "20% OFF",
    isPublic: true,
  },
];

export interface PromoValidationResult {
  isValid: boolean;
  promo?: PromoCode;
  discountAmount: number;
  errorMessage?: string;
}

export function validateAndApplyPromo(
  inputCode: string,
  baseTariff: number
): PromoValidationResult {
  if (!inputCode || !inputCode.trim()) {
    return { isValid: false, discountAmount: 0 };
  }

  const cleanCode = inputCode.trim().toUpperCase();
  const promo = AVAILABLE_PROMOS.find((p) => p.code === cleanCode);

  if (!promo) {
    return {
      isValid: false,
      discountAmount: 0,
      errorMessage: `Invalid promo code "${cleanCode}". Try DIRECT10 or AMBARISH15.`,
    };
  }

  if (promo.minSpend && baseTariff < promo.minSpend) {
    return {
      isValid: false,
      discountAmount: 0,
      errorMessage: `Promo "${promo.code}" requires minimum booking tariff of ₹${promo.minSpend}.`,
    };
  }

  let discount = 0;
  if (promo.discountType === "PERCENTAGE") {
    discount = Math.round((baseTariff * promo.discountValue) / 100);
  } else if (promo.discountType === "FLAT") {
    discount = Math.min(promo.discountValue, baseTariff);
  }

  return {
    isValid: true,
    promo,
    discountAmount: discount,
  };
}
