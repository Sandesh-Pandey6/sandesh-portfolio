const PERMISSION_HELP =
  "Your Cloudinary API key cannot upload videos. Fix: Cloudinary Dashboard → Settings → API Keys → use the Primary key, or create an unsigned upload preset (Upload presets → Add → Unsigned, folder: portfolio) and add CLOUDINARY_UPLOAD_PRESET=your_preset_name to .env.local, then restart npm run dev.";

function isPermissionMessage(message: string): boolean {
  const lower = message.toLowerCase();
  return (
    lower.includes("permission") ||
    lower.includes("forbidden") ||
    message.includes('actions=["create"]')
  );
}

export function parseCloudinaryApiError(json: unknown): string {
  if (typeof json !== "object" || json === null) {
    return "Upload failed — unexpected response from Cloudinary.";
  }
  const o = json as Record<string, unknown>;
  let message = "";
  if (o.error && typeof o.error === "object" && o.error !== null) {
    const err = o.error as Record<string, unknown>;
    if (typeof err.message === "string") message = err.message;
  }
  if (!message && typeof o.message === "string") message = o.message;

  if (message && isPermissionMessage(message)) return PERMISSION_HELP;

  return message || "Upload failed — check file size (max 100 MB on free plan).";
}

export function formatCloudinaryError(err: unknown): string {
  if (err instanceof Error && err.message) {
    return isPermissionMessage(err.message) ? PERMISSION_HELP : err.message;
  }

  if (typeof err === "object" && err !== null) {
    const o = err as Record<string, unknown>;
    if (typeof o.message === "string") {
      return isPermissionMessage(o.message) ? PERMISSION_HELP : o.message;
    }
    if (o.error && typeof o.error === "object" && o.error !== null) {
      const nested = o.error as Record<string, unknown>;
      if (typeof nested.message === "string") {
        return isPermissionMessage(nested.message) ? PERMISSION_HELP : nested.message;
      }
    }
  }

  if (typeof err === "string") {
    return isPermissionMessage(err) ? PERMISSION_HELP : err;
  }

  return "Upload failed — try a smaller file or use a YouTube link below.";
}
