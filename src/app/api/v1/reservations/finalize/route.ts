import { NextResponse } from "next/server";
import crypto from "crypto";
import { db, runTransaction } from "@/lib/db";
import { getNextReservationReference } from "@/lib/sequence";
import { queueOutboxEvent, processOutboxQueue } from "@/lib/outbox";
import { ROOMS } from "@/data/rooms";
import { generateAdminConfirmToken } from "@/lib/admin-token";
import { ensureCheckoutSession } from "@/lib/session-token";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { checkoutId, accessToken, guest, paymentMethod = "RAZORPAY" } = body;

    // SEC 01 & SEC 02: Strict input validation
    if (!checkoutId || !accessToken || !guest) {
      return NextResponse.json(
        { error: "INVALID_REQUEST", message: "Missing required checkout identifier, token, or guest details." },
        { status: 400 }
      );
    }

    const { name, email, phone, city, state, gstin, companyName, specialRequests, b2b } = guest;
    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: "INVALID_GUEST", message: "Guest name, email, and phone are mandatory." },
        { status: 400 }
      );
    }

    // Phone & email formatting check
    const cleanPhone = String(phone).replace(/[^0-9+]/g, "");
    if (cleanPhone.length < 10 || cleanPhone.length > 15) {
      return NextResponse.json(
        { error: "INVALID_PHONE", message: "A valid 10 to 15 digit telephone number is required." },
        { status: 400 }
      );
    }

    const tokenHash = crypto.createHash("sha256").update(accessToken).digest("hex");
    const now = Date.now();

    // 1. Verify checkout session exists and token matches (with stateless recovery if across serverless instances)
    const checkout = ensureCheckoutSession(checkoutId, accessToken);

    if (!checkout) {
      return NextResponse.json(
        { error: "NOT_FOUND", message: "Checkout session does not exist or access token is invalid." },
        { status: 404 }
      );
    }

    // 2. IDEMPOTENCY CHECK: If already finalized, return existing reservation
    const existingRes = db
      .prepare("SELECT * FROM reservations WHERE checkout_id = ?")
      .get(checkoutId) as any;

    if (existingRes) {
      const financial = JSON.parse(existingRes.financial_snapshot_json);
      const bookedRooms = JSON.parse(existingRes.booked_rooms_json);
      return NextResponse.json({
        success: true,
        isExisting: true,
        reservation: {
          id: existingRes.id,
          bookingReference: existingRes.booking_reference,
          status: existingRes.status,
          checkIn: checkout.check_in,
          checkOut: checkout.check_out,
          guestName: existingRes.guest_name,
          guestEmail: existingRes.guest_email,
          guestPhone: existingRes.guest_phone,
          totalAmount: financial.totalAmount,
          bookedRooms,
        },
      });
    }

    // 3. Verify expiry
    if (now > checkout.expires_at || checkout.status === "EXPIRED") {
      return NextResponse.json(
        { error: "CHECKOUT_EXPIRED", message: "Checkout session and room hold have expired." },
        { status: 409 }
      );
    }

    // 4. Verify Payment State
    let finalStatus = "CONFIRMED";
    let paymentId: string | null = null;

    if (paymentMethod === "RAZORPAY") {
      const payment = db
        .prepare("SELECT * FROM payments WHERE checkout_id = ?")
        .get(checkoutId) as any;

      if (!payment || payment.status !== "PAID") {
        return NextResponse.json(
          { error: "PAYMENT_REQUIRED", message: "This checkout requires verified payment confirmation." },
          { status: 409 }
        );
      }
      paymentId = payment.provider_payment_id || payment.provider_order_id;
    } else {
      // Pay at hotel: marked as PENDING_CONFIRMATION until front desk identity verification
      finalStatus = "PENDING_CONFIRMATION";
      paymentId = "PAY_AT_HOTEL";
    }

    // 5. Load checkout items
    const items = db
      .prepare("SELECT * FROM checkout_items WHERE checkout_id = ?")
      .all(checkoutId) as any[];

    const bookedRooms = items.map((itm) => {
      const roomCat = ROOMS.find((r) => r.id === itm.room_type_id || r.slug === itm.room_type_id) || ROOMS[0];
      const planCode = itm.rate_plan_code || itm.ratePlanCode || "EP";
      const ratePlan = roomCat.ratePlans.find((rp) => rp.code === planCode) || roomCat.ratePlans[0];
      return {
        roomTypeId: itm.room_type_id,
        roomName: roomCat.name,
        bedType: roomCat.bedType,
        ratePlanCode: planCode,
        ratePlanName: ratePlan.name,
        pricePerNight: itm.unit_price_paise / 100,
        quantity: itm.quantity,
      };
    });

    const inDate = new Date(checkout.check_in);
    const outDate = new Date(checkout.check_out);
    const nights = Math.max(1, Math.round((outDate.getTime() - inDate.getTime()) / (1000 * 60 * 60 * 24)));

    const financialSnapshot = {
      baseAmount: checkout.subtotal_paise / 100,
      discountAmount: checkout.discount_paise / 100,
      taxAmount: checkout.tax_paise / 100,
      totalAmount: checkout.total_paise / 100,
      currency: "INR",
      promoCode: checkout.promo_code,
    };

    const reservationId = crypto.randomUUID();
    const lookupToken = crypto.randomBytes(16).toString("hex"); // 128 bits of entropy
    const lookupTokenHash = crypto.createHash("sha256").update(lookupToken).digest("hex");

    // Sequential booking reference: HAGR-XXXX
    const bookingReference = await getNextReservationReference();

    // 6. Execute atomic database transaction
    runTransaction(() => {
      // Consume inventory hold
      db.prepare(
        "UPDATE inventory_holds SET status = 'CONSUMED' WHERE checkout_id = ?"
      ).run(checkoutId);

      // Create reservation
      db.prepare(
        `INSERT INTO reservations (
          id, booking_reference, checkout_id, lookup_token_hash, status,
          check_in, check_out,
          guest_name, guest_email, guest_phone, guest_city, guest_state,
          guest_gstin, company_name, special_requests, booking_type,
          payment_method, payment_id, financial_snapshot_json, booked_rooms_json,
          pms_status, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING', ?, ?)`
      ).run(
        reservationId,
        bookingReference,
        checkoutId,
        lookupTokenHash,
        finalStatus,
        checkout.check_in,
        checkout.check_out,
        name.trim(),
        email.trim().toLowerCase(),
        cleanPhone,
        city?.trim() || null,
        state?.trim() || null,
        gstin?.trim().toUpperCase() || null,
        companyName?.trim() || null,
        specialRequests?.trim() || null,
        checkout.booking_type,
        paymentMethod,
        paymentId,
        JSON.stringify(financialSnapshot),
        JSON.stringify(bookedRooms),
        now,
        now
      );

      // Update checkout session status
      db.prepare("UPDATE checkout_sessions SET status = 'CONFIRMED', updated_at = ? WHERE id = ?").run(
        now,
        checkoutId
      );

      const adminConfirmToken = generateAdminConfirmToken(bookingReference, reservationId);

      // Queue Outbox events for Email and PMS
      const emailPayload = {
        confirmationNo: bookingReference,
        status: finalStatus,
        adminConfirmToken,
        bookingType: checkout.booking_type,
        checkIn: checkout.check_in,
        checkOut: checkout.check_out,
        nights,
        rooms: checkout.rooms,
        adults: checkout.adults,
        children: checkout.children,
        bookedRooms,
        guestName: name.trim(),
        guestPhone: cleanPhone,
        guestEmail: email.trim().toLowerCase(),
        guestCity: city?.trim(),
        guestState: state?.trim(),
        guestGstin: gstin?.trim().toUpperCase(),
        companyName: companyName?.trim(),
        specialRequests: specialRequests?.trim(),
        promoCode: checkout.promo_code,
        discountAmount: financialSnapshot.discountAmount,
        baseAmount: financialSnapshot.baseAmount,
        taxAmount: financialSnapshot.taxAmount,
        totalAmount: financialSnapshot.totalAmount,
        paymentMethod,
        paymentId,
      };

      queueOutboxEvent(reservationId, "EMAIL_NOTIFICATION", emailPayload);

      const pmsPayload = {
        bookingType: checkout.booking_type,
        checkIn: checkout.check_in,
        checkOut: checkout.check_out,
        nights,
        rooms: checkout.rooms,
        adults: checkout.adults,
        children: checkout.children,
        bookedRooms,
        guestName: name.trim(),
        guestPhone: cleanPhone,
        guestEmail: email.trim().toLowerCase(),
        guestCity: city?.trim(),
        guestState: state?.trim(),
        guestGstin: gstin?.trim().toUpperCase(),
        specialRequests: specialRequests?.trim(),
        promoCode: checkout.promo_code,
        discountAmount: financialSnapshot.discountAmount,
        baseAmount: financialSnapshot.baseAmount,
        taxAmount: financialSnapshot.taxAmount,
        totalAmount: financialSnapshot.totalAmount,
        paymentMethod,
        paymentId,
      };

      queueOutboxEvent(reservationId, "PMS_SYNC", pmsPayload);
    });

    // Trigger outbox processing in background
    processOutboxQueue().catch((err) =>
      console.warn("[Outbox] Background trigger warning:", err?.message)
    );

    return NextResponse.json({
      success: true,
      isExisting: false,
      reservation: {
        id: reservationId,
        bookingReference,
        lookupToken, // Return secret token to client for secure lookup
        status: finalStatus,
        checkIn: checkout.check_in,
        checkOut: checkout.check_out,
        nights,
        rooms: checkout.rooms,
        adults: checkout.adults,
        children: checkout.children,
        guestName: name.trim(),
        guestEmail: email.trim().toLowerCase(),
        guestPhone: cleanPhone,
        totalAmount: financialSnapshot.totalAmount,
        bookedRooms,
      },
    });
  } catch (err: any) {
    console.error("[Reservations Finalize API] Error:", err);
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: err?.message || "Failed to finalize reservation." },
      { status: 500 }
    );
  }
}
