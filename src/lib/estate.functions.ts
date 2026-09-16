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

const closeLeadSchema = z.object({
  id: z.string(),
  result: z.enum(["won", "lost"]),
  sale_amount: z.number().nullable(),
});

export const closeLead = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => closeLeadSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("leads")
      .update({
        closed_result: data.result,
        closed_at: new Date().toISOString(),
        sale_amount: data.result === "won" ? data.sale_amount : null,
        status: data.result === "won" ? "Won" : "Contacted",
        stage: data.result === "won" ? "Won" : "Contacted",
      })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

const AD_SPEND_COLUMNS = "id,spend_date,amount,source,notes,created_at";

export const listAdSpend = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("ad_spend")
    .select(AD_SPEND_COLUMNS)
    .order("spend_date", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
});

const newAdSpendSchema = z.object({
  spend_date: z.string().min(1),
  amount: z.number().nonnegative(),
  source: z.string().min(1),
  notes: z.string().nullable(),
});

export type NewAdSpendInput = z.infer<typeof newAdSpendSchema>;

export const createAdSpend = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => newAdSpendSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("ad_spend").insert(data);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ---------------------------------- RDV ---------------------------------- */

const APPOINTMENT_COLUMNS =
  "id,lead_id,scheduled_at,duration_minutes,status,notes,created_at";

export const listAppointments = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("appointments")
    .select(APPOINTMENT_COLUMNS)
    .order("scheduled_at", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
});

const APPOINTMENT_STATUSES = [
  "scheduled",
  "confirmed",
  "completed",
  "cancelled",
  "no_show",
] as const;

const newAppointmentSchema = z.object({
  lead_id: z.string().min(1),
  scheduled_at: z.string().min(1),
  duration_minutes: z.number().int().positive(),
  notes: z.string().nullable(),
});

export type NewAppointmentInput = z.infer<typeof newAppointmentSchema>;

export const createAppointment = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => newAppointmentSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("appointments")
      .insert({ ...data, status: "scheduled" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

const updateAppointmentSchema = z.object({
  id: z.string(),
  status: z.enum(APPOINTMENT_STATUSES),
});

export const updateAppointmentStatus = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => updateAppointmentSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("appointments")
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
