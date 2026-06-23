import type { SerializedEvent } from "@/lib/models/Event";

export interface ApiErrorItem {
  field: string;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: ApiErrorItem[];
}

export type EventFormData = {
  eventName: string;
  eventDate: string;
  speakerName: string;
  speakerDesignation: string;
  description?: string;
  speakerIntro?: string;
};

async function parseResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const payload = (await response.json()) as ApiResponse<T>;
  return payload;
}

export async function fetchEvents(): Promise<SerializedEvent[]> {
  const response = await fetch("/api/events", { cache: "no-store" });
  const payload = await parseResponse<SerializedEvent[]>(response);

  if (!response.ok || !payload.success || !payload.data) {
    throw new Error(payload.message || "Failed to load events");
  }

  return payload.data;
}

export async function fetchEvent(id: string): Promise<SerializedEvent> {
  const response = await fetch(`/api/events/${id}`, { cache: "no-store" });
  const payload = await parseResponse<SerializedEvent>(response);

  if (!response.ok || !payload.success || !payload.data) {
    throw new Error(payload.message || "Failed to load event");
  }

  return payload.data;
}

export async function createEvent(
  data: EventFormData
): Promise<{ event: SerializedEvent; errors?: ApiErrorItem[]; message?: string }> {
  const response = await fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const payload = await parseResponse<SerializedEvent>(response);

  if (!response.ok || !payload.success) {
    return {
      event: null as unknown as SerializedEvent,
      errors: payload.errors,
      message: payload.message || "Failed to create event",
    };
  }

  return { event: payload.data! };
}

export async function updateEvent(
  id: string,
  data: EventFormData
): Promise<{ event: SerializedEvent; errors?: ApiErrorItem[]; message?: string }> {
  const response = await fetch(`/api/events/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const payload = await parseResponse<SerializedEvent>(response);

  if (!response.ok || !payload.success) {
    return {
      event: null as unknown as SerializedEvent,
      errors: payload.errors,
      message: payload.message || "Failed to update event",
    };
  }

  return { event: payload.data! };
}

export async function deleteEvent(
  id: string
): Promise<{ success: boolean; message?: string }> {
  const response = await fetch(`/api/events/${id}`, { method: "DELETE" });
  const payload = await parseResponse<{ id: string; message: string }>(response);

  if (!response.ok || !payload.success) {
    return { success: false, message: payload.message || "Failed to delete event" };
  }

  return { success: true };
}

export async function generateEventContent(
  data: EventFormData
): Promise<{
  description: string;
  speakerIntro: string;
  message?: string;
}> {
  const response = await fetch("/api/events/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const payload = await parseResponse<{
    description: string;
    speakerIntro: string;
  }>(response);

  if (!response.ok || !payload.success || !payload.data) {
    return {
      description: "",
      speakerIntro: "",
      message: payload.message || "Failed to generate AI content.",
    };
  }

  return {
    description: payload.data.description,
    speakerIntro: payload.data.speakerIntro,
  };
}

export async function regenerateEventContent(
  id: string
): Promise<{ event: SerializedEvent; message?: string }> {
  const response = await fetch(`/api/events/${id}/generate`, {
    method: "POST",
  });
  const payload = await parseResponse<SerializedEvent>(response);

  if (!response.ok || !payload.success || !payload.data) {
    return {
      event: null as unknown as SerializedEvent,
      message: payload.message || "Failed to generate content",
    };
  }

  return { event: payload.data };
}
