import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "portfolio_admin";

function getAdminSecret(): string | null {
  const password = process.env.ADMIN_PASSWORD?.trim();
  if (!password) return null;
  return process.env.ADMIN_SECRET?.trim() || password;
}

export function isAdminConfigured(): boolean {
  return Boolean(getAdminSecret());
}

export function createSessionToken(): string | null {
  const secret = getAdminSecret();
  if (!secret) return null;
  return createHmac("sha256", secret).update("portfolio-admin-session").digest("hex");
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const expected = createSessionToken();
  if (!expected) return false;
  try {
    const a = Buffer.from(token);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return verifySessionToken(cookieStore.get(ADMIN_COOKIE)?.value);
}
