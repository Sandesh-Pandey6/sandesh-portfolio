import { NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import {
  ADMIN_COOKIE,
  createSessionToken,
  isAdminConfigured,
} from "@/lib/adminAuth";

export async function POST(request: Request) {
  if (!isAdminConfigured()) {
    const hint = process.env.VERCEL
      ? "Add ADMIN_PASSWORD in Vercel → Project Settings → Environment Variables, then redeploy."
      : "Set ADMIN_PASSWORD in .env.local and restart the dev server.";
    return NextResponse.json({ error: `Admin is not configured. ${hint}` }, { status: 503 });
  }

  const body = (await request.json()) as { password?: string };
  const password = body.password?.trim() ?? "";
  const expected = process.env.ADMIN_PASSWORD?.trim() ?? "";

  try {
    const a = Buffer.from(password);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) {
      return NextResponse.json({ error: "Wrong password" }, { status: 401 });
    }
  } catch {
    return NextResponse.json({ error: "Wrong password" }, { status: 401 });
  }

  const token = createSessionToken();
  if (!token) {
    return NextResponse.json({ error: "Session error" }, { status: 500 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}
