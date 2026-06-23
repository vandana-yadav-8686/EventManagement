import { NextRequest } from "next/server";
import { generateEventContent, getGeminiErrorStatus, getGeminiUserMessage } from "@/lib/gemini";
import { eventInputSchema, formatZodErrors } from "@/lib/validations/event";
import { apiError, apiSuccess } from "@/lib/api-utils";

export async function POST(request: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return apiError("Invalid JSON in request body", 400);
    }

    const parsed = eventInputSchema.safeParse(body);
    if (!parsed.success) {
      return apiError("Validation failed", 400, formatZodErrors(parsed.error));
    }

    const eventDate = new Date(parsed.data.eventDate);
    const eventDateFormatted = eventDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const generated = await generateEventContent({
      eventName: parsed.data.eventName,
      eventDate: eventDateFormatted,
      speakerName: parsed.data.speakerName,
      speakerDesignation: parsed.data.speakerDesignation,
    });

    return apiSuccess(generated);
  } catch (error) {
    console.error("[POST /api/events/generate]", error);
    return apiError(getGeminiUserMessage(error), getGeminiErrorStatus(error));
  }
}
