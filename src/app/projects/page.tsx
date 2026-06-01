import type { Metadata } from "next";
import Link from "next/link";
import ProjectList from "@/components/ProjectList";
import { loadProjects } from "@/data/projects";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "All Projects | Sandesh Pandey",
  description: "Full-stack projects — case studies, code, and live demos.",
};

export default async function AllProjectsPage() {
  const projects = await loadProjects();

  return (
    <main className="projects-page section-container">
      <p className="section-label">
        <span>03</span> / Work
      </p>
      <h1 className="section-title projects-page__title">All projects</h1>
      <p className="projects-page__intro">
        {projects.length} featured builds — APIs, full-stack apps, and real-time
        systems. Open a case study for details, or use View Code / Live Demo when
        available.
      </p>

      <ProjectList projects={projects} />

      <div className="projects-page__footer">
        <Link href="/#work" className="link-demo">
          ← Back to home
        </Link>
      </div>
    </main>
  );
}
