import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, MessageCircle, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getWhatsAppLink, LOCATIONS, PROPERTY_TYPES } from "@/lib/data";

export const Route = createFileRoute("/lead")({
  head: () => ({
    meta: [
      { title: "Qualifier mon projet — Novarys Estate" },
      {
        name: "description",
        content:
          "Décrivez votre projet immobilier en une minute : un conseiller Novarys vous rappelle avec une sélection de biens adaptée.",
      },
      { property: "og:title", content: "Let's find your property — Novarys Estate" },
      {
        property: "og:description",
        content: "Formulaire de qualification intelligent pour acheteurs, locataires et investisseurs.",
      },
    ],
  }),
  component: LeadPage,
});

const EMPTY = {
  name: "",
  phone: "",
  email: "",
  budget: "",
  zone: "",
  type: "",
  bedrooms: "",
  timing: "",
  visit: "",
};

const TIMINGS = ["Immédiatement", "1 à 3 mois", "3 à 6 mois", "Plus tard"];

function LeadPage() {
  const [form, setForm] = useState({ ...EMPTY });
  const [sent, setSent] = useState(false);

  const set = (key: keyof typeof EMPTY, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const filled = Object.values(form).filter(Boolean).length;
  const score = Math.min(98, 40 + filled * 6 + (form.visit === "Oui" ? 8 : 0));
  const ready = form.name && form.phone && form.type && form.zone;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ready) {
      toast.error("Complétez au minimum votre nom, téléphone, type de bien et zone.");
      return;
    }
    setSent(true);
    toast.success("Demande transmise à l'équipe commerciale");
  };

  if (sent) {
    return (
      <div className="min-h-screen">
        <SiteHeader />
        <section className="mx-auto max-w-2xl px-5 py-24 text-center sm:px-8">
          <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-secondary">
            <CheckCircle2 className="size-7 text-accent" />
          </span>
          <h1 className="mt-7 text-3xl sm:text-4xl">Votre demande a bien été transmise.</h1>
          <p className="mt-4 text-muted-foreground">
            Un conseiller immobilier vous contactera prochainement. Votre profil a été qualifié
            automatiquement avec un score de {score}/100 et transmis au pipeline de l'agence.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild variant="accent">
              <a
                href={getWhatsAppLink(
                  `Bonjour Novarys Estate, je viens de soumettre ma demande sur le site.\nNom : ${form.name}\nProjet : ${form.type} à ${form.zone}\nBudget : ${form.budget || "non précisé"}\nMerci de me recontacter.`
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="size-4" /> Continuer sur WhatsApp
              </a>
            </Button>
            <Button asChild variant="quiet">
              <Link to="/properties">Continuer à explorer les biens</Link>
            </Button>
          </div>
          <p className="mt-10 text-xs text-muted-foreground">
            Prototype de démonstration — les données saisies restent dans votre navigateur.
          </p>
        </section>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-5xl px-5 py-14 sm:px-8 sm:py-20">
        <div className="max-w-xl">
          <p className="eyebrow text-accent">Qualification</p>
          <h1 className="mt-3 text-4xl sm:text-5xl">Let's find your property.</h1>
          <p className="mt-4 text-muted-foreground">
            Une minute suffit. Vos réponses permettent à notre IA de préparer une sélection avant
            même l'appel du conseiller.
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_320px]">
          <form onSubmit={submit} className="space-y-6 rounded-xl border border-border bg-card p-7">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Nom complet" required>
                <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Jean Kouassi" />
              </Field>
              <Field label="Téléphone / WhatsApp" required>
                <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+225 07 00 00 00 00" />
              </Field>
              <Field label="Email">
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  placeholder="jean@example.ci"
                />
              </Field>
              <Field label="Budget">
                <Input
                  value={form.budget}
                  onChange={(e) => set("budget", e.target.value)}
                  placeholder="600 000 FCFA/mois"
                />
              </Field>
              <Field label="Zone recherchée" required>
                <Choice value={form.zone} onChange={(v) => set("zone", v)} options={[...LOCATIONS]} placeholder="Sélectionner une zone" />
              </Field>
              <Field label="Type de bien" required>
                <Choice value={form.type} onChange={(v) => set("type", v)} options={PROPERTY_TYPES} placeholder="Sélectionner un type" />
              </Field>
              <Field label="Nombre de chambres">
                <Choice
                  value={form.bedrooms}
                  onChange={(v) => set("bedrooms", v)}
                  options={["1", "2", "3", "4", "5+"]}
                  placeholder="Sélectionner"
                />
              </Field>
              <Field label="Date du projet">
                <Choice value={form.timing} onChange={(v) => set("timing", v)} options={TIMINGS} placeholder="Sélectionner" />
              </Field>
            </div>

            <div>
              <Label className="text-sm">Êtes-vous prêt à visiter un bien prochainement ?</Label>
              <div className="mt-3 flex gap-2.5">
                {["Oui", "Non"].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => set("visit", v)}
                    className={`rounded-full border px-5 py-2 text-sm transition-all duration-300 ${
                      form.visit === v
                        ? "border-foreground bg-foreground text-background"
                        : "border-border hover:border-foreground/40"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            <Button type="submit" variant="hero" size="lg" className="w-full">
              Envoyer ma demande
            </Button>
            <p className="text-xs text-muted-foreground">
              Prototype de démonstration : aucune donnée n'est envoyée à un service externe.
            </p>
          </form>

          {/* Live summary */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-xl border border-border bg-card p-6">
              <p className="flex items-center gap-2 text-sm font-semibold">
                <Sparkles className="size-4 text-accent" /> Résumé de votre profil
              </p>
              <dl className="mt-5 space-y-3 text-sm">
                <Row label="Nom" value={form.name} />
                <Row label="Contact" value={form.phone || form.email} />
                <Row label="Projet" value={form.type} />
                <Row label="Zone" value={form.zone} />
                <Row label="Budget" value={form.budget} />
                <Row label="Chambres" value={form.bedrooms} />
                <Row label="Échéance" value={form.timing} />
                <Row label="Visite" value={form.visit} />
              </dl>
              <div className="mt-6 border-t border-border pt-5">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-muted-foreground">Lead score estimé</span>
                  <span className="font-display text-2xl">{score}/100</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-accent transition-all duration-700"
                    style={{ width: `${score}%` }}
                  />
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-sm">
        {label} {required && <span className="text-accent">*</span>}
      </Label>
      {children}
    </div>
  );
}

function Choice({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o} value={o}>
            {o}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium">{value || "—"}</dd>
    </div>
  );
}
