import { db } from "@/lib/db";
import { sendReservationNotificationEmails } from "@/lib/email";
import { createPmsReservation } from "@/lib/hotel-os-client";

/**
 * Durable Outbox Engine (SEC 06 & Table 5)
 * Guarantees reliable asynchronous dispatch of PMS synchronization and Email vouchers
 * without blocking API requests or losing messages on server restarts.
 */

export interface OutboxMessage {
  id: number;
  reservation_id: string;
  event_type: "PMS_SYNC" | "EMAIL_NOTIFICATION";
  payload: string;
  attempts: number;
  max_attempts: number;
  next_attempt_at: number;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
}

/**
 * Queue message in durable outbox inside an active database transaction
 */
export function queueOutboxEvent(
  reservationId: string,
  eventType: "PMS_SYNC" | "EMAIL_NOTIFICATION",
  payload: any
): void {
  const now = Date.now();
  db.prepare(
    `INSERT INTO outbox (
      reservation_id, event_type, payload, attempts, max_attempts, next_attempt_at, status, created_at
    ) VALUES (?, ?, ?, 0, 5, ?, 'PENDING', ?)`
  ).run(reservationId, eventType, JSON.stringify(payload), now, now);
}

/**
 * Process pending outbox events with bounded exponential backoff
 */
export async function processOutboxQueue(): Promise<void> {
  const now = Date.now();
  const pending = (db
    .prepare(
      "SELECT * FROM outbox WHERE status = 'PENDING' AND next_attempt_at <= ? ORDER BY id ASC LIMIT 5"
    )
    .all(now) as unknown) as OutboxMessage[];

  for (const item of pending) {
    // Mark processing
    db.prepare("UPDATE outbox SET status = 'PROCESSING' WHERE id = ?").run(item.id);

    try {
      const payload = JSON.parse(item.payload);

      if (item.event_type === "EMAIL_NOTIFICATION") {
        await sendReservationNotificationEmails(payload);
        db.prepare(
          "UPDATE outbox SET status = 'COMPLETED', processed_at = ? WHERE id = ?"
        ).run(Date.now(), item.id);
      } else if (item.event_type === "PMS_SYNC") {
        const pmsRes = await createPmsReservation(payload);
        if (pmsRes.success && !pmsRes.offlineFallback) {
          db.prepare(
            "UPDATE reservations SET pms_confirmation_no = ?, pms_status = 'SYNCED', updated_at = ? WHERE id = ?"
          ).run(pmsRes.confirmationNo, Date.now(), item.reservation_id);

          db.prepare(
            "UPDATE outbox SET status = 'COMPLETED', processed_at = ? WHERE id = ?"
          ).run(Date.now(), item.id);
        } else {
          // PMS offline or fallback — retry with exponential backoff
          const attempts = item.attempts + 1;
          const nextAttempt = Date.now() + Math.pow(2, attempts) * 30000;
          const newStatus = attempts >= item.max_attempts ? "FAILED" : "PENDING";

          db.prepare(
            "UPDATE outbox SET attempts = ?, next_attempt_at = ?, status = ?, last_error = ? WHERE id = ?"
          ).run(attempts, nextAttempt, newStatus, "PMS synchronization offline or rejected", item.id);
        }
      }
    } catch (err: any) {
      const attempts = item.attempts + 1;
      const nextAttempt = Date.now() + Math.pow(2, attempts) * 30000;
      const newStatus = attempts >= item.max_attempts ? "FAILED" : "PENDING";

      db.prepare(
        "UPDATE outbox SET attempts = ?, next_attempt_at = ?, status = ?, last_error = ? WHERE id = ?"
      ).run(attempts, nextAttempt, newStatus, err?.message || "Outbox processing error", item.id);
    }
  }
}
