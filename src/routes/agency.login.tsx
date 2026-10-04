import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/agency/login")({
  head: () => ({
    meta: [
      { title: "Connexion agence — NOVARYS ESTATE" },
      { name: "description", content: "Espace sécurisé des agences partenaires NOVARYS ESTATE." },
      { property: "og:title", content: "Connexion agence — NOVARYS ESTATE" },
      { property: "og:description", content: "Espace sécurisé des agences partenaires NOVARYS ESTATE." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error("Email ou mot de passe incorrect");
      return;
    }
    navigate({ to: "/dashboard", replace: true });
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      <div className="pointer-events-none absolute left-1/2 top-1/3 size-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-gradient opacity-15 blur-3xl" />
      <div className="relative w-full max-w-sm">
        <Link to="/" className="mb-8 flex items-baseline justify-center gap-2">
          <span className="font-display text-xl">NOVARYS</span>
          <span className="eyebrow opacity-60">Estate</span>
        </Link>
        <form onSubmit={onSubmit} className="space-y-5 rounded-xl border border-border bg-card p-8">
          <div>
            <p className="eyebrow">Espace agence</p>
            <h1 className="mt-2 text-3xl">Connexion</h1>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input id="password" type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Connexion…" : "Se connecter"}
          </Button>
        </form>
      </div>
    </div>
  );
}
