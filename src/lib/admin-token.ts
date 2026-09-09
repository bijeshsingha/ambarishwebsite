import crypto from "crypto";
import { serverConfig } from "@/lib/config";

/**
 * Generates an HMAC-SHA256 token for front desk actions (confirming reservations).
 * Bound to the booking reference and internal reservation UUID.
 */
export function generateAdminConfirmToken(bookingReference: string, reservationId: string): string {
  const secret = process.env.ADMIN_SECRET_KEY || serverConfig.mail.pass || "ambarish-front-desk-key-2026";
  return crypto
    .createHmac("sha256", secret)
    .update(`${bookingReference.trim().toUpperCase()}:${reservationId.trim()}`)
    .digest("hex");
}

/**
 * Constant-time verification of the front desk confirmation token
 */
export function verifyAdminConfirmToken(
  bookingReference: string,
  reservationId: string,
  token: string
): boolean {
  if (!bookingReference || !reservationId || !token) return false;
  try {
    const expected = generateAdminConfirmToken(bookingReference, reservationId);
    const bufExpected = Buffer.from(expected, "hex");
    const bufActual = Buffer.from(token.trim(), "hex");

    if (bufExpected.length !== bufActual.length) return false;
    return crypto.timingSafeEqual(bufExpected, bufActual);
  } catch {
    return false;
  }
}
