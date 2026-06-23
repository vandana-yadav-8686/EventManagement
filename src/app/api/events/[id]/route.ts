import { NextRequest } from "next/server";
import {
  deleteEventRecord,
  formatZodErrors,
  getEventById,
  getMongoErrorMessage,
  parseEventInput,
  updateEventRecord,
} from "@/lib/events-service";
import { apiError, apiSuccess, isValidObjectId } from "@/lib/api-utils";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  if (!isValidObjectId(id)) {
    return apiError("Invalid event ID", 400);
  }

  try {
    const event = await getEventById(id);
    if (!event) {
      return apiError("Event not found", 404);
    }
    return apiSuccess(event);
  } catch (error) {
    console.error(`[GET /api/events/${id}]`, error);
    return apiError(getMongoErrorMessage(error), 500);
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  if (!isValidObjectId(id)) {
    return apiError("Invalid event ID", 400);
  }

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

    const event = await updateEventRecord(id, parsed.data);
    if (!event) {
      return apiError("Event not found", 404);
    }

    return apiSuccess(event);
  } catch (error) {
    console.error(`[PUT /api/events/${id}]`, error);
    return apiError(getMongoErrorMessage(error), 500);
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  if (!isValidObjectId(id)) {
    return apiError("Invalid event ID", 400);
  }

  try {
    const deleted = await deleteEventRecord(id);
    if (!deleted) {
      return apiError("Event not found", 404);
    }

    return apiSuccess({ id, message: "Event deleted successfully" });
  } catch (error) {
    console.error(`[DELETE /api/events/${id}]`, error);
    return apiError(getMongoErrorMessage(error), 500);
  }
}
