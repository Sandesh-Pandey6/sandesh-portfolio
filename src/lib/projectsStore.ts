import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import { head, put } from "@vercel/blob";
import type { ProjectDetail, ProjectsFile } from "@/types/project";
import { SOCIAL_GITHUB } from "@/data/site";

const DATA_PATH = path.join(process.cwd(), "data", "projects.json");
const BLOB_PATHNAME = "portfolio-projects.json";

const defaultFile: ProjectsFile = {
  projects: [],
  githubRepoBySlug: {},
};

function envKey(slug: string, prefix: "LIVE" | "DEMO"): string {
  const suffix = slug.replace(/-/g, "_").toUpperCase();
  return `NEXT_PUBLIC_${prefix}_${suffix}`;
}

function resolveFromEnv(slug: string, prefix: "LIVE" | "DEMO"): string | undefined {
  const value = process.env[envKey(slug, prefix)]?.trim();
  return value || undefined;
}

function withDemoLinks(
  project: ProjectDetail,
  githubRepoBySlug: Record<string, string>
): ProjectDetail {
  const repo = githubRepoBySlug[project.slug];
  const github =
    project.github ??
    (repo ? `https://github.com/Sandesh-Pandey6/${repo}` : SOCIAL_GITHUB);

  const live = project.live ?? resolveFromEnv(project.slug, "LIVE");
  const demoVideo = project.demoVideo ?? resolveFromEnv(project.slug, "DEMO");

  return {
    ...project,
    github,
    ...(live ? { live } : {}),
    ...(demoVideo ? { demoVideo } : {}),
  };
}

export function applyDemoLinks(
  file: ProjectsFile
): ProjectDetail[] {
  return file.projects.map((p) => withDemoLinks(p, file.githubRepoBySlug));
}

async function readFromBlob(): Promise<ProjectsFile | null> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return null;
  try {
    const meta = await head(BLOB_PATHNAME);
    const res = await fetch(meta.url, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as ProjectsFile;
  } catch {
    return null;
  }
}

async function writeToBlob(data: ProjectsFile): Promise<void> {
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

async function readFromDisk(): Promise<ProjectsFile> {
  try {
    const raw = await readFile(DATA_PATH, "utf-8");
    return JSON.parse(raw) as ProjectsFile;
  } catch {
    return defaultFile;
  }
}

async function writeToDisk(data: ProjectsFile): Promise<void> {
  await mkdir(path.dirname(DATA_PATH), { recursive: true });
  await writeFile(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
}

export async function readProjectsFile(): Promise<ProjectsFile> {
  const fromBlob = await readFromBlob();
  if (fromBlob) return fromBlob;
  return readFromDisk();
}

export async function writeProjectsFile(data: ProjectsFile): Promise<void> {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    await writeToBlob(data);
    await writeToDisk(data);
    return;
  }
  await writeToDisk(data);
}

export async function loadProjects(): Promise<ProjectDetail[]> {
  const file = await readProjectsFile();
  return applyDemoLinks(file);
}

export async function getProjectBySlug(
  slug: string
): Promise<ProjectDetail | undefined> {
  const projects = await loadProjects();
  return projects.find((p) => p.slug === slug);
}

export function validateProjectsFile(data: ProjectsFile): string | null {
  if (!Array.isArray(data.projects)) return "projects must be an array";
  const slugs = new Set<string>();
  for (const p of data.projects) {
    if (!p.slug?.trim()) return "Each project needs a slug";
    if (slugs.has(p.slug)) return `Duplicate slug: ${p.slug}`;
    slugs.add(p.slug);
    if (!p.title?.trim()) return `Project "${p.slug}" needs a title`;
  }
  return null;
}
