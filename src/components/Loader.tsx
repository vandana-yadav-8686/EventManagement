export function Loader({
  label = "Loading...",
  inline = false,
}: {
  label?: string;
  inline?: boolean;
}) {
  if (inline) {
    return (
      <span className="inline-flex items-center gap-2 text-inherit" role="status" aria-live="polite">
        <span className="loader-inline" aria-hidden="true" />
        <span className="sr-only">{label}</span>
      </span>
    );
  }

  return (
    <div
      className="flex flex-col items-center justify-center py-16 text-muted"
      role="status"
      aria-live="polite"
    >
      <div className="loader" aria-hidden="true" />
      <p className="mt-4 text-sm">{label}</p>
    </div>
  );
}

/** Alias for Loader */
export const DotsLoader = Loader;
export const LoadingSpinner = Loader;
