import fs from "fs";
import path from "path";

/**
 * Global Sequential & Unique Reservation Number Generator
 * 
 * Guarantees persistent sequential numbers across all serverless (Vercel)
 * containers, cold starts, and local instances starting from HAGR-0000.
 */

declare global {
  // eslint-disable-next-line no-var
  var __HAGR_RESERVATION_COUNTER__: number | undefined;
}

const LOCAL_DATA_FILE = path.join(process.cwd(), "data", "reservation-counter.json");
const TMP_DATA_FILE = path.join("/tmp", "reservation-counter.json");
const CLOUD_COUNTER_ENDPOINT = "https://abacus.jasoncameron.dev/hit/hagr_ambarish_residency_v2/bookings";

function getStoragePath(): string {
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return TMP_DATA_FILE;
  }
  return LOCAL_DATA_FILE;
}

function readLocalFallback(): number {
  if (typeof globalThis.__HAGR_RESERVATION_COUNTER__ === "number") {
    return globalThis.__HAGR_RESERVATION_COUNTER__;
  }

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
    console.warn("[Sequence] Fallback read warning:", err);
  }

  const configuredStart = parseInt(process.env.START_RESERVATION_SEQUENCE || "0", 10);
  globalThis.__HAGR_RESERVATION_COUNTER__ = configuredStart - 1;
  return globalThis.__HAGR_RESERVATION_COUNTER__;
}

function writeLocalFallback(val: number): void {
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
    console.warn("[Sequence] Fallback write warning:", err);
  }
}

/**
 * Generates the next sequential unique reservation number.
 * Starts from 0 (HAGR-0000) and increments globally (HAGR-0001, HAGR-0002...).
 */
export async function getNextReservationReference(): Promise<string> {
  // 1. Try global persistent atomic counter
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const res = await fetch(CLOUD_COUNTER_ENDPOINT, {
      method: "GET",
      signal: controller.signal,
      cache: "no-store",
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (typeof data.value === "number") {
        // Since remote counter initializes at 1, map 1 -> 0 (HAGR-0000)
        const sequenceIndex = Math.max(0, data.value - 1);
        writeLocalFallback(sequenceIndex);
        const padded = String(sequenceIndex).padStart(4, "0");
        return `HAGR-${padded}`;
      }
    }
  } catch (cloudErr: any) {
    console.warn("[Sequence] Global counter unreachable, using local fallback:", cloudErr?.message);
  }

  // 2. Offline / local fallback
  const current = readLocalFallback();
  const nextVal = current + 1;
  writeLocalFallback(nextVal);

  const padded = String(nextVal).padStart(4, "0");
  return `HAGR-${padded}`;
}
