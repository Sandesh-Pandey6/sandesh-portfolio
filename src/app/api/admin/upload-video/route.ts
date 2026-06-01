import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { getCloudinary, isCloudinaryConfigured } from "@/lib/cloudinary";
import { formatCloudinaryError } from "@/lib/cloudinaryErrors";

export const maxDuration = 120;

const MAX_BYTES = 100 * 1024 * 1024; // 100 MB

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isCloudinaryConfigured()) {
    return NextResponse.json(
      {
        error:
          "Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to .env.local, then restart the dev server.",
      },
      { status: 503 }
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No video file provided" }, { status: 400 });
  }

  if (!file.type.startsWith("video/")) {
    return NextResponse.json(
      { error: "File must be a video (mp4, webm, mov, etc.)" },
      { status: 400 }
    );
  }

  if (file.size > MAX_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    return NextResponse.json(
      {
        error: `File is ${sizeMb} MB. Cloudinary free plan allows ${MAX_BYTES / (1024 * 1024)} MB per video (length does not matter — HD recordings are often larger). Compress to 720p or use a YouTube link in Demo video URL.`,
      },
      { status: 400 }
    );
  }

  const slug = String(formData.get("slug") ?? "demo")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-");

  const buffer = Buffer.from(await file.arrayBuffer());
  const cloudinary = getCloudinary();

  try {
    const result = await new Promise<{
      secure_url: string;
      public_id: string;
    }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "video",
          folder: "portfolio",
          public_id: `${slug}-${Date.now()}`,
        },
        (error, uploadResult) => {
          if (error || !uploadResult?.secure_url) {
            reject(error ?? new Error("Upload failed"));
            return;
          }
          resolve({
            secure_url: uploadResult.secure_url,
            public_id: uploadResult.public_id,
          });
        }
      );
      stream.end(buffer);
    });

    return NextResponse.json({
      ok: true,
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (err) {
    return NextResponse.json(
      { error: formatCloudinaryError(err) },
      { status: 500 }
    );
  }
}
