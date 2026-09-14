import type { Lead, Property } from "@/lib/data";

const QUALIFIED: string[] = ["Qualified", "Hot", "Contacted", "Visit Scheduled", "Negotiation", "Won"];

export function leadKpis(leads: Lead[], properties: Property[]) {
  const total = leads.length;
  const qualified = leads.filter((l) => QUALIFIED.includes(l.status)).length;
  const visits = leads.filter((l) => l.status === "Visit Scheduled" || l.stage === "Visit Scheduled").length;
  const negotiations = leads.filter((l) => l.status === "Negotiation" || l.stage === "Negotiation").length;
  const won = leads.filter((l) => l.status === "Won" || l.stage === "Closed Won").length;
  const conversion = total ? (won / total) * 100 : 0;
  const avgScore = total ? Math.round(leads.reduce((s, l) => s + l.score, 0) / total) : 0;
  return {
    total,
    qualified,
    visits,
    negotiations,
    won,
    conversion,
    avgScore,
    availableProperties: properties.filter((p) => p.available).length,
    pipelineValue: leads.reduce((s, l) => s + l.budget, 0),
  };
}

export function leadsByMonth(leads: Lead[]) {
  const months = new Map<string, { month: string; leads: number; qualified: number }>();
  for (const l of leads) {
    const key = l.date.slice(0, 7);
    const label = new Date(`${key}-01T00:00:00Z`).toLocaleDateString("fr-FR", {
      month: "short",
      timeZone: "UTC",
    });
    const entry = months.get(key) ?? { month: label, leads: 0, qualified: 0 };
    entry.leads += 1;
    if (QUALIFIED.includes(l.status)) entry.qualified += 1;
    months.set(key, entry);
  }
  return [...months.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([, v]) => v);
}

function countBy<T>(items: T[], key: (item: T) => string) {
  const map = new Map<string, number>();
  for (const item of items) {
    const k = key(item);
    map.set(k, (map.get(k) ?? 0) + 1);
  }
  return [...map.entries()].sort((a, b) => b[1] - a[1]);
}

export function propertyInterestFrom(leads: Lead[]) {
  return countBy(leads, (l) => l.propertyType).map(([type, demandes]) => ({ type, demandes }));
}

export function requestedLocationsFrom(leads: Lead[]) {
  const total = leads.length || 1;
  return countBy(leads, (l) => l.location).map(([name, n]) => ({
    name,
    value: Math.round((n / total) * 100),
  }));
}

const BUDGET_BANDS: { name: string; max: number }[] = [
  { name: "< 500 000 FCFA/mois", max: 500_000 },
  { name: "500 000 – 1 M FCFA", max: 1_000_000 },
  { name: "1 M – 50 M FCFA", max: 50_000_000 },
  { name: "50 M – 150 M FCFA", max: 150_000_000 },
  { name: "> 150 M FCFA", max: Number.POSITIVE_INFINITY },
];

export function requestedBudgetsFrom(leads: Lead[]) {
  const total = leads.length || 1;
  return BUDGET_BANDS.map((band, i) => {
    const min = i === 0 ? 0 : BUDGET_BANDS[i - 1]!.max;
    const n = leads.filter((l) => l.budget > min && l.budget <= band.max).length;
    return { name: band.name, value: Math.round((n / total) * 100) };
  }).filter((b) => b.value > 0);
}

export function funnelFrom(leads: Lead[]) {
  const k = leadKpis(leads, []);
  return [
    { step: "Prospects reçus", value: k.total },
    { step: "Qualifiés par l'IA", value: k.qualified },
    { step: "Visites programmées", value: k.visits },
    { step: "Négociations", value: k.negotiations },
    { step: "Ventes conclues", value: k.won },
  ].filter((s) => s.value > 0 || s.step === "Prospects reçus");
}

export function topRequestedProperties(leads: Lead[], properties: Property[]) {
  const counts = new Map<string, number>();
  for (const l of leads) for (const id of l.matches) counts.set(id, (counts.get(id) ?? 0) + 1);
  return [...counts.entries()]
    .map(([id, value]) => ({ name: properties.find((p) => p.id === id)?.name ?? id, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 4);
}
