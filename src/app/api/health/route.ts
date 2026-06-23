import { connectDB, getMongoErrorMessage } from "@/lib/db";
import { apiError, apiSuccess } from "@/lib/api-utils";

export async function GET() {
  try {
    await connectDB();
    return apiSuccess({
      status: "ok",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[GET /api/health]", error);
    return apiError(getMongoErrorMessage(error), 503);
  }
}
