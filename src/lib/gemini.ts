import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

export interface GeneratedEventContent {
  description: string;
  speakerIntro: string;
}

const MODELS = [
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
  "gemini-1.5-flash",
] as const;

function buildPrompt(input: {
  eventName: string;
  eventDate: string;
  speakerName: string;
  speakerDesignation: string;
}) {
  return `Write professional content for a medical conference event page.

Event Name: ${input.eventName}
Event Date: ${input.eventDate}
Speaker Name: ${input.speakerName}
Speaker Designation: ${input.speakerDesignation}

Return JSON with:
- "description": 2-3 paragraphs about the event (topics, importance, audience)
- "speakerIntro": ~100 words introducing the speaker`;
}

function parseGeneratedJson(text: string): GeneratedEventContent {
  const cleaned = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Could not parse AI response. Please try again.");
  }

  const parsed = JSON.parse(jsonMatch[0]) as GeneratedEventContent;

  if (!parsed.description?.trim() || !parsed.speakerIntro?.trim()) {
    throw new Error("AI response was incomplete. Please try again.");
  }

  return {
    description: parsed.description.trim(),
    speakerIntro: parsed.speakerIntro.trim(),
  };
}

function getErrorStatus(error: unknown): number | undefined {
  if (error && typeof error === "object" && "status" in error) {
    return Number((error as { status: number }).status);
  }
  return undefined;
}

function isQuotaError(message: string, status?: number): boolean {
  return status === 429 || message.includes("429") || message.includes("quota");
}

export function getGeminiUserMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  const status = getErrorStatus(error);

  if (message.includes("GEMINI_API_KEY") || message.includes("not configured")) {
    return "AI is not configured. Add GEMINI_API_KEY to your .env file and restart the server.";
  }
  if (isQuotaError(message, status)) {
    return "Gemini free-tier quota is used up. New API keys on the same Google project share the same limit — wait and try later, or enable billing in Google AI Studio.";
  }
  if (
    status === 400 ||
    status === 401 ||
    status === 403 ||
    message.includes("API key not valid")
  ) {
    return "Invalid Gemini API key. Copy the full key from Google AI Studio into .env and restart npm run dev.";
  }
  if (status === 404 || message.includes("not found")) {
    return "Gemini model is temporarily unavailable. Please try again later.";
  }

  return message || "Failed to generate AI content. Please try again.";
}

export function getGeminiErrorStatus(error: unknown): number {
  const message = error instanceof Error ? error.message : String(error);
  const status = getErrorStatus(error);

  if (message.includes("not configured")) return 503;
  if (isQuotaError(message, status)) return 429;
  if (status === 400 || status === 401 || status === 403) return 502;
  if (status === 404) return 502;
  return 500;
}

async function callModel(
  genAI: GoogleGenerativeAI,
  modelName: string,
  prompt: string
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({
      model: modelName,
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            description: { type: SchemaType.STRING },
            speakerIntro: { type: SchemaType.STRING },
          },
          required: ["description", "speakerIntro"],
        },
      },
    });
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    if (text?.trim()) return text;
  } catch (jsonModeError) {
    const msg = jsonModeError instanceof Error ? jsonModeError.message : String(jsonModeError);
    const status = getErrorStatus(jsonModeError);
    if (isQuotaError(msg, status) || msg.includes("API key not valid")) {
      throw jsonModeError;
    }
    console.warn(`[Gemini] ${modelName} json mode:`, msg.slice(0, 200));
  }

  const model = genAI.getGenerativeModel({ model: modelName });
  const result = await model.generateContent(
    `${prompt}\n\nRespond with only valid JSON, no markdown.`
  );
  const text = result.response.text();
  if (!text?.trim()) throw new Error("Empty AI response");
  return text;
}

export async function generateEventContent(input: {
  eventName: string;
  eventDate: string;
  speakerName: string;
  speakerDesignation: string;
}): Promise<GeneratedEventContent> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured. Add your key to .env");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const prompt = buildPrompt(input);
  const errorLog: string[] = [];

  for (const modelName of MODELS) {
    try {
      const text = await callModel(genAI, modelName, prompt);
      return parseGeneratedJson(text);
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      console.warn(`[Gemini] ${modelName} failed:`, msg.slice(0, 200));
      errorLog.push(msg);
    }
  }

  const combined = errorLog.join(" ");
  if (isQuotaError(combined)) {
    throw new Error(
      "Gemini free-tier quota is used up. New API keys on the same Google project share the same limit — wait and try later, or enable billing in Google AI Studio."
    );
  }
  if (combined.includes("API key not valid") || combined.includes("API_KEY_INVALID")) {
    throw new Error(
      "Invalid Gemini API key. Copy the full key from Google AI Studio into .env and restart npm run dev."
    );
  }

  throw new Error("Gemini could not generate content. Please try again later.");
}
