import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import { head, put } from "@vercel/blob";
import {
  BLOB_SETUP_MESSAGE,
  hasBlobStorage,
  isVercelDeployment,
} from "@/lib/blobConfig";

export { BLOB_SETUP_MESSAGE, hasBlobStorage, isVercelDeployment };

async function readFromBlob<T>(pathname: string): Promise<T | null> {
  if (!hasBlobStorage()) return null;
  try {
    const meta = await head(pathname);
    const res = await fetch(meta.url, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

async function readFromDisk<T>(diskPath: string, defaultValue: T): Promise<T> {
  try {
    const raw = await readFile(diskPath, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return defaultValue;
  }
}

export async function readJsonStore<T>(opts: {
  diskPath: string;
  blobPathname: string;
  defaultValue: T;
}): Promise<T> {
  const fromBlob = await readFromBlob<T>(opts.blobPathname);
  if (fromBlob) return fromBlob;
  return readFromDisk(opts.diskPath, opts.defaultValue);
}

export async function writeJsonStore<T>(opts: {
  diskPath: string;
  blobPathname: string;
  data: T;
}): Promise<void> {
  const json = JSON.stringify(opts.data, null, 2);

  if (hasBlobStorage()) {
    await put(opts.blobPathname, json, {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
    });
    if (!isVercelDeployment()) {
      await mkdir(path.dirname(opts.diskPath), { recursive: true });
      await writeFile(opts.diskPath, json, "utf-8");
    }
    return;
  }

  if (isVercelDeployment()) {
    throw new Error(BLOB_SETUP_MESSAGE);
  }

  await mkdir(path.dirname(opts.diskPath), { recursive: true });
  await writeFile(opts.diskPath, json, "utf-8");
}
