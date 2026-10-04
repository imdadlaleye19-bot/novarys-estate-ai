import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { getMyAccess } from "@/lib/estate.functions";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/agency/login" });
    const access = await getMyAccess();
    return { user: data.user, access };
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const { access } = Route.useRouteContext();
  if (!access.isAdmin && access.agencyIds.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="max-w-md rounded-xl border border-border bg-card p-8 text-center">
          <p className="eyebrow">Accès agence</p>
          <h1 className="mt-3 text-2xl">Aucune agence associée</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Aucune agence n'est associée à ce compte ({access.email}). Contactez NOVARYS pour
            activer votre accès.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button
              variant="outline"
              className="rounded-full"
              onClick={async () => {
                await supabase.auth.signOut();
                window.location.assign("/agency/login");
              }}
            >
              Se déconnecter
            </Button>
            <Button asChild className="rounded-full">
              <Link to="/">Accueil</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }
  return <Outlet />;
}
