"use client";

import { useEffect, useState } from "react";

export function linesToList(value: string): string[] {
  return value
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

type AdminLinesTextareaProps = {
  /** Changes when switching to another record (project slug, category id, etc.) */
  syncKey: string;
  items: string[];
  onItemsChange: (items: string[]) => void;
  rows?: number;
  placeholder?: string;
};

/**
 * Textarea for "one item per line" lists. Keeps local draft so Enter/new lines work
 * while typing (controlled value from items[] would strip trailing empty lines).
 */
export default function AdminLinesTextarea({
  syncKey,
  items,
  onItemsChange,
  rows = 6,
  placeholder,
}: AdminLinesTextareaProps) {
  const [draft, setDraft] = useState(() => items.join("\n"));

  useEffect(() => {
    setDraft(items.join("\n"));
  }, [syncKey]);

  return (
    <textarea
      rows={rows}
      value={draft}
      placeholder={placeholder}
      onChange={(e) => {
        const raw = e.target.value;
        setDraft(raw);
        onItemsChange(linesToList(raw));
      }}
    />
  );
}
