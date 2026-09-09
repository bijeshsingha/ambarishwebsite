import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyAdminConfirmToken } from "@/lib/admin-token";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { sendGuestConfirmedVoucherEmail, sendGuestCancelledBookingEmail, ReservationEmailPayload } from "@/lib/email";
import { calculateNights } from "@/lib/formatters";

/**
 * Front Desk Booking Confirmation API
 * GET: Fetches reservation details for the confirmation prompt screen after validating token.
 * POST: Finalizes confirmation, updates database to CONFIRMED, and dispatches confirmed voucher to guest.
 */

export async function GET(request: Request) {
  const clientIp = getClientIp(request);
  const rate = checkRateLimit("desk_confirm_get", clientIp, 30, 60);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: "TOO_MANY_REQUESTS", message: "Too many requests. Please try again in a moment." },
      { status: 429 }
    );
  }

  const { searchParams } = new URL(request.url);
  const reference = (searchParams.get("reference") || "").trim().toUpperCase();
  const token = (searchParams.get("token") || "").trim();

  if (!reference || !token) {
    return NextResponse.json(
      { error: "INVALID_REQUEST", message: "Booking reference and authorization token are required." },
      { status: 400 }
    );
  }

  // Look up reservation by booking_reference
  const reservation = db
    .prepare("SELECT * FROM reservations WHERE booking_reference = ?")
    .get(reference) as any;

  if (!reservation) {
    return NextResponse.json(
      { error: "NOT_FOUND", message: "Reservation not found." },
      { status: 404 }
    );
  }

  // Verify HMAC admin token
  const isValid = verifyAdminConfirmToken(reference, reservation.id, token);
  if (!isValid) {
    return NextResponse.json(
      { error: "UNAUTHORIZED", message: "Invalid or expired confirmation token." },
      { status: 403 }
    );
  }

  const checkout = db
    .prepare("SELECT check_in, check_out, adults, children, rooms, booking_type FROM checkout_sessions WHERE id = ?")
    .get(reservation.checkout_id) as any;

  const financial = JSON.parse(reservation.financial_snapshot_json || "{}");
  const bookedRooms = JSON.parse(reservation.booked_rooms_json || "[]");

  const nights = calculateNights(
    reservation.check_in || checkout?.check_in,
    reservation.check_out || checkout?.check_out
  );

  return NextResponse.json({
    success: true,
    reservation: {
      id: reservation.id,
      bookingReference: reservation.booking_reference,
      status: reservation.status,
      checkIn: reservation.check_in || checkout?.check_in,
      checkOut: reservation.check_out || checkout?.check_out,
      nights,
      rooms: checkout?.rooms || 1,
      adults: checkout?.adults || 2,
      children: checkout?.children || 0,
      guestName: reservation.guest_name,
      guestPhone: reservation.guest_phone,
      guestEmail: reservation.guest_email,
      guestCity: reservation.guest_city,
      guestState: reservation.guest_state,
      guestGstin: reservation.guest_gstin,
      companyName: reservation.company_name,
      specialRequests: reservation.special_requests,
      paymentMethod: reservation.payment_method,
      bookedRooms,
      baseAmount: financial.baseAmount,
      discountAmount: financial.discountAmount,
      taxAmount: financial.taxAmount,
      totalAmount: financial.totalAmount,
      createdAt: reservation.created_at,
      updatedAt: reservation.updated_at,
    },
  });
}

