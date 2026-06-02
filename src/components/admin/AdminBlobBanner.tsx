"use client";

import { BLOB_SETUP_MESSAGE } from "@/lib/blobConfig";

export default function AdminBlobBanner({
  deployedOnVercel,
  blobConfigured,
}: {
  deployedOnVercel: boolean;
  blobConfigured: boolean;
}) {
  if (!deployedOnVercel || blobConfigured) return null;

  return (
    <div className="admin-alert admin-alert--error admin-blob-banner" role="alert">
      <strong>Saves will not work on this live site yet.</strong> Vercel cannot write
      files to disk. {BLOB_SETUP_MESSAGE}
      <ol className="admin-steps-list admin-blob-banner__steps">
        <li>
          Vercel dashboard → your project → <strong>Storage</strong> →{" "}
          <strong>Create Database</strong> → <strong>Blob</strong>
        </li>
        <li>Connect the Blob store to this project (adds env vars automatically)</li>
        <li>
          <strong>Deployments</strong> → <strong>Redeploy</strong>, then try Save again
        </li>
      </ol>
    </div>
  );
}
