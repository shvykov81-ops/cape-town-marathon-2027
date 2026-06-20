import { LRUCache } from "lru-cache";

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

const DEFAULT_CONFIG: RateLimitConfig = {
  maxRequests: 5,
  windowMs: 60 * 1000, // 1 minute
};

const PATH_CONFIGS: Record<string, RateLimitConfig> = {
  // Auth: stricter — 5 attempts per 5 minutes
  "/api/auth/": { maxRequests: 5, windowMs: 5 * 60 * 1000 },
  // Auth session: more lenient — 60 per minute (legitimate polling)
  "/api/auth/session": { maxRequests: 60, windowMs: 60 * 1000 },
  // Booking: moderate — 10 per minute
  "/api/booking": { maxRequests: 10, windowMs: 60 * 1000 },
  // Contact: already protected, but keep consistent
  "/api/contact": { maxRequests: 5, windowMs: 60 * 1000 },
  // Admin APIs: moderate — 30 per minute (legitimate heavy use)
  "/api/admin/": { maxRequests: 30, windowMs: 60 * 1000 },
  // Trainer apply: strict — 3 per hour
  "/api/trainers/apply": { maxRequests: 3, windowMs: 60 * 60 * 1000 },
  // Reviews: moderate — 10 per minute
  "/api/reviews": { maxRequests: 10, windowMs: 60 * 1000 },
  // Documents: moderate — 20 per minute
  "/api/documents": { maxRequests: 20, windowMs: 60 * 1000 },
  // Upload: strict — 5 per minute
  "/api/upload": { maxRequests: 5, windowMs: 60 * 1000 },
  // Registration: strict — 3 per hour
  "/api/auth/register": { maxRequests: 3, windowMs: 60 * 60 * 1000 },
};

const rateLimitCache = new LRUCache<string, number>({
  max: 10000,
  ttl: 60 * 60 * 1000, // 1 hour max TTL
});

function getConfig(pathname: string): RateLimitConfig {
  for (const [prefix, config] of Object.entries(PATH_CONFIGS)) {
    if (pathname.startsWith(prefix)) {
      return config;
    }
  }
  return DEFAULT_CONFIG;
}

/**
 * Check rate limit for an IP + path combination.
 * Returns true if allowed, false if exceeded.
 * NOTE: This is in-memory rate limiting. For production on Vercel,
 * consider using @upstash/ratelimit with Redis for distributed rate limiting.
 */
export function checkRateLimit(ip: string, pathname: string): boolean;
/**
 * Legacy overload: check rate limit with explicit maxRequests.
 * Used by existing route handlers (e.g., contact API).
 * @deprecated Use path-aware signature instead
 */
export function checkRateLimit(ip: string, maxRequests: number): boolean;
export function checkRateLimit(ip: string, arg2: string | number): boolean {
  if (typeof arg2 === "string") {
    // New path-aware signature
    const config = getConfig(arg2);
    const key = `${ip}:${arg2}`;
    const current = rateLimitCache.get(key) || 0;
    if (current >= config.maxRequests) {
      return false;
    }
    rateLimitCache.set(key, current + 1, { ttl: config.windowMs });
    return true;
  } else {
    // Legacy signature: ip + maxRequests
    const current = rateLimitCache.get(ip) || 0;
    if (current >= arg2) return false;
    rateLimitCache.set(ip, current + 1);
    return true;
  }
}

/**
 * Get remaining requests for an IP + path.
 */
export function getRateLimitRemaining(ip: string, pathname: string): number {
  const config = getConfig(pathname);
  const key = `${ip}:${pathname}`;
  const current = rateLimitCache.get(key) || 0;
  return Math.max(0, config.maxRequests - current);
}

/**
 * Get rate limit headers for response.
 */
export function getRateLimitHeaders(ip: string, pathname: string): Record<string, string> {
  const config = getConfig(pathname);
  const remaining = getRateLimitRemaining(ip, pathname);
  return {
    "X-RateLimit-Limit": String(config.maxRequests),
    "X-RateLimit-Remaining": String(remaining),
    "X-RateLimit-Window": String(config.windowMs / 1000),
  };
}

/**
 * Reset rate limit for an IP + path (e.g., after successful auth).
 */
export function resetRateLimit(ip: string, pathname: string): void {
  const key = `${ip}:${pathname}`;
  rateLimitCache.delete(key);
}
