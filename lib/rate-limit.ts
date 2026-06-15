import { LRUCache } from "lru-cache";

const rateLimitCache = new LRUCache<string, number>({
  max: 500,
  ttl: 60 * 1000, // 1 minute
});

export function checkRateLimit(ip: string, maxRequests: number = 5): boolean {
  const current = rateLimitCache.get(ip) || 0;
  if (current >= maxRequests) return false;
  rateLimitCache.set(ip, current + 1);
  return true;
}

export function getRateLimitRemaining(ip: string, maxRequests: number = 5): number {
  const current = rateLimitCache.get(ip) || 0;
  return Math.max(0, maxRequests - current);
}
