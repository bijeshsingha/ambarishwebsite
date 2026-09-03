import { serverConfig } from "@/lib/config";

/**
 * Hotel OS PMS API Gateway Client
 * Handles all live communication with the Hotel OS Property Management System.
 */

export interface BookedRoomItem {
  roomSlug: string;
  roomName: string;
  categoryCode: string;
  bedType?: string;
  ratePlanCode: string;
  ratePlanName: string;
  pricePerNight: number;
  quantity: number;
}

export interface ReservationData {
  id?: string;
  bookingReference: string;
  confirmationNo?: string;
  status: string;
  roomSlug?: string;
  roomName?: string;
  ratePlanCode?: string;
  ratePlanName?: string;
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
  guestState?: string;
  guestGstin?: string;
  companyName?: string;
  b2b?: {
    accountType?: string;
    companyName?: string;
    corporateEmail?: string;
    poNumber?: string;
    billingInstruction?: string;
  };
  specialRequests?: string;
  promoCode?: string;
  discountAmount?: number;
  baseAmount: number;
  taxAmount: number;
  totalAmount: number;
  paymentMethod: string;
  paymentId?: string;
  createdAt?: string;
}

export interface ReservationCreatePayload {
  bookingType?: "INDIVIDUAL" | "CORPORATE";
  checkIn: string;
  checkOut: string;
  nights: number;
  rooms: number;
  adults: number;
  children: number;
  bookedRooms: BookedRoomItem[];
  guestName: string;
  guestPhone: string;
  guestEmail: string;
  guestCity?: string;
  guestState?: string;
  guestNationality?: string;
  guestGstin?: string;
  b2b?: {
    accountType?: string;
    companyName?: string;
    corporateEmail?: string;
    poNumber?: string;
    billingInstruction?: string;
  };
  specialRequests?: string;
  promoCode?: string;
  discountAmount?: number;
  baseAmount: number;
  taxAmount: number;
  totalAmount: number;
  paymentMethod?: string;
  paymentId?: string;
  depositAmount?: number;
}

export interface AvailabilityCategory {
  roomTypeId: string;
  roomTypeCode: string;
  roomTypeName: string;
  totalRooms: number;
  occupiedOrBlocked: number;
  availableCount: number;
  capacity: number;
}

export interface AvailabilityQuoteResponse {
  arrivalDate: string;
  departureDate: string;
  totalRooms: number;
  availableRooms: number;
  categories: AvailabilityCategory[];
  fallback?: boolean;
}

export interface EventEnquiryPayload {
  eventType: string;
  eventTitle: string;
  eventDate: string;
  durationDays?: number;
  attendees: number;
  seatingLayout?: string;
  organizerName: string;
  organizerPhone: string;
  organizerEmail: string;
  additionalNotes?: string;
}

export interface B2bEnquiryPayload {
  enquiryType?: string;
  companyName: string;
  accountType?: "CORPORATE" | "TRAVEL_AGENT";
  contactPerson: string;
  designation?: string;
  email: string;
  phone: string;
  gstin?: string;
  city?: string;
  state?: string;
  estimatedMonthlyRoomNights?: number;
  requiredMealPlans?: string[];
  billingPreference?: string;
  message?: string;
}

/**
 * Fetch live availability quote from PMS
 */
export async function fetchPmsAvailability(
  checkIn: string,
  checkOut: string
): Promise<AvailabilityQuoteResponse> {
  const { apiUrl, apiKey, propertyId } = serverConfig.pms;
  const endpoint = `${apiUrl}/availability/quote?arrivalDate=${encodeURIComponent(checkIn)}&departureDate=${encodeURIComponent(checkOut)}&propertyId=${encodeURIComponent(propertyId)}`;

  try {
    const res = await fetch(endpoint, {
      headers: {
        "x-api-key": apiKey,
      },
      next: { revalidate: 0 },
    });

    if (res.ok) {
      return (await res.json()) as AvailabilityQuoteResponse;
    }

    console.warn(`[PMS] Availability responded with status ${res.status}`);
  } catch (err: any) {
    console.warn(`[PMS] Availability fetch failed: ${err.message}`);
  }

  // Graceful fallback response if PMS is offline or transitioning
  return {
    arrivalDate: checkIn,
    departureDate: checkOut,
    totalRooms: 35,
    availableRooms: 35,
    categories: [],
    fallback: true,
  };
}

/**
 * Submit confirmed booking to PMS
 */
