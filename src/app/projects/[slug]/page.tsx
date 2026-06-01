import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectBySlug } from "@/data/projects";
import ProjectMedia from "@/components/ProjectMedia";
import ScrollReveal from "@/components/ScrollReveal";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="section-container" style={{ paddingTop: "120px" }}>
      <ScrollReveal delay={0}>
        <p className="section-label">
          Case Study / <span>{project.title}</span>
        </p>
        <h1
          style={{
            fontSize: "clamp(2rem, 5vw, 3rem)",
            fontWeight: 600,
            letterSpacing: "-0.02em",
            marginBottom: "0.5rem",
          }}
        >
          {project.title}
        </h1>
        <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
          {project.year}
        </p>
      </ScrollReveal>

      <div
        style={{
          width: "100%",
          height: "1px",
          background: "var(--border-color)",
          margin: "2.5rem 0",
        }}
      />

      {(project.demoVideo || project.live) && (
        <ScrollReveal delay={0.08}>
          <div id="demo" className="project-detail__media">
            <ProjectMedia demoVideo={project.demoVideo} title={project.title} />
            {project.live && !project.demoVideo ? (
              <div className="project-detail__live">
                <p className="project-media__label">Live app</p>
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  Open live demo
                </a>
              </div>
            ) : null}
            {project.live && project.demoVideo ? (
              <p className="project-detail__live-inline">
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-code"
                >
                  Open deployed app →
                </a>
              </p>
            ) : null}
          </div>
        </ScrollReveal>
      )}

      <ScrollReveal delay={0.1}>
        <h3
          style={{
            fontSize: "0.8rem",
            fontWeight: 600,
            color: "var(--accent)",
            marginBottom: "1rem",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          Overview
        </h3>
        <p
          style={{
            fontSize: "1.05rem",
            lineHeight: 1.75,
            color: "var(--text-muted)",
            marginBottom: "3rem",
          }}
        >
          {project.overview}
        </p>
      </ScrollReveal>

      <ScrollReveal delay={0.15}>
        <h3
          style={{
            fontSize: "0.8rem",
            fontWeight: 600,
            color: "var(--accent)",
            marginBottom: "1rem",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          Tech Stack
        </h3>
        <div className="stack-tags" style={{ marginBottom: "3rem" }}>
          {project.techStack.map((tech) => (
            <span key={tech} className="stack-tag">
              {tech}
            </span>
          ))}
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.2}>
        <h3
          style={{
            fontSize: "0.8rem",
            fontWeight: 600,
            color: "var(--accent)",
            marginBottom: "1.25rem",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          Key Highlights
        </h3>
        <ul
          style={{
            listStyle: "none",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          {project.highlights.map((item, idx) => (
            <li
              key={idx}
              style={{
                display: "flex",
                gap: "0.75rem",
                color: "var(--text-muted)",
                lineHeight: 1.65,
              }}
            >
              <span style={{ color: "var(--accent)", flexShrink: 0 }}>→</span>
              {item}
            </li>
          ))}
        </ul>
      </ScrollReveal>

      <div
        style={{
          marginTop: "3rem",
          paddingTop: "2rem",
          borderTop: "1px solid var(--border-color)",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        <Link href="/projects" className="link-demo">
          ← All projects
        </Link>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1.25rem" }}>
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="link-demo"
            >
              Live demo
            </a>
          )}
          {project.demoVideo && (
            <a href="#demo" className="link-demo">
              Watch demo
            </a>
          )}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="link-code"
            >
              View on GitHub
            </a>
          )}
        </div>
      </div>
    </main>
  );
}