export async function POST(request: Request) {
  const clientIp = getClientIp(request);
  const rate = checkRateLimit("desk_confirm_post", clientIp, 15, 60);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: "TOO_MANY_REQUESTS", message: "Rate limit exceeded. Please try again in a minute." },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const reference = String(body.reference || "").trim().toUpperCase();
    const token = String(body.token || "").trim();
    const action = String(body.action || "CONFIRM").toUpperCase();
    const allocatedRoom = String(body.allocatedRoom || "").trim();
    const staffName = String(body.staffName || "Front Desk").trim();
    const staffNotes = String(body.notes || "").trim();

    if (!reference || !token) {
      return NextResponse.json(
        { error: "INVALID_REQUEST", message: "Booking reference and authorization token are required." },
        { status: 400 }
      );
    }

    const reservation = db
      .prepare("SELECT * FROM reservations WHERE booking_reference = ?")
      .get(reference) as any;

    if (!reservation) {
      return NextResponse.json(
        { error: "NOT_FOUND", message: "Reservation record not found." },
        { status: 404 }
      );
    }

    // Verify cryptographic authorization token
    const isValid = verifyAdminConfirmToken(reference, reservation.id, token);
    if (!isValid) {
      return NextResponse.json(
        { error: "UNAUTHORIZED", message: "Invalid or expired confirmation token." },
        { status: 403 }
      );
    }

    const now = Date.now();

    if (action === "CANCEL") {
      db.prepare(
        "UPDATE reservations SET status = 'CANCELLED', updated_at = ? WHERE id = ?"
      ).run(now, reservation.id);

      const checkout = db
        .prepare("SELECT check_in, check_out, adults, children, rooms, booking_type FROM checkout_sessions WHERE id = ?")
        .get(reservation.checkout_id) as any;

      const financial = JSON.parse(reservation.financial_snapshot_json || "{}");
      const bookedRooms = JSON.parse(reservation.booked_rooms_json || "[]");
      const nights = calculateNights(
        reservation.check_in || checkout?.check_in,
        reservation.check_out || checkout?.check_out
      );

      const emailPayload: ReservationEmailPayload = {
        confirmationNo: reservation.booking_reference,
        status: "CANCELLED",
        bookingType: reservation.booking_type,
        checkIn: reservation.check_in || checkout?.check_in,
        checkOut: reservation.check_out || checkout?.check_out,
        nights,
        rooms: checkout?.rooms || 1,
        adults: checkout?.adults || 2,
        children: checkout?.children || 0,
        bookedRooms,
        guestName: reservation.guest_name,
        guestPhone: reservation.guest_phone,
        guestEmail: reservation.guest_email,
        guestCity: reservation.guest_city,
        guestState: reservation.guest_state,
        baseAmount: financial.baseAmount,
        discountAmount: financial.discountAmount,
        taxAmount: financial.taxAmount,
        totalAmount: financial.totalAmount,
        paymentMethod: reservation.payment_method,
      };

      let emailDelivered = false;
      try {
        const emailResult = await sendGuestCancelledBookingEmail(
          emailPayload,
          staffNotes || "Room inventory fully occupied for requested stay dates."
        );
        emailDelivered = emailResult.delivered;
      } catch (err: any) {
        console.warn("[Desk Cancel] Email dispatch warning:", err.message);
      }

      return NextResponse.json({
        success: true,
        status: "CANCELLED",
        message: `Reservation #${reference} has been marked as Cancelled. Notification email has been sent to ${reservation.guest_email}.`,
        emailDelivered,
      });
    }

    // Process CONFIRM
    if (reservation.status === "CONFIRMED") {
      return NextResponse.json({
        success: true,
        alreadyConfirmed: true,
        status: "CONFIRMED",
        message: `Reservation #${reference} is already confirmed.`,
      });
    }

    // Update reservation in database
    db.prepare(
      "UPDATE reservations SET status = 'CONFIRMED', updated_at = ? WHERE id = ?"
    ).run(now, reservation.id);

    const checkout = db
      .prepare("SELECT check_in, check_out, adults, children, rooms, booking_type, promo_code FROM checkout_sessions WHERE id = ?")
      .get(reservation.checkout_id) as any;

    const financial = JSON.parse(reservation.financial_snapshot_json || "{}");
    const bookedRooms = JSON.parse(reservation.booked_rooms_json || "[]");
    const nights = calculateNights(
      reservation.check_in || checkout?.check_in,
      reservation.check_out || checkout?.check_out
    );

    // Build payload for confirmed voucher email
    const emailPayload: ReservationEmailPayload = {
      confirmationNo: reservation.booking_reference,
      status: "CONFIRMED",
      bookingType: reservation.booking_type,
      checkIn: reservation.check_in || checkout?.check_in,
      checkOut: reservation.check_out || checkout?.check_out,
      nights,
      rooms: checkout?.rooms || 1,
      adults: checkout?.adults || 2,
      children: checkout?.children || 0,
      bookedRooms,
      guestName: reservation.guest_name,
      guestPhone: reservation.guest_phone,
      guestEmail: reservation.guest_email,
      guestCity: reservation.guest_city,
      guestState: reservation.guest_state,
      guestGstin: reservation.guest_gstin,
      companyName: reservation.company_name,
      specialRequests: staffNotes
        ? `${reservation.special_requests ? reservation.special_requests + " | " : ""}Front Desk: ${staffNotes}${allocatedRoom ? ` (Room: ${allocatedRoom})` : ""}`
        : reservation.special_requests,
      promoCode: checkout?.promo_code,
      discountAmount: financial.discountAmount,
      baseAmount: financial.baseAmount,
      taxAmount: financial.taxAmount,
      totalAmount: financial.totalAmount,
      paymentMethod: reservation.payment_method,
      paymentId: reservation.payment_id,
    };

    // Dispatch confirmed voucher email to the guest
    let emailDelivered = false;
    try {
      const emailResult = await sendGuestConfirmedVoucherEmail(emailPayload);
      emailDelivered = emailResult.delivered;
    } catch (err: any) {
      console.warn("[Desk Confirm] Email dispatch warning:", err.message);
    }

    return NextResponse.json({
      success: true,
      status: "CONFIRMED",
      message: `Reservation #${reference} successfully confirmed! Guaranteed voucher has been dispatched to ${reservation.guest_email}.`,
      emailDelivered,
      allocatedRoom: allocatedRoom || null,
      confirmedBy: staffName,
      confirmedAt: now,
    });
  } catch (err: any) {
    console.error("[Desk Confirm] Error:", err);
    return NextResponse.json(
      { error: "SERVER_ERROR", message: err.message || "Failed to process confirmation." },
      { status: 500 }
    );
  }
}
