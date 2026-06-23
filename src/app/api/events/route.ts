import { NextRequest } from "next/server";
import { unstable_cache } from "next/cache";
import {
  createEventRecord,
  formatZodErrors,
  getMongoErrorMessage,
  listEvents,
  parseEventInput,
} from "@/lib/events-service";
import { apiError, apiSuccess } from "@/lib/api-utils";

const getCachedEvents = unstable_cache(
  async () => listEvents(),
  ["events-list"],
  { revalidate: 15, tags: ["events"] }
);

export async function GET() {
  try {
    const events = await getCachedEvents();
    return apiSuccess(events);
  } catch (error) {
    console.error("[GET /api/events]", error);
    return apiError(getMongoErrorMessage(error), 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return apiError("Invalid JSON in request body", 400);
    }

    const parsed = parseEventInput(body);
    if (!parsed.success) {
      return apiError("Validation failed", 400, formatZodErrors(parsed.error));
    }

    const event = await createEventRecord(parsed.data);
    return apiSuccess(event, 201);
  } catch (error) {
    console.error("[POST /api/events]", error);
    return apiError(getMongoErrorMessage(error), 500);
  }
}
