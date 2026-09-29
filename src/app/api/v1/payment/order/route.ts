import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { ensureCheckoutSession } from "@/lib/session-token";

export async function POST(request: Request) {
  const clientIp = getClientIp(request);

  try {
    const body = await request.json();
    const { checkoutId, accessToken } = body;

    if (!checkoutId || !accessToken) {
      return NextResponse.json(
        { error: "INVALID_REQUEST", message: "Checkout ID and access token required." },
        { status: 400 }
      );
    }

    // SEC 09 & Table 3: Rate limit 5 orders per 15 minutes
    const rate = checkRateLimit("payment_order", `${clientIp}:${checkoutId}`, 5, 900);
    if (!rate.allowed) {
      return NextResponse.json(
        { error: "TOO_MANY_REQUESTS", message: "Rate limit exceeded. Please try again later." },
        { status: 429, headers: { "Retry-After": String(rate.resetInSeconds) } }
      );
    }

    // Hash client access token
    const tokenHash = crypto.createHash("sha256").update(accessToken).digest("hex");
    const now = Date.now();

    // SEC 03: Load authoritative checkout session (with stateless recovery if cross-container)
    const checkout = ensureCheckoutSession(checkoutId, accessToken);

    if (!checkout) {
      return NextResponse.json(
        { error: "NOT_FOUND", message: "Invalid checkout session." },
        { status: 404 }
      );
    }

    if (now > checkout.expires_at || checkout.status === "EXPIRED") {
      return NextResponse.json(
        { error: "CHECKOUT_EXPIRED", message: "Checkout session and inventory hold have expired." },
        { status: 409 }
      );
    }

    if (checkout.status === "PAID" || checkout.status === "CONFIRMED") {
      return NextResponse.json(
        { error: "ALREADY_PROCESSED", message: "This checkout has already been paid or confirmed." },
        { status: 409 }
      );
    }

    const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "";
    const keySecret = process.env.RAZORPAY_KEY_SECRET || "";

    const amountInPaise = checkout.total_paise;
    let orderId = "";

    if (keyId && keySecret) {
      const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
      const response = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amountInPaise,
          currency: "INR",
          receipt: `hagr_${checkoutId.slice(0, 8)}`,
          notes: {
            checkoutId,
            hotel: "Hotel Ambarish Grand Residency",
          },
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.id) {
        console.error("[Razorpay API] Order creation rejected:", data?.error?.description);
        return NextResponse.json(
          { error: "GATEWAY_ERROR", message: "Payment provider was unable to create an order." },
          { status: 502 }
        );
      }
      orderId = data.id;
    } else {
      // Offline / Developer simulation order if credentials not yet configured
      orderId = `order_sim_${crypto.randomBytes(8).toString("hex")}`;
    }

    // SEC 03: Persist provider order ID, expected amount, currency, and checkout ID in database
    db.prepare(
      `INSERT INTO payments (
        checkout_id, provider, provider_order_id, amount_paise, currency, status, created_at, updated_at
      ) VALUES (?, 'RAZORPAY', ?, ?, 'INR', 'CREATED', ?, ?)
      ON CONFLICT(checkout_id) DO UPDATE SET
        provider_order_id = excluded.provider_order_id,
        amount_paise = excluded.amount_paise,
        status = 'CREATED',
        updated_at = excluded.updated_at`
    ).run(checkoutId, orderId, amountInPaise, now, now);

    db.prepare("UPDATE checkout_sessions SET status = 'PAYMENT_PENDING', updated_at = ? WHERE id = ?").run(
      now,
      checkoutId
    );

    return NextResponse.json({
      success: true,
      orderId,
      amount: amountInPaise,
      currency: "INR",
      keyId,
    });
  } catch (err: any) {
    console.error("[Payment Order API] Error creating order:", err);
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: err?.message || "Could not create payment order." },
      { status: 500 }
    );
  }
}
