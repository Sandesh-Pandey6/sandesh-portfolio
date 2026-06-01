import Link from "next/link";
import ScrollReveal from "./ScrollReveal";
import ProjectList from "./ProjectList";
import { loadFeaturedProjects } from "@/data/projects";

export default async function Projects() {
  const projects = await loadFeaturedProjects();

  return (
    <section id="work" className="section-container">
      <ScrollReveal delay={0}>
        <p className="section-label">
          <span>03</span> / Work
        </p>
        <h2 className="section-title">
          Featured projects — shipped &amp; in production.
        </h2>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <ProjectList projects={projects} />
      </ScrollReveal>

      <ScrollReveal delay={0.2}>
        <div className="projects-section__more">
          <Link href="/projects" className="btn-secondary projects-view-all">
            View all projects
          </Link>
        </div>
      </ScrollReveal>
    </section>
  );
}
