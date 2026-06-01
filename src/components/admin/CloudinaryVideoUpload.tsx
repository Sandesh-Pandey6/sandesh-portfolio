"use client";

import { useEffect, useRef, useState } from "react";
import { parseCloudinaryApiError } from "@/lib/cloudinaryErrors";

/** Cloudinary free plan: max per video file */
const CLOUDINARY_MAX_MB = 100;

type CloudinaryConfig = {
  configured: boolean;
  cloudName: string | null;
  uploadPreset: string | null;
};

type CloudinaryVideoUploadProps = {
  projectSlug: string;
  onUploaded: (url: string) => void;
};

function formatMb(bytes: number): string {
  return (bytes / (1024 * 1024)).toFixed(1);
}

function tooLargeMessage(sizeMb: string): string {
  return `This file is ${sizeMb} MB. Cloudinary’s free plan allows up to ${CLOUDINARY_MAX_MB} MB per file. Compress to 720p (Clipchamp / HandBrake) or paste an unlisted YouTube link in “Demo video URL” below.`;
}

function uploadWithProgress(
  url: string,
  formData: FormData,
  onProgress: (percent: number) => void
): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) {
        onProgress(Math.min(99, Math.round((e.loaded / e.total) * 100)));
      }
    });

    xhr.addEventListener("load", () => {
      let json: unknown;
      try {
        json = JSON.parse(xhr.responseText);
      } catch {
        reject(new Error("Invalid response from server"));
        return;
      }
      if (xhr.status >= 200 && xhr.status < 300) {
        onProgress(100);
        resolve(json);
      } else {
        const errJson = json as { error?: string };
        reject(new Error(errJson.error ?? parseCloudinaryApiError(json)));
      }
    });

    xhr.addEventListener("error", () => {
      reject(new Error("Network error — check your connection and try again."));
    });

    xhr.addEventListener("abort", () => {
      reject(new Error("Upload cancelled."));
    });

    xhr.send(formData);
  });
}

export default function CloudinaryVideoUpload({
  projectSlug,
  onUploaded,
}: CloudinaryVideoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [config, setConfig] = useState<CloudinaryConfig | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"idle" | "upload" | "process">("idle");
  const [error, setError] = useState("");
  const [lastFile, setLastFile] = useState("");

  useEffect(() => {
    void fetch("/api/admin/cloudinary-status")
      .then((r) => r.json())
      .then((json: CloudinaryConfig) => setConfig(json))
      .catch(() => setConfig(null));
  }, []);

  /** Unsigned preset — no API key permissions needed */
  async function uploadUnsigned(file: File, cloudName: string, uploadPreset: string) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    formData.append("folder", "portfolio");

    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`;

    setPhase("upload");
    setProgress(0);

    const json = await uploadWithProgress(uploadUrl, formData, (pct) => {
      setProgress(pct);
      if (pct >= 99) setPhase("process");
    });

    const url = (json as { secure_url?: string }).secure_url;
    if (!url) throw new Error(parseCloudinaryApiError(json));
    return url;
  }

  /** Server upload — uses API secret (full upload permission) */
  async function uploadViaServer(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("slug", projectSlug);

    setPhase("upload");
    setProgress(0);

    const json = await uploadWithProgress("/api/admin/upload-video", formData, (pct) => {
      setProgress(Math.min(90, Math.round(pct * 0.9)));
      if (pct >= 99) setPhase("process");
    });

    const url = (json as { url?: string }).url;
    if (!url) throw new Error("Upload failed — no URL returned");
    return url;
  }

  async function handleUpload(file: File) {
    const sizeMb = formatMb(file.size);
    const maxBytes = CLOUDINARY_MAX_MB * 1024 * 1024;

    if (file.size > maxBytes) {
      setError(tooLargeMessage(sizeMb));
      setLastFile(file.name);
      return;
    }

    setUploading(true);
    setError("");
    setPhase("upload");
    setProgress(0);
    setLastFile(`${file.name} (${sizeMb} MB)`);

    try {
      let url: string;

      if (config?.cloudName && config.uploadPreset) {
        url = await uploadUnsigned(file, config.cloudName, config.uploadPreset);
      } else {
        url = await uploadViaServer(file);
      }

      onUploaded(url);
      setPhase("idle");
      setProgress(100);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      if (msg.toLowerCase().includes("size") || msg.toLowerCase().includes("large")) {
        setError(tooLargeMessage(sizeMb));
      } else {
        setError(msg);
      }
      setPhase("idle");
      setProgress(0);
    } finally {
      setUploading(false);
    }
  }

  const statusText =
    phase === "process"
      ? "Sending to Cloudinary & processing…"
      : uploading
        ? `Uploading… ${progress}%`
        : null;

  const modeHint =
    config?.uploadPreset
      ? "Using unsigned upload preset (recommended)."
      : config?.configured
        ? "Upload goes through your server using the API secret."
        : null;

  return (
    <div className="admin-cloudinary">
      <p className="admin-cloudinary__title">Upload to Cloudinary</p>
      <p className="admin-cloudinary__desc">
        Large videos can take a few minutes — that is normal. Time depends on file
        size and internet speed.
      </p>
      {modeHint ? <p className="admin-cloudinary__meta">{modeHint}</p> : null}
      <p className="admin-cloudinary__limit">
        Free plan: max <strong>{CLOUDINARY_MAX_MB} MB</strong>. Smaller files (720p,
        ~30–50 MB) upload faster.
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
          {uploading ? `Uploading… ${progress}%` : "Choose video & upload"}
        </button>
      </div>

      {uploading ? (
        <div className="admin-upload-progress" aria-live="polite">
          <div className="admin-upload-progress__track">
            <div
              className="admin-upload-progress__bar"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="admin-upload-progress__text">{statusText}</p>
          {lastFile ? <p className="admin-cloudinary__meta">{lastFile}</p> : null}
        </div>
      ) : (
        lastFile && !error && <p className="admin-cloudinary__meta">{lastFile}</p>
      )}

      {error ? (
        <p className="admin-alert admin-alert--error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
