"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import CloudinaryVideoUpload from "@/components/admin/CloudinaryVideoUpload";
import type { ProjectDetail, ProjectsFile } from "@/types/project";

function linesToList(value: string): string[] {
  return value
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

function listToLines(items: string[]): string {
  return items.join("\n");
}

function emptyProject(index: number): ProjectDetail {
  const n = String(index + 1).padStart(2, "0");
  return {
    id: n,
    slug: `project-${n}`,
    title: "New Project",
    tech: "STACK",
    year: String(new Date().getFullYear()),
    desc: "",
    overview: "",
    techStack: [],
    highlights: [],
  };
}

function AdminSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="admin-section">
      <div className="admin-section__head">
        <h3 className="admin-section__title">{title}</h3>
        <p className="admin-section__desc">{description}</p>
      </div>
      <div className="admin-section__fields">{children}</div>
    </section>
  );
}

function Field({
  label,
  hint,
  span = 1,
  children,
}: {
  label: string;
  hint?: string;
  span?: 1 | 2;
  children: React.ReactNode;
}) {
  return (
    <label className={span === 2 ? "admin-field admin-field--wide" : "admin-field"}>
      <span className="admin-field__label">{label}</span>
      {hint ? <span className="admin-field__hint">{hint}</span> : null}
      {children}
    </label>
  );
}

