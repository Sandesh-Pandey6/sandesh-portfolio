import path from "path";
import { readJsonStore, writeJsonStore } from "@/lib/jsonStore";
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

export async function readHeroStatsFile(): Promise<HeroStatsFile> {
  return readJsonStore({
    diskPath: DATA_PATH,
    blobPathname: BLOB_PATHNAME,
    defaultValue: defaultFile,
  });
}

export async function writeHeroStatsFile(data: HeroStatsFile): Promise<void> {
  await writeJsonStore({
    diskPath: DATA_PATH,
    blobPathname: BLOB_PATHNAME,
    data,
  });
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
