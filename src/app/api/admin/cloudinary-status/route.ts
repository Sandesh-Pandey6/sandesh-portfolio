import { NextResponse } from "next/server";
import { isCloudinaryConfigured } from "@/lib/cloudinary";

export async function GET() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim() ?? null;
  const uploadPreset =
    process.env.CLOUDINARY_UPLOAD_PRESET?.trim() ||
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET?.trim() ||
    null;

  return NextResponse.json({
    configured: isCloudinaryConfigured(),
    cloudName,
    uploadPreset,
  });
}
