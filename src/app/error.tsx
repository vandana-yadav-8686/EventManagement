"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-10 text-center">
      <h2 className="text-lg font-semibold text-red-800">Something went wrong</h2>
      <p className="mt-2 text-sm text-red-700">
        The page could not load. This can happen after code changes — try again.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-[var(--primary-hover)]"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-foreground hover:bg-background"
        >
          Go to dashboard
        </Link>
      </div>
    </div>
  );
}
