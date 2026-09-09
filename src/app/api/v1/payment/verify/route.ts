import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const clientIp = getClientIp(request);

  try {
    const body = await request.json();
    const { checkoutId, accessToken, razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      body;

    if (!checkoutId || !accessToken || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "INVALID_PARAMS", message: "Missing required payment verification parameters." },
        { status: 400 }
      );
    }

    // SEC 09 & Table 3: Rate limit 10 verify attempts per 15 minutes
    const rate = checkRateLimit("payment_verify", `${clientIp}:${checkoutId}`, 10, 900);
    if (!rate.allowed) {
      return NextResponse.json(
        { error: "TOO_MANY_REQUESTS", message: "Rate limit exceeded." },
        { status: 429, headers: { "Retry-After": String(rate.resetInSeconds) } }
      );
    }

    const tokenHash = crypto.createHash("sha256").update(accessToken).digest("hex");

    // SEC 03: Verify against stored checkout session
    const checkout = db
      .prepare("SELECT * FROM checkout_sessions WHERE id = ? AND token_hash = ?")
      .get(checkoutId, tokenHash) as any;

    if (!checkout) {
      return NextResponse.json(
        { error: "INVALID_CHECKOUT", message: "Checkout session not recognized." },
        { status: 404 }
      );
    }

    // Load stored payment record
    const payment = db
      .prepare("SELECT * FROM payments WHERE checkout_id = ?")
      .get(checkoutId) as any;

    if (!payment) {
      return NextResponse.json(
        { error: "PAYMENT_NOT_FOUND", message: "No payment order registered for this checkout." },
        { status: 404 }
      );
    }

    // If already verified and marked PAID, return idempotent success
    if (payment.status === "PAID" && payment.provider_payment_id === razorpay_payment_id) {
      return NextResponse.json({ success: true, verified: true, idempotent: true });
    }

    // SEC 03: Verify that order ID strictly matches the stored provider order ID
    if (payment.provider_order_id !== razorpay_order_id) {
      return NextResponse.json(
        { error: "ORDER_MISMATCH", message: "Order ID does not correspond to this checkout session." },
        { status: 400 }
      );
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET || "";

    // If simulating in dev without credentials
    if (!keySecret && razorpay_order_id.startsWith("order_sim_")) {
      const now = Date.now();
      db.prepare(
        "UPDATE payments SET status = 'PAID', provider_payment_id = ?, updated_at = ? WHERE checkout_id = ?"
      ).run(razorpay_payment_id, now, checkoutId);
      db.prepare("UPDATE checkout_sessions SET status = 'PAID', updated_at = ? WHERE id = ?").run(
        now,
        checkoutId
      );
      return NextResponse.json({ success: true, verified: true, simulation: true });
    }

    if (!keySecret) {
      return NextResponse.json(
        { error: "CONFIG_ERROR", message: "Payment verification credentials missing on server." },
        { status: 500 }
      );
    }

    // SEC 03: Construct HMAC using stored provider order ID
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${payment.provider_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const expectedBuf = Buffer.from(expectedSignature, "utf-8");
    const receivedBuf = Buffer.from(razorpay_signature, "utf-8");

    // SEC 03 & SEC 15: Constant-time comparison without logging signatures
    const isSignatureValid =
      expectedBuf.length === receivedBuf.length &&
      crypto.timingSafeEqual(expectedBuf, receivedBuf);

    if (!isSignatureValid) {
      // SEC 15: Do NOT log the signatures!
      console.warn(`[Payment Verify] Signature verification failed for checkout ${checkoutId}`);
      return NextResponse.json(
        { error: "INVALID_SIGNATURE", message: "Cryptographic payment signature mismatch." },
        { status: 400 }
      );
    }

    // Check payment state in Razorpay if needed, or record verified state
    const now = Date.now();
    db.prepare(
      "UPDATE payments SET status = 'PAID', provider_payment_id = ?, updated_at = ? WHERE checkout_id = ?"
    ).run(razorpay_payment_id, now, checkoutId);

    db.prepare("UPDATE checkout_sessions SET status = 'PAID', updated_at = ? WHERE id = ?").run(
      now,
      checkoutId
    );

    return NextResponse.json({
      success: true,
      verified: true,
      checkoutId,
    });
  } catch (err: any) {
    console.error("[Payment Verify API] Internal error:", err?.message);
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: "Payment verification failed." },
      { status: 500 }
    );
  }
}
