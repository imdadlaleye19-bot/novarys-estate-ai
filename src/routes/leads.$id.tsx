import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarClock, Check, MessageCircle, Phone, RefreshCw, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { PropertyCard } from "@/components/property-card";
import { StatusBadge } from "@/routes/leads.index";
import { getLead, getProperty, type LeadStatus } from "@/lib/data";

export const Route = createFileRoute("/leads/$id")({
  loader: ({ params }) => {
    const lead = getLead(params.id);
    if (!lead) throw notFound();
    return { lead };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Prospect introuvable — Novarys Estate" }, { name: "robots", content: "noindex" }],
      };
    }
    const { lead } = loaderData;
    const description = `${lead.name} — ${lead.project} ${lead.propertyType} à ${lead.location}, score IA ${lead.score}/100.`;
    return {
      meta: [
        { title: `${lead.name} — Prospect Novarys Estate` },
        { name: "description", content: description },
        { property: "og:title", content: `${lead.name} — Prospect Novarys Estate` },
        { property: "og:description", content: description },
      ],
    };
  },
  component: LeadDetail,
});

const NEXT_STATUS: Record<LeadStatus, LeadStatus> = {
  New: "Qualified",
  Qualified: "Contacted",
  Hot: "Visit Scheduled",
  Contacted: "Visit Scheduled",
  "Visit Scheduled": "Negotiation",
  Negotiation: "Won",
  Won: "Won",
};

function LeadDetail() {
  const { lead } = Route.useLoaderData();
  const [status, setStatus] = useState<LeadStatus>(lead.status);

  const matched = lead.matches
    .map((id) => getProperty(id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <AppShell
      title={lead.name}
      subtitle={`${lead.project} · ${lead.propertyType} · ${lead.location}`}
      actions={
        <Button asChild variant="quiet" size="sm">
          <Link to="/leads">← Tous les prospects</Link>
        </Button>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          {/* Profile */}
          <section className="rounded-xl border border-border bg-card p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="eyebrow text-muted-foreground">Lead score</p>
                <p className="mt-1 font-display text-4xl">{lead.score}/100</p>
              </div>
              <StatusBadge status={status} />
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-secondary">
              <div className="h-full rounded-full bg-accent" style={{ width: `${lead.score}%` }} />
            </div>

            <dl className="mt-7 grid gap-5 sm:grid-cols-3">
              <Info label="Project" value={lead.project} />
              <Info label="Budget" value={lead.budgetLabel} />
              <Info label="Location" value={lead.location} />
              <Info label="Bedrooms" value={lead.bedrooms ? `${lead.bedrooms}` : "Sans objet"} />
              <Info label="Move-in" value={lead.moveIn} />
              <Info label="Source" value={lead.source} />
              <Info label="Téléphone" value={lead.phone} />
              <Info label="Email" value={lead.email} />
              <Info label="Créé le" value={new Date(lead.date).toLocaleDateString("fr-FR")} />
            </dl>
          </section>

          {/* AI summary */}
          <section className="surface-ink rounded-xl p-6">
            <p className="flex items-center gap-2 text-sm font-semibold text-sidebar-primary">
              <Sparkles className="size-4" /> AI Summary
            </p>
            <p className="mt-3 text-sm leading-relaxed opacity-85">{lead.aiSummary}</p>
          </section>

          {/* Matches */}
          <section>
            <h2 className="text-lg">Biens correspondants</h2>
            <div className="mt-4 grid gap-6 sm:grid-cols-2">
              {matched.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          </section>
        </div>

        {/* Actions + timeline */}
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-xl border border-border bg-card p-6">
            <p className="text-sm font-semibold">Actions</p>
            <div className="mt-4 flex flex-col gap-2.5">
              <Button
                variant="accent"
                onClick={() => toast.success(`Message WhatsApp envoyé à ${lead.name}`, { description: "Démonstration." })}
              >
                <MessageCircle className="size-4" /> WhatsApp
              </Button>
              <Button variant="quiet" onClick={() => toast.success(`Appel lancé vers ${lead.phone}`)}>
                <Phone className="size-4" /> Call
              </Button>
              <Button variant="quiet" onClick={() => toast.success("Visite programmée", { description: "Créneau ajouté à l'agenda de l'agence." })}>
                <CalendarClock className="size-4" /> Schedule visit
              </Button>
              <Button
                variant="hero"
                onClick={() => {
                  const next = NEXT_STATUS[status];
                  setStatus(next);
                  toast.success(`Statut mis à jour : ${next}`);
                }}
              >
                <RefreshCw className="size-4" /> Change status
              </Button>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <p className="text-sm font-semibold">Timeline</p>
            <ol className="mt-5 space-y-5">
              {lead.timeline.map((t) => (
                <li key={t.label} className="flex gap-3">
                  <span
                    className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full text-[10px] ${
                      t.done ? "bg-foreground text-background" : "border border-dashed border-border text-muted-foreground"
                    }`}
                  >
                    {t.done ? <Check className="size-3" /> : "•"}
                  </span>
                  <div>
                    <p className="text-sm">{t.label}</p>
                    <p className="text-xs text-muted-foreground">{t.date}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-sm font-medium">{value}</dd>
    </div>
  );
}
