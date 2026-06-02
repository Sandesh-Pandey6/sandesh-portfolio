import path from "path";
import { readJsonStore, writeJsonStore } from "@/lib/jsonStore";
import type { ProjectDetail, ProjectsFile } from "@/types/project";
import { FEATURED_HOME_MAX } from "@/types/project";
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

export async function readProjectsFile(): Promise<ProjectsFile> {
  return readJsonStore({
    diskPath: DATA_PATH,
    blobPathname: BLOB_PATHNAME,
    defaultValue: defaultFile,
  });
}

export async function writeProjectsFile(data: ProjectsFile): Promise<void> {
  await writeJsonStore({
    diskPath: DATA_PATH,
    blobPathname: BLOB_PATHNAME,
    data,
  });
}

export function resolveFeaturedSlugs(file: ProjectsFile): string[] {
  const valid = new Set(file.projects.map((p) => p.slug));
  if (file.featuredSlugs?.length) {
    return file.featuredSlugs
      .filter((slug) => valid.has(slug))
      .slice(0, FEATURED_HOME_MAX);
  }
  return file.projects.slice(0, FEATURED_HOME_MAX).map((p) => p.slug);
}

export async function loadProjects(): Promise<ProjectDetail[]> {
  const file = await readProjectsFile();
  return applyDemoLinks(file);
}

export async function loadFeaturedProjects(): Promise<ProjectDetail[]> {
  const file = await readProjectsFile();
  const all = applyDemoLinks(file);
  const slugs = resolveFeaturedSlugs(file);
  return slugs
    .map((slug) => all.find((p) => p.slug === slug))
    .filter((p): p is ProjectDetail => Boolean(p));
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
  if (data.featuredSlugs) {
    if (data.featuredSlugs.length > FEATURED_HOME_MAX) {
      return `Home page can showcase at most ${FEATURED_HOME_MAX} projects`;
    }
    for (const slug of data.featuredSlugs) {
      if (!slugs.has(slug)) return `Featured slug not found: ${slug}`;
    }
  }
  return null;
}
