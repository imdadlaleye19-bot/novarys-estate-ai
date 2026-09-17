import { queryOptions } from "@tanstack/react-query";
import {
  getLeadDetail,
  getPropertyById,
  listAdSpend,
  listAgencyOverview,
  listAppointments,
  listLeads,
  listProperties,
  type AgencyOverviewRow,
} from "@/lib/estate.functions";
import { mapLead, mapProperty, type LeadRow, type PropertyRow, type TimelineRow } from "@/lib/mappers";

export const propertiesQuery = () =>
  queryOptions({
    queryKey: ["properties"],
    queryFn: async () => {
      const rows = (await listProperties()) as unknown as PropertyRow[];
      return rows.map(mapProperty);
    },
  });

export const propertyQuery = (id: string) =>
  queryOptions({
    queryKey: ["properties", id],
    queryFn: async () => {
      const row = (await getPropertyById({ data: { id } })) as unknown as PropertyRow | null;
      return row ? mapProperty(row) : null;
    },
  });

export const leadsQuery = () =>
  queryOptions({
    queryKey: ["leads"],
    queryFn: async () => {
      const rows = (await listLeads()) as unknown as LeadRow[];
      return rows.map((r) => mapLead(r));
    },
  });

export const leadQuery = (id: string) =>
  queryOptions({
    queryKey: ["leads", id],
    queryFn: async () => {
      const res = (await getLeadDetail({ data: { id } })) as unknown as {
        lead: LeadRow | null;
        timeline: TimelineRow[];
      };
      return res.lead ? mapLead(res.lead, res.timeline) : null;
    },
  });

export interface AdSpendRow {
  id: string;
  spend_date: string;
  amount: number;
  source: string;
  notes: string | null;
  created_at: string;
}

export const adSpendQuery = () =>
  queryOptions({
    queryKey: ["ad-spend"],
    queryFn: async () => {
      const rows = (await listAdSpend()) as unknown as AdSpendRow[];
      return rows.map((r) => ({ ...r, amount: Number(r.amount) }));
    },
  });

export type AppointmentStatus =
  | "scheduled"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "no_show";

export interface AppointmentRow {
  id: string;
  lead_id: string | null;
  scheduled_at: string;
  duration_minutes: number;
  status: AppointmentStatus;
  notes: string | null;
  created_at: string;
}

export const appointmentsQuery = () =>
  queryOptions({
    queryKey: ["appointments"],
    queryFn: async () => (await listAppointments()) as unknown as AppointmentRow[],
  });

export const agencyOverviewQuery = () =>
  queryOptions({
    queryKey: ["agency-overview"],
    queryFn: async () => (await listAgencyOverview()) as unknown as AgencyOverviewRow[],
  });
