const projects = [
  {
    title: "Portfolio Website",
    description:
      "A modern, responsive personal portfolio built with Next.js and Tailwind CSS. Features dark mode, smooth scrolling, and a contact form with API integration.",
    tech: ["Next.js", "React", "Tailwind CSS", "TypeScript"],
    liveUrl: "#",
    githubUrl: "#",
  },
  {
    title: "JavaScript Projects Collection",
    description:
      "A collection of interactive JavaScript mini-projects including calculators, to-do lists, and DOM manipulation exercises. Built with vanilla JS.",
    tech: ["JavaScript", "HTML", "CSS"],
    liveUrl: "#",
    githubUrl: "#",
  },
  {
    title: "React Dashboard App",
    description:
      "A feature-rich dashboard application with charts, data tables, and responsive layout. Demonstrates state management and component composition.",
    tech: ["React", "Tailwind CSS", "Chart.js"],
    liveUrl: "#",
    githubUrl: "#",
  },
  {
    title: "E-Commerce Landing Page",
    description:
      "A sleek product landing page with hero section, feature highlights, and call-to-action. Fully responsive with modern animations.",
    tech: ["React", "Tailwind CSS", "Framer Motion"],
    liveUrl: "#",
    githubUrl: "#",
  },
  {
    title: "Task Manager App",
    description:
      "A full-featured task manager with CRUD operations, filtering, and localStorage persistence. Clean UI with drag-and-drop support.",
    tech: ["React", "TypeScript", "Tailwind CSS"],
    liveUrl: "#",
    githubUrl: "#",
  },
];

export default function Projects() {
  return (
    <section
      id="projects"
      className="scroll-mt-20 px-4 py-20"
    >
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-12 text-3xl font-bold text-zinc-900 dark:text-zinc-100">
          Projects
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <article
              key={project.title}
              className="flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition-all hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="flex flex-1 flex-col p-6">
                <h3 className="mb-2 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                  {project.title}
                </h3>
                <p className="mb-4 flex-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {project.description}
                </p>
                <div className="mb-4 flex flex-wrap gap-2">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex gap-3">
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500"
                  >
                    Live Demo
                  </a>
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:border-emerald-500 hover:text-emerald-600 dark:border-zinc-600 dark:text-zinc-300 dark:hover:border-emerald-500 dark:hover:text-emerald-400"
                  >
                    GitHub
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
