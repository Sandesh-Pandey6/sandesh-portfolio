import path from "path";
import { readJsonStore, writeJsonStore } from "@/lib/jsonStore";
import type { SkillsFile } from "@/types/skills";

const DATA_PATH = path.join(process.cwd(), "data", "skills.json");
const BLOB_PATHNAME = "portfolio-skills.json";

const defaultFile: SkillsFile = {
  enabled: true,
  sectionLabel: "02 / Stack",
  sectionTitle: "Tools chosen for longevity, not hype.",
  categories: [],
};

export async function readSkillsFile(): Promise<SkillsFile> {
  return readJsonStore({
    diskPath: DATA_PATH,
    blobPathname: BLOB_PATHNAME,
    defaultValue: defaultFile,
  });
}

export async function writeSkillsFile(data: SkillsFile): Promise<void> {
  await writeJsonStore({
    diskPath: DATA_PATH,
    blobPathname: BLOB_PATHNAME,
    data,
  });
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
