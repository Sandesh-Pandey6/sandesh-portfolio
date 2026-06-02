"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { HeroStat, HeroStatsFile } from "@/types/heroStats";

function newStat(): HeroStat {
  return { value: "0+", label: "New stat" };
}

export default function AdminHeroEditor() {
  const [data, setData] = useState<HeroStatsFile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [saveError, setSaveError] = useState("");

  const load = useCallback(async () => {
    const res = await fetch("/api/hero-stats");
    if (!res.ok) return;
    setData((await res.json()) as HeroStatsFile);
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
    const res = await fetch("/api/hero-stats", {
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
    setSaveMessage("Hero stats saved. Refresh the home page to see changes.");
  }

  function updateStat(index: number, patch: Partial<HeroStat>) {
    if (!data) return;
    const stats = [...data.stats];
    stats[index] = { ...stats[index], ...patch };
    setData({ ...data, stats });
    setSaveMessage("");
  }

  function addStat() {
    if (!data || data.stats.length >= 6) return;
    setData({ ...data, stats: [...data.stats, newStat()] });
    setSaveMessage("");
  }

  function removeStat(index: number) {
    if (!data || data.stats.length <= 1) return;
    if (!window.confirm(`Remove “${data.stats[index].label}”?`)) return;
    setData({ ...data, stats: data.stats.filter((_, i) => i !== index) });
    setSaveMessage("");
  }

  if (loading) {
    return <p className="admin-muted">Loading hero stats…</p>;
  }

  if (!data) {
    return <p className="admin-muted">Could not load hero stats.</p>;
  }

  return (
    <div className="admin-app">
      <header className="admin-toolbar">
        <div className="admin-toolbar__intro">
          <h1 className="admin-title">Hero stats</h1>
          <p className="admin-lead">
            Edit the three numbers under your hero headline on the home page
            (e.g. <strong>1+</strong> Years building).
          </p>
        </div>
        <div className="admin-toolbar__actions">
          <Link href="/#hero" target="_blank" className="btn-secondary">
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

      <div className="admin-card admin-hero-stats">
        <p className="admin-sidebar__label">Stats</p>
        <p className="admin-sidebar__hint">
          {data.stats.length} of 6 — shown left to right in the hero
        </p>
        <ul className="admin-hero-stats__list">
          {data.stats.map((stat, i) => (
            <li key={i} className="admin-hero-stats__item">
              <div className="admin-hero-stats__preview">
                <span className="stat-value">{stat.value || "—"}</span>
                <span className="stat-label">{stat.label || "Label"}</span>
              </div>
              <div className="admin-form admin-form--grid admin-hero-stats__fields">
                <label className="admin-field">
                  <span className="admin-field__label">Value</span>
                  <span className="admin-field__hint">e.g. 1+, 5+, 10+</span>
                  <input
                    value={stat.value}
                    onChange={(e) => updateStat(i, { value: e.target.value })}
                    placeholder="1+"
                  />
                </label>
                <label className="admin-field">
                  <span className="admin-field__label">Label</span>
                  <span className="admin-field__hint">Short line under the number</span>
                  <input
                    value={stat.label}
                    onChange={(e) => updateStat(i, { label: e.target.value })}
                    placeholder="Years building"
                  />
                </label>
              </div>
              {data.stats.length > 1 ? (
                <button
                  type="button"
                  className="admin-delete"
                  onClick={() => removeStat(i)}
                >
                  Remove stat
                </button>
              ) : null}
            </li>
          ))}
        </ul>
        {data.stats.length < 6 ? (
          <button type="button" className="btn-secondary admin-add" onClick={addStat}>
            + Add stat
          </button>
        ) : null}
      </div>
    </div>
  );
}
