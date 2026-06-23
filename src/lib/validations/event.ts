import { z } from "zod";

const trimmedString = (field: string, min = 2, max = 200) =>
  z
    .string({ required_error: `${field} is required` })
    .trim()
    .min(1, `${field} is required`)
    .min(min, `${field} must be at least ${min} characters`)
    .max(max, `${field} must be at most ${max} characters`);

function parseEventDate(value: string): Date {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error("Invalid date");
  }
  return date;
}

function isTodayOrFuture(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const eventDay = new Date(date);
  eventDay.setHours(0, 0, 0, 0);
  return eventDay >= today;
}

export const eventInputSchema = z.object({
  eventName: trimmedString("Event name", 3, 150),
  eventDate: z
    .string({ required_error: "Event date is required" })
    .trim()
    .min(1, "Event date is required")
    .refine(
      (value) => {
        try {
          parseEventDate(value);
          return true;
        } catch {
          return false;
        }
      },
      { message: "Please enter a valid event date" }
    )
    .refine(
      (value) => isTodayOrFuture(parseEventDate(value)),
      { message: "Event date cannot be in the past" }
    ),
  speakerName: trimmedString("Speaker name", 2, 120),
  speakerDesignation: trimmedString("Speaker designation", 2, 200),
  description: z.string().trim().max(5000).optional(),
  speakerIntro: z.string().trim().max(2000).optional(),
});

export type EventInput = z.infer<typeof eventInputSchema>;

export const eventUpdateSchema = eventInputSchema;

export function formatZodErrors(error: z.ZodError) {
  return error.errors.map((issue) => ({
    field: issue.path.join(".") || "form",
    message: issue.message,
  }));
}

export function toStoredEventDate(isoDateString: string): Date {
  const date = parseEventDate(isoDateString);
  date.setHours(0, 0, 0, 0);
  return date;
}

export function formatEventDate(date: Date): string {
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function toDateInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
