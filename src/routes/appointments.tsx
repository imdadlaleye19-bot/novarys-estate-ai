import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { CalendarCheck } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import {
  AppointmentBadge,
  AppointmentQuickActions,
  formatSlot,
} from "@/components/appointment-actions";
import {
  appointmentsQuery,
  leadsQuery,
  type AppointmentRow,
  type AppointmentStatus,
} from "@/lib/estate-queries";

export const Route = createFileRoute("/appointments")({
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(appointmentsQuery()),
      context.queryClient.ensureQueryData(leadsQuery()),
    ]);
  },
  head: () => ({
    meta: [
      { title: "Rendez-vous — Novarys Estate" },
      {
        name: "description",
        content:
          "Agenda des rendez-vous prospects de l'agence : aujourd'hui, cette semaine et à venir, avec suivi des statuts.",
      },
      { property: "og:title", content: "Rendez-vous — Novarys Estate" },
      {
        property: "og:description",
        content: "Planifiez et suivez les visites et rendez-vous de vos prospects.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AppointmentsPage,
});

function startOfDay(d: Date) {
  const c = new Date(d);
  c.setHours(0, 0, 0, 0);
  return c;
}

function groupOf(iso: string) {
  const now = new Date();
  const today = startOfDay(now);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const weekEnd = new Date(today);
  weekEnd.setDate(weekEnd.getDate() + 7);
  const d = new Date(iso);
  if (d < tomorrow) return "today" as const;
  if (d < weekEnd) return "week" as const;
  return "later" as const;
}

const GROUPS = [
  { key: "today", label: "Aujourd'hui" },
  { key: "week", label: "Cette semaine" },
  { key: "later", label: "Plus tard" },
] as const;

function AppointmentsPage() {
  const { data: appointments } = useSuspenseQuery(appointmentsQuery());
  const { data: leads } = useSuspenseQuery(leadsQuery());
  const queryClient = useQueryClient();
  const update = useServerFn(
    (await0 => await0) as never,
  ) as never;

  return (
    <AppShell title="Rendez-vous" subtitle="Agenda des visites et échanges prospects">
      <Inner appointments={appointments} leads={leads} queryClient={queryClient} />
      {void update}
    </AppShell>
  );
}

function Inner({
  appointments,
  leads,
  queryClient,
}: {
  appointments: AppointmentRow[];
  leads: { id: string; name: string }[];
  queryClient: ReturnType<typeof useQueryClient>;
}) {
  const nameFor = (id: string | null) =>
    leads.find((l) => l.id === id)?.name ?? "Prospect inconnu";

  const sorted = [...appointments].sort((a, b) =>
    a.scheduled_at.localeCompare(b.scheduled_at),
  );

  return (
    <div className="space-y-8">
      {GROUPS.map(({ key, label }) => {
        const rows = sorted.filter((a) => groupOf(a.scheduled_at) === key);
        return (
          <section key={key}>
            <h2 className="flex items-center gap-2 text-lg">
              <CalendarCheck className="size-4 text-accent" /> {label}
              <span className="text-sm text-muted-foreground">({rows.length})</span>
            </h2>
            <div className="mt-4 divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
              {rows.map((a) => (
                <Row
                  key={a.id}
                  appointment={a}
                  leadName={nameFor(a.lead_id)}
                  queryClient={queryClient}
                />
              ))}
              {rows.length === 0 && (
                <p className="px-5 py-8 text-center text-sm text-muted-foreground">
                  Aucun rendez-vous.
                </p>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function Row({
  appointment,
  leadName,
  queryClient,
}: {
  appointment: AppointmentRow;
  leadName: string;
  queryClient: ReturnType<typeof useQueryClient>;
}) {
  const mutation = useStatusMutation(queryClient);
  return (
    <div className="flex flex-wrap items-center gap-4 px-5 py-4">
      <div className="min-w-0 flex-1">
        {appointment.lead_id ? (
          <Link
            to="/leads/$id"
            params={{ id: appointment.lead_id }}
            className="text-sm font-medium underline-offset-4 hover:underline"
          >
            {leadName}
          </Link>
        ) : (
          <p className="text-sm font-medium">{leadName}</p>
        )}
        <p className="mt-0.5 text-xs text-muted-foreground">
          {formatSlot(appointment.scheduled_at)} · {appointment.duration_minutes} min
          {appointment.notes ? ` · ${appointment.notes}` : ""}
        </p>
      </div>
      <AppointmentBadge status={appointment.status} />
      <AppointmentQuickActions
        status={appointment.status}
        disabled={mutation.isPending}
        onChange={(next) => mutation.mutate({ id: appointment.id, status: next })}
      />
    </div>
  );
}

export function useStatusMutation(queryClient: ReturnType<typeof useQueryClient>) {
  const update = useServerFn(updateAppointmentStatus);
  return useMutation({
    mutationFn: (input: { id: string; status: AppointmentStatus }) =>
      update({ data: input }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast.success("Statut du rendez-vous mis à jour");
    },
    onError: () => toast.error("Mise à jour impossible pour le moment."),
  });
}
