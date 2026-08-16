import { createFileRoute } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppShell } from "@/components/app-shell";
import { Panel, tooltipStyle } from "@/routes/dashboard";
import {
  chartColors,
  chartPalette,
  leadsGenerated,
  propertyInterest,
  qualificationFunnel,
  requestedBudgets,
  requestedLocations,
  trafficData,
  trafficSources,
} from "@/lib/data";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — Novarys Estate" },
      {
        name: "description",
        content:
          "Performances commerciales : visiteurs, leads, qualification, rendez-vous, taux de conversion, biens et zones les plus demandés.",
      },
      { property: "og:title", content: "Analytics — Novarys Estate" },
      {
        property: "og:description",
        content: "Analyse complète de la performance commerciale d'une agence immobilière.",
      },
    ],
  }),
  component: Analytics,
});

const TOP_KPIS = [
  { label: "Visitors", value: "1 248" },
  { label: "Leads", value: "186" },
  { label: "Qualified leads", value: "72" },
  { label: "Appointments", value: "24" },
  { label: "Conversion rate", value: "5,8 %" },
];

const TOP_PROPERTIES = [
  { name: "Appartement Premium Riviera 2", value: 42 },
  { name: "Villa Contemporaine Riviera 3", value: 31 },
  { name: "Villa Duplex Cocody Angré", value: 24 },
  { name: "Plateau Business Center", value: 18 },
];

function Analytics() {
  return (
    <AppShell title="Analytics" subtitle="Performance commerciale — 30 derniers jours">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {TOP_KPIS.map((k) => (
          <div key={k.label} className="rounded-xl border border-border bg-card p-5">
            <p className="font-display text-3xl">{k.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{k.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel title="Website traffic" subtitle="Visiteurs par jour">
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={trafficData}>
              <defs>
                <linearGradient id="aTraffic" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={chartColors.teal} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={chartColors.teal} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis tickLine={false} axisLine={false} fontSize={12} width={34} />
              <Tooltip {...tooltipStyle} />
              <Area type="monotone" dataKey="visitors" stroke={chartColors.teal} fill="url(#aTraffic)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Lead generation" subtitle="Leads créés par mois">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={leadsGenerated}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis tickLine={false} axisLine={false} fontSize={12} width={34} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="leads" radius={[6, 6, 0, 0]} fill={chartColors.ink} />
            </BarChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Lead qualification" subtitle="Entonnoir de conversion">
          <div className="space-y-3">
            {qualificationFunnel.map((s, i) => (
              <div key={s.step}>
                <div className="flex justify-between text-xs">
                  <span>{s.step}</span>
                  <span className="font-medium tabular-nums">{s.value}</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${(s.value / qualificationFunnel[0]!.value) * 100}%`,
                      background: chartPalette[i % chartPalette.length],
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <LineChart data={leadsGenerated}>
              <Tooltip {...tooltipStyle} />
              <Line type="monotone" dataKey="qualified" stroke={chartColors.bronze} strokeWidth={2.5} dot={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={11} />
            </LineChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Traffic sources" subtitle="Répartition des visiteurs">
          <div className="flex items-center gap-6">
            <ResponsiveContainer width="55%" height={220}>
              <PieChart>
                <Pie
                  data={trafficSources}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={52}
                  outerRadius={88}
                  paddingAngle={3}
                  stroke="none"
                >
                  {trafficSources.map((s, i) => (
                    <Cell key={s.name} fill={chartPalette[i % chartPalette.length]} />
                  ))}
                </Pie>
                <Tooltip {...tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2.5 text-sm">
              {trafficSources.map((s, i) => (
                <div key={s.name} className="flex items-center gap-2">
                  <span
                    className="size-2.5 rounded-full"
                    style={{ background: chartPalette[i % chartPalette.length] }}
                  />
                  <span className="flex-1">{s.name}</span>
                  <span className="font-medium">{s.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </Panel>

        <Panel title="Property demand" subtitle="Demandes par type de bien">
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={propertyInterest} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
              <XAxis type="number" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis dataKey="type" type="category" tickLine={false} axisLine={false} fontSize={12} width={92} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="demandes" radius={[0, 6, 6, 0]} fill={chartColors.bronze} />
            </BarChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Most requested properties" subtitle="Biens les plus consultés">
          <div className="space-y-4">
            {TOP_PROPERTIES.map((p) => (
              <div key={p.name}>
                <div className="flex justify-between text-sm">
                  <span className="truncate pr-3">{p.name}</span>
                  <span className="font-medium tabular-nums">{p.value}</span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-secondary">
                  <div className="h-full rounded-full bg-foreground" style={{ width: `${(p.value / 42) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Most requested locations" subtitle="Zones les plus demandées">
          <div className="space-y-4">
            {requestedLocations.map((l) => (
              <div key={l.name} className="flex items-center gap-3">
                <span className="w-24 text-sm">{l.name}</span>
                <span className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                  <span className="block h-full rounded-full bg-accent" style={{ width: `${(l.value / 38) * 100}%` }} />
                </span>
                <span className="w-9 text-right text-sm font-medium">{l.value}%</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Most requested budgets" subtitle="Tranches budgétaires demandées">
          <div className="space-y-4">
            {requestedBudgets.map((b, i) => (
              <div key={b.name} className="flex items-center gap-3">
                <span className="w-44 text-sm">{b.name}</span>
                <span className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                  <span
                    className="block h-full rounded-full"
                    style={{
                      width: `${(b.value / 34) * 100}%`,
                      background: chartPalette[i % chartPalette.length],
                    }}
                  />
                </span>
                <span className="w-9 text-right text-sm font-medium">{b.value}%</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}
