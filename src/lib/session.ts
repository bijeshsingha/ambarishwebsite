/**
 * Session Cookie & Client Storage Helper
 * Persists guest profile & stay parameters across pages and reloads
 */

export interface GuestProfileSession {
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guestCity?: string;
  companyName?: string;
  gstin?: string;
  specialRequests?: string;
}

export interface StayParamsSession {
  checkIn: string;
  checkOut: string;
  rooms: number;
  adults: number;
  children: number;
  promoCode?: string;
}

const GUEST_COOKIE_KEY = "ambarish_guest_profile";
const STAY_COOKIE_KEY = "ambarish_stay_params";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

// Helper to set a cookie
function setCookie(name: string, value: string, maxAgeSeconds: number = COOKIE_MAX_AGE) {
  if (typeof document === "undefined") return;
  const encoded = encodeURIComponent(value);
  document.cookie = `${name}=${encoded}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax`;
  try {
    localStorage.setItem(name, value);
  } catch {
    // Ignore storage quota errors
  }
}

// Helper to get a cookie
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  // Try reading cookie first
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

  // Fallback to localStorage
  try {
    return localStorage.getItem(name);
  } catch {
    return null;
  }
}

/**
 * Save guest contact and billing information to session cookie
 */
export function saveGuestSession(profile: Partial<GuestProfileSession>): void {
  if (!profile) return;
  const existing = getGuestSession() || {};
  const merged = { ...existing, ...profile };
  setCookie(GUEST_COOKIE_KEY, JSON.stringify(merged));
}

/**
 * Retrieve saved guest contact information
 */
export function getGuestSession(): GuestProfileSession | null {
  const data = getCookie(GUEST_COOKIE_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data) as GuestProfileSession;
  } catch {
    return null;
  }
}

/**
 * Save stay parameters (dates, rooms, adults, children, promo)
 */
export function saveStaySession(stay: Partial<StayParamsSession>): void {
  if (!stay) return;
  const existing = getStaySession() || {};
  const merged = { ...existing, ...stay };
  setCookie(STAY_COOKIE_KEY, JSON.stringify(merged));
}

/**
 * Retrieve saved stay parameters
 */
export function getStaySession(): StayParamsSession | null {
  const data = getCookie(STAY_COOKIE_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data) as StayParamsSession;
  } catch {
    return null;
  }
}
