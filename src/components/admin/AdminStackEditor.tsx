"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import AdminLinesTextarea from "@/components/admin/AdminLinesTextarea";
import type { SkillCategory, SkillsFile } from "@/types/skills";

function newCategory(index: number): SkillCategory {
  return {
    id: `category-${index + 1}`,
    title: "New category",
    items: [],
  };
}

export default function AdminStackEditor() {
  const [data, setData] = useState<SkillsFile | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [saveError, setSaveError] = useState("");

  const load = useCallback(async () => {
    const res = await fetch("/api/skills");
    if (!res.ok) return;
    setData((await res.json()) as SkillsFile);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleSave() {
    if (!data) return;
    setSaving(true);
    setSaveMessage("");
    setSaveError("");
    const res = await fetch("/api/skills", {
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
    setSaveMessage("Stack section saved. Refresh the home page to see changes.");
  }

  function updateCategory(index: number, patch: Partial<SkillCategory>) {
    if (!data) return;
    const categories = [...data.categories];
    categories[index] = { ...categories[index], ...patch };
    setData({ ...data, categories });
    setSaveMessage("");
  }

  function addCategory() {
    if (!data) return;
    setData({
      ...data,
      categories: [...data.categories, newCategory(data.categories.length)],
    });
    setActiveIndex(data.categories.length);
    setSaveMessage("");
  }

  function deleteCategory(index: number) {
    if (!data) return;
    if (!window.confirm(`Delete “${data.categories[index].title}”?`)) return;
    const categories = data.categories.filter((_, i) => i !== index);
    setData({ ...data, categories });
    setActiveIndex(Math.max(0, index - 1));
    setSaveMessage("");
  }

  if (loading) {
    return <p className="admin-muted">Loading stack section…</p>;
  }

  if (!data) {
    return <p className="admin-muted">Could not load stack data.</p>;
  }

  const category = data.categories[activeIndex];

  return (
    <div className="admin-app">
      <header className="admin-toolbar">
        <div className="admin-toolbar__intro">
          <h1 className="admin-title">Tech stack editor</h1>
          <p className="admin-lead">
            This is the <strong>02 / Stack</strong> section on your home page — edit
            categories (Backend, Frontend, etc.) and skills, then save.
          </p>
        </div>
        <div className="admin-toolbar__actions">
          <Link href="/#stack" target="_blank" className="btn-secondary">
            Preview on home
          </Link>
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

      <div className="admin-card admin-stack-settings">
        <label className="admin-featured-item admin-stack-toggle">
          <input
            type="checkbox"
            checked={data.enabled}
            onChange={(e) => {
              setData({ ...data, enabled: e.target.checked });
              setSaveMessage("");
            }}
          />
          <span>Show Stack section on home page</span>
        </label>
        <div className="admin-form admin-form--grid admin-stack-settings__fields">
          <label className="admin-field">
            <span className="admin-field__label">Section label</span>
            <span className="admin-field__hint">e.g. 02 / Stack</span>
            <input
              value={data.sectionLabel}
              onChange={(e) => {
                setData({ ...data, sectionLabel: e.target.value });
                setSaveMessage("");
              }}
            />
          </label>
          <label className="admin-field admin-field--wide">
            <span className="admin-field__label">Section headline</span>
            <input
              value={data.sectionTitle}
              onChange={(e) => {
                setData({ ...data, sectionTitle: e.target.value });
                setSaveMessage("");
              }}
            />
          </label>
        </div>
      </div>

      <div className="admin-workspace">
        <aside className="admin-sidebar admin-card">
          <p className="admin-sidebar__label">Categories</p>
          <p className="admin-sidebar__hint">{data.categories.length} total</p>
          <ul className="admin-project-list">
            {data.categories.map((cat, i) => (
              <li key={cat.id}>
                <button
                  type="button"
                  className={
                    i === activeIndex
                      ? "admin-project-list__btn admin-project-list__btn--active"
                      : "admin-project-list__btn"
                  }
                  onClick={() => setActiveIndex(i)}
                >
                  <span className="admin-project-list__title">{cat.title}</span>
                  <span className="admin-project-list__meta">
                    {cat.items.length} skills
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <button type="button" className="btn-secondary admin-add" onClick={addCategory}>
            + Add category
          </button>
        </aside>

        <div className="admin-editor">
          {category ? (
            <div className="admin-card admin-section">
              <div className="admin-section__head">
                <div className="admin-editor__top" style={{ margin: 0 }}>
                  <h3 className="admin-section__title">Edit category</h3>
                  <button
                    type="button"
                    className="admin-delete"
                    onClick={() => deleteCategory(activeIndex)}
                  >
                    Delete category
                  </button>
                </div>
              </div>
              <div className="admin-section__fields">
                <label className="admin-field">
                  <span className="admin-field__label">Category ID</span>
                  <span className="admin-field__hint">Internal key (lowercase)</span>
                  <input
                    value={category.id}
                    onChange={(e) =>
                      updateCategory(activeIndex, {
                        id: e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9-]/g, "-"),
                      })
                    }
                  />
                </label>
                <label className="admin-field">
                  <span className="admin-field__label">Category title</span>
                  <input
                    value={category.title}
                    onChange={(e) =>
                      updateCategory(activeIndex, { title: e.target.value })
                    }
                  />
                </label>
                <label className="admin-field admin-field--wide">
                  <span className="admin-field__label">Skills</span>
                  <span className="admin-field__hint">
                    One skill per line — press Enter for a new line
                  </span>
                  <AdminLinesTextarea
                    syncKey={category.id}
                    items={category.items}
                    rows={8}
                    placeholder={"Python\nFastAPI\nDocker"}
                    onItemsChange={(items) =>
                      updateCategory(activeIndex, { items })
                    }
                  />
                </label>
              </div>
            </div>
          ) : (
            <div className="admin-card admin-center" style={{ minHeight: "12rem" }}>
              <p className="admin-muted">No categories yet.</p>
              <button type="button" className="btn-primary" onClick={addCategory}>
                Add first category
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
