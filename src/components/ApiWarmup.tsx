"use client";

import { useEffect } from "react";

/** Warm MongoDB connection as soon as the app loads */
export function ApiWarmup() {
  useEffect(() => {
    fetch("/api/health", { priority: "low" } as RequestInit).catch(() => {});
  }, []);

  return null;
}
