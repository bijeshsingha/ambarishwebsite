import { NextResponse } from "next/server";
import crypto from "crypto";
import { db, runTransaction } from "@/lib/db";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { ROOMS } from "@/data/rooms";
import { AVAILABLE_PROMOS } from "@/data/promos";
import { createCheckoutToken } from "@/lib/session-token";

// Capacity ceiling per physical category (Total 35 rooms)
const ROOM_CAPACITIES: Record<string, number> = {
  rt_deluxe_king: 10,
  rt_deluxe_twin: 15,
  rt_exec_king: 3,
  rt_exec_twin: 5,
  rt_suite: 2,
};

// Map friendly codes/slugs to canonical IDs
function canonicalRoomTypeId(input: string): string {
  const norm = input.toLowerCase().replace(/-/g, "_");
  if (norm.includes("suite")) return "rt_suite";
  if (norm.includes("exec") && norm.includes("twin")) return "rt_exec_twin";
  if (norm.includes("exec")) return "rt_exec_king";
  if (norm.includes("deluxe") && norm.includes("twin")) return "rt_deluxe_twin";
  return "rt_deluxe_king";
}

function getStayDatesArray(checkIn: string, checkOut: string): string[] {
  const dates: string[] = [];
  const curr = new Date(checkIn);
  const end = new Date(checkOut);
  while (curr < end) {
    dates.push(curr.toISOString().split("T")[0]);
    curr.setDate(curr.getDate() + 1);
  }
  return dates;
}

