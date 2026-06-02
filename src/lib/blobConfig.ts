export const BLOB_SETUP_MESSAGE =
  "Connect Vercel Blob to this project (Storage → Blob), then redeploy so BLOB_READ_WRITE_TOKEN is set.";

export function isVercelDeployment(): boolean {
  return Boolean(process.env.VERCEL);
}

export function hasBlobStorage(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim());
}
