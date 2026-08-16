import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const NAV = [
  { label: "Accueil", to: "/" },
  { label: "Biens", to: "/properties" },
  { label: "Acheter", to: "/properties", search: { transaction: "Achat" } },
  { label: "Louer", to: "/properties", search: { transaction: "Location" } },
  { label: "Investir", to: "/properties", search: { transaction: "Achat" } },
  { label: "À propos", to: "/about" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link to="/" className="flex items-baseline gap-2">
          <span className="font-display text-lg tracking-tight">NOVARYS</span>
          <span className="eyebrow text-muted-foreground">Estate</span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              search={"search" in item ? (item.search as never) : undefined}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm" className="hidden md:inline-flex">
            <Link to="/dashboard">Demo Mode</Link>
          </Button>
          <Button asChild variant="hero" size="sm" className="hidden sm:inline-flex">
            <Link to="/ai-search">
              <Sparkles className="size-4" />
              Trouver mon bien avec l'IA
            </Link>
          </Button>
          <button
            type="button"
            aria-label="Ouvrir le menu"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex size-9 items-center justify-center rounded-md border border-border lg:hidden"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-background lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-5 py-3 sm:px-8">
            {NAV.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                search={"search" in item ? (item.search as never) : undefined}
                onClick={() => setOpen(false)}
                className="py-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/dashboard"
              onClick={() => setOpen(false)}
              className="py-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Demo Mode
            </Link>
            <Button asChild variant="hero" className="mt-3 w-full">
              <Link to="/ai-search" onClick={() => setOpen(false)}>
                <Sparkles className="size-4" />
                Trouver mon bien avec l'IA
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
