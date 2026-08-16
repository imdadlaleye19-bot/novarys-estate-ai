import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import {
  Bath,
  BedDouble,
  CalendarClock,
  Car,
  Check,
  MapPin,
  Maximize,
  Phone,
  ShieldCheck,
  Sparkles,
  Trees,
  Waves,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PropertyCard } from "@/components/property-card";
import { Button } from "@/components/ui/button";
import { formatPrice, getProperty, properties } from "@/lib/data";

export const Route = createFileRoute("/properties/$id")({
  loader: ({ params }) => {
    const property = getProperty(params.id);
    if (!property) throw notFound();
    return { property };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Bien introuvable — Novarys Estate" }, { name: "robots", content: "noindex" }],
      };
    }
    const { property } = loaderData;
    const description = `${property.name} — ${property.surface} m² à ${property.location}. ${formatPrice(property)}.`;
    return {
      meta: [
        { title: `${property.name} — Novarys Estate` },
        { name: "description", content: description },
        { property: "og:title", content: `${property.name} — Novarys Estate` },
        { property: "og:description", content: description },
      ],
    };
  },
  component: PropertyDetail,
});

const FEATURE_ICONS: Record<string, typeof Car> = {
  Garage: Car,
  Piscine: Waves,
  Jardin: Trees,
  "Sécurité 24/7": ShieldCheck,
};

function PropertyDetail() {
  const { property } = Route.useLoaderData();
  const [active, setActive] = useState(0);

  const similar = properties
    .filter((p) => p.id !== property.id && (p.type === property.type || p.location === property.location))
    .slice(0, 3);

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <section className="mx-auto max-w-7xl px-5 pt-8 sm:px-8 sm:pt-12">
        <Link
          to="/properties"
          className="text-xs text-muted-foreground underline-offset-4 hover:underline"
        >
          ← Retour au catalogue
        </Link>

        <div className="mt-5 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="size-4" /> {property.address}
            </p>
            <h1 className="mt-2 text-3xl sm:text-5xl">{property.name}</h1>
          </div>
          <div className="text-right">
            <p className="font-display text-3xl sm:text-4xl">{formatPrice(property)}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {property.transaction} · {property.type} · Disponible
            </p>
          </div>
        </div>

        {/* Gallery */}
        <div className="mt-8 grid gap-3 lg:grid-cols-[2fr_1fr]">
          <div className="overflow-hidden rounded-xl">
            <img
              src={property.gallery[active] ?? property.image}
              alt={property.name}
              width={1200}
              height={800}
              className="aspect-[16/10] w-full object-cover transition-all duration-700"
            />
          </div>
          <div className="grid grid-cols-4 gap-3 lg:grid-cols-2">
            {property.gallery.map((g, i) => (
              <button
                key={g + i}
                type="button"
                onClick={() => setActive(i)}
                className={`overflow-hidden rounded-lg border-2 transition-all duration-300 ${
                  active === i ? "border-accent" : "border-transparent opacity-80 hover:opacity-100"
                }`}
              >
                <img
                  src={g}
                  alt={`${property.name} — vue ${i + 1}`}
                  loading="lazy"
                  width={600}
                  height={400}
                  className="aspect-[4/3] w-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
          <div>
            {/* Key facts */}
            <div className="grid grid-cols-2 gap-4 rounded-xl border border-border bg-card p-6 sm:grid-cols-4">
              <Fact icon={BedDouble} value={`${property.bedrooms}`} label="chambres" />
              <Fact icon={Bath} value={`${property.bathrooms}`} label="salles de bain" />
              <Fact icon={Maximize} value={`${property.surface} m²`} label="surface" />
              <Fact icon={ShieldCheck} value="24/7" label="sécurité" />
            </div>

            <div className="mt-10">
              <h2 className="text-2xl">Description</h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">{property.description}</p>
            </div>

            <div className="mt-10">
              <h2 className="text-2xl">Prestations</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {property.features.map((f) => {
                  const Icon = FEATURE_ICONS[f] ?? Check;
                  return (
                    <div
                      key={f}
                      className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 text-sm"
                    >
                      <Icon className="size-4 text-accent" />
                      {f}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-10">
              <h2 className="text-2xl">Localisation approximative</h2>
              <div className="mt-5 overflow-hidden rounded-xl border border-border">
                <div className="relative flex h-56 items-center justify-center bg-secondary">
                  <div
                    className="absolute inset-0 opacity-60"
                    style={{
                      backgroundImage:
                        "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
                      backgroundSize: "38px 38px",
                    }}
                    aria-hidden
                  />
                  <div className="relative flex flex-col items-center">
                    <span className="flex size-11 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lift">
                      <MapPin className="size-5" />
                    </span>
                    <p className="mt-3 text-sm font-medium">{property.address}</p>
                    <p className="text-xs text-muted-foreground">
                      Adresse exacte communiquée par le conseiller
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="surface-ink mt-10 rounded-xl p-7">
              <p className="eyebrow opacity-70">Analyse IA</p>
              <h2 className="mt-2 text-2xl text-ink-foreground">
                Pourquoi ce bien correspond à votre projet
              </h2>
              <ul className="mt-5 space-y-3 text-sm opacity-85">
                {property.highlights.map((h) => (
                  <li key={h} className="flex gap-3">
                    <Sparkles className="mt-0.5 size-4 shrink-0 text-accent" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sticky actions */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-xl border border-border bg-card p-6 shadow-soft">
              <p className="font-display text-2xl">{formatPrice(property)}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Frais d'agence et conditions détaillés par le conseiller.
              </p>
              <div className="mt-6 flex flex-col gap-2.5">
                <Button asChild variant="hero">
                  <Link to="/lead">
                    <Phone className="size-4" /> Contacter un conseiller
                  </Link>
                </Button>
                <Button asChild variant="quiet">
                  <Link to="/lead">
                    <CalendarClock className="size-4" /> Programmer une visite
                  </Link>
                </Button>
                <Button asChild variant="accent">
                  <Link to="/ai-search">
                    <Sparkles className="size-4" /> Trouver des biens similaires avec l'IA
                  </Link>
                </Button>
              </div>
              <div className="mt-6 border-t border-border pt-5 text-xs text-muted-foreground">
                Réponse moyenne d'un conseiller Novarys : moins de 12 minutes.
              </div>
            </div>
          </aside>
        </div>
      </section>

      {similar.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 pb-10 sm:px-8">
          <h2 className="text-2xl">Biens similaires</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        </section>
      )}

      <SiteFooter />
    </div>
  );
}

function Fact({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof BedDouble;
  value: string;
  label: string;
}) {
  return (
    <div>
      <Icon className="size-4 text-accent" />
      <p className="mt-2 font-display text-xl">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
