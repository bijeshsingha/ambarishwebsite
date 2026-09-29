import crypto from "crypto";
import { db } from "@/lib/db";

const TOKEN_SECRET =
  process.env.SESSION_SECRET ||
  process.env.RAZORPAY_KEY_SECRET ||
  "ambarish_grand_residency_guwahati_session_secret_2026";

export interface CheckoutSessionPayload {
  checkoutId: string;
  checkIn: string;
  checkOut: string;
  occupancy: {
    adults: number;
    children: number;
    rooms: number;
  };
  pricing: {
    subtotalPaise: number;
    discountPaise: number;
    taxPaise: number;
    totalPaise: number;
  };
  items: Array<{
    roomTypeId: string;
    ratePlanCode: string;
    quantity: number;
    unitPricePaise: number;
    taxRateBps: number;
  }>;
  promoCode?: string | null;
  bookingType: string;
  expiresAt: number;
  createdAt: number;
}

/**
 * Generate a cryptographically signed checkout access token.
 * Enables zero-downtime, stateless session recovery across serverless Lambda instances.
 */
export function createCheckoutToken(payload: CheckoutSessionPayload): string {
  const json = JSON.stringify(payload);
  const data = Buffer.from(json, "utf-8").toString("base64url");
  const signature = crypto.createHmac("sha256", TOKEN_SECRET).update(data).digest("base64url");
  return `cst_${data}.${signature}`;
}

/**
 * Verify and decode a signed checkout access token.
 */
export function verifyCheckoutToken(token: string): CheckoutSessionPayload | null {
  if (!token || typeof token !== "string" || !token.startsWith("cst_")) {
    return null;
  }

  const raw = token.slice(4);
  const dotIdx = raw.lastIndexOf(".");
  if (dotIdx === -1) return null;

  const data = raw.slice(0, dotIdx);
  const signature = raw.slice(dotIdx + 1);

  const expectedSignature = crypto.createHmac("sha256", TOKEN_SECRET).update(data).digest("base64url");

  const sigBuf = Buffer.from(signature, "utf-8");
  const expBuf = Buffer.from(expectedSignature, "utf-8");

  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return null;
  }

  try {
    const json = Buffer.from(data, "base64url").toString("utf-8");
    const payload = JSON.parse(json) as CheckoutSessionPayload;
    return payload;
  } catch {
    return null;
  }
}

/**
 * Ensures checkout session and items exist in the active SQLite database.
 * If missing (e.g. cross-instance serverless routing on Vercel), restores the authoritative
 * state from the cryptographically verified access token.
 */
export function ensureCheckoutSession(checkoutId: string, accessToken: string): any {
  const tokenHash = crypto.createHash("sha256").update(accessToken).digest("hex");

  // 1. Direct local SQLite query
  let checkout = db
    .prepare("SELECT * FROM checkout_sessions WHERE id = ? AND token_hash = ?")
    .get(checkoutId, tokenHash) as any;

  if (checkout) {
    return checkout;
  }

  // 2. Stateless recovery from signed access token if local row missing in serverless container
  const restored = verifyCheckoutToken(accessToken);
  if (restored && restored.checkoutId === checkoutId) {
    const now = Date.now();
    try {
      db.prepare(
        `INSERT INTO checkout_sessions (
          id, token_hash, check_in, check_out, adults, children, rooms, booking_type,
          status, subtotal_paise, discount_paise, tax_paise, total_paise, currency,
          promo_code, expires_at, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'INR', ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET updated_at = ?`
      ).run(
        restored.checkoutId,
        tokenHash,
        restored.checkIn,
        restored.checkOut,
        restored.occupancy?.adults || 2,
        restored.occupancy?.children || 0,
        restored.occupancy?.rooms || 1,
        restored.bookingType || "INDIVIDUAL",
        "HELD",
        restored.pricing.subtotalPaise,
        restored.pricing.discountPaise || 0,
        restored.pricing.taxPaise,
        restored.pricing.totalPaise,
        restored.promoCode || null,
        restored.expiresAt,
        restored.createdAt,
        restored.createdAt,
        now
      );

      const insertItem = db.prepare(
        `INSERT INTO checkout_items (
          checkout_id, room_type_id, rate_plan_code, quantity, unit_price_paise, tax_rate_bps
        ) VALUES (?, ?, ?, ?, ?, ?)`
      );

      for (const itm of restored.items || []) {
        insertItem.run(
          restored.checkoutId,
          itm.roomTypeId,
          itm.ratePlanCode || "EP",
          itm.quantity,
          itm.unitPricePaise,
          itm.taxRateBps || 500
        );
      }

      checkout = db
        .prepare("SELECT * FROM checkout_sessions WHERE id = ? AND token_hash = ?")
        .get(checkoutId, tokenHash) as any;
    } catch (recoveryErr) {
      console.warn("[SessionRecovery] Could not restore session into SQLite:", recoveryErr);
    }
  }

  return checkout;
}