export default function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  const [configured, setConfigured] = useState(true);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [data, setData] = useState<ProjectsFile | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [saveMessage, setSaveMessage] = useState("");
  const [saveError, setSaveError] = useState("");
  const [saving, setSaving] = useState(false);
  const [cloudinaryReady, setCloudinaryReady] = useState(false);

  const checkSession = useCallback(async () => {
    const res = await fetch("/api/admin/session");
    const json = (await res.json()) as {
      configured: boolean;
      authenticated: boolean;
    };
    setConfigured(json.configured);
    setAuthenticated(json.authenticated);
    setLoading(false);
    return json.authenticated;
  }, []);

  const loadProjects = useCallback(async () => {
    const res = await fetch("/api/projects");
    if (!res.ok) return;
    const json = (await res.json()) as ProjectsFile;
    setData(json);
  }, []);

  useEffect(() => {
    void (async () => {
      const ok = await checkSession();
      if (ok) {
        await loadProjects();
        const res = await fetch("/api/admin/cloudinary-status");
        if (res.ok) {
          const json = (await res.json()) as { configured: boolean };
          setCloudinaryReady(json.configured);
        }
      }
    })();
  }, [checkSession, loadProjects]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const json = (await res.json()) as { error?: string };
    if (!res.ok) {
      setLoginError(json.error ?? "Login failed");
      return;
    }
    setAuthenticated(true);
    setPassword("");
    await loadProjects();
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthenticated(false);
    setData(null);
  }

  async function handleSave() {
    if (!data) return;
    setSaving(true);
    setSaveMessage("");
    setSaveError("");
    const res = await fetch("/api/projects", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = (await res.json()) as { error?: string };
    setSaving(false);
    if (!res.ok) {
      setSaveError(json.error ?? "Save failed");
      return;
    }
    setSaveMessage("All changes saved. Open your portfolio to see them live.");
  }

  function updateProject(index: number, patch: Partial<ProjectDetail>) {
    if (!data) return;
    const projects = [...data.projects];
    projects[index] = { ...projects[index], ...patch };
    setData({ ...data, projects });
    setSaveMessage("");
  }

  function updateRepoName(slug: string, repoName: string) {
    if (!data) return;
    const githubRepoBySlug = { ...data.githubRepoBySlug };
    if (repoName.trim()) {
      githubRepoBySlug[slug] = repoName.trim();
    } else {
      delete githubRepoBySlug[slug];
    }
    setData({ ...data, githubRepoBySlug });
    setSaveMessage("");
  }

  function addProject() {
    if (!data) return;
    const project = emptyProject(data.projects.length);
    setData({
      ...data,
      projects: [...data.projects, project],
      githubRepoBySlug: { ...data.githubRepoBySlug },
    });
    setActiveIndex(data.projects.length);
    setSaveMessage("");
  }

  function deleteProject(index: number) {
    if (!data || data.projects.length <= 1) return;
    if (!window.confirm(`Delete “${data.projects[index].title}”? This cannot be undone until you save.`)) {
      return;
    }
    const projects = data.projects.filter((_, i) => i !== index);
    setData({ ...data, projects });
    setActiveIndex(Math.max(0, index - 1));
    setSaveMessage("");
  }

  if (loading) {
    return (
      <div className="admin-center">
        <p className="admin-muted">Loading admin…</p>
      </div>
    );
  }

  if (!configured) {
    return (
      <div className="admin-center">
        <div className="admin-card admin-card--narrow">
          <span className="admin-eyebrow">Setup required</span>
          <h1 className="admin-title">Admin is not ready yet</h1>
          <ol className="admin-steps-list">
            <li>
              Open <code>.env.local</code> in your project folder
            </li>
            <li>
              Add <code>ADMIN_PASSWORD=your-secret</code>
            </li>
            <li>
              Restart the dev server (<code>npm run dev</code>)
            </li>
            <li>Reload this page</li>
          </ol>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="admin-center">
        <div className="admin-card admin-card--narrow">
          <span className="admin-eyebrow">Private area</span>
          <h1 className="admin-title">Sign in to edit projects</h1>
          <form onSubmit={handleLogin} className="admin-form-stack">
            <Field label="Password">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                placeholder="Enter admin password"
                required
              />
            </Field>
            {loginError ? (
              <p className="admin-alert admin-alert--error" role="alert">
                {loginError}
              </p>
            ) : null}
            <button type="submit" className="btn-primary admin-btn-block">
              Sign in
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="admin-center">
        <p className="admin-muted">Loading your projects…</p>
      </div>
    );
  }

  const project = data.projects[activeIndex];
  if (!project) {
    return (
      <div className="admin-center">
        <p className="admin-muted">No projects yet.</p>
        <button type="button" className="btn-primary" onClick={addProject}>
          Create first project
        </button>
      </div>
    );
  }

  const repoName = data.githubRepoBySlug[project.slug] ?? "";
  const previewCard = `/#work`;
  const previewCase = `/projects/${project.slug}`;

  return (
    <div className="admin-app">
      <header className="admin-toolbar">
        <div className="admin-toolbar__intro">
          <h1 className="admin-title">Project editor</h1>
          <p className="admin-lead">
            Pick a project → edit the fields → click <strong>Save changes</strong>.
          </p>
        </div>
        <div className="admin-toolbar__actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => void handleLogout()}
          >
            Sign out
          </button>
          <button
            type="button"
            className="btn-primary"
            disabled={saving}
            onClick={() => void handleSave()}
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </header>

      <div className="admin-howto" aria-label="How to use">
        <div className="admin-howto__step">
          <span className="admin-howto__num">1</span>
          <span>Choose a project</span>
        </div>
        <div className="admin-howto__step">
          <span className="admin-howto__num">2</span>
          <span>Edit sections below</span>
        </div>
        <div className="admin-howto__step">
          <span className="admin-howto__num">3</span>
          <span>Save &amp; check portfolio</span>
        </div>
      </div>

      {saveMessage ? (
        <p className="admin-alert admin-alert--success" role="status">
          {saveMessage}
        </p>
      ) : null}
      {saveError ? (
        <p className="admin-alert admin-alert--error" role="alert">
          {saveError}
        </p>
      ) : (
        <p className="admin-alert admin-alert--info">
          Unsaved edits are only on this page until you save.
        </p>
      )}

      <div className="admin-workspace">
        <aside className="admin-sidebar admin-card">
          <p className="admin-sidebar__label">Your projects</p>
          <p className="admin-sidebar__hint">{data.projects.length} total</p>
          <ul className="admin-project-list">
            {data.projects.map((p, i) => (
              <li key={`${p.slug}-${i}`}>
                <button
                  type="button"
                  className={
                    i === activeIndex
                      ? "admin-project-list__btn admin-project-list__btn--active"
                      : "admin-project-list__btn"
                  }
                  onClick={() => setActiveIndex(i)}
                >
                  <span className="admin-project-list__title">{p.title}</span>
                  <span className="admin-project-list__meta">
                    {p.year} · /{p.slug}
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <button type="button" className="btn-secondary admin-add" onClick={addProject}>
            + New project
          </button>
        </aside>

        <div className="admin-editor">
          <div className="admin-card admin-editor__header">
            <div>
              <span className="admin-eyebrow">Editing</span>
              <h2 className="admin-editor__title">{project.title}</h2>
              <p className="admin-editor__urls">
                Card on home · Case study at{" "}
                <code>/projects/{project.slug}</code>
              </p>
            </div>
            <div className="admin-editor__header-actions">
              <Link href={previewCase} target="_blank" className="btn-secondary admin-preview-btn">
                Preview case study
              </Link>
              <Link href={previewCard} target="_blank" className="btn-secondary admin-preview-btn">
                Preview on home
              </Link>
              <button
                type="button"
                className="admin-delete"
                onClick={() => deleteProject(activeIndex)}
              >
                Delete project
              </button>
            </div>
          </div>

          <AdminSection
            title="Basics"
            description="Name and URL shown on cards and the case study header."
          >
            <Field label="Project title" hint="Shown as the main heading">
              <input
                value={project.title}
                onChange={(e) => updateProject(activeIndex, { title: e.target.value })}
              />
            </Field>
            <Field
              label="URL slug"
              hint="Lowercase, hyphens only — e.g. shopnext → /projects/shopnext"
            >
              <input
                value={project.slug}
                onChange={(e) => {
                  const slug = e.target.value
                    .toLowerCase()
                    .replace(/[^a-z0-9-]/g, "-");
                  updateProject(activeIndex, { slug });
                }}
              />
            </Field>
            <Field label="Year" hint="Small label on the card">
              <input
                value={project.year}
                onChange={(e) => updateProject(activeIndex, { year: e.target.value })}
              />
            </Field>
            <Field label="Sort ID" hint="Order on the site (01, 02, 03…)">
              <input
                value={project.id}
                onChange={(e) => updateProject(activeIndex, { id: e.target.value })}
              />
            </Field>
            <Field
              label="Tech line"
              hint="One line under the title on cards, e.g. NEXT.JS + DJANGO"
              span={2}
            >
              <input
                value={project.tech}
                onChange={(e) => updateProject(activeIndex, { tech: e.target.value })}
              />
            </Field>
          </AdminSection>

          <AdminSection
            title="Card text"
            description="Short summary visitors see on the Work section and /projects page."
          >
            <Field label="Short description" span={2}>
              <textarea
                rows={3}
                value={project.desc}
                onChange={(e) => updateProject(activeIndex, { desc: e.target.value })}
                placeholder="One or two sentences about what this project does."
              />
            </Field>
          </AdminSection>

          <AdminSection
            title="Case study page"
            description="Longer content on the full project page."
          >
            <Field label="Overview" hint="Main paragraph on the case study" span={2}>
              <textarea
                rows={5}
                value={project.overview}
                onChange={(e) => updateProject(activeIndex, { overview: e.target.value })}
              />
            </Field>
            <Field label="Tech stack" hint="One technology per line — shown as tags" span={2}>
              <textarea
                rows={4}
                value={listToLines(project.techStack)}
                onChange={(e) =>
                  updateProject(activeIndex, { techStack: linesToList(e.target.value) })
                }
                placeholder={"FastAPI\nPostgreSQL\nDocker"}
              />
            </Field>
            <Field label="Highlights" hint="One bullet per line — key achievements" span={2}>
              <textarea
                rows={6}
                value={listToLines(project.highlights)}
                onChange={(e) =>
                  updateProject(activeIndex, { highlights: linesToList(e.target.value) })
                }
                placeholder={"Built JWT auth with role-based access\n95%+ test coverage"}
              />
            </Field>
          </AdminSection>

          <AdminSection
            title="Links & demos"
            description="Optional. Leave blank if you don't have a live site or video yet."
          >
            {cloudinaryReady ? (
              <div className="admin-field admin-field--wide">
                <CloudinaryVideoUpload
                  projectSlug={project.slug}
                  onUploaded={(url) => {
                    updateProject(activeIndex, { demoVideo: url });
                    setSaveMessage(
                      "Video uploaded to Cloudinary. Click Save changes to publish on your site."
                    );
                  }}
                />
              </div>
            ) : (
              <div className="admin-field admin-field--wide admin-cloudinary-setup">
                <p className="admin-cloudinary__title">Cloudinary (recommended)</p>
                <p className="admin-cloudinary__desc">
                  Add your Cloudinary keys to <code>.env.local</code>, restart{" "}
                  <code>npm run dev</code>, then upload videos here — or paste a
                  Cloudinary URL manually below.
                </p>
              </div>
            )}
            <Field
              label="Live demo URL"
              hint="Opens the deployed app — shows a “Live Demo” button"
            >
              <input
                type="url"
                placeholder="https://your-app.vercel.app"
                value={project.live ?? ""}
                onChange={(e) =>
                  updateProject(activeIndex, {
                    live: e.target.value.trim() || undefined,
                  })
                }
              />
            </Field>
            <Field
              label="Demo video URL"
              hint="YouTube, Vimeo, Cloudinary (direct .mp4 link), or any https:// video URL"
            >
              <input
                type="url"
                placeholder="https://res.cloudinary.com/.../video.mp4"
                value={project.demoVideo ?? ""}
                onChange={(e) =>
                  updateProject(activeIndex, {
                    demoVideo: e.target.value.trim() || undefined,
                  })
                }
              />
            </Field>
            <Field
              label="GitHub repo name"
              hint="Just the repo name — links to github.com/Sandesh-Pandey6/…"
            >
              <input
                placeholder="icecream_ecommerce"
                value={repoName}
                onChange={(e) => updateRepoName(project.slug, e.target.value)}
              />
            </Field>
            <Field
              label="Full GitHub URL"
              hint="Only if you need a different link than the repo name above"
            >
              <input
                type="url"
                placeholder="https://github.com/..."
                value={project.github ?? ""}
                onChange={(e) =>
                  updateProject(activeIndex, {
                    github: e.target.value.trim() || undefined,
                  })
                }
              />
            </Field>
          </AdminSection>
        </div>
      </div>

      <footer className="admin-sticky-save">
        <p className="admin-sticky-save__text">
          Editing <strong>{project.title}</strong>
        </p>
        <button
          type="button"
          className="btn-primary"
          disabled={saving}
          onClick={() => void handleSave()}
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
      </footer>
    </div>
  );
}
