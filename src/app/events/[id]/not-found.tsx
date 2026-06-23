import Link from "next/link";

export default function EventNotFound() {
  return (
    <div className="rounded-xl border border-border bg-card px-6 py-12 text-center">
      <h1 className="text-lg font-semibold text-foreground">Event not found</h1>
      <p className="mt-2 text-sm text-muted">
        This event may have been deleted or the link is invalid.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block text-sm font-medium text-primary hover:underline"
      >
        ← Back to dashboard
      </Link>
    </div>
  );
}
