import Link from "next/link";
import { projects, type ProjectDetail } from "@/data/projects";

function parseTags(tech: string): string[] {
  return tech.split(/[+,&]/).map((t) => t.trim()).filter(Boolean);
}

function ProjectCard({ project }: { project: ProjectDetail }) {
  const tags = project.techStack?.length
    ? project.techStack.slice(0, 4)
    : parseTags(project.tech);

  return (
    <article className="project-card">
      <div className="project-card__meta">
        <p className="case-study-label">Case Study</p>
        <span className="project-card__year">{project.year}</span>
      </div>
      <h3>{project.title}</h3>
      <p className="project-desc">{project.desc}</p>
      <div className="project-tags">
        {tags.map((tag) => (
          <span key={tag} className="project-tag">
            {tag}
          </span>
        ))}
      </div>
      <div className="project-actions">
        {project.github ? (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="link-code"
          >
            View Code
          </a>
        ) : (
          <Link href={`/projects/${project.slug}`} className="link-code">
            View Case Study
          </Link>
        )}
        {project.live ? (
          <a
            href={project.live}
            target="_blank"
            rel="noopener noreferrer"
            className="link-demo"
          >
            Live Demo
          </a>
        ) : null}
        {project.demoVideo ? (
          <Link href={`/projects/${project.slug}#demo`} className="link-demo">
            Watch Demo
          </Link>
        ) : null}
        {!project.live && !project.demoVideo ? (
          <Link href={`/projects/${project.slug}`} className="link-demo">
            Read More
          </Link>
        ) : null}
      </div>
    </article>
  );
}

type ProjectListProps = {
  limit?: number;
};

export default function ProjectList({ limit }: ProjectListProps) {
  const list = limit ? projects.slice(0, limit) : projects;

  return (
    <div className="project-list">
      {list.map((project) => (
        <ProjectCard key={project.slug} project={project} />
      ))}
    </div>
  );
}

export { projects };