export async function createPmsReservation(
  payload: ReservationCreatePayload
): Promise<{ success: boolean; confirmationNo: string; rawData: any }> {
  const { apiUrl, apiKey, propertyId } = serverConfig.pms;
  const endpoint = `${apiUrl}/reservations`;

  const pmsPayload = {
    ...payload,
    propertyId,
    source: payload.bookingType === "CORPORATE" ? "CORPORATE" : "WEBSITE",
    channelRef: `WEB-${Date.now().toString().slice(-6)}`,
  };

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
    body: JSON.stringify(pmsPayload),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error(`[PMS] Reservation error (${res.status}):`, errText);
    throw new Error(`PMS reservation failed: ${res.statusText}`);
  }

  const data = await res.json();
  const confirmationNo = data.confirmationNo || data.reservation?.confirmationNo || data.bookingReference;

  if (!confirmationNo) {
    throw new Error("PMS did not return a valid confirmation number");
  }

  return {
    success: true,
    confirmationNo,
    rawData: data,
  };
}

/**
 * Lookup confirmed reservation by reference / confirmation number
 */
export async function getPmsReservationByReference(
  reference: string
): Promise<ReservationData | null> {
  const { apiUrl, apiKey, propertyId } = serverConfig.pms;
  const endpoint = `${apiUrl}/reservations?propertyId=${encodeURIComponent(propertyId)}`;

  try {
    const res = await fetch(endpoint, {
      headers: {
        "x-api-key": apiKey,
      },
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      console.warn(`[PMS] Reservations list query failed with status ${res.status}`);
      return null;
    }

    const list = await res.json();
    if (!Array.isArray(list)) return null;

    const matched = list.find(
      (r: any) =>
        r.confirmationNo === reference ||
        r.id === reference ||
        r.channelRef?.includes(reference)
    );

    if (!matched) return null;

    return {
      id: matched.id,
      bookingReference: matched.confirmationNo || reference,
      confirmationNo: matched.confirmationNo || reference,
      status: matched.status || "CONFIRMED",
      roomSlug: matched.roomType?.code?.toLowerCase() || "deluxe-room",
      roomName: matched.roomTypeName || matched.roomType?.name || "Double Deluxe Room",
      ratePlanCode: "EP",
      ratePlanName: "Standard Rate",
      checkIn: matched.arrivalDate,
      checkOut: matched.departureDate,
      nights: matched.rooms?.[0]?.nights?.length || 1,
      rooms: matched.roomCount || matched.rooms?.length || 1,
      adults: matched.adults || 2,
      children: matched.children || 0,
      guestName: matched.primaryGuest?.name || "Guest",
      guestEmail: matched.primaryGuest?.email || "",
      guestPhone: matched.primaryGuest?.phone || "",
      companyName: matched.primaryGuest?.companyName || undefined,
      guestGstin: matched.primaryGuest?.gstin || undefined,
      baseAmount: matched.totalSnapshot || 0,
      taxAmount: 0,
      totalAmount: matched.totalSnapshot || 0,
      paymentMethod: matched.guaranteeType || "PAY_AT_HOTEL",
      createdAt: matched.createdAt,
    };
  } catch (err: any) {
    console.error(`[PMS] Lookup error for reference ${reference}:`, err.message);
    return null;
  }
}

/**
 * Submit banquet/event enquiry to PMS CRM
 */
export async function submitPmsEventEnquiry(
  payload: EventEnquiryPayload
): Promise<{ success: boolean; message: string }> {
  const { apiUrl, apiKey } = serverConfig.pms;
  const endpoint = `${apiUrl}/events/enquiry`;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.warn(`[PMS] Event enquiry failed (${res.status}):`, errText);
    throw new Error(`PMS event enquiry submission failed: ${res.statusText}`);
  }

  return { success: true, message: "Event enquiry recorded in PMS" };
}

/**
 * Submit corporate / travel agent B2B enquiry to PMS
 */
export async function submitPmsB2bEnquiry(
  payload: B2bEnquiryPayload
): Promise<{ success: boolean; message: string }> {
  const { apiUrl, apiKey } = serverConfig.pms;
  const endpoint = `${apiUrl}/b2b/enquiry`;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.warn(`[PMS] B2B enquiry failed (${res.status}):`, errText);
    throw new Error(`PMS B2B enquiry submission failed: ${res.statusText}`);
  }

  return { success: true, message: "B2B enquiry recorded in PMS" };
}
