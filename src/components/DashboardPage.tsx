"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { SerializedEvent } from "@/lib/models/Event";
import { fetchEvents } from "@/lib/api-client";
import { useEventCache } from "@/context/EventCacheContext";
import { EventTable } from "@/components/EventTable";
import { EmptyState } from "@/components/EmptyState";
import { Alert } from "@/components/Alert";
import { Loader } from "@/components/Loader";

function DashboardContent() {
  const searchParams = useSearchParams();
  const createdId = searchParams.get("created") ?? undefined;
  const { seedEvents, getAllCachedEvents, removeCachedEvent } = useEventCache();

  const [events, setEvents] = useState<SerializedEvent[]>(() => getAllCachedEvents());
  const [isLoading, setIsLoading] = useState(() => getAllCachedEvents().length === 0);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(
    createdId ? "Event created successfully!" : ""
  );

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (events.length === 0) setIsLoading(true);
      setError("");

      try {
        const fresh = await fetchEvents();
        if (!cancelled) {
          setEvents(fresh);
          seedEvents(fresh);
        }
      } catch (err) {
        if (!cancelled && events.length === 0) {
          setError(err instanceof Error ? err.message : "Failed to load events");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDeleted = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    removeCachedEvent(id);
  };

  if (isLoading && events.length === 0) {
    return <Loader label="Loading events..." />;
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Event Dashboard</h1>
          <p className="mt-1 text-sm text-muted">
            View, edit, and manage all your conference events
          </p>
        </div>
        <Link
          href="/events/new"
          prefetch
          className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[var(--primary-hover)]"
        >
          + Create Event
        </Link>
      </div>

      {error && <Alert variant="error" message={error} />}

      {successMessage && (
        <Alert
          variant="success"
          message={successMessage}
          onDismiss={() => setSuccessMessage("")}
        />
      )}

      {!error && events.length === 0 && <EmptyState />}

      {events.length > 0 && <EventTable events={events} onDeleted={handleDeleted} />}
    </div>
  );
}

export function DashboardPage() {
  return (
    <Suspense fallback={<Loader label="Loading dashboard..." />}>
      <DashboardContent />
    </Suspense>
  );
}
