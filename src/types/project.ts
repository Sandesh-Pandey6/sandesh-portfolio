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
};
