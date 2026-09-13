import type {
  Lead,
  LeadStatus,
  PipelineStage,
  Property,
  PropertyType,
  Transaction,
} from "@/lib/data";
import { galleryFor, imageFor } from "@/lib/property-images";

export interface PropertyRow {
  id: string;
  name: string;
  type: string;
  transaction: string;
  location: string;
  address: string | null;
  price: number;
  surface: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  image_url: string | null;
  gallery: string[] | null;
  features: string[] | null;
  description: string | null;
  highlights: string[] | null;
  available: boolean | null;
}

export function mapProperty(row: PropertyRow): Property {
  return {
    id: row.id,
    name: row.name,
    type: row.type as PropertyType,
    transaction: row.transaction as Transaction,
    location: row.location,
    address: row.address ?? row.location,
    price: Number(row.price),
    surface: Number(row.surface ?? 0),
    bedrooms: row.bedrooms ?? 0,
    bathrooms: row.bathrooms ?? 0,
    image: imageFor(row.id, row.image_url, row.gallery),
    gallery: galleryFor(row.id, row.gallery),
    features: row.features ?? [],
    description: row.description ?? "",
    highlights: row.highlights ?? [],
    available: row.available ?? true,
  };
}

export interface LeadRow {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  project: string | null;
  budget: number | null;
  budget_label: string | null;
  location: string | null;
  property_type: string | null;
  bedrooms: number | null;
  move_in: string | null;
  score: number | null;
  status: string | null;
  stage: string | null;
  source: string | null;
  ai_summary: string | null;
  matches: string[] | null;
  created_at: string;
}

export interface TimelineRow {
  lead_id: string | null;
  label: string;
  event_date: string | null;
  done: boolean | null;
  created_at: string;
}

export function mapLead(row: LeadRow, timeline: TimelineRow[] = []): Lead {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone ?? "",
    email: row.email ?? "",
    project: (row.project ?? "Achat") as Lead["project"],
    budget: Number(row.budget ?? 0),
    budgetLabel: row.budget_label ?? "Non précisé",
    location: row.location ?? "—",
    propertyType: (row.property_type ?? "Appartement") as PropertyType,
    bedrooms: row.bedrooms ?? 0,
    moveIn: row.move_in ?? "Non précisé",
    score: row.score ?? 0,
    status: (row.status ?? "New") as LeadStatus,
    stage: (row.stage ?? "New Leads") as PipelineStage,
    date: row.created_at.slice(0, 10),
    source: (row.source ?? "Direct") as Lead["source"],
    aiSummary: row.ai_summary ?? "",
    matches: row.matches ?? [],
    timeline: timeline
      .filter((t) => t.lead_id === row.id)
      .map((t) => ({ label: t.label, date: t.event_date ?? "", done: Boolean(t.done) })),
  };
}
