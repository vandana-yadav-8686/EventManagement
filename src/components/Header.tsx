import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-border bg-card shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" prefetch className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-sm font-bold text-white">
            EM
          </span>
          <div>
            <p className="text-lg font-semibold text-foreground">Event Management</p>
            <p className="text-xs text-muted">ConferenceTV Assignment</p>
          </div>
        </Link>
        <nav className="flex items-center gap-3">
          <Link
            href="/"
            prefetch
            className="rounded-lg px-3 py-2 text-sm font-medium text-muted transition hover:bg-background hover:text-foreground"
          >
            Dashboard
          </Link>
          <Link
            href="/events/new"
            prefetch
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-[var(--primary-hover)]"
          >
            + Create Event
          </Link>
        </nav>
      </div>
    </header>
  );
}
