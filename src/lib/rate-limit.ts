import { db } from "@/lib/db";

/**
 * Rate Limiter backed by durable database storage
 * Enforces strict request throttles per Table 3 to prevent abuse, scraping, and brute forcing.
 */

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetInSeconds: number;
}

export function checkRateLimit(
  prefix: string,
  identifier: string,
  maxRequests: number,
  windowSeconds: number
): RateLimitResult {
  const key = `${prefix}:${identifier}`;
  const now = Date.now();
  const windowMs = windowSeconds * 1000;

  try {
    const row = db.prepare("SELECT count, reset_at FROM rate_limits WHERE key = ?").get(key) as
      | { count: number; reset_at: number }
      | undefined;

    if (!row || now > row.reset_at) {
      // Window expired or first request
      const resetAt = now + windowMs;
      db.prepare(
        "INSERT INTO rate_limits (key, count, reset_at) VALUES (?, 1, ?) ON CONFLICT(key) DO UPDATE SET count = 1, reset_at = ?"
      ).run(key, resetAt, resetAt);

      return {
        allowed: true,
        remaining: maxRequests - 1,
        resetInSeconds: windowSeconds,
      };
    }

    if (row.count >= maxRequests) {
      const resetInSeconds = Math.max(1, Math.ceil((row.reset_at - now) / 1000));
      return {
        allowed: false,
        remaining: 0,
        resetInSeconds,
      };
    }

    // Increment
    const newCount = row.count + 1;
    db.prepare("UPDATE rate_limits SET count = ? WHERE key = ?").run(newCount, key);

    return {
      allowed: true,
      remaining: maxRequests - newCount,
      resetInSeconds: Math.max(1, Math.ceil((row.reset_at - now) / 1000)),
    };
  } catch (err) {
    console.error("[RateLimit] Error executing rate check:", err);
    // Fail-open for application availability if DB transiently locked, but log error
    return { allowed: true, remaining: 1, resetInSeconds: windowSeconds };
  }
}

/**
 * Extract client IP from request headers (handles proxies, CF, Vercel)
 */
export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  return "127.0.0.1";
}
