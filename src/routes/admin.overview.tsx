import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Building2 } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { agencyOverviewQuery } from "@/lib/estate-queries";
import { formatCompact } from "@/lib/data";

export const Route = createFileRoute("/admin/overview")({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(agencyOverviewQuery());
  },
  head: () => ({
    meta: [
      { title: "Vue globale NOVARYS — toutes les agences" },
      {
        name: "description",
        content:
          "Vue interne consolidée : prospects, dépenses publicitaires, rendez-vous, taux de conversion et chiffre d'affaires par agence.",
      },
      { property: "og:title", content: "Vue globale NOVARYS — toutes les agences" },
      {
        property: "og:description",
        content: "Performance comparée de toutes les agences Novarys Estate.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AdminOverview,
});

function AdminOverview() {
  const { data: rows } = useSuspenseQuery(agencyOverviewQuery());

  const totals = rows.reduce(
    (acc, r) => ({
      leads: acc.leads + r.leads,
      spend: acc.spend + r.spend,
      appointments: acc.appointments + r.appointments,
      revenue: acc.revenue + r.revenue,
      won: acc.won + Math.round((r.conversion / 100) * r.leads),
    }),
    { leads: 0, spend: 0, appointments: 0, revenue: 0, won: 0 },
  );
  const conversion = totals.leads ? (totals.won / totals.leads) * 100 : 0;

  const cards = [
    { label: "Prospects (toutes agences)", value: `${totals.leads}`, delta: `${rows.length} agence(s)` },
    {
      label: "Dépense publicitaire",
      value: formatCompact(totals.spend),
      delta: totals.leads ? `${formatCompact(Math.round(totals.spend / totals.leads))} / prospect` : "—",
    },
    {
      label: "Rendez-vous",
      value: `${totals.appointments}`,
      delta: totals.appointments
        ? `${formatCompact(Math.round(totals.spend / totals.appointments))} / RDV`
        : "hors annulés",
    },
    { label: "CA généré", value: formatCompact(totals.revenue), delta: `${totals.won} vente(s)` },
    { label: "Taux de conversion", value: `${conversion.toFixed(1)} %`, delta: "moyenne consolidée" },
  ];

  return (
    <AppShell
      title="Vue globale NOVARYS"
      subtitle="Usage interne — performance consolidée de toutes les agences"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl border border-border bg-card p-5">
            <p className="font-display text-3xl">{c.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{c.label}</p>
            <p className="mt-3 text-xs font-medium text-accent">{c.delta}</p>
          </div>
        ))}
      </div>

      <section className="mt-6 rounded-xl border border-border bg-card p-6">
        <div className="mb-5">
          <h2 className="text-lg">Détail par agence</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Indicateurs calculés à partir des prospects, dépenses et rendez-vous réels.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="py-3 pr-4 font-medium">Agence</th>
                <th className="py-3 pr-4 text-right font-medium">Prospects</th>
                <th className="py-3 pr-4 text-right font-medium">Dépenses pub</th>
                <th className="py-3 pr-4 text-right font-medium">Coût / prospect</th>
                <th className="py-3 pr-4 text-right font-medium">RDV</th>
                <th className="py-3 pr-4 text-right font-medium">Coût / RDV</th>
                <th className="py-3 pr-4 text-right font-medium">Conversion</th>
                <th className="py-3 text-right font-medium">CA généré</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-border/60 last:border-0">
                  <td className="py-3 pr-4">
                    <span className="flex items-center gap-2">
                      <Building2 className="size-4 text-muted-foreground" />
                      {r.name}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-right">{r.leads}</td>
                  <td className="py-3 pr-4 text-right">{formatCompact(r.spend)}</td>
                  <td className="py-3 pr-4 text-right">{formatCompact(Math.round(r.costPerLead))}</td>
                  <td className="py-3 pr-4 text-right">{r.appointments}</td>
                  <td className="py-3 pr-4 text-right">
                    {formatCompact(Math.round(r.costPerAppointment))}
                  </td>
                  <td className="py-3 pr-4 text-right">{r.conversion.toFixed(1)} %</td>
                  <td className="py-3 text-right">{formatCompact(r.revenue)}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-6 text-center text-sm text-muted-foreground">
                    Aucune agence enregistrée.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </AppShell>
  );
}
