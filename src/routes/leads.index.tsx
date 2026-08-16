import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowUpDown, Search } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { leads, type Lead, type LeadStatus } from "@/lib/data";

export const Route = createFileRoute("/leads/")({
  head: () => ({
    meta: [
      { title: "Prospects — Novarys Estate CRM" },
      {
        name: "description",
        content:
          "Gestion CRM des prospects immobiliers : score IA, budget, zone, statut et date de création, avec recherche, filtres et tri.",
      },
      { property: "og:title", content: "AI Leads — Novarys Estate" },
      {
        property: "og:description",
        content: "Tous vos prospects qualifiés automatiquement, dans une seule table.",
      },
    ],
  }),
  component: LeadsPage,
});

const STATUSES: LeadStatus[] = [
  "New",
  "Qualified",
  "Hot",
  "Contacted",
  "Visit Scheduled",
  "Negotiation",
  "Won",
];

export function StatusBadge({ status }: { status: LeadStatus }) {
  const tone: Record<LeadStatus, string> = {
    New: "bg-secondary text-secondary-foreground",
    Qualified: "bg-success/15 text-success",
    Hot: "bg-destructive/12 text-destructive",
    Contacted: "bg-accent/18 text-accent-foreground",
    "Visit Scheduled": "bg-chart-3/18 text-foreground",
    Negotiation: "bg-warning/20 text-warning-foreground",
    Won: "bg-foreground text-background",
  };
  return (
    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${tone[status]}`}>
      {status}
    </span>
  );
}

export function ScoreBar({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-12 font-medium tabular-nums">{score}/100</span>
      <span className="h-1.5 w-14 overflow-hidden rounded-full bg-secondary">
        <span
          className="block h-full rounded-full bg-accent"
          style={{ width: `${score}%` }}
        />
      </span>
    </div>
  );
}

type SortKey = "score" | "date" | "budget" | "name";
const PAGE_SIZE = 6;

function LeadsPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<LeadStatus | "Tous">("Tous");
  const [sort, setSort] = useState<SortKey>("score");
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = leads.filter((l) => {
      if (status !== "Tous" && l.status !== status) return false;
      if (q && !`${l.name} ${l.location} ${l.propertyType} ${l.project}`.toLowerCase().includes(q))
        return false;
      return true;
    });
    const sorters: Record<SortKey, (a: Lead, b: Lead) => number> = {
      score: (a, b) => b.score - a.score,
      date: (a, b) => b.date.localeCompare(a.date),
      budget: (a, b) => b.budget - a.budget,
      name: (a, b) => a.name.localeCompare(b.name),
    };
    return [...list].sort(sorters[sort]);
  }, [query, status, sort]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pages - 1);
  const rows = filtered.slice(current * PAGE_SIZE, current * PAGE_SIZE + PAGE_SIZE);

  return (
    <AppShell title="AI Leads" subtitle={`${leads.length} prospects qualifiés automatiquement`}>
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(0);
            }}
            placeholder="Rechercher un prospect…"
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {(["Tous", ...STATUSES] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                setStatus(s);
                setPage(0);
              }}
              className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                status === s
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <Button
          variant="quiet"
          size="sm"
          onClick={() =>
            setSort((s) =>
              s === "score" ? "date" : s === "date" ? "budget" : s === "budget" ? "name" : "score",
            )
          }
        >
          <ArrowUpDown className="size-4" /> Tri : {sort}
        </Button>
      </div>

      <div className="mt-5 overflow-hidden rounded-xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-sm">
            <thead className="bg-secondary/60 text-left text-xs text-muted-foreground">
              <tr>
                {["Name", "Project", "Budget", "Location", "Property type", "Lead score", "Status", "Date"].map(
                  (h) => (
                    <th key={h} className="px-4 py-3 font-medium">
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((l) => (
                <tr key={l.id} className="transition-colors hover:bg-secondary/40">
                  <td className="px-4 py-3">
                    <Link to="/leads/$id" params={{ id: l.id }} className="font-medium hover:underline">
                      {l.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{l.project}</td>
                  <td className="px-4 py-3 tabular-nums">{l.budgetLabel}</td>
                  <td className="px-4 py-3 text-muted-foreground">{l.location}</td>
                  <td className="px-4 py-3 text-muted-foreground">{l.propertyType}</td>
                  <td className="px-4 py-3">
                    <ScoreBar score={l.score} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={l.status} />
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(l.date).toLocaleDateString("fr-FR")}
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">
                    Aucun prospect ne correspond à cette recherche.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <p className="text-muted-foreground">
          {filtered.length} résultat{filtered.length > 1 ? "s" : ""} · page {current + 1}/{pages}
        </p>
        <div className="flex gap-2">
          <Button
            variant="quiet"
            size="sm"
            disabled={current === 0}
            onClick={() => setPage(current - 1)}
          >
            Précédent
          </Button>
          <Button
            variant="quiet"
            size="sm"
            disabled={current >= pages - 1}
            onClick={() => setPage(current + 1)}
          >
            Suivant
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
