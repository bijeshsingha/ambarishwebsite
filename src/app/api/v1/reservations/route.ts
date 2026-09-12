import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { calculateNights } from "@/lib/formatters";

/**
 * Reservations Gateway
 * - Allows secure lookup by reference and optional token
 * - Redacts sensitive contact data for public view
 * - Returns accurate stay schedule, nights, room count, and complete price breakup
 */

export async function GET(request: Request) {
  const clientIp = getClientIp(request);

  // Allow 60 lookups per 60 seconds (prevents accidental 429 locks during active booking flow)
  const rate = checkRateLimit("res_lookup", clientIp, 60, 60);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: "TOO_MANY_REQUESTS", message: "Rate limit exceeded. Please try again in a moment." },
      { status: 429, headers: { "Retry-After": String(rate.resetInSeconds) } }
    );
  }

  const { searchParams } = new URL(request.url);
  const reference = (searchParams.get("reference") || searchParams.get("id") || "").trim().toUpperCase();
  const token = (searchParams.get("token") || "").trim();

  if (!reference) {
    return NextResponse.json(
      { error: "INVALID_REQUEST", message: "Booking reference is required." },
      { status: 400 }
    );
  }

  let res: any = null;

  // 1. Try matching with cryptographic token hash if token is present
  if (token) {
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    res = db
      .prepare(
        "SELECT * FROM reservations WHERE booking_reference = ? AND lookup_token_hash = ?"
      )
      .get(reference, tokenHash) as any;
  }

  // 2. If token omitted or not matching hash, look up by booking reference directly
  if (!res) {
    res = db
      .prepare("SELECT * FROM reservations WHERE booking_reference = ?")
      .get(reference) as any;
  }

  if (!res) {
    return NextResponse.json(
      { error: "NOT_FOUND", message: "Reservation not found." },
      {
        status: 404,
        headers: { "Cache-Control": "no-store, no-cache, must-revalidate" },
      }
    );
  }

  const checkout = db
    .prepare(
      "SELECT check_in, check_out, adults, children, rooms, promo_code, booking_type FROM checkout_sessions WHERE id = ?"
    )
    .get(res.checkout_id) as any;

  const financial = JSON.parse(res.financial_snapshot_json || "{}");
  const bookedRooms = JSON.parse(res.booked_rooms_json || "[]");

  const checkIn = res.check_in || checkout?.check_in || "";
  const checkOut = res.check_out || checkout?.check_out || "";
  const nights = calculateNights(checkIn, checkOut);

  // Mask phone for privacy in guest view
  const maskedPhone =
    res.guest_phone && res.guest_phone.length > 5
      ? `${res.guest_phone.slice(0, 3)}****${res.guest_phone.slice(-3)}`
      : res.guest_phone || "";

  return NextResponse.json(
    {
      success: true,
      reservation: {
        id: res.id,
        bookingReference: res.booking_reference,
        status: res.status,
        checkIn,
        checkOut,
        nights: nights > 0 ? nights : 1,
        adults: checkout?.adults || 2,
        children: checkout?.children || 0,
        rooms: checkout?.rooms || 1,
        guestName: res.guest_name,
        guestPhone: maskedPhone,
        guestEmail: res.guest_email,
        guestCity: res.guest_city,
        guestState: res.guest_state,
        guestGstin: res.guest_gstin,
        companyName: res.company_name,
        specialRequests: res.special_requests,
        bookingType: res.booking_type,
        paymentMethod: res.payment_method,
        paymentId: res.payment_id,
        bookedRooms,
        promoCode: checkout?.promo_code || null,
        baseAmount: financial.baseAmount || 0,
        discountAmount: financial.discountAmount || 0,
        taxAmount: financial.taxAmount || 0,
        totalAmount: financial.totalAmount || 0,
        currency: financial.currency || "INR",
        createdAt: res.created_at,
        updatedAt: res.updated_at,
      },
    },
    {
      headers: { "Cache-Control": "no-store, no-cache, must-revalidate" },
    }
  );
}

import { POST as finalizeReservation } from "./finalize/route";

export async function POST(request: Request) {
  return finalizeReservation(request);
}
