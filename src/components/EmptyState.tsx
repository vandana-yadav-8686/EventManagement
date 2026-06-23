import Link from "next/link";

export function EmptyState() {
  return (
    <div className="rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-background text-2xl">
        📅
      </div>
      <h2 className="text-lg font-semibold text-foreground">No events yet</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted">
        You haven&apos;t created any events. Start by adding your first conference
        event with speaker details.
      </p>
      <Link
        href="/events/new"
        className="mt-6 inline-block rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[var(--primary-hover)]"
      >
        Create your first event
      </Link>
    </div>
  );
}
