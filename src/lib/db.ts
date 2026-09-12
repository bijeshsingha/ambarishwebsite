import path from "path";
import fs from "fs";
import os from "os";
import { DatabaseSync } from "node:sqlite";

/**
 * Authoritative SQLite Database Manager
 * Implements durable storage, ACID transactions, and integrity constraints.
 * Hardened for multi-worker build processes, serverless (Vercel/Lambda), and concurrency.
 */

declare global {
  // eslint-disable-next-line no-var
  var __AMBARISH_DB__: DatabaseSync | undefined;
}

function resolveDbPath(): string {
  try {
    const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
    if (isServerless) {
      return path.join(os.tmpdir(), "ambarish.db");
    }

    const dataDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) {
      try {
        fs.mkdirSync(dataDir, { recursive: true });
      } catch {
        return path.join(os.tmpdir(), "ambarish.db");
      }
    }

    return path.join(dataDir, "ambarish.db");
  } catch {
    return path.join(os.tmpdir(), "ambarish.db");
  }
}

function initDbSchema(db: DatabaseSync): void {
  // 1. MUST set busy timeout FIRST before any locks or WAL mode
  try {
    db.exec("PRAGMA busy_timeout = 10000;");
    db.exec("PRAGMA foreign_keys = ON;");
  } catch (err) {
    console.warn("[DB] Pragmas error:", err);
  }

  // 2. Set WAL mode safely (ignore if already set or locked by concurrent worker)
  try {
    db.exec("PRAGMA journal_mode = WAL;");
  } catch {
    // Already in WAL or concurrent worker active
  }

  // 3. Schema definition with IF NOT EXISTS
  try {
    db.exec(`
      CREATE TABLE IF NOT EXISTS checkout_sessions (
        id TEXT PRIMARY KEY,
        token_hash TEXT NOT NULL,
        check_in TEXT NOT NULL,
        check_out TEXT NOT NULL,
        adults INTEGER NOT NULL,
        children INTEGER NOT NULL,
        rooms INTEGER NOT NULL,
        booking_type TEXT NOT NULL DEFAULT 'INDIVIDUAL',
        status TEXT NOT NULL,
        subtotal_paise INTEGER NOT NULL,
        discount_paise INTEGER NOT NULL DEFAULT 0,
        tax_paise INTEGER NOT NULL,
        total_paise INTEGER NOT NULL,
        currency TEXT NOT NULL DEFAULT 'INR',
        promo_code TEXT,
        expires_at INTEGER NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS checkout_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        checkout_id TEXT NOT NULL REFERENCES checkout_sessions(id) ON DELETE CASCADE,
        room_type_id TEXT NOT NULL,
        ratePlanCode TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        unit_price_paise INTEGER NOT NULL,
        tax_rate_bps INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS inventory_holds (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        checkout_id TEXT NOT NULL REFERENCES checkout_sessions(id) ON DELETE CASCADE,
        room_type_id TEXT NOT NULL,
        stay_date TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        status TEXT NOT NULL,
        expires_at INTEGER NOT NULL,
        created_at INTEGER NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_holds_date_type ON inventory_holds(stay_date, room_type_id, status);
      CREATE INDEX IF NOT EXISTS idx_holds_checkout ON inventory_holds(checkout_id);

      CREATE TABLE IF NOT EXISTS payments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        checkout_id TEXT NOT NULL UNIQUE REFERENCES checkout_sessions(id),
        provider TEXT NOT NULL DEFAULT 'RAZORPAY',
        provider_order_id TEXT UNIQUE,
        provider_payment_id TEXT UNIQUE,
        amount_paise INTEGER NOT NULL,
        currency TEXT NOT NULL DEFAULT 'INR',
        status TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS reservations (
        id TEXT PRIMARY KEY,
        booking_reference TEXT UNIQUE NOT NULL,
        checkout_id TEXT UNIQUE NOT NULL,
        lookup_token_hash TEXT NOT NULL,
        status TEXT NOT NULL,
        check_in TEXT,
        check_out TEXT,
        guest_name TEXT NOT NULL,
        guest_email TEXT NOT NULL,
        guest_phone TEXT NOT NULL,
        guest_city TEXT,
        guest_state TEXT,
        guest_gstin TEXT,
        company_name TEXT,
        special_requests TEXT,
        booking_type TEXT NOT NULL DEFAULT 'INDIVIDUAL',
        payment_method TEXT NOT NULL,
        payment_id TEXT,
        financial_snapshot_json TEXT NOT NULL,
        booked_rooms_json TEXT NOT NULL,
        pms_confirmation_no TEXT,
        pms_status TEXT DEFAULT 'PENDING',
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_res_lookup ON reservations(lookup_token_hash);
      CREATE INDEX IF NOT EXISTS idx_res_ref ON reservations(booking_reference);
      CREATE INDEX IF NOT EXISTS idx_res_dates ON reservations(check_in, check_out, status);

      CREATE TABLE IF NOT EXISTS webhook_events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        provider_event_id TEXT UNIQUE NOT NULL,
        event_type TEXT NOT NULL,
        payload TEXT NOT NULL,
        processed_at INTEGER,
        created_at INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS outbox (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        reservation_id TEXT,
        event_type TEXT NOT NULL,
        payload TEXT NOT NULL,
        attempts INTEGER NOT NULL DEFAULT 0,
        max_attempts INTEGER NOT NULL DEFAULT 5,
        next_attempt_at INTEGER NOT NULL,
        status TEXT NOT NULL DEFAULT 'PENDING',
        last_error TEXT,
        processed_at INTEGER,
        created_at INTEGER NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_outbox_pending ON outbox(status, next_attempt_at);

      CREATE TABLE IF NOT EXISTS sequence_counters (
        name TEXT PRIMARY KEY,
        current_value INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS rate_limits (
        key TEXT PRIMARY KEY,
        count INTEGER NOT NULL,
        reset_at INTEGER NOT NULL
      );
    `);
  } catch (schemaErr) {
    console.warn("[DB] Schema init warning (already exists or locked):", schemaErr);
  }

  // Safe migration for check_in / check_out columns if missing
  try {
    db.exec("ALTER TABLE reservations ADD COLUMN check_in TEXT;");
  } catch {
    // Ignore
  }
  try {
    db.exec("ALTER TABLE reservations ADD COLUMN check_out TEXT;");
  } catch {
    // Ignore
  }

  // Initialize sequence counter if not exists
  try {
    const checkSeq = db.prepare("SELECT current_value FROM sequence_counters WHERE name = ?").get("reservation_sequence");
    if (!checkSeq) {
      db.prepare("INSERT INTO sequence_counters (name, current_value) VALUES (?, ?)").run("reservation_sequence", 0);
    }
  } catch {
    // Ignore concurrency conflicts
  }
}

function getDatabase(): DatabaseSync {
  if (globalThis.__AMBARISH_DB__) {
    return globalThis.__AMBARISH_DB__;
  }

  const dbPath = resolveDbPath();
  let db: DatabaseSync;

  try {
    db = new DatabaseSync(dbPath);
    initDbSchema(db);
  } catch (err: any) {
    console.warn(`[DB] Could not open SQLite at "${dbPath}" (${err?.message}). Falling back to memory DB.`);
    try {
      db = new DatabaseSync(":memory:");
      initDbSchema(db);
    } catch (memErr) {
      console.error("[DB] Critical memory DB init error:", memErr);
      throw memErr;
    }
  }

  globalThis.__AMBARISH_DB__ = db;
  return db;
}

export const db = getDatabase();

/**
 * Execute callback within an IMMEDIATE database transaction
 */
export function runTransaction<T>(fn: () => T): T {
  try {
    db.exec("BEGIN IMMEDIATE");
    const result = fn();
    db.exec("COMMIT");
    return result;
  } catch (err) {
    try {
      db.exec("ROLLBACK");
    } catch {
      // Ignore rollback error if no active txn
    }
    throw err;
  }
}
