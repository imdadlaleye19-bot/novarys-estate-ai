import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  BarChart3,
  Building2,
  CalendarCheck,
  KanbanSquare,
  LayoutDashboard,
  Menu,
  Settings,
  Sparkles,
  Users,
  X,
} from "lucide-react";

const NAV = [
  { label: "Overview", to: "/dashboard", icon: LayoutDashboard },
  { label: "Properties", to: "/properties", icon: Building2 },
  { label: "AI Leads", to: "/leads", icon: Users },
  { label: "Pipeline", to: "/pipeline", icon: KanbanSquare },
  { label: "Appointments", to: "/pipeline", icon: CalendarCheck },
  { label: "Analytics", to: "/analytics", icon: BarChart3 },
  { label: "Settings", to: "/dashboard", icon: Settings },
] as const;

export function AppShell({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background lg:flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 shrink-0 bg-sidebar text-sidebar-foreground transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between px-5">
          <Link to="/" className="flex items-baseline gap-2">
            <span className="font-display text-base text-sidebar-accent-foreground">NOVARYS</span>
            <span className="eyebrow opacity-60">Estate</span>
          </Link>
          <button
            type="button"
            aria-label="Fermer le menu"
            className="lg:hidden"
            onClick={() => setOpen(false)}
          >
            <X className="size-4" />
          </button>
        </div>

        <nav className="mt-2 flex flex-col gap-1 px-3">
          {NAV.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              onClick={() => setOpen(false)}
              activeOptions={{ exact: true }}
              activeProps={{
                className: "bg-sidebar-accent text-sidebar-accent-foreground",
              }}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm opacity-85 transition-colors hover:bg-sidebar-accent hover:opacity-100"
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="absolute inset-x-3 bottom-4 rounded-lg bg-sidebar-accent p-4">
          <p className="flex items-center gap-2 text-xs font-semibold text-sidebar-primary">
            <Sparkles className="size-3.5" /> Demo Mode
          </p>
          <p className="mt-1.5 text-xs opacity-70">
            demo@novarys.com — données fictives de démonstration.
          </p>
        </div>
      </aside>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-foreground/40 lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-xl">
          <div className="flex flex-wrap items-center gap-3 px-5 py-4 sm:px-8">
            <button
              type="button"
              aria-label="Ouvrir le menu"
              className="inline-flex size-9 items-center justify-center rounded-md border border-border lg:hidden"
              onClick={() => setOpen(true)}
            >
              <Menu className="size-4" />
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-xl sm:text-2xl">{title}</h1>
              {subtitle && <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>}
            </div>
            {actions}
          </div>
        </header>
        <main className="px-5 py-6 sm:px-8 sm:py-8">{children}</main>
      </div>
    </div>
  );
}
