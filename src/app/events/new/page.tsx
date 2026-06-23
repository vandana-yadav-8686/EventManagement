"use client";

import { useRouter } from "next/navigation";
import { EventForm } from "@/components/EventForm";
import { useEventCache } from "@/context/EventCacheContext";
import type { SerializedEvent } from "@/lib/models/Event";

export default function NewEventPage() {
  const router = useRouter();
  const { setCachedEvent } = useEventCache();

  const handleSuccess = (event: SerializedEvent) => {
    setCachedEvent(event);
    router.push(`/?created=${event.id}`);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Create Event</h1>
        <p className="mt-1 text-sm text-muted">
          Fill in the event and speaker details. All fields marked with * are required.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <EventForm mode="create" onSuccess={handleSuccess} />
      </div>
    </div>
  );
}
