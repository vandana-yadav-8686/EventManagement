"use client";

import { useState } from "react";
import Link from "next/link";
import { regenerateEventContent } from "@/lib/api-client";
import { exportEventToPdf } from "@/lib/export-pdf";
import type { SerializedEvent } from "@/lib/models/Event";
import { Alert } from "@/components/Alert";
import { Loader } from "@/components/Loader";

interface EventDetailClientProps {
  event: SerializedEvent;
}

export function EventDetailClient({ event: initialEvent }: EventDetailClientProps) {
  const [event, setEvent] = useState(initialEvent);
  const [isGenerating, setIsGenerating] = useState(false);
  const [actionMessage, setActionMessage] = useState("");

  const handleRegenerate = async () => {
    setIsGenerating(true);
    setActionMessage("");

    const result = await regenerateEventContent(event.id);
    setIsGenerating(false);

    if (!result.event?.id) {
      setActionMessage(result.message || "Failed to regenerate AI content.");
      return;
    }

    setEvent(result.event);
    setActionMessage("AI content regenerated and saved.");
  };

  const handleExportPdf = async () => {
    await exportEventToPdf(event);
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            href="/"
            className="text-sm font-medium text-primary hover:underline"
          >
            ← Back to dashboard
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-foreground">{event.eventName}</h1>
          <p className="mt-1 text-sm text-muted">{event.eventDateFormatted}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleExportPdf}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium transition hover:bg-card"
          >
            Export PDF
          </button>

          <Link
            href={`/events/${event.id}/edit`}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-[var(--primary-hover)]"
          >
            Edit Event
          </Link>
        </div>
      </div>

      {actionMessage && (
        <Alert
          variant={actionMessage.includes("Failed") || actionMessage.includes("quota") ? "error" : "success"}
          message={actionMessage}
          onDismiss={() => setActionMessage("")}
        />
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
            Speaker Details
          </h2>
          <p className="mt-3 text-lg font-semibold text-foreground">{event.speakerName}</p>
          <p className="mt-1 text-sm text-muted">{event.speakerDesignation}</p>
        </section>

        <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
            Event Info
          </h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Created</dt>
              <dd className="text-foreground">
                {new Date(event.createdAt).toLocaleDateString("en-IN")}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Last updated</dt>
              <dd className="text-foreground">
                {new Date(event.updatedAt).toLocaleDateString("en-IN")}
              </dd>
            </div>
          </dl>
        </section>

        {event.description && (
          <section className="rounded-xl border border-border bg-card p-6 shadow-sm lg:col-span-2">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
              About the Event
            </h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-foreground">
              {event.description}
            </p>
          </section>
        )}

        {event.speakerIntro && (
          <section className="rounded-xl border border-border bg-card p-6 shadow-sm lg:col-span-2">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
              Speaker Introduction
            </h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-foreground">
              {event.speakerIntro}
            </p>
          </section>
        )}

        {!event.description && !event.speakerIntro && (
          <section className="rounded-xl border border-dashed border-border bg-background p-6 text-center lg:col-span-2">
            <p className="text-sm text-muted">
              No AI-generated content yet.
            </p>
          </section>
        )}
      </div>
    </div>
  );
}
