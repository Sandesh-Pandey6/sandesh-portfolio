export interface ProjectDetail {
  id: string;
  slug: string;
  title: string;
  tech: string;
  year: string;
  desc: string;
  overview: string;
  techStack: string[];
  highlights: string[];
  github?: string;
  live?: string;
  demoVideo?: string;
}

export type ProjectsFile = {
  projects: ProjectDetail[];
  githubRepoBySlug: Record<string, string>;
  /** Up to 3 slugs shown on the home page Work section (order preserved) */
  featuredSlugs?: string[];
};

export const FEATURED_HOME_MAX = 3;
