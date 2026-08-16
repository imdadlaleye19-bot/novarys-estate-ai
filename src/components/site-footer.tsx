import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="surface-ink mt-24">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-lg">NOVARYS</span>
            <span className="eyebrow opacity-70">Estate</span>
          </div>
          <p className="mt-3 max-w-sm text-sm opacity-70">
            Transform your real estate business with AI. Abidjan · Dakar · Cotonou.
          </p>
        </div>
        <div className="text-sm">
          <p className="eyebrow opacity-60">Plateforme</p>
          <div className="mt-3 flex flex-col gap-2 opacity-80">
            <Link to="/properties">Catalogue</Link>
            <Link to="/ai-search">Assistant IA</Link>
            <Link to="/lead">Être contacté</Link>
          </div>
        </div>
        <div className="text-sm">
          <p className="eyebrow opacity-60">Agences</p>
          <div className="mt-3 flex flex-col gap-2 opacity-80">
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/pipeline">Pipeline</Link>
            <Link to="/analytics">Analytics</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-7xl px-5 py-5 text-xs opacity-55 sm:px-8">
          © 2026 Novarys Estate — prototype de démonstration. Données fictives.
        </p>
      </div>
    </footer>
  );
}
