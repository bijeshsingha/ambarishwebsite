import { NextResponse } from "next/server";
import crypto from "crypto";
import { db, runTransaction } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-razorpay-signature");
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET;

    if (!signature || !webhookSecret) {
      return NextResponse.json(
        { error: "UNAUTHORIZED", message: "Missing webhook signature or secret." },
        { status: 401 }
      );
    }

    // Cryptographic validation of raw body
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    const expectedBuf = Buffer.from(expectedSignature, "utf-8");
    const receivedBuf = Buffer.from(signature, "utf-8");

    const isValid =
      expectedBuf.length === receivedBuf.length &&
      crypto.timingSafeEqual(expectedBuf, receivedBuf);

    if (!isValid) {
      console.warn("[Webhook] Invalid signature received");
      return NextResponse.json(
        { error: "INVALID_SIGNATURE", message: "Webhook signature verification failed." },
        { status: 400 }
      );
    }

    const event = JSON.parse(rawBody);
    const eventId = event.event_id || event.id || `evt_${Date.now()}`;
    const eventType = event.event || "unknown";

    // SEC 03: Deduplicate webhooks with unique provider event ID
    const existing = db
      .prepare("SELECT id FROM webhook_events WHERE provider_event_id = ?")
      .get(eventId);

    if (existing) {
      return NextResponse.json({ status: "already_processed", eventId });
    }

    const now = Date.now();

    // Process event state transitions atomically
    runTransaction(() => {
      db.prepare(
        "INSERT INTO webhook_events (provider_event_id, event_type, payload, processed_at, created_at) VALUES (?, ?, ?, ?, ?)"
      ).run(eventId, eventType, rawBody, now, now);

      if (eventType === "order.paid" || eventType === "payment.captured") {
        const orderEntity = event.payload?.order?.entity || event.payload?.payment?.entity;
        const orderId = orderEntity?.order_id || orderEntity?.id;
        const paymentId = event.payload?.payment?.entity?.id;

        if (orderId) {
          const payment = db
            .prepare("SELECT checkout_id FROM payments WHERE provider_order_id = ?")
            .get(orderId) as { checkout_id: string } | undefined;

          if (payment) {
            db.prepare(
              "UPDATE payments SET status = 'PAID', provider_payment_id = COALESCE(?, provider_payment_id), updated_at = ? WHERE checkout_id = ?"
            ).run(paymentId || null, now, payment.checkout_id);

            db.prepare(
              "UPDATE checkout_sessions SET status = 'PAID', updated_at = ? WHERE id = ?"
            ).run(now, payment.checkout_id);
          }
        }
      }
    });

    return NextResponse.json({ status: "success", eventId });
  } catch (err: any) {
    console.error("[Razorpay Webhook] Processing error:", err?.message);
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: "Webhook processing error." },
      { status: 500 }
    );
  }
}
