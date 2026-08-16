import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { GripVertical } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { PIPELINE_STAGES, formatCompact, leads, type Lead, type PipelineStage } from "@/lib/data";

export const Route = createFileRoute("/pipeline")({
  head: () => ({
    meta: [
      { title: "Pipeline commercial — Novarys Estate" },
      {
        name: "description",
        content:
          "Kanban commercial : déplacez vos prospects de la qualification à la signature, avec score IA et budget sur chaque carte.",
      },
      { property: "og:title", content: "Pipeline commercial — Novarys Estate" },
      {
        property: "og:description",
        content: "Suivi visuel des prospects immobiliers, de la qualification à la vente.",
      },
    ],
  }),
  component: Pipeline,
});

function Pipeline() {
  const [items, setItems] = useState<Lead[]>(leads);
  const [dragging, setDragging] = useState<string | null>(null);

  const move = (id: string, stage: PipelineStage) => {
    setItems((prev) => prev.map((l) => (l.id === id ? { ...l, stage } : l)));
    const lead = items.find((l) => l.id === id);
    if (lead && lead.stage !== stage) toast.success(`${lead.name} déplacé vers « ${stage} »`);
  };

  return (
    <AppShell
      title="Pipeline"
      subtitle="Glissez une carte d'une colonne à l'autre pour faire avancer un prospect"
    >
      <div className="-mx-5 overflow-x-auto px-5 pb-4 sm:-mx-8 sm:px-8">
        <div className="flex min-w-max gap-4">
          {PIPELINE_STAGES.map((stage) => {
            const cards = items.filter((l) => l.stage === stage);
            const total = cards.reduce((sum, c) => sum + c.budget, 0);
            return (
              <div
                key={stage}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  if (dragging) move(dragging, stage);
                  setDragging(null);
                }}
                className="flex w-72 shrink-0 flex-col rounded-xl border border-border bg-secondary/40 p-3"
              >
                <div className="flex items-center justify-between px-1 pb-3">
                  <p className="text-sm font-semibold">{stage}</p>
                  <span className="rounded-full bg-card px-2 py-0.5 text-xs text-muted-foreground">
                    {cards.length}
                  </span>
                </div>
                <p className="px-1 pb-3 text-[11px] text-muted-foreground">
                  Valeur : {formatCompact(total)} FCFA
                </p>

                <div className="flex flex-col gap-3">
                  {cards.map((l) => (
                    <article
                      key={l.id}
                      draggable
                      onDragStart={() => setDragging(l.id)}
                      onDragEnd={() => setDragging(null)}
                      className={`cursor-grab rounded-lg border border-border bg-card p-4 shadow-soft transition-all duration-300 hover:-translate-y-0.5 active:cursor-grabbing ${
                        dragging === l.id ? "opacity-50" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          to="/leads/$id"
                          params={{ id: l.id }}
                          className="text-sm font-medium hover:underline"
                        >
                          {l.name}
                        </Link>
                        <GripVertical className="size-4 shrink-0 text-muted-foreground" />
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {l.project} · {l.propertyType}
                      </p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-sm font-medium">{formatCompact(l.budget)}</span>
                        <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-semibold">
                          {l.score}/100
                        </span>
                      </div>
                    </article>
                  ))}
                  {cards.length === 0 && (
                    <div className="rounded-lg border border-dashed border-border py-8 text-center text-xs text-muted-foreground">
                      Déposez un prospect ici
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
