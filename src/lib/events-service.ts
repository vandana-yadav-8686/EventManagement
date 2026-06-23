import { connectDB, getMongoErrorMessage } from "@/lib/db";
import { Event, serializeEvent, type EventLike, type SerializedEvent } from "@/lib/models/Event";
import {
  eventInputSchema,
  formatZodErrors,
  toStoredEventDate,
  type EventInput,
} from "@/lib/validations/event";

export async function listEvents(): Promise<SerializedEvent[]> {
  await connectDB();
  const events = await Event.find()
    .select(
      "eventName eventDate speakerName speakerDesignation description speakerIntro createdAt updatedAt"
    )
    .sort({ eventDate: 1 });

  return events.map((event) => serializeEvent(event));
}

export async function getEventById(id: string): Promise<SerializedEvent | null> {
  await connectDB();
  const event = await Event.findById(id)
    .select(
      "eventName eventDate speakerName speakerDesignation description speakerIntro createdAt updatedAt"
    )
    .lean();
  if (!event) return null;
  return serializeEvent(event as unknown as EventLike);
}

export async function createEventRecord(data: EventInput): Promise<SerializedEvent> {
  await connectDB();
  const event = await Event.create({
    eventName: data.eventName,
    eventDate: toStoredEventDate(data.eventDate),
    speakerName: data.speakerName,
    speakerDesignation: data.speakerDesignation,
    description: data.description || undefined,
    speakerIntro: data.speakerIntro || undefined,
  });
  return serializeEvent(event);
}

export async function updateEventRecord(
  id: string,
  data: EventInput
): Promise<SerializedEvent | null> {
  await connectDB();
  const event = await Event.findByIdAndUpdate(
    id,
    {
      eventName: data.eventName,
      eventDate: toStoredEventDate(data.eventDate),
      speakerName: data.speakerName,
      speakerDesignation: data.speakerDesignation,
      description: data.description || undefined,
      speakerIntro: data.speakerIntro || undefined,
    },
    { new: true, runValidators: true }
  );

  if (!event) return null;
  return serializeEvent(event);
}

export async function deleteEventRecord(id: string): Promise<boolean> {
  await connectDB();
  const result = await Event.findByIdAndDelete(id);
  return !!result;
}

export function parseEventInput(body: unknown) {
  return eventInputSchema.safeParse(body);
}

export { formatZodErrors, getMongoErrorMessage };
