import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PropertyCard } from "@/components/property-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  LOCATIONS,
  PROPERTY_TYPES,
  TRANSACTIONS,
  properties,
  type PropertyType,
  type Transaction,
} from "@/lib/data";

export const Route = createFileRoute("/properties/")({
  validateSearch: (search: Record<string, unknown>): { transaction?: Transaction } => {
    const t = search["transaction"];
    return t === "Achat" || t === "Location" ? { transaction: t } : {};
  },
  head: () => ({
    meta: [
      { title: "Catalogue immobilier — Novarys Estate" },
      {
        name: "description",
        content:
          "Villas, appartements, bureaux et terrains à Cocody, Riviera, Marcory, Plateau et Bingerville. Filtrez par budget, type et nombre de chambres.",
      },
      { property: "og:title", content: "Explore our properties — Novarys Estate" },
      {
        property: "og:description",
        content: "Le catalogue premium de Novarys Estate à Abidjan et en Afrique francophone.",
      },
    ],
  }),
  component: Catalogue,
});

const MAX_RENT = 3_000_000;
const MAX_SALE = 900_000_000;

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-300 ${
        active
          ? "border-foreground bg-foreground text-background"
          : "border-border bg-card text-muted-foreground hover:border-foreground/40 hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function Catalogue() {
  const { transaction: initialTransaction } = Route.useSearch();
  const [query, setQuery] = useState("");
  const [types, setTypes] = useState<PropertyType[]>([]);
  const [transaction, setTransaction] = useState<Transaction | undefined>(initialTransaction);
  const [locations, setLocations] = useState<string[]>([]);
  const [bedrooms, setBedrooms] = useState<number | undefined>(undefined);
  const [budget, setBudget] = useState<number>(MAX_SALE);

  const maxBudget = transaction === "Location" ? MAX_RENT : MAX_SALE;
  const budgetValue = Math.min(budget, maxBudget);

  const toggle = <T,>(list: T[], value: T, set: (v: T[]) => void) =>
    set(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

  const results = useMemo(() => {
    return properties.filter((p) => {
      const q = query.trim().toLowerCase();
      if (q && !`${p.name} ${p.location} ${p.type} ${p.address}`.toLowerCase().includes(q))
        return false;
      if (types.length && !types.includes(p.type)) return false;
      if (transaction && p.transaction !== transaction) return false;
      if (locations.length && !locations.includes(p.location)) return false;
      if (bedrooms !== undefined && p.bedrooms < bedrooms) return false;
      if (transaction && p.price > budgetValue) return false;
      return true;
    });
  }, [query, types, transaction, locations, bedrooms, budgetValue]);

  const reset = () => {
    setQuery("");
    setTypes([]);
    setTransaction(undefined);
    setLocations([]);
    setBedrooms(undefined);
    setBudget(MAX_SALE);
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <section className="border-b border-border bg-secondary/40">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20">
          <p className="eyebrow text-accent">Catalogue</p>
          <h1 className="mt-3 text-4xl sm:text-5xl">Explore our properties</h1>
          <p className="mt-4 max-w-xl text-muted-foreground">
            {properties.length} biens sélectionnés à Abidjan. Filtrez selon votre projet ou laissez
            l'assistant IA le faire pour vous.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* Filters */}
          <aside className="space-y-7 rounded-xl border border-border bg-card p-6 lg:sticky lg:top-24 lg:self-start">
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-2 text-sm font-semibold">
                <SlidersHorizontal className="size-4" /> Filtres
              </p>
              <button
                type="button"
                onClick={reset}
                className="text-xs text-muted-foreground underline-offset-4 hover:underline"
              >
                Réinitialiser
              </button>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher un bien…"
                className="pl-9"
              />
            </div>

            <div>
              <p className="eyebrow text-muted-foreground">Type</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {PROPERTY_TYPES.map((t) => (
                  <Chip key={t} active={types.includes(t)} onClick={() => toggle(types, t, setTypes)}>
                    {t}
                  </Chip>
                ))}
              </div>
            </div>

            <div>
              <p className="eyebrow text-muted-foreground">Transaction</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {TRANSACTIONS.map((t) => (
                  <Chip
                    key={t}
                    active={transaction === t}
                    onClick={() => setTransaction(transaction === t ? undefined : t)}
                  >
                    {t}
                  </Chip>
                ))}
              </div>
            </div>

            <div>
              <p className="eyebrow text-muted-foreground">Localisation</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {LOCATIONS.map((l) => (
                  <Chip
                    key={l}
                    active={locations.includes(l)}
                    onClick={() => toggle(locations, l, setLocations)}
                  >
                    {l}
                  </Chip>
                ))}
              </div>
            </div>

            <div>
              <p className="eyebrow text-muted-foreground">
                Budget {transaction === "Location" ? "mensuel" : "d'achat"}
              </p>
              <Slider
                className="mt-4"
                value={[budgetValue]}
                min={transaction === "Location" ? 100_000 : 50_000_000}
                max={maxBudget}
                step={transaction === "Location" ? 50_000 : 10_000_000}
                onValueChange={(v) => setBudget(v[0] ?? budgetValue)}
              />
              <p className="mt-2 text-xs text-muted-foreground">
                {transaction
                  ? `Jusqu'à ${new Intl.NumberFormat("fr-FR").format(budgetValue)} FCFA${
                      transaction === "Location" ? "/mois" : ""
                    }`
                  : "Choisissez Achat ou Location pour filtrer par budget"}
              </p>
            </div>

            <div>
              <p className="eyebrow text-muted-foreground">Chambres</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5].map((b) => (
                  <Chip
                    key={b}
                    active={bedrooms === b}
                    onClick={() => setBedrooms(bedrooms === b ? undefined : b)}
                  >
                    {b}+
                  </Chip>
                ))}
              </div>
            </div>
          </aside>

          {/* Results */}
          <div>
            <div className="flex items-center justify-between pb-5">
              <p className="text-sm text-muted-foreground">
                {results.length} bien{results.length > 1 ? "s" : ""} correspondant
                {results.length > 1 ? "s" : ""}
              </p>
            </div>

            {results.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border bg-card p-14 text-center">
                <h2 className="text-xl">Aucun bien ne correspond à ces critères</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Élargissez votre budget ou votre zone de recherche.
                </p>
                <Button onClick={reset} variant="quiet" className="mt-6">
                  Réinitialiser les filtres
                </Button>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {results.map((p) => (
                  <PropertyCard key={p.id} property={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
