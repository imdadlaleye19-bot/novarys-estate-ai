import { createFileRoute, Link } from "@tanstack/react-router";
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
import { ArrowUpRight, Sparkles } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import {
  aiActivity,
  chartColors,
  chartPalette,
  kpis,
  leads,
  leadsGenerated,
  propertyInterest,
  trafficData,
  trafficSources,
} from "@/lib/data";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard agence — Novarys Estate" },
      {
        name: "description",
        content:
          "Vue d'ensemble de l'activité commerciale : visiteurs, nouveaux prospects, qualification IA, visites programmées et négociations en cours.",
      },
      { property: "og:title", content: "Dashboard agence — Novarys Estate" },
      {
        property: "og:description",
        content: "Pilotage complet de l'activité immobilière assistée par l'IA.",
      },
    ],
  }),
  component: Dashboard,
});

export function Panel({
  title,
  subtitle,
  children,
  className = "",
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-xl border border-border bg-card p-6 ${className}`}>
      <div className="mb-5">
        <h2 className="text-lg">{title}</h2>
        {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

export const tooltipStyle = {
  contentStyle: {
    borderRadius: 10,
    border: "1px solid var(--border)",
    background: "var(--card)",
    fontSize: 12,
  },
} as const;

function Dashboard() {
  const recentLeads = [...leads]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  return (
    <AppShell
      title="Good evening, Admin."
      subtitle="Agence Novarys Abidjan — activité des 30 derniers jours"
      actions={
        <Button asChild variant="hero" size="sm">
          <Link to="/leads">
            Voir les prospects <ArrowUpRight className="size-4" />
          </Link>
        </Button>
      }
    >
      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-xl border border-border bg-card p-5">
            <p className="font-display text-3xl">{k.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{k.label}</p>
            <p className="mt-3 text-xs font-medium text-accent">{k.delta}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Panel title="Leads generated" subtitle="Volume mensuel et part qualifiée" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={leadsGenerated}>
              <defs>
                <linearGradient id="gLeads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={chartColors.ink} stopOpacity={0.28} />
                  <stop offset="100%" stopColor={chartColors.ink} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis tickLine={false} axisLine={false} fontSize={12} width={32} />
              <Tooltip {...tooltipStyle} />
              <Area
                type="monotone"
                dataKey="leads"
                stroke={chartColors.ink}
                fill="url(#gLeads)"
                strokeWidth={2}
              />
              <Line type="monotone" dataKey="qualified" stroke={chartColors.bronze} strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Traffic sources" subtitle="Origine des visiteurs">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={trafficSources}
                dataKey="value"
                nameKey="name"
                innerRadius={58}
                outerRadius={92}
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
          <div className="mt-3 space-y-2 text-xs">
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
        </Panel>

        <Panel title="Lead qualification" subtitle="Scores IA par semaine">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={leadsGenerated}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis tickLine={false} axisLine={false} fontSize={12} width={32} />
              <Tooltip {...tooltipStyle} />
              <Line type="monotone" dataKey="qualified" stroke={chartColors.bronze} strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Property interest" subtitle="Demandes par type de bien">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={propertyInterest}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="type" tickLine={false} axisLine={false} fontSize={11} />
              <YAxis tickLine={false} axisLine={false} fontSize={12} width={32} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="demandes" radius={[6, 6, 0, 0]} fill={chartColors.ink} />
            </BarChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Website traffic" subtitle="Visiteurs des 7 derniers jours">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={trafficData}>
              <defs>
                <linearGradient id="gTraffic" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={chartColors.teal} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={chartColors.teal} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis tickLine={false} axisLine={false} fontSize={12} width={32} />
              <Tooltip {...tooltipStyle} />
              <Area type="monotone" dataKey="visitors" stroke={chartColors.teal} fill="url(#gTraffic)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </Panel>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Panel title="Derniers prospects" subtitle="Qualifiés automatiquement par l'IA">
          <div className="divide-y divide-border">
            {recentLeads.map((l) => (
              <Link
                key={l.id}
                to="/leads/$id"
                params={{ id: l.id }}
                className="flex items-center gap-4 py-3 transition-colors hover:bg-secondary/50"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{l.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {l.project} · {l.propertyType} · {l.location}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">{l.budgetLabel}</span>
                <span className="font-display text-lg">{l.score}</span>
              </Link>
            ))}
          </div>
        </Panel>

        <Panel title="AI Activity" subtitle="Actions automatiques récentes">
          <div className="space-y-4">
            {aiActivity.map((a) => (
              <div key={a.title + a.time} className="flex gap-3">
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary">
                  <Sparkles className="size-3.5 text-accent" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm">{a.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {a.detail} · {a.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}
