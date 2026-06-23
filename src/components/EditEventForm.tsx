"use client";

import { useRouter } from "next/navigation";
import { EventForm } from "@/components/EventForm";
import { useEventCache } from "@/context/EventCacheContext";
import type { SerializedEvent } from "@/lib/models/Event";

interface EditEventFormProps {
  event: SerializedEvent;
}

export function EditEventForm({ event }: EditEventFormProps) {
  const router = useRouter();
  const { setCachedEvent } = useEventCache();

  const handleSuccess = (updated: SerializedEvent) => {
    setCachedEvent(updated);
    router.push(`/events/${updated.id}`);
  };

  return <EventForm mode="edit" initialData={event} onSuccess={handleSuccess} />;
}
