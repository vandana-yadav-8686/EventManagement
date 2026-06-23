type AlertVariant = "success" | "error" | "info";

const styles: Record<AlertVariant, string> = {
  success: "border-green-200 bg-green-50 text-green-800",
  error: "border-red-200 bg-red-50 text-red-800",
  info: "border-blue-200 bg-blue-50 text-blue-800",
};

interface AlertProps {
  variant: AlertVariant;
  message: string;
  onDismiss?: () => void;
}

export function Alert({ variant, message, onDismiss }: AlertProps) {
  return (
    <div
      role="alert"
      className={`mb-6 flex items-start justify-between rounded-lg border px-4 py-3 text-sm ${styles[variant]}`}
    >
      <span>{message}</span>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="ml-4 shrink-0 font-medium opacity-70 hover:opacity-100"
          aria-label="Dismiss"
        >
          ×
        </button>
      )}
    </div>
  );
}
