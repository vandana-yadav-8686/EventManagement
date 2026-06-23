"use client";

import { use } from "react";
import { EventViewPage } from "./EventViewPage";

type PageProps = { params: Promise<{ id: string }> };

export default function EventDetailPage({ params }: PageProps) {
  const { id } = use(params);
  return <EventViewPage id={id} />;
}
