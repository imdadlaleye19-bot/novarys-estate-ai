import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

function publicClient() {
  return createClient<Database>(
    process.env["SUPABASE_URL"]!,
    process.env["SUPABASE_PUBLISHABLE_KEY"]!,
    { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
  );
}

const PROPERTY_COLUMNS =
  "id,name,type,transaction,location,address,price,surface,bedrooms,bathrooms,image_url,gallery,features,description,highlights,available";

const LEAD_COLUMNS =
  "id,name,phone,email,project,budget,budget_label,location,property_type,bedrooms,move_in,score,status,stage,source,ai_summary,matches,created_at,sale_amount,closed_at,closed_result";

export const listProperties = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await publicClient()
    .from("properties")
    .select(PROPERTY_COLUMNS)
    .eq("available", true)
    .order("price", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const getPropertyById = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => z.object({ id: z.string() }).parse(input))
  .handler(async ({ data }) => {
    const { data: row, error } = await publicClient()
      .from("properties")
      .select(PROPERTY_COLUMNS)
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return row;
  });

/**
 * Les prospects sont protégés par RLS (lecture réservée aux comptes agence).
 * Le prototype n'a pas encore d'écran de connexion : la lecture CRM passe donc
 * par le serveur. À remplacer par `requireSupabaseAuth` dès l'ajout de l'auth.
 */
export const listLeads = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("leads")
    .select(LEAD_COLUMNS)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const getLeadDetail = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => z.object({ id: z.string() }).parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const [leadRes, timelineRes] = await Promise.all([
      supabaseAdmin.from("leads").select(LEAD_COLUMNS).eq("id", data.id).maybeSingle(),
      supabaseAdmin
        .from("lead_timeline")
        .select("lead_id,label,event_date,done,created_at")
        .eq("lead_id", data.id)
        .order("created_at", { ascending: true }),
    ]);
    if (leadRes.error) throw new Error(leadRes.error.message);
    if (timelineRes.error) throw new Error(timelineRes.error.message);
    return { lead: leadRes.data, timeline: timelineRes.data ?? [] };
  });

const newLeadSchema = z.object({
  name: z.string().min(1),
  phone: z.string().nullable(),
  email: z.string().nullable(),
  project: z.string().nullable(),
  budget: z.number().nullable(),
  budget_label: z.string().nullable(),
  location: z.string().nullable(),
  property_type: z.string().nullable(),
  bedrooms: z.number().nullable(),
  move_in: z.string().nullable(),
  score: z.number(),
  status: z.string(),
  stage: z.string(),
  source: z.string(),
});

export type NewLeadInput = z.infer<typeof newLeadSchema>;

export const createLead = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => newLeadSchema.parse(input))
  .handler(async ({ data }) => {
    const { error } = await publicClient().from("leads").insert(data);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
