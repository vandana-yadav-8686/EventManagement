import type { SerializedEvent } from "@/lib/models/Event";

export function exportEventToPdf(event: SerializedEvent) {
  // Dynamic import keeps initial bundle smaller
  return import("@/lib/pdf-export").then((mod) => mod.exportEventToPdf(event));
}
