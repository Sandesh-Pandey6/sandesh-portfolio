import type { Metadata } from "next";
import Link from "next/link";
import ProjectList from "@/components/ProjectList";
import ProjectsPagination, {
  getProjectsPageSlice,
  PROJECTS_PER_PAGE,
} from "@/components/ProjectsPagination";
import { loadProjects } from "@/data/projects";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "All Projects | Sandesh Pandey",
  description: "Full-stack projects — case studies, code, and live demos.",
};

type PageProps = {
  searchParams: Promise<{ page?: string }>;
};

export default async function AllProjectsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const requestedPage = Math.max(1, parseInt(params.page ?? "1", 10) || 1);
  const allProjects = await loadProjects();
  const { items: projects, currentPage, totalPages } = getProjectsPageSlice(
    allProjects,
    requestedPage
  );

  return (
    <main className="projects-page section-container">
      <p className="section-label">
        <span>03</span> / Work
      </p>
      <h1 className="section-title projects-page__title">All projects</h1>
      <p className="projects-page__intro">
        {allProjects.length} build{allProjects.length === 1 ? "" : "s"} — APIs,
        full-stack apps, and real-time systems. Open a case study for details, or
        use View Code / Live Demo when available.
      </p>

      <ProjectList projects={projects} />

      <ProjectsPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={allProjects.length}
        perPage={PROJECTS_PER_PAGE}
      />

      <div className="projects-page__footer">
        <Link href="/#work" className="link-demo">
          ← Back to home
        </Link>
      </div>
    </main>
  );
}
