import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import { head, put } from "@vercel/blob";
import type { SkillsFile } from "@/types/skills";

const DATA_PATH = path.join(process.cwd(), "data", "skills.json");
const BLOB_PATHNAME = "portfolio-skills.json";

const defaultFile: SkillsFile = {
  enabled: true,
  sectionLabel: "02 / Stack",
  sectionTitle: "Tools chosen for longevity, not hype.",
  categories: [],
};

async function readFromBlob(): Promise<SkillsFile | null> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return null;
  try {
    const meta = await head(BLOB_PATHNAME);
    const res = await fetch(meta.url, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as SkillsFile;
  } catch {
    return null;
  }
}

async function writeToBlob(data: SkillsFile): Promise<void> {
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

async function readFromDisk(): Promise<SkillsFile> {
  try {
    const raw = await readFile(DATA_PATH, "utf-8");
    return JSON.parse(raw) as SkillsFile;
  } catch {
    return defaultFile;
  }
}

async function writeToDisk(data: SkillsFile): Promise<void> {
  await mkdir(path.dirname(DATA_PATH), { recursive: true });
  await writeFile(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
}

export async function readSkillsFile(): Promise<SkillsFile> {
  const fromBlob = await readFromBlob();
  if (fromBlob) return fromBlob;
  return readFromDisk();
}

export async function writeSkillsFile(data: SkillsFile): Promise<void> {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    await writeToBlob(data);
    await writeToDisk(data);
    return;
  }
  await writeToDisk(data);
}

export async function loadSkills(): Promise<SkillsFile> {
  return readSkillsFile();
}

export function validateSkillsFile(data: SkillsFile): string | null {
  if (typeof data.enabled !== "boolean") return "enabled must be true or false";
  if (!data.sectionTitle?.trim()) return "Section title is required";
  if (!Array.isArray(data.categories)) return "categories must be an array";

  const ids = new Set<string>();
  for (const cat of data.categories) {
    if (!cat.id?.trim()) return "Each category needs an id";
    if (ids.has(cat.id)) return `Duplicate category id: ${cat.id}`;
    ids.add(cat.id);
    if (!cat.title?.trim()) return `Category "${cat.id}" needs a title`;
    if (!Array.isArray(cat.items)) return `Category "${cat.id}" items must be a list`;
  }
  return null;
}
