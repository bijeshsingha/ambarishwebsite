import { ROOMS } from "@/data/rooms";
import { calculateNights } from "./formatters";
import { calculateRoomGST } from "./gst";

export interface BookedRoomItem {
  roomSlug: string;
  roomName: string;
  categoryCode: string;
  bedType?: string; // e.g. "King Bed" or "Twin Bed"
  ratePlanCode: string;
  ratePlanName: string;
  pricePerNight: number;
  quantity: number;
}

export interface ReservationData {
  id: string;
  bookingReference: string;
  status: "CONFIRMED" | "CANCELLED" | "PENDING";
  roomSlug: string;
  roomName: string;
  ratePlanCode: string;
  ratePlanName: string;
  bookedRooms?: BookedRoomItem[];
  checkIn: string;
  checkOut: string;
  nights: number;
  rooms: number;
  adults: number;
  children: number;
  bookingType?: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guestCity?: string;
  guestGstin?: string;
  companyName?: string;
  billingAddress?: string;
  specialRequests?: string;
  promoCode?: string;
  discountAmount?: number;
  baseAmount: number;
  taxAmount: number;
  totalAmount: number;
  paymentMethod: string;
  paymentId: string;
  createdAt: string;
}

let reservationSequence = parseInt(process.env.INITIAL_RESERVATION_NUMBER || "0", 10);

export function generateReservationReference(): string {
  reservationSequence += 1;
  const seqNumber = String(reservationSequence).padStart(4, "0");
  return `HAGR-${seqNumber}`;
}

export interface StayQuoteParams {
  checkIn: string;
  checkOut: string;
  adults?: number;
  children?: number;
  roomId?: string;
  ratePlanCode?: string;
}

export function getStayQuote({
  checkIn,
  checkOut,
  adults = 2,
  children = 0,
  roomId,
  ratePlanCode = "EP",
}: StayQuoteParams) {
  const nights = calculateNights(checkIn, checkOut);

  // Find specific room or default to deluxe-room
  const room = ROOMS.find((r) => r.slug === roomId || r.id === roomId) || ROOMS[0];
  const ratePlan = room.ratePlans.find((p) => p.code === ratePlanCode) || room.ratePlans[0];

  const gst = calculateRoomGST(ratePlan.pricePerNight, nights, false);

  const availableRooms = ROOMS.map((r) => {
    const plan = r.ratePlans.find((p) => p.code === ratePlanCode) || r.ratePlans[0];
    const planGst = calculateRoomGST(plan.pricePerNight, nights, false);
    return {
      id: r.id,
      slug: r.slug,
      name: r.name,
      categoryCode: r.categoryCode,
      basePrice: r.basePrice,
      pricePerNight: plan.pricePerNight,
      totalBaseAmount: planGst.baseAmount,
      taxAmount: planGst.totalTax,
      totalAmount: planGst.totalAmount,
      ratePlan: plan,
      isAvailable: true,
    };
  });

  return {
    checkIn,
    checkOut,
    nights,
    adults,
    children,
    selectedRoom: {
      id: room.id,
      slug: room.slug,
      name: room.name,
      categoryCode: room.categoryCode,
      selectedPlan: ratePlan,
      pricePerNight: ratePlan.pricePerNight,
      baseAmount: gst.baseAmount,
      taxAmount: gst.totalTax,
      totalAmount: gst.totalAmount,
      breakdown: gst,
    },
    availableRooms,
  };
}
