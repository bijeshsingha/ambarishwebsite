import fs from "fs";
import path from "path";

/**
 * Sequential Unique Reservation Number Generator for Hotel Ambarish Grand Residency
 * Generates clean, sequential, and unique serial numbers starting from 0.
 * Examples: HAGR-0000, HAGR-0001, HAGR-0002 ...
 */

declare global {
  // eslint-disable-next-line no-var
  var __HAGR_RESERVATION_COUNTER__: number | undefined;
}

const LOCAL_DATA_FILE = path.join(process.cwd(), "data", "reservation-counter.json");
const TMP_DATA_FILE = path.join("/tmp", "reservation-counter.json");

function getStoragePath(): string {
  // Use /tmp for serverless/read-only lambda runtimes (like Vercel)
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return TMP_DATA_FILE;
  }
  return LOCAL_DATA_FILE;
}

function loadPersistedSequence(): number {
  if (typeof globalThis.__HAGR_RESERVATION_COUNTER__ === "number") {
    return globalThis.__HAGR_RESERVATION_COUNTER__;
  }

  const configuredStart = parseInt(process.env.START_RESERVATION_SEQUENCE || "0", 10);
  const targetPath = getStoragePath();

  try {
    if (fs.existsSync(targetPath)) {
      const content = fs.readFileSync(targetPath, "utf-8");
      const parsed = JSON.parse(content);
      if (typeof parsed.lastSequence === "number") {
        globalThis.__HAGR_RESERVATION_COUNTER__ = parsed.lastSequence;
        return parsed.lastSequence;
      }
    }
  } catch (err) {
    console.warn("[Sequence] Error reading persisted sequence:", err);
  }

  // If no previous sequence found, start right before initial value so first call generates configuredStart
  globalThis.__HAGR_RESERVATION_COUNTER__ = configuredStart - 1;
  return globalThis.__HAGR_RESERVATION_COUNTER__;
}

function persistSequence(val: number): void {
  globalThis.__HAGR_RESERVATION_COUNTER__ = val;
  const targetPath = getStoragePath();

  try {
    const dir = path.dirname(targetPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(
      targetPath,
      JSON.stringify({ lastSequence: val, updatedAt: new Date().toISOString() }, null, 2),
      "utf-8"
    );
  } catch (err) {
    console.warn("[Sequence] Error saving sequence to disk:", err);
  }
}

/**
 * Generates the next sequential unique reservation number starting from 0 (HAGR-0000).
 */
export function getNextReservationReference(): string {
  const current = loadPersistedSequence();
  const nextVal = current + 1;
  persistSequence(nextVal);

  const paddedNumber = String(nextVal).padStart(4, "0");
  return `HAGR-${paddedNumber}`;
}
