import { NextResponse } from "next/server";
import { isAdminAuthenticated, isAdminConfigured } from "@/lib/adminAuth";

export async function GET() {
  return NextResponse.json({
    configured: isAdminConfigured(),
    authenticated: await isAdminAuthenticated(),
  });
}
