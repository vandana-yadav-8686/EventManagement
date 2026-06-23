"use client";

import { useState } from "react";
import Link from "next/link";
import type { SerializedEvent } from "@/lib/models/Event";
import { deleteEvent } from "@/lib/api-client";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";

function prefetchEvent(id: string) {
  fetch(`/api/events/${id}`, { priority: "low" } as RequestInit).catch(() => {});
}

interface EventTableProps {
  events: SerializedEvent[];
  onDeleted: (id: string) => void;
}

export function EventTable({ events, onDeleted }: EventTableProps) {
  const [deleteTarget, setDeleteTarget] = useState<SerializedEvent | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    setDeleteError("");

    const result = await deleteEvent(deleteTarget.id);
    setIsDeleting(false);

    if (!result.success) {
      setDeleteError(result.message || "Failed to delete event.");
      return;
    }

    onDeleted(deleteTarget.id);
    setDeleteTarget(null);
  };

  return (
    <>
      {deleteError && (
        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {deleteError}
        </p>
      )}

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-border bg-background">
              <tr>
                <th className="px-4 py-3 font-semibold text-foreground">Event Name</th>
                <th className="px-4 py-3 font-semibold text-foreground">Date</th>
                <th className="px-4 py-3 font-semibold text-foreground">Speaker</th>
                <th className="px-4 py-3 font-semibold text-foreground">Designation</th>
                <th className="px-4 py-3 font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {events.map((event) => (
                <tr key={event.id} className="transition hover:bg-background/60">
                  <td className="px-4 py-3 font-medium text-foreground">
                    {event.eventName}
                  </td>
                  <td className="px-4 py-3 text-muted">{event.eventDateFormatted}</td>
                  <td className="px-4 py-3 text-foreground">{event.speakerName}</td>
                  <td className="px-4 py-3 text-muted">{event.speakerDesignation}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/events/${event.id}`}
                        prefetch
                        onMouseEnter={() => prefetchEvent(event.id)}
                        onFocus={() => prefetchEvent(event.id)}
                        className="rounded-md border border-border px-2.5 py-1 text-xs font-medium text-foreground transition hover:bg-background"
                      >
                        View
                      </Link>
                      <Link
                        href={`/events/${event.id}/edit`}
                        prefetch
                        onMouseEnter={() => prefetchEvent(event.id)}
                        onFocus={() => prefetchEvent(event.id)}
                        className="rounded-md border border-border px-2.5 py-1 text-xs font-medium text-foreground transition hover:bg-background"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          setDeleteError("");
                          setDeleteTarget(event);
                        }}
                        className="rounded-md border border-red-200 px-2.5 py-1 text-xs font-medium text-danger transition hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <DeleteConfirmDialog
        eventName={deleteTarget?.eventName ?? ""}
        isOpen={!!deleteTarget}
        isDeleting={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}
