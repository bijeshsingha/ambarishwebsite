import { db } from "@/lib/db";

/**
 * Authoritative Database Sequence Counter
 * Guarantees atomic, strictly monotonically increasing sequential reservation references
 * formatted as HAGR-XXXX (e.g. HAGR-0000, HAGR-0001, etc.) backed by ACID transactions.
 */

export async function getNextReservationReference(): Promise<string> {
  // Execute within atomic transaction on sequence_counters table
  db.exec("BEGIN IMMEDIATE");
  try {
    const row = db
      .prepare("SELECT current_value FROM sequence_counters WHERE name = ?")
      .get("reservation_sequence") as { current_value: number } | undefined;

    const current = row ? row.current_value : 0;
    const nextValue = current + 1;

    db.prepare(
      "INSERT INTO sequence_counters (name, current_value) VALUES (?, ?) ON CONFLICT(name) DO UPDATE SET current_value = ?"
    ).run("reservation_sequence", nextValue, nextValue);

    db.exec("COMMIT");

    const padded = String(current).padStart(4, "0");
    return `HAGR-${padded}`;
  } catch (err) {
    db.exec("ROLLBACK");
    throw new Error(`Failed to allocate sequential reservation reference: ${(err as Error).message}`);
  }
}
