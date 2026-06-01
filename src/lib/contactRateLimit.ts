/** Simple in-memory rate limit (per server instance). */

const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS = 5;

const hits = new Map<string, { count: number; resetAt: number }>();

export function checkContactRateLimit(ip: string): boolean {
  const key = ip || "unknown";
  const now = Date.now();
  const entry = hits.get(key);

  if (!entry || now > entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }

  if (entry.count >= MAX_REQUESTS) {
    return false;
  }

  entry.count += 1;
  return true;
}

export function rateLimitMessage(): string {
  return "Too many messages sent. Please try again in an hour.";
}
