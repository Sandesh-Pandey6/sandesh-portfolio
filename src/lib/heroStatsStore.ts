import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import { head, put } from "@vercel/blob";
import type { HeroStatsFile } from "@/types/heroStats";

const DATA_PATH = path.join(process.cwd(), "data", "heroStats.json");
const BLOB_PATHNAME = "portfolio-hero-stats.json";

const defaultFile: HeroStatsFile = {
  stats: [
    { value: "1+", label: "Years building" },
    { value: "5+", label: "Shipped projects" },
    { value: "10+", label: "Stacks fluent" },
  ],
};

async function readFromBlob(): Promise<HeroStatsFile | null> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return null;
  try {
    const meta = await head(BLOB_PATHNAME);
    const res = await fetch(meta.url, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as HeroStatsFile;
  } catch {
    return null;
  }
}

async function writeToBlob(data: HeroStatsFile): Promise<void> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("BLOB_READ_WRITE_TOKEN is not set");
  }
  await put(BLOB_PATHNAME, JSON.stringify(data, null, 2), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}

async function readFromDisk(): Promise<HeroStatsFile> {
  try {
    const raw = await readFile(DATA_PATH, "utf-8");
    return JSON.parse(raw) as HeroStatsFile;
  } catch {
    return defaultFile;
  }
}

async function writeToDisk(data: HeroStatsFile): Promise<void> {
  await mkdir(path.dirname(DATA_PATH), { recursive: true });
  await writeFile(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
}

export async function readHeroStatsFile(): Promise<HeroStatsFile> {
  const fromBlob = await readFromBlob();
  if (fromBlob) return fromBlob;
  return readFromDisk();
}

export async function writeHeroStatsFile(data: HeroStatsFile): Promise<void> {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    await writeToBlob(data);
    await writeToDisk(data);
    return;
  }
  await writeToDisk(data);
}

export async function loadHeroStats(): Promise<HeroStatsFile> {
  return readHeroStatsFile();
}

export function validateHeroStatsFile(data: HeroStatsFile): string | null {
  if (!Array.isArray(data.stats) || data.stats.length === 0) {
    return "Add at least one stat";
  }
  if (data.stats.length > 6) {
    return "Maximum 6 stats";
  }
  for (let i = 0; i < data.stats.length; i++) {
    const stat = data.stats[i];
    if (!stat.value?.trim()) return `Stat ${i + 1}: value is required`;
    if (!stat.label?.trim()) return `Stat ${i + 1}: label is required`;
  }
  return null;
}
