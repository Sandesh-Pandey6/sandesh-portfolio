/** Simple in-memory rate limit (per server instance). */

const WINDOW_MS = 60 * 60 * 1000; // 1 hour

const limits = {
  contact: 5,
  "send-code": 4,
} as const;

type RateLimitAction = keyof typeof limits;

const hits = new Map<string, { count: number; resetAt: number }>();

function rateLimitKey(ip: string, action: RateLimitAction): string {
  return `${action}:${ip || "unknown"}`;
}

export function checkContactRateLimit(
  ip: string,
  action: RateLimitAction = "contact"
): boolean {
  const key = rateLimitKey(ip, action);
  const max = limits[action];
  const now = Date.now();
  const entry = hits.get(key);

  if (!entry || now > entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }

  if (entry.count >= max) {
    return false;
  }

  entry.count += 1;
  return true;
}

export function rateLimitMessage(action: RateLimitAction = "contact"): string {
  if (action === "send-code") {
    return "Too many verification codes requested. Please try again in an hour.";
  }
  return "Too many messages sent. Please try again in an hour.";
}
