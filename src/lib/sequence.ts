import { db } from "@/lib/db";

/**
 * Authoritative Database Sequence Counter
 * Guarantees atomic, strictly monotonically increasing sequential reservation references
 * formatted as HAGR-XXXX (e.g. HAGR-0000, HAGR-0001, etc.) backed by ACID transactions.
 */

export async function getNextReservationReference(): Promise<string> {
  // Execute within atomic transaction on sequence_counters table
  try {
    db.exec("BEGIN IMMEDIATE");
    const row = db
      .prepare("SELECT current_value FROM sequence_counters WHERE name = ?")
      .get("reservation_sequence") as { current_value: number } | undefined;

    let current = row ? row.current_value : 0;

    // Safety: ensure current is strictly higher than any existing reference in reservations table
    try {
      const maxResRow = db
        .prepare("SELECT booking_reference FROM reservations ORDER BY booking_reference DESC LIMIT 1")
        .get() as { booking_reference: string } | undefined;

      if (maxResRow && maxResRow.booking_reference?.startsWith("HAGR-")) {
        const existingNum = parseInt(maxResRow.booking_reference.replace("HAGR-", ""), 10);
        if (!isNaN(existingNum) && existingNum >= current) {
          current = existingNum + 1;
        }
      }
    } catch {
      // Ignore if table query fails
    }

    const nextValue = current + 1;

    db.prepare(
      "INSERT INTO sequence_counters (name, current_value) VALUES (?, ?) ON CONFLICT(name) DO UPDATE SET current_value = ?"
    ).run("reservation_sequence", nextValue, nextValue);

    db.exec("COMMIT");

    const padded = String(current).padStart(4, "0");
    return `HAGR-${padded}`;
  } catch (err) {
    try {
      db.exec("ROLLBACK");
    } catch {
      // Ignore rollback failure if no txn active
    }
    throw new Error(`Failed to allocate sequential reservation reference: ${(err as Error).message}`);
  }
}