export async function POST(request: Request) {
  const clientIp = getClientIp(request);

  // SEC 09 & Table 3: 5 checkouts per 10 minutes per IP
  const rate = checkRateLimit("checkout", clientIp, 5, 600);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: "TOO_MANY_REQUESTS", message: "Rate limit exceeded. Please try again later." },
      { status: 429, headers: { "Retry-After": String(rate.resetInSeconds) } }
    );
  }

  try {
    const body = await request.json();

    // SEC 01 & SEC 02: Strict input validation
    const { checkIn, checkOut, occupancy, items, promoCode, bookingType = "INDIVIDUAL" } = body;

    if (!checkIn || !checkOut || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "INVALID_PAYLOAD", message: "Missing checkIn, checkOut, or room items." },
        { status: 400 }
      );
    }

    // Validate real calendar dates
    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isNaN(inDate.getTime()) || isNaN(outDate.getTime()) || outDate <= inDate) {
      return NextResponse.json(
        { error: "INVALID_DATES", message: "Departure date must be after arrival date." },
        { status: 400 }
      );
    }

    const stayNights = Math.round((outDate.getTime() - inDate.getTime()) / (1000 * 60 * 60 * 24));
    if (stayNights > 30) {
      return NextResponse.json(
        { error: "MAX_STAY_EXCEEDED", message: "Maximum stay duration is 30 nights." },
        { status: 400 }
      );
    }

    const stayDates = getStayDatesArray(checkIn, checkOut);
    const now = Date.now();

    // Expire outdated holds first
    db.prepare(
      "UPDATE inventory_holds SET status = 'EXPIRED' WHERE status = 'ACTIVE' AND expires_at < ?"
    ).run(now);
    db.prepare(
      "UPDATE checkout_sessions SET status = 'EXPIRED' WHERE status = 'HELD' AND expires_at < ?"
    ).run(now);

    // Validate rooms & calculate authoritative pricing on server (SEC 02)
    let totalBasePaise = 0;
    let totalRoomsCount = 0;
    let totalCpRooms = 0;
    const validatedItems: Array<{
      roomTypeId: string;
      ratePlanCode: string;
      quantity: number;
      unitPricePaise: number;
      taxRateBps: number;
    }> = [];

    for (const itm of items) {
      const roomTypeId = canonicalRoomTypeId(itm.roomTypeId || itm.roomSlug || "rt_deluxe_king");
      const quantity = Math.max(1, Math.min(10, parseInt(itm.quantity || 1, 10)));
      totalRoomsCount += quantity;

      // Match room in ROOMS data
      const roomCat = ROOMS.find(
        (r) => canonicalRoomTypeId(r.id) === roomTypeId || canonicalRoomTypeId(r.slug) === roomTypeId
      ) || ROOMS[0];

      // Match rate plan
      const ratePlan =
        roomCat.ratePlans.find((rp) => rp.code === itm.ratePlanCode) || roomCat.ratePlans[0];

      if (ratePlan.code === "CP") {
        totalCpRooms += quantity;
      }

      // Base room tariff
      const unitPricePaise = Math.round(roomCat.basePrice * 100);
      const itemSubtotalPaise = unitPricePaise * quantity * stayNights;
      totalBasePaise += itemSubtotalPaise;

      validatedItems.push({
        roomTypeId,
        ratePlanCode: ratePlan.code,
        quantity,
        unitPricePaise,
        taxRateBps: 500, // standard baseline SAC 996311 (5% GST)
      });
    }

    // Dynamic breakfast calculation (₹150 per person per night for guests in CP rooms)
    const numAdults = Math.max(1, parseInt(occupancy?.adults || 2, 10));
    let breakfastGuestsCount = 0;
    if (totalCpRooms > 0 && totalRoomsCount > 0) {
      if (totalCpRooms === totalRoomsCount) {
        breakfastGuestsCount = numAdults;
      } else {
        breakfastGuestsCount = Math.min(numAdults, totalCpRooms * 2);
      }
    }
    const breakfastPaise = breakfastGuestsCount * 150 * 100 * stayNights;

    // Extra bed charge for adults exceeding standard capacity of 2 per room
    const baseIncludedAdults = totalRoomsCount * 2;
    const extraPaxCount = Math.max(0, numAdults - baseIncludedAdults);
    const extraPaxPaise = extraPaxCount * 500 * 100 * stayNights;

    totalBasePaise += (breakfastPaise + extraPaxPaise);

    // Authoritative Promo Discount Calculation
    let discountPaise = 0;
    let appliedPromoCode: string | null = null;

    if (promoCode && typeof promoCode === "string") {
      const cleanCode = promoCode.trim().toUpperCase();
      const promo = AVAILABLE_PROMOS.find((p) => p.code === cleanCode);
      if (promo) {
        appliedPromoCode = promo.code;
        const totalBaseRupees = totalBasePaise / 100;
        if (!promo.minSpend || totalBaseRupees >= promo.minSpend) {
          if (promo.discountType === "PERCENTAGE") {
            discountPaise = Math.round((totalBasePaise * promo.discountValue) / 100);
          } else {
            discountPaise = Math.round(Math.min(totalBasePaise, promo.discountValue * 100));
          }
        }
      }
    }

    const netBasePaise = Math.max(0, totalBasePaise - discountPaise);

    // SAC 996311 GST Engine:
    // Room Tariff <= ₹7,500 per room/night: 5% GST, > ₹7,500: 18%
    const effectiveDailyRateRupees = netBasePaise / 100 / Math.max(1, totalRoomsCount * stayNights);
    const taxRateBps = effectiveDailyRateRupees > 7500 ? 1800 : 500; // 18% vs 5%
    const taxPaise = Math.round((netBasePaise * taxRateBps) / 10000);
    const totalPaise = netBasePaise + taxPaise;

    // SEC 05: Atomic Inventory Hold Allocation across stay dates
    const checkoutId = crypto.randomUUID();
    const holdExpiresAt = now + 15 * 60 * 1000; // 15-minute checkout lock window

    // Generate stateless recovery access token to ensure seamless multi-container serverless execution
    const accessToken = createCheckoutToken({
      checkoutId,
      checkIn,
      checkOut,
      occupancy: {
        adults: occupancy?.adults || 2,
        children: occupancy?.children || 0,
        rooms: totalRoomsCount,
      },
      pricing: {
        subtotalPaise: totalBasePaise,
        discountPaise,
        taxPaise,
        totalPaise,
      },
      items: validatedItems,
      promoCode: appliedPromoCode,
      bookingType,
      expiresAt: holdExpiresAt,
      createdAt: now,
    });
    const tokenHash = crypto.createHash("sha256").update(accessToken).digest("hex");

    // Execute hold check and creation inside an atomic IMMEDIATE transaction
    runTransaction(() => {
      for (const stayDate of stayDates) {
        for (const itm of validatedItems) {
          const cap = ROOM_CAPACITIES[itm.roomTypeId] || 10;

          // Check active holds
          const heldRow = db
            .prepare(
              "SELECT COALESCE(SUM(quantity), 0) as held FROM inventory_holds WHERE room_type_id = ? AND stay_date = ? AND status = 'ACTIVE' AND expires_at > ?"
            )
            .get(itm.roomTypeId, stayDate, now) as { held: number };

          // Check confirmed reservations
          const resRow = db
            .prepare(
              "SELECT COUNT(*) as confirmed FROM reservations WHERE status = 'CONFIRMED' AND check_in <= ? AND check_out > ?"
            )
            .get(stayDate, stayDate) as { confirmed: number };

          const currentlyOccupied = (heldRow ? heldRow.held : 0) + (resRow ? resRow.confirmed : 0);

          if (currentlyOccupied + itm.quantity > cap) {
            throw new Error(
              `INSUFFICIENT_INVENTORY: Category ${itm.roomTypeId} exceeds physical capacity on ${stayDate}`
            );
          }
        }
      }

      // If all dates and categories have capacity, insert checkout session
      db.prepare(
        `INSERT INTO checkout_sessions (
          id, token_hash, check_in, check_out, adults, children, rooms, booking_type,
          status, subtotal_paise, discount_paise, tax_paise, total_paise, currency,
          promo_code, expires_at, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'INR', ?, ?, ?, ?)`
      ).run(
        checkoutId,
        tokenHash,
        checkIn,
        checkOut,
        occupancy?.adults || 2,
        occupancy?.children || 0,
        totalRoomsCount,
        bookingType,
        "HELD",
        totalBasePaise,
        discountPaise,
        taxPaise,
        totalPaise,
        appliedPromoCode,
        holdExpiresAt,
        now,
        now
      );

      // Insert checkout items
      const insertItem = db.prepare(
        `INSERT INTO checkout_items (
          checkout_id, room_type_id, rate_plan_code, quantity, unit_price_paise, tax_rate_bps
        ) VALUES (?, ?, ?, ?, ?, ?)`
      );
      for (const itm of validatedItems) {
        insertItem.run(
          checkoutId,
          itm.roomTypeId,
          itm.ratePlanCode,
          itm.quantity,
          itm.unitPricePaise,
          taxRateBps
        );
      }

      // Insert inventory holds for every stay date
      const insertHold = db.prepare(
        `INSERT INTO inventory_holds (
          checkout_id, room_type_id, stay_date, quantity, status, expires_at, created_at
        ) VALUES (?, ?, ?, ?, 'ACTIVE', ?, ?)`
      );
      for (const stayDate of stayDates) {
        for (const itm of validatedItems) {
          insertHold.run(checkoutId, itm.roomTypeId, stayDate, itm.quantity, holdExpiresAt, now);
        }
      }
    });

    return NextResponse.json({
      success: true,
      checkoutId,
      accessToken,
      expiresAt: holdExpiresAt,
      pricing: {
        subtotalAmount: totalBasePaise / 100,
        discountAmount: discountPaise / 100,
        taxAmount: taxPaise / 100,
        totalAmount: totalPaise / 100,
        currency: "INR",
      },
    });
  } catch (err: any) {
    if (err.message && err.message.startsWith("INSUFFICIENT_INVENTORY")) {
      return NextResponse.json(
        {
          error: "INSUFFICIENT_INVENTORY",
          message: "The requested room inventory is no longer available for your selected dates.",
        },
        { status: 409 }
      );
    }
    console.error("[Checkouts API] Error creating checkout:", err);
    return NextResponse.json(
      {
        error: "INTERNAL_ERROR",
        message: err?.message || "Failed to initialize checkout.",
      },
      { status: 500 }
    );
  }
}
