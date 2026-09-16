import type { AppointmentStatus } from "@/lib/estate-queries";

export const APPOINTMENT_LABELS: Record<AppointmentStatus, string> = {
  scheduled: "Programmé",
  confirmed: "Confirmé",
  completed: "Réalisé",
  cancelled: "Annulé",
  no_show: "No-show",
};

const TONES: Record<AppointmentStatus, string> = {
  scheduled: "border-border text-muted-foreground",
  confirmed: "border-accent/40 bg-accent/10 text-accent",
  completed: "border-foreground/20 bg-foreground text-background",
  cancelled: "border-destructive/30 bg-destructive/10 text-destructive",
  no_show: "border-destructive/30 text-destructive",
};

export function AppointmentBadge({ status }: { status: AppointmentStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium ${TONES[status]}`}
    >
      {APPOINTMENT_LABELS[status]}
    </span>
  );
}

const QUICK: AppointmentStatus[] = ["confirmed", "completed", "cancelled", "no_show"];

export function AppointmentQuickActions({
  status,
  disabled,
  onChange,
}: {
  status: AppointmentStatus;
  disabled?: boolean;
  onChange: (next: AppointmentStatus) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {QUICK.map((s) => (
        <button
          key={s}
          type="button"
          disabled={disabled || status === s}
          onClick={() => onChange(s)}
          className={`rounded-full border px-3 py-1.5 text-xs transition-colors disabled:opacity-40 ${
            status === s
              ? "border-foreground bg-foreground text-background"
              : "border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          {APPOINTMENT_LABELS[s]}
        </button>
      ))}
    </div>
  );
}

export function formatSlot(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("fr-FR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}
