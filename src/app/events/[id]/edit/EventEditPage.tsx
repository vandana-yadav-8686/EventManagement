"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchEvent } from "@/lib/api-client";
import { useEventCache } from "@/context/EventCacheContext";
import type { SerializedEvent } from "@/lib/models/Event";
import { EditEventForm } from "@/components/EditEventForm";
import { Loader } from "@/components/Loader";
import { Alert } from "@/components/Alert";

export function EventEditPage({ id }: { id: string }) {
  const { getCachedEvent, setCachedEvent } = useEventCache();
  const [event, setEvent] = useState<SerializedEvent | null>(() => getCachedEvent(id));
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(!getCachedEvent(id));

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!event) setIsLoading(true);
      setError("");

      try {
        const fresh = await fetchEvent(id);
        if (!cancelled) {
          setEvent(fresh);
          setCachedEvent(fresh);
        }
      } catch (err) {
        if (!cancelled && !event) {
          setError(err instanceof Error ? err.message : "Event not found");
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
  }, [id]);

  if (isLoading && !event) {
    return <Loader label="Loading event..." />;
  }

  if (error || !event) {
    return (
      <div>
        <Alert variant="error" message={error || "Event not found"} />
        <Link
          href="/"
          className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
        >
          ← Back to dashboard
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <Link
          href={`/events/${event.id}`}
          prefetch
          className="text-sm font-medium text-primary hover:underline"
        >
          ← Back to event details
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-foreground">Edit Event</h1>
        <p className="mt-1 text-sm text-muted">
          Update any field for &quot;{event.eventName}&quot;
        </p>
      </div>
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <EditEventForm event={event} />
      </div>
    </div>
  );
}
