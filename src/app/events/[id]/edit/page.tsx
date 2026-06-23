"use client";

import { use } from "react";
import { EventEditPage } from "./EventEditPage";

type PageProps = { params: Promise<{ id: string }> };

export default function EditEventPage({ params }: PageProps) {
  const { id } = use(params);
  return <EventEditPage id={id} />;
}
