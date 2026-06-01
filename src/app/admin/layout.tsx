import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Admin | Sandesh.dev",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-shell">
      <header className="admin-topbar">
        <Link href="/" className="admin-topbar__brand">
          <span className="admin-topbar__dot" aria-hidden />
          Sandesh.dev
          <span className="admin-topbar__badge">Admin</span>
        </Link>
        <Link href="/projects" className="admin-topbar__link">
          View portfolio →
        </Link>
      </header>
      <div className="admin-page">{children}</div>
    </div>
  );
}
