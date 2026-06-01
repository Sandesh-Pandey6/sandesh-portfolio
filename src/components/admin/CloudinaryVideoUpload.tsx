"use client";

import { useRef, useState } from "react";

type CloudinaryVideoUploadProps = {
  projectSlug: string;
  onUploaded: (url: string) => void;
};

export default function CloudinaryVideoUpload({
  projectSlug,
  onUploaded,
}: CloudinaryVideoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [lastFile, setLastFile] = useState("");

  async function handleUpload(file: File) {
    setUploading(true);
    setError("");
    setLastFile(file.name);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("slug", projectSlug);

    try {
      const res = await fetch("/api/admin/upload-video", {
        method: "POST",
        body: formData,
      });
      const json = (await res.json()) as { url?: string; error?: string };

      if (!res.ok || !json.url) {
        setError(json.error ?? "Upload failed");
        return;
      }

      onUploaded(json.url);
    } catch {
      setError("Network error — try again.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="admin-cloudinary">
      <p className="admin-cloudinary__title">Upload to Cloudinary</p>
      <p className="admin-cloudinary__desc">
        Host the video online — no need to keep a large file in your project. After
        upload, the URL below is filled in automatically.
      </p>
      <div className="admin-cloudinary__actions">
        <input
          ref={inputRef}
          type="file"
          accept="video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov"
          className="admin-cloudinary__input"
          disabled={uploading}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleUpload(file);
            e.target.value = "";
          }}
        />
        <button
          type="button"
          className="btn-secondary"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? "Uploading…" : "Choose video & upload"}
        </button>
      </div>
      {lastFile && !error ? (
        <p className="admin-cloudinary__meta">
          {uploading ? `Uploading ${lastFile}…` : `Last file: ${lastFile}`}
        </p>
      ) : null}
      {error ? (
        <p className="admin-alert admin-alert--error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
