import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <h1 className="mb-2 text-6xl font-bold text-zinc-900 dark:text-zinc-100">404</h1>
      <p className="mb-6 text-zinc-600 dark:text-zinc-400">Page not found</p>
      <Link
        href="/"
        className="rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-emerald-500"
      >
        Back to Home
      </Link>
    </div>
  );
}
