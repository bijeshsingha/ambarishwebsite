/**
 * Client Session & Stay Parameters Storage Helper (SEC 10 Compliant)
 * 
 * In strict compliance with SEC 10:
 * - NO personal identifiable information (name, email, phone, GSTIN, company, special requests, payment data)
 *   is EVER persisted to browser cookies or localStorage.
 * - Only non-sensitive search preferences (dates, occupancy, room counts, promo codes) are preserved.
 * - Any legacy PII cookies from prior versions are actively purged upon initialization.
 */

export interface StayParamsSession {
  checkIn: string;
  checkOut: string;
  rooms: number;
  adults: number;
  children: number;
  promoCode?: string;
}

const STAY_COOKIE_KEY = "ambarish_stay_params";
const LEGACY_PII_COOKIE_KEY = "ambarish_guest_profile";
const STAY_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days for stay preferences

// Helper to set cookie for non-sensitive stay parameters
function setCookie(name: string, value: string, maxAgeSeconds: number = STAY_COOKIE_MAX_AGE) {
  if (typeof document === "undefined") return;
  const encoded = encodeURIComponent(value);
  document.cookie = `${name}=${encoded}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax`;
  try {
    localStorage.setItem(name, value);
  } catch {
    // Ignore quota errors
  }
}

// Helper to get cookie
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  const nameEQ = `${name}=`;
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) {
      try {
        return decodeURIComponent(c.substring(nameEQ.length, c.length));
      } catch {
        return c.substring(nameEQ.length, c.length);
      }
    }
  }

  try {
    return localStorage.getItem(name);
  } catch {
    return null;
  }
}

// Actively purge legacy PII cookie if present
export function purgeLegacyGuestPII(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${LEGACY_PII_COOKIE_KEY}=; path=/; max-age=0; SameSite=Lax`;
  try {
    localStorage.removeItem(LEGACY_PII_COOKIE_KEY);
  } catch {
    // Ignore storage errors
  }
}

/**
 * Save non-sensitive stay parameters (dates, rooms, adults, children, promo)
 */
export function saveStaySession(stay: Partial<StayParamsSession>): void {
  if (!stay) return;
  const existing = getStaySession() || {};
  const merged = { ...existing, ...stay };
  setCookie(STAY_COOKIE_KEY, JSON.stringify(merged));
}

/**
 * Retrieve saved non-sensitive stay parameters
 */
export function getStaySession(): StayParamsSession | null {
  purgeLegacyGuestPII();
  const data = getCookie(STAY_COOKIE_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data) as StayParamsSession;
  } catch {
    return null;
  }
}

/**
 * Clear stay parameters session
 */
export function clearStaySession(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${STAY_COOKIE_KEY}=; path=/; max-age=0; SameSite=Lax`;
  try {
    localStorage.removeItem(STAY_COOKIE_KEY);
  } catch {
    // Ignore storage errors
  }
}

/**
 * @deprecated In accordance with SEC 10, guest PII is never stored in browser storage.
 * This stub safely no-ops and purges any legacy PII.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function saveGuestSession(_profile: any): void {
  purgeLegacyGuestPII();
}

/**
 * @deprecated In accordance with SEC 10, guest PII is never retrieved from browser storage.
 * Returns null to prevent credential/PII persistence across sessions.
 */
export function getGuestSession(): null {
  purgeLegacyGuestPII();
  return null;
}
