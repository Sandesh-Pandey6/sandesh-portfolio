import Link from "next/link";
import type { ProjectDetail } from "@/types/project";

function parseTags(tech: string): string[] {
  return tech.split(/[+,&]/).map((t) => t.trim()).filter(Boolean);
}

function ProjectCard({ project }: { project: ProjectDetail }) {
  const tags = project.techStack?.length
    ? project.techStack.slice(0, 4)
    : parseTags(project.tech);
  const caseStudyHref = `/projects/${project.slug}`;

  return (
    <article className="project-card">
      <div className="project-card__meta">
        <p className="case-study-label">Case Study</p>
        <span className="project-card__year">{project.year}</span>
      </div>
      <h3>
        <Link href={caseStudyHref} className="project-card__title-link">
          {project.title}
        </Link>
      </h3>
      <p className="project-desc">{project.desc}</p>
      <div className="project-tags">
        {tags.map((tag) => (
          <span key={tag} className="project-tag">
            {tag}
          </span>
        ))}
      </div>
      <div className="project-actions">
        {project.live ? (
          <a
            href={project.live}
            target="_blank"
            rel="noopener noreferrer"
            className="link-demo link-demo--primary"
          >
            Live Demo
          </a>
        ) : null}
        {project.demoVideo ? (
          <Link href={`${caseStudyHref}#demo`} className="link-demo link-demo--primary">
            Watch Demo
          </Link>
        ) : null}
        {project.github ? (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="link-code"
          >
            View Code
          </a>
        ) : null}
        <Link href={caseStudyHref} className="link-demo">
          Case Study
        </Link>
      </div>
    </article>
  );
}

type ProjectListProps = {
  projects: ProjectDetail[];
  limit?: number;
};

export default function ProjectList({ projects, limit }: ProjectListProps) {
  const list = limit ? projects.slice(0, limit) : projects;

  return (
    <div className="project-list">
      {list.map((project) => (
        <ProjectCard key={project.slug} project={project} />
      ))}
    </div>
  );
}
