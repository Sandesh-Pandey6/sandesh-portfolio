import { NextResponse } from "next/server";
import { isAdminAuthenticated, isAdminConfigured } from "@/lib/adminAuth";
import { hasBlobStorage, isVercelDeployment } from "@/lib/blobConfig";

export async function GET() {
  const deployedOnVercel = isVercelDeployment();
  return NextResponse.json({
    configured: isAdminConfigured(),
    authenticated: await isAdminAuthenticated(),
    deployedOnVercel,
    blobConfigured: hasBlobStorage(),
    canPersistOnServer: !deployedOnVercel || hasBlobStorage(),
  });
}
