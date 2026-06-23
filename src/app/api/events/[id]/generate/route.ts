import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { Event, serializeEvent } from "@/lib/models/Event";
import {
  generateEventContent,
  getGeminiErrorStatus,
  getGeminiUserMessage,
} from "@/lib/gemini";
import { apiError, apiSuccess, isValidObjectId } from "@/lib/api-utils";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  if (!isValidObjectId(id)) {
    return apiError("Invalid event ID", 400);
  }

  try {
    await connectDB();
    const event = await Event.findById(id);

    if (!event) {
      return apiError("Event not found", 404);
    }

    const eventDateFormatted = event.eventDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const generated = await generateEventContent({
      eventName: event.eventName,
      eventDate: eventDateFormatted,
      speakerName: event.speakerName,
      speakerDesignation: event.speakerDesignation,
    });

    event.description = generated.description;
    event.speakerIntro = generated.speakerIntro;
    await event.save();

    return apiSuccess(serializeEvent(event));
  } catch (error) {
    console.error(`[POST /api/events/${id}/generate]`, error);
    return apiError(getGeminiUserMessage(error), getGeminiErrorStatus(error));
  }
}
