const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const fs = require('fs');

const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new DatabaseSync(path.join(dataDir, 'ambarish.db'));
db.exec("PRAGMA journal_mode = WAL;");
db.exec("PRAGMA foreign_keys = ON;");
db.exec("PRAGMA busy_timeout = 5000;");

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
    rate_plan_code TEXT NOT NULL,
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
    checkout_id TEXT UNIQUE NOT NULL REFERENCES checkout_sessions(id),
    lookup_token_hash TEXT NOT NULL,
    status TEXT NOT NULL,
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
    reservation_id TEXT REFERENCES reservations(id),
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

  INSERT INTO sequence_counters (name, current_value) 
  VALUES ('reservation_sequence', 0)
  ON CONFLICT(name) DO NOTHING;
`);

const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;").all();
console.log("Database initialized. Tables:", tables.map(t => t.name));
