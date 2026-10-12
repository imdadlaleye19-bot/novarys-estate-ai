import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { propertiesQuery } from "@/lib/estate-queries";
import { ArrowLeft, MessageCircle, RotateCcw, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PropertyCard } from "@/components/property-card";
import { Button } from "@/components/ui/button";
import { getWhatsAppLink, type Property } from "@/lib/data";

export const Route = createFileRoute("/ai-search")({
  loader: ({ context }) => context.queryClient.ensureQueryData(propertiesQuery()),
  head: () => ({
    meta: [
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      { title: "Assistant de recherche immobilière — NOVARYS IMMO" },
      {
        name: "description",
        content:
          "Répondez à six questions et notre assistant de recherche vous propose les biens les plus adaptés à votre projet, avec un score de compatibilité.",
      },
      { property: "og:title", content: "Find your perfect property — NOVARYS IMMO" },
      {
        property: "og:description",
        content: "Un assistant de recherche intelligent qui compare vos critères aux biens disponibles.",
      },
    ],
  }),
  component: AiSearch,
});

interface Step {
  key: keyof Answers;
  question: string;
  hint?: string;
  options: string[];
}

interface Answers {
  project: string;
  type: string;
  budget: string;
  zone: string;
  bedrooms: string;
  timing: string;
}

const STEPS: Step[] = [
  {
    key: "project",
    question: "Quel est votre projet ?",
    hint: "Bonsoir 👋 Je suis l'assistant de recherche Novarys. Quelques questions et je vous propose une sélection.",
    options: ["Acheter", "Louer", "Investir"],
  },
  { key: "type", question: "Quel type de bien recherchez-vous ?", options: ["Appartement", "Villa", "Terrain", "Bureau"] },
  {
    key: "budget",
    question: "Quel est votre budget ?",
    options: [
      "Moins de 500 000 FCFA/mois",
      "500 000 – 1 500 000 FCFA/mois",
      "Moins de 200 000 000 FCFA",
      "200 000 000 – 500 000 000 FCFA",
      "Plus de 500 000 000 FCFA",
    ],
  },
  {
    key: "zone",
    question: "Dans quelle zone souhaitez-vous rechercher ?",
    options: ["Cocody", "Riviera", "Marcory", "Plateau", "Bingerville"],
  },
  { key: "bedrooms", question: "Combien de chambres souhaitez-vous ?", options: ["1", "2", "3", "4", "5+", "Sans objet"] },
  {
    key: "timing",
    question: "Quand souhaitez-vous réaliser votre projet ?",
    options: ["Immédiatement", "1 à 3 mois", "3 à 6 mois", "Plus tard"],
  },
];

const budgetCeiling: Record<string, number> = {
  "Moins de 500 000 FCFA/mois": 500_000,
  "500 000 – 1 500 000 FCFA/mois": 1_500_000,
  "Moins de 200 000 000 FCFA": 200_000_000,
  "200 000 000 – 500 000 000 FCFA": 500_000_000,
  "Plus de 500 000 000 FCFA": 1_000_000_000,
};

function scoreProperty(p: Property, a: Answers) {
  let score = 55;
  const reasons: string[] = [];
  const wantsRent = a.project === "Louer";
  if ((wantsRent && p.transaction === "Location") || (!wantsRent && p.transaction === "Achat")) {
    score += 15;
    reasons.push(wantsRent ? "Disponible à la location" : "Disponible à l'achat");
  }
  if (p.type === a.type) {
    score += 14;
    reasons.push("Type de bien recherché");
  }
  if (p.location === a.zone) {
    score += 12;
    reasons.push("Même quartier");
  }
  const ceiling = budgetCeiling[a.budget] ?? Infinity;
  if (p.price <= ceiling) {
    score += 10;
    reasons.push("Budget compatible");
  } else score -= 18;
  const wanted = a.bedrooms === "5+" ? 5 : Number(a.bedrooms);
  if (!Number.isNaN(wanted) && p.bedrooms >= wanted) {
    score += 6;
    reasons.push("Nombre de chambres correspondant");
  }
  if (a.timing === "Immédiatement" && p.available) {
    score += 3;
    reasons.push("Disponible immédiatement");
  }
  return { match: Math.max(41, Math.min(98, score)), reasons };
}

/** Seuil à partir duquel un bien est considéré comme une vraie correspondance. */
const GOOD_MATCH = 80;

