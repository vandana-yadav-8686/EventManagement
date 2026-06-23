import Link from "next/link";

export default function NotFound() {
  return (
    <div className="rounded-xl border border-border bg-card px-6 py-16 text-center shadow-sm">
      <p className="text-5xl font-bold text-primary">404</p>
      <h1 className="mt-4 text-xl font-semibold text-foreground">Page not found</h1>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted">
        The page you are looking for does not exist or may have been removed.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-[var(--primary-hover)]"
      >
        Back to dashboard
      </Link>
    </div>
  );
}
