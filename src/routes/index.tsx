import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Brain, Building2, MessageSquareText, Sparkles, Workflow } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PropertyCard } from "@/components/property-card";
import { Button } from "@/components/ui/button";
import { heroImage, properties } from "@/lib/data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Novarys Estate — L'immobilier premium propulsé par l'IA" },
      {
        name: "description",
        content:
          "Novarys Estate aide les agences immobilières d'Afrique francophone à présenter leurs biens, qualifier leurs prospects avec l'IA et suivre leurs ventes.",
      },
      { property: "og:title", content: "Novarys Estate — Transform your real estate business with AI" },
      {
        property: "og:description",
        content:
          "Recherche immobilière intelligente, qualification automatique des prospects et CRM commercial pour agences premium.",
      },
    ],
  }),
  component: Landing,
});

const FEATURES = [
  {
    icon: Brain,
    title: "AI Property Matching",
    text: "L'assistant analyse le projet du visiteur et propose en quelques secondes les biens réellement compatibles, avec un score de correspondance.",
  },
  {
    icon: Sparkles,
    title: "Lead Qualification",
    text: "Chaque demande est notée automatiquement sur 100 selon le budget, la zone, le type de bien et l'échéance du projet.",
  },
  {
    icon: Workflow,
    title: "Smart CRM",
    text: "Les prospects qualifiés arrivent directement dans le pipeline de votre équipe commerciale, prêts à être contactés.",
  },
];

const STATS = [
  { value: "+1 200", label: "biens référencés" },
  { value: "+850", label: "prospects qualifiés" },
  { value: "+24", label: "agences accompagnées" },
  { value: "24/7", label: "assistance IA" },
];

const STEPS = [
  { n: "01", title: "Décrivez votre projet", text: "Achat, location ou investissement — en quelques questions simples." },
  { n: "02", title: "L'IA analyse vos critères", text: "Budget, zone, type de bien, nombre de chambres et échéance." },
  { n: "03", title: "Recevez les biens correspondants", text: "Une sélection classée par score de compatibilité." },
  { n: "04", title: "Connectez-vous à un conseiller", text: "Par WhatsApp ou téléphone, avec votre profil déjà transmis." },
];

function Landing() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      {/* Hero */}
      <section className="relative isolate">
        <div className="relative min-h-[86vh] overflow-hidden">
          <img
            src={heroImage}
            alt="Villa contemporaine premium à Abidjan au coucher du soleil"
            width={1600}
            height={1104}
            className="absolute inset-0 size-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{ backgroundImage: "var(--gradient-veil)" }}
            aria-hidden
          />
          <div className="relative mx-auto flex min-h-[86vh] max-w-7xl flex-col justify-end px-5 pb-16 pt-28 sm:px-8 sm:pb-24">
            <p className="eyebrow animate-rise text-background/70">Novarys Estate</p>
            <h1 className="animate-rise mt-4 max-w-3xl text-4xl leading-[1.05] text-background sm:text-6xl lg:text-7xl">
              Find the property that fits your life.
            </h1>
            <p className="animate-rise mt-5 max-w-xl text-base text-background/80 sm:text-lg">
              Une nouvelle génération de recherche immobilière propulsée par l'intelligence
              artificielle.
            </p>
            <div className="animate-rise mt-9 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" variant="accent">
                <Link to="/ai-search">
                  <Sparkles className="size-4" />
                  Trouver mon bien avec l'IA
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-background/40 bg-transparent text-background hover:bg-background hover:text-foreground"
              >
                <Link to="/properties">Explorer les biens</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="max-w-2xl">
          <p className="eyebrow text-accent">Plateforme</p>
          <h2 className="mt-3 text-3xl sm:text-4xl">Une expérience immobilière plus intelligente</h2>
          <p className="mt-4 text-muted-foreground">
            Novarys connecte votre catalogue, votre assistant IA et votre équipe commerciale dans un
            seul flux continu.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-border bg-card p-7 transition-all duration-500 hover:-translate-y-1 hover:shadow-lift"
            >
              <span className="inline-flex size-10 items-center justify-center rounded-lg bg-secondary">
                <f.icon className="size-5 text-accent" />
              </span>
              <h3 className="mt-5 text-xl">{f.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="surface-ink">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-16 sm:grid-cols-2 sm:px-8 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label}>
              <p className="font-display text-4xl">{s.value}</p>
              <p className="mt-1.5 text-sm opacity-70">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Selection */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow text-accent">Sélection</p>
            <h2 className="mt-3 text-3xl sm:text-4xl">Biens d'exception disponibles</h2>
          </div>
          <Button asChild variant="quiet">
            <Link to="/properties">
              Voir tout le catalogue <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {properties.slice(0, 3).map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-border bg-secondary/40">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
          <p className="eyebrow text-accent">Fonctionnement</p>
          <h2 className="mt-3 text-3xl sm:text-4xl">Quatre étapes, aucune friction</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-4">
            {STEPS.map((s) => (
              <div key={s.n} className="border-t border-foreground/15 pt-5">
                <p className="font-display text-2xl text-accent">{s.n}</p>
                <h3 className="mt-3 text-lg">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="surface-ink overflow-hidden rounded-2xl px-8 py-14 sm:px-14 sm:py-20">
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-5xl">Transformez votre agence avec l'IA.</h2>
            <p className="mt-4 opacity-75">
              Catalogue intelligent, qualification automatique et pipeline commercial : découvrez la
              démonstration complète de Novarys Estate.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" variant="accent">
                <Link to="/dashboard">
                  <Building2 className="size-4" />
                  Ouvrir la démo agence
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-background/30 bg-transparent text-background hover:bg-background hover:text-foreground"
              >
                <Link to="/lead">
                  <MessageSquareText className="size-4" />
                  Être rappelé par un conseiller
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