function AiSearch() {
  const { data: properties } = useSuspenseQuery(propertiesQuery());
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<Answers>>({});
  const done = step >= STEPS.length;

  const results = useMemo(() => {
    if (!done) return [];
    const a = answers as Answers;
    return properties
      .map((p) => ({ property: p, ...scoreProperty(p, a) }))
      .sort((x, y) => y.match - x.match)
      .slice(0, 3);
  }, [done, answers]);

  const zones = useMemo(
    () => Array.from(new Set(properties.map((p) => p.location))).sort(),
    [properties],
  );
  const steps = STEPS.map((s) => (s.key === "zone" && zones.length ? { ...s, options: zones } : s));
  const current = steps[step];
  const goodMatches = results.filter((r) => r.match >= GOOD_MATCH).length;

  const pick = (value: string) => {
    if (!current) return;
    setAnswers((prev) => ({ ...prev, [current.key]: value }));
    setStep((s) => s + 1);
  };

  const restart = () => {
    setAnswers({});
    setStep(0);
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <section className="mx-auto max-w-3xl px-5 py-14 sm:px-8 sm:py-20">
        <div className="text-center">
          <p className="eyebrow text-accent">Assistant de recherche</p>
          <h1 className="mt-3 text-4xl sm:text-5xl">Find your perfect property.</h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Répondez à quelques questions et notre assistant de recherche compare vos critères
            aux biens réellement disponibles.
          </p>
        </div>

        {/* Progress */}
        <div className="mt-10 flex items-center gap-2">
          {STEPS.map((s, i) => (
            <div
              key={s.key}
              className={`h-1 flex-1 rounded-full transition-colors duration-500 ${
                i < step ? "bg-accent" : "bg-border"
              }`}
            />
          ))}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          {done ? "Analyse terminée" : `Question ${step + 1} sur ${STEPS.length}`}
        </p>

        {/* Conversation */}
        <div className="mt-8 space-y-4">
          {STEPS.slice(0, step).map((s) => (
            <div key={s.key} className="space-y-2">
              <div className="max-w-[85%] rounded-2xl rounded-tl-sm border border-border bg-card px-4 py-3 text-sm">
                {s.question}
              </div>
              <div className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-tr-sm bg-primary/15 px-4 py-3 text-sm text-foreground ring-1 ring-primary/30">
                {answers[s.key]}
              </div>
            </div>
          ))}

          {current && (
            <div className="animate-rise space-y-4 rounded-2xl border border-border bg-card p-6 shadow-soft">
              {current.hint && step === 0 && (
                <p className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Sparkles className="mt-0.5 size-4 shrink-0 text-accent" />
                  {current.hint}
                </p>
              )}
              <h2 className="text-xl">{current.question}</h2>
              <div className="flex flex-wrap gap-2.5">
                {current.options.map((o) => (
                  <button
                    key={o}
                    type="button"
                    onClick={() => pick(o)}
                    className="rounded-full border border-border px-4 py-2 text-sm transition-colors duration-300 hover:border-primary/50 hover:bg-primary/10 hover:text-foreground"
                  >
                    {o}
                  </button>
                ))}
              </div>
              {step > 0 && (
                <button
                  type="button"
                  onClick={() => setStep((s) => s - 1)}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="size-3.5" /> Question précédente
                </button>
              )}
            </div>
          )}
        </div>

        {/* Results */}
        {done && (
          <div className="animate-rise mt-10">
            <div className="rounded-2xl border border-border bg-card p-6">
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="size-4 text-accent" /> Analyse de {properties.length} biens
                terminée
              </p>
              <h2 className="mt-2 text-2xl">
                {results.length === 0
                  ? "Aucun bien n'est disponible pour le moment."
                  : goodMatches > 0
                    ? `${goodMatches} bien(s) correspondent bien à votre recherche.`
                    : "Aucun bien ne correspond parfaitement à vos critères actuellement, voici les plus proches."}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {answers.project} · {answers.type} · {answers.zone} · {answers.budget} ·{" "}
                {answers.bedrooms} chambre(s) · {answers.timing}
              </p>
            </div>

            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((r) => (
                <div key={r.property.id} className="space-y-2">
                  <PropertyCard property={r.property} match={r.match} />
                  <p className="text-xs text-muted-foreground">
                    {r.reasons.length
                      ? r.reasons.join(", ")
                      : "Correspondance partielle avec vos critères"}
                  </p>
                </div>
              ))}
            </div>

            <div className="surface-ink mt-8 rounded-2xl p-7">
              <h3 className="text-xl text-ink-foreground">
                Souhaitez-vous recevoir cette sélection sur WhatsApp ?
              </h3>
              <p className="mt-2 text-sm opacity-75">
                Un conseiller Novarys vous transmet les fiches complètes et organise les visites.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button asChild variant="accent">
                  <a
                    href={getWhatsAppLink(
                      `Bonjour NOVARYS IMMO, j'ai utilisé l'assistant de recherche et souhaite recevoir les fiches de : ${results
                        .map((r) => r.property.name)
                        .join(", ")}.\nMerci d'organiser une visite.`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="size-4" /> Recevoir sur WhatsApp
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-background/30 bg-transparent text-background hover:bg-background hover:text-foreground"
                >
                  <Link to="/lead">Être rappelé par un conseiller</Link>
                </Button>
                <Button
                  variant="ghost"
                  onClick={restart}
                  className="text-background hover:bg-background/10 hover:text-background"
                >
                  <RotateCcw className="size-4" /> Recommencer
                </Button>
              </div>
            </div>
          </div>
        )}
      </section>

      <SiteFooter />
    </div>
  );
}
