import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { getCloudinary, isCloudinaryConfigured } from "@/lib/cloudinary";

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isCloudinaryConfigured()) {
    return NextResponse.json(
      { error: "Cloudinary is not configured in .env.local" },
      { status: 503 }
    );
  }

  let slug = "demo";
  try {
    const body = (await request.json()) as { slug?: string };
    slug =
      body.slug
        ?.trim()
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, "-") || "demo";
  } catch {
    // empty body is ok
  }

  const cloudinary = getCloudinary();
  const timestamp = Math.round(Date.now() / 1000);
  const folder = "portfolio";
  const public_id = `${slug}-${timestamp}`;

  // Every parameter sent to Cloudinary (except file, api_key, signature) must be signed.
  const paramsToSign = { folder, public_id, timestamp };
  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET!
  );

  return NextResponse.json({
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    timestamp,
    signature,
    folder,
    publicId: public_id,
  });
}
