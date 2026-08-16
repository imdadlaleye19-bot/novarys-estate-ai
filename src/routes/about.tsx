import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "À propos — Novarys Estate" },
      {
        name: "description",
        content:
          "Novarys Estate équipe les agences immobilières d'Abidjan, Dakar et Cotonou d'une plateforme de recherche et de qualification pilotée par l'IA.",
      },
      { property: "og:title", content: "À propos — Novarys Estate" },
      {
        property: "og:description",
        content: "La plateforme IA des agences immobilières premium d'Afrique francophone.",
      },
    ],
  }),
  component: About,
});

const VALUES = [
  {
    title: "Ancrage local",
    text: "Nos modèles sont calibrés sur les quartiers, les usages et les niveaux de prix réels d'Abidjan, Dakar et Cotonou.",
  },
  {
    title: "Exigence produit",
    text: "Une interface pensée pour l'immobilier haut de gamme : sobre, rapide, sans bruit visuel.",
  },
  {
    title: "Résultats commerciaux",
    text: "Chaque fonctionnalité existe pour augmenter le nombre de prospects qualifiés transmis à vos conseillers.",
  },
];

function About() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-4xl px-5 py-20 sm:px-8 sm:py-28">
        <p className="eyebrow text-accent">À propos</p>
        <h1 className="mt-3 text-4xl sm:text-5xl">
          Transform your real estate business with AI.
        </h1>
        <p className="mt-6 text-lg text-muted-foreground">
          Novarys Estate est une plateforme SaaS conçue pour les agences immobilières, promoteurs et
          gestionnaires de biens d'Afrique francophone. Elle réunit un catalogue en ligne, un
          assistant de recherche intelligent et un CRM commercial dans une seule expérience.
        </p>
        <p className="mt-4 text-muted-foreground">
          Nos équipes accompagnent aujourd'hui 24 agences en Côte d'Ivoire, au Sénégal et au Bénin.
          Cette démonstration présente le parcours complet, du visiteur anonyme jusqu'à la signature,
          avec des données fictives.
        </p>

        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          {VALUES.map((v) => (
            <div key={v.title} className="border-t border-border pt-5">
              <h2 className="text-lg">{v.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{v.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" variant="hero">
            <Link to="/ai-search">Essayer l'assistant IA</Link>
          </Button>
          <Button asChild size="lg" variant="quiet">
            <Link to="/dashboard">Voir la démo agence</Link>
          </Button>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
