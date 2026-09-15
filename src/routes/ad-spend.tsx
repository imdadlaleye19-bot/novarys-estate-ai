import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Megaphone, Plus } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { adSpendQuery } from "@/lib/estate-queries";
import { createAdSpend } from "@/lib/estate.functions";
import { formatCompact } from "@/lib/data";

export const Route = createFileRoute("/ad-spend")({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(adSpendQuery());
  },
  head: () => ({
    meta: [
      { title: "Dépenses publicitaires — Novarys Estate" },
      {
        name: "description",
        content:
          "Suivi des investissements publicitaires de l'agence : montant, source, date et total du mois en cours.",
      },
      { property: "og:title", content: "Dépenses publicitaires — Novarys Estate" },
      {
        property: "og:description",
        content: "Enregistrez vos budgets média et mesurez le coût d'acquisition de vos prospects.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AdSpendPage,
});

const SOURCES = ["Meta Ads", "Google Ads", "TikTok Ads", "Affichage", "Autre"];

function AdSpendPage() {
  const { data: rows } = useSuspenseQuery(adSpendQuery());
  const queryClient = useQueryClient();
  const addSpend = useServerFn(createAdSpend);

  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [amount, setAmount] = useState("");
  const [source, setSource] = useState(SOURCES[0]!);
  const [notes, setNotes] = useState("");

  const monthKey = today.slice(0, 7);
  const monthTotal = rows
    .filter((r) => r.spend_date.slice(0, 7) === monthKey)
    .reduce((s, r) => s + r.amount, 0);
  const allTotal = rows.reduce((s, r) => s + r.amount, 0);

  const mutation = useMutation({
    mutationFn: (input: { spend_date: string; amount: number; source: string; notes: string | null }) =>
      addSpend({ data: input }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ad-spend"] });
      toast.success("Dépense enregistrée");
      setAmount("");
      setNotes("");
    },
    onError: () => toast.error("Enregistrement impossible pour le moment."),
  });

  return (
    <AppShell
      title="Dépenses publicitaires"
      subtitle="Budget média investi par l'agence"
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="font-display text-3xl">{formatCompact(monthTotal)}</p>
          <p className="mt-1 text-xs text-muted-foreground">Total du mois en cours</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="font-display text-3xl">{formatCompact(allTotal)}</p>
          <p className="mt-1 text-xs text-muted-foreground">Total cumulé</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="font-display text-3xl">{rows.length}</p>
          <p className="mt-1 text-xs text-muted-foreground">Dépenses enregistrées</p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[360px_1fr]">
        <form
          className="rounded-xl border border-border bg-card p-6"
          onSubmit={(e) => {
            e.preventDefault();
            const value = Number(amount.replace(/[^\d.]/g, ""));
            if (!value) {
              toast.error("Indiquez un montant valide.");
              return;
            }
            mutation.mutate({
              spend_date: date,
              amount: value,
              source,
              notes: notes.trim() || null,
            });
          }}
        >
          <p className="flex items-center gap-2 text-sm font-semibold">
            <Megaphone className="size-4 text-accent" /> Nouvelle dépense
          </p>

          <div className="mt-5 space-y-4">
            <Field label="Date">
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </Field>
            <Field label="Montant (FCFA)">
              <Input
                inputMode="numeric"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="250000"
                required
              />
            </Field>
            <Field label="Source">
              <div className="flex flex-wrap gap-2">
                {SOURCES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSource(s)}
                    className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                      source === s
                        ? "border-foreground bg-foreground text-background"
                        : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </Field>
            <Field label="Note (optionnel)">
              <Input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Campagne villas Cocody"
              />
            </Field>
          </div>

          <Button type="submit" variant="hero" className="mt-6 w-full" disabled={mutation.isPending}>
            <Plus className="size-4" /> {mutation.isPending ? "Enregistrement…" : "Ajouter la dépense"}
          </Button>
        </form>

        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-sm">
              <thead className="bg-secondary/60 text-left text-xs text-muted-foreground">
                <tr>
                  {["Date", "Montant", "Source", "Note"].map((h) => (
                    <th key={h} className="px-4 py-3 font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((r) => (
                  <tr key={r.id} className="transition-colors hover:bg-secondary/40">
                    <td className="px-4 py-3 tabular-nums">
                      {new Date(r.spend_date).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-4 py-3 font-medium tabular-nums">{formatCompact(r.amount)}</td>
                    <td className="px-4 py-3 text-muted-foreground">{r.source}</td>
                    <td className="px-4 py-3 text-muted-foreground">{r.notes ?? "—"}</td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-12 text-center text-muted-foreground">
                      Aucune dépense enregistrée pour le moment.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1.5 text-xs text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}
