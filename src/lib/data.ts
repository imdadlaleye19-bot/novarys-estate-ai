import prop1 from "@/assets/prop-1.jpg";
import prop2 from "@/assets/prop-2.jpg";
import prop3 from "@/assets/prop-3.jpg";
import prop4 from "@/assets/prop-4.jpg";
import prop5 from "@/assets/prop-5.jpg";
import prop6 from "@/assets/prop-6.jpg";
import prop7 from "@/assets/prop-7.jpg";
import prop8 from "@/assets/prop-8.jpg";
import hero from "@/assets/hero.jpg";

export const heroImage = hero;

export type PropertyType = "Appartement" | "Villa" | "Terrain" | "Bureau";
export type Transaction = "Achat" | "Location";
export const LOCATIONS = ["Cocody", "Riviera", "Marcory", "Plateau", "Bingerville"] as const;
export const PROPERTY_TYPES: PropertyType[] = ["Appartement", "Villa", "Terrain", "Bureau"];
export const TRANSACTIONS: Transaction[] = ["Achat", "Location"];

export const AGENCY_WHATSAPP = "+2290153960139";
export const AGENCY_WHATSAPP_DISPLAY = "+229 01 53 96 01 39";

export function getWhatsAppLink(message?: string) {
  const number = AGENCY_WHATSAPP.replace(/\D/g, "");
  const url = new URL(`https://wa.me/${number}`);
  if (message) url.searchParams.set("text", message);
  return url.toString();
}

export interface Property {
  id: string;
  name: string;
  type: PropertyType;
  transaction: Transaction;
  location: string;
  address: string;
  price: number;
  surface: number;
  bedrooms: number;
  bathrooms: number;
  image: string;
  gallery: string[];
  features: string[];
  description: string;
  highlights: string[];
  available: boolean;
}

export const properties: Property[] = [
  {
    id: "villa-contemporaine-riviera-3",
    name: "Villa Contemporaine Riviera 3",
    type: "Villa",
    transaction: "Achat",
    location: "Riviera",
    address: "Riviera 3, Cocody — Abidjan",
    price: 850_000_000,
    surface: 650,
    bedrooms: 5,
    bathrooms: 6,
    image: prop1,
    gallery: [prop1, prop6, prop2, prop5],
    features: ["Garage", "Piscine", "Jardin", "Sécurité 24/7", "Climatisation", "Cuisine équipée"],
    description:
      "Signature architecturale contemporaine sur une parcelle arborée de 900 m², cette villa de 650 m² habitables associe volumes généreux, lumière naturelle traversante et matériaux nobles. Le rez-de-chaussée s'ouvre entièrement sur la terrasse et la piscine à débordement. L'étage accueille cinq suites dont une master de 55 m² avec dressing et terrasse privative.",
    highlights: [
      "Quartier résidentiel prisé, à 8 minutes des écoles internationales",
      "Livrée entièrement équipée, prête à habiter",
      "Rendement locatif estimé à 7,2 % en location meublée",
    ],
    available: true,
  },
  {
    id: "appartement-premium-riviera-2",
    name: "Appartement Premium Riviera 2",
    type: "Appartement",
    transaction: "Location",
    location: "Riviera",
    address: "Riviera 2, Cocody — Abidjan",
    price: 550_000,
    surface: 145,
    bedrooms: 3,
    bathrooms: 2,
    image: prop2,
    gallery: [prop2, prop7, prop5, prop1],
    features: ["Ascenseur", "Parking privé", "Sécurité 24/7", "Climatisation", "Balcon"],
    description:
      "Appartement de standing au 7e étage d'une résidence sécurisée récente. Séjour double orienté ouest avec vue dégagée, trois chambres dont une suite parentale, cuisine américaine équipée et deux places de parking en sous-sol.",
    highlights: [
      "Charges incluses dans le loyer mensuel",
      "Résidence avec salle de sport et local vélos",
      "Disponible immédiatement",
    ],
    available: true,
  },
  {
    id: "immeuble-bureaux-plateau",
    name: "Plateau Business Center — Plateau 4e étage",
    type: "Bureau",
    transaction: "Location",
    location: "Plateau",
    address: "Avenue Botreau-Roussel, Plateau — Abidjan",
    price: 2_500_000,
    surface: 320,
    bedrooms: 0,
    bathrooms: 3,
    image: prop3,
    gallery: [prop3, prop8, prop2],
    features: ["Fibre optique", "Groupe électrogène", "Parking visiteurs", "Sécurité 24/7", "Ascenseurs"],
    description:
      "Plateau de bureaux de 320 m² livré aménagé au cœur du quartier d'affaires. Open space modulable, trois bureaux fermés, salle de réunion 14 places et espace détente. Immeuble certifié avec double alimentation électrique.",
    highlights: [
      "Adresse premium au centre du quartier d'affaires",
      "Aménagement modulable selon vos équipes",
      "Bail 3/6/9 négociable",
    ],
    available: true,
  },
  {
    id: "terrain-vue-lagune-bingerville",
    name: "Terrain Vue Lagune — Bingerville",
    type: "Terrain",
    transaction: "Achat",
    location: "Bingerville",
    address: "Route de Bingerville — Abidjan",
    price: 120_000_000,
    surface: 1200,
    bedrooms: 0,
    bathrooms: 0,
    image: prop4,
    gallery: [prop4, prop1],
    features: ["Titre foncier", "Viabilisé", "Vue lagune", "Accès bitumé"],
    description:
      "Parcelle de 1 200 m² avec vue directe sur la lagune Ébrié, entièrement viabilisée et disposant d'un titre foncier définitif. Idéale pour un projet de villa d'exception ou une petite résidence de standing.",
    highlights: [
      "Titre foncier purgé, transaction sécurisée",
      "Zone en forte valorisation (+18 % sur 24 mois)",
      "Constructible immédiatement",
    ],
    available: true,
  },
  {
    id: "penthouse-cocody-ambassades",
    name: "Penthouse Cocody Ambassades",
    type: "Appartement",
    transaction: "Achat",
    location: "Cocody",
    address: "Quartier des Ambassades, Cocody — Abidjan",
    price: 320_000_000,
    surface: 210,
    bedrooms: 4,
    bathrooms: 3,
    image: prop5,
    gallery: [prop5, prop2, prop7],
    features: ["Terrasse 60 m²", "Ascenseur privatif", "Piscine commune", "Sécurité 24/7", "Domotique"],
    description:
      "Dernier étage d'une résidence signature de 12 logements. Terrasse panoramique de 60 m² orientée lagune, séjour de 70 m², quatre chambres et système domotique intégré. Deux places de parking et une cave.",
    highlights: [
      "Vue lagune imprenable, dernier étage",
      "Résidence livrée en 2024, garanties constructeur actives",
      "Quartier diplomatique très recherché",
    ],
    available: true,
  },
  {
    id: "villa-duplex-cocody-angre",
    name: "Villa Duplex Cocody Angré",
    type: "Villa",
    transaction: "Location",
    location: "Cocody",
    address: "Angré 8e tranche, Cocody — Abidjan",
    price: 1_200_000,
    surface: 300,
    bedrooms: 4,
    bathrooms: 4,
    image: prop6,
    gallery: [prop6, prop1, prop2],
    features: ["Garage 2 voitures", "Jardin", "Sécurité 24/7", "Climatisation", "Studio indépendant"],
    description:
      "Duplex familial de 300 m² dans une rue calme d'Angré. Quatre chambres en suite, double séjour, cuisine équipée, studio indépendant pour le personnel et jardin paysager de 200 m².",
    highlights: [
      "Idéale pour famille d'expatriés",
      "Proche écoles internationales et supermarchés",
      "Disponible sous 15 jours",
    ],
    available: true,
  },
  {
    id: "appartement-standing-marcory-zone4",
    name: "Appartement Standing Marcory Zone 4",
    type: "Appartement",
    transaction: "Location",
    location: "Marcory",
    address: "Zone 4C, Marcory — Abidjan",
    price: 450_000,
    surface: 110,
    bedrooms: 3,
    bathrooms: 2,
    image: prop7,
    gallery: [prop7, prop2, prop8],
    features: ["Ascenseur", "Parking", "Sécurité 24/7", "Balcon", "Cuisine équipée"],
    description:
      "Appartement lumineux de 110 m² au 3e étage, à deux pas des commerces et restaurants de la Zone 4. Trois chambres, séjour avec balcon, cuisine équipée et place de parking dédiée.",
    highlights: [
      "Rapport qualité-prix le plus fort du secteur",
      "Quartier animé, très bien desservi",
      "Bail 1 an renouvelable, 2 mois de caution",
    ],
    available: true,
  },
  {
    id: "bureau-open-space-marcory",
    name: "Bureau Open Space Marcory",
    type: "Bureau",
    transaction: "Achat",
    location: "Marcory",
    address: "Zone 4, Marcory — Abidjan",
    price: 190_000_000,
    surface: 240,
    bedrooms: 0,
    bathrooms: 2,
    image: prop8,
    gallery: [prop8, prop3],
    features: ["Open space", "Fibre optique", "Parking 8 places", "Climatisation centralisée"],
    description:
      "Plateau de 240 m² entièrement rénové en 2025, pensé pour une équipe de 30 à 40 personnes. Open space lumineux, deux salles de réunion vitrées, cuisine partagée et 8 places de parking privatives.",
    highlights: [
      "Rénovation complète récente, aucun travaux à prévoir",
      "Accès direct au boulevard VGE",
      "Investissement locatif possible dès la livraison",
    ],
    available: true,
  },
];

export function getProperty(id: string) {
  return properties.find((p) => p.id === id);
}

export function formatPrice(p: Pick<Property, "price" | "transaction">) {
  const amount = new Intl.NumberFormat("fr-FR").format(p.price);
  return p.transaction === "Location" ? `${amount} FCFA/mois` : `${amount} FCFA`;
}

export function formatCompact(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(value >= 10_000_000 ? 0 : 1)}M`;
  if (value >= 1_000) return `${Math.round(value / 1_000)}k`;
  return `${value}`;
}

/* ------------------------------- CRM data ------------------------------- */

export type LeadStatus =
  | "New"
  | "Qualified"
  | "Hot"
  | "Contacted"
  | "Visit Scheduled"
  | "Negotiation"
  | "Won";

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  project: "Location" | "Achat" | "Investissement";
  budget: number;
  budgetLabel: string;
  location: string;
  propertyType: PropertyType;
  bedrooms: number;
  moveIn: string;
  score: number;
  status: LeadStatus;
  stage: PipelineStage;
  date: string;
  source: "Instagram" | "Google" | "Facebook" | "Direct" | "WhatsApp";
  aiSummary: string;
  matches: string[];
  timeline: { label: string; date: string; done: boolean }[];
}

export type PipelineStage =
  | "New Leads"
  | "Qualified"
  | "Contacted"
  | "Visit Scheduled"
  | "Negotiation"
  | "Won";

export const PIPELINE_STAGES: PipelineStage[] = [
  "New Leads",
  "Qualified",
  "Contacted",
  "Visit Scheduled",
  "Negotiation",
  "Won",
];

const tl = (steps: [string, string, boolean][]) =>
  steps.map(([label, date, done]) => ({ label, date, done }));

export const leads: Lead[] = [
  {
    id: "jean-k",
    name: "Jean K.",
    phone: "+225 07 88 41 22 10",
    email: "jean.k@example.ci",
    project: "Location",
    budget: 600_000,
    budgetLabel: "600 000 FCFA/mois",
    location: "Cocody / Riviera",
    propertyType: "Appartement",
    bedrooms: 3,
    moveIn: "Moins d'un mois",
    score: 94,
    status: "Qualified",
    stage: "Qualified",
    date: "2026-08-14",
    source: "Instagram",
    aiSummary:
      "Prospect hautement qualifié. Recherche un appartement 3 chambres à Cocody/Riviera avec un budget maximum de 600 000 FCFA/mois. Projet immédiat, disponible pour une visite cette semaine.",
    matches: ["appartement-premium-riviera-2", "appartement-standing-marcory-zone4", "villa-duplex-cocody-angre"],
    timeline: tl([
      ["Lead créé depuis la recherche IA", "14 août, 09:12", true],
      ["Qualification IA terminée — score 94/100", "14 août, 09:13", true],
      ["3 biens recommandés automatiquement", "14 août, 09:14", true],
      ["Sélection envoyée sur WhatsApp", "14 août, 09:22", true],
      ["Visite programmée", "18 août, 11:00", false],
    ]),
  },
  {
    id: "sarah-m",
    name: "Sarah M.",
    phone: "+225 05 44 12 90 08",
    email: "sarah.m@example.ci",
    project: "Achat",
    budget: 180_000_000,
    budgetLabel: "180 000 000 FCFA",
    location: "Riviera",
    propertyType: "Villa",
    bedrooms: 4,
    moveIn: "1 à 3 mois",
    score: 91,
    status: "Hot",
    stage: "Visit Scheduled",
    date: "2026-08-13",
    source: "Google",
    aiSummary:
      "Acquéreuse sérieuse, financement bancaire pré-accordé. Cherche une villa 4 chambres à Riviera. Sensible à la sécurité et à la proximité des écoles internationales.",
    matches: ["villa-contemporaine-riviera-3", "villa-duplex-cocody-angre", "penthouse-cocody-ambassades"],
    timeline: tl([
      ["Lead créé depuis la recherche IA", "13 août, 16:40", true],
      ["Qualification IA terminée — score 91/100", "13 août, 16:41", true],
      ["Contact WhatsApp établi", "13 août, 18:05", true],
      ["Visite programmée", "17 août, 10:00", true],
    ]),
  },
  {
    id: "marc-a",
    name: "Marc A.",
    phone: "+225 01 22 76 33 41",
    email: "marc.a@example.ci",
    project: "Location",
    budget: 450_000,
    budgetLabel: "450 000 FCFA/mois",
    location: "Marcory",
    propertyType: "Appartement",
    bedrooms: 3,
    moveIn: "1 à 3 mois",
    score: 78,
    status: "Contacted",
    stage: "Contacted",
    date: "2026-08-12",
    source: "Facebook",
    aiSummary:
      "Prospect intéressé par un 3 chambres en Zone 4. Budget serré mais cohérent avec l'offre disponible. À relancer après le 1er septembre.",
    matches: ["appartement-standing-marcory-zone4", "appartement-premium-riviera-2"],
    timeline: tl([
      ["Lead créé depuis le formulaire", "12 août, 11:02", true],
      ["Qualification IA terminée — score 78/100", "12 août, 11:03", true],
      ["Appel conseiller effectué", "12 août, 15:30", true],
      ["Relance planifiée", "01 sept.", false],
    ]),
  },
  {
    id: "aisha-d",
    name: "Aïcha D.",
    phone: "+225 07 90 55 11 76",
    email: "aicha.d@example.ci",
    project: "Investissement",
    budget: 120_000_000,
    budgetLabel: "120 000 000 FCFA",
    location: "Bingerville",
    propertyType: "Terrain",
    bedrooms: 0,
    moveIn: "3 à 6 mois",
    score: 84,
    status: "Qualified",
    stage: "Qualified",
    date: "2026-08-11",
    source: "WhatsApp",
    aiSummary:
      "Investisseuse basée à Dakar. Recherche un terrain viabilisé avec titre foncier à Bingerville pour un projet locatif. Décision attendue sous 90 jours.",
    matches: ["terrain-vue-lagune-bingerville"],
    timeline: tl([
      ["Lead créé depuis WhatsApp", "11 août, 08:20", true],
      ["Qualification IA terminée — score 84/100", "11 août, 08:21", true],
      ["Dossier investisseur transmis", "11 août, 14:10", true],
    ]),
  },
  {
    id: "olivier-t",
    name: "Olivier T.",
    phone: "+225 05 12 88 40 03",
    email: "olivier.t@example.ci",
    project: "Location",
    budget: 2_500_000,
    budgetLabel: "2 500 000 FCFA/mois",
    location: "Plateau",
    propertyType: "Bureau",
    bedrooms: 0,
    moveIn: "Immédiatement",
    score: 88,
    status: "Negotiation",
    stage: "Negotiation",
    date: "2026-08-10",
    source: "Direct",
    aiSummary:
      "Directeur d'une société de services de 35 salariés. Recherche 300 m² de bureaux au Plateau, emménagement immédiat. Négociation en cours sur la durée du bail.",
    matches: ["immeuble-bureaux-plateau", "bureau-open-space-marcory"],
    timeline: tl([
      ["Lead créé depuis le formulaire", "10 août, 10:15", true],
      ["Qualification IA terminée — score 88/100", "10 août, 10:16", true],
      ["Visite effectuée", "12 août, 09:00", true],
      ["Proposition commerciale envoyée", "13 août, 17:45", true],
    ]),
  },
  {
    id: "fatou-b",
    name: "Fatou B.",
    phone: "+221 77 651 20 14",
    email: "fatou.b@example.sn",
    project: "Achat",
    budget: 320_000_000,
    budgetLabel: "320 000 000 FCFA",
    location: "Cocody",
    propertyType: "Appartement",
    bedrooms: 4,
    moveIn: "1 à 3 mois",
    score: 90,
    status: "Won",
    stage: "Won",
    date: "2026-08-08",
    source: "Instagram",
    aiSummary:
      "Cliente sénégalaise, achat résidence secondaire à Abidjan. Compromis signé sur le penthouse Cocody Ambassades.",
    matches: ["penthouse-cocody-ambassades"],
    timeline: tl([
      ["Lead créé depuis la recherche IA", "08 août, 12:00", true],
      ["Qualification IA terminée — score 90/100", "08 août, 12:01", true],
      ["Visite virtuelle réalisée", "09 août, 15:00", true],
      ["Compromis signé", "15 août, 11:30", true],
    ]),
  },
  {
    id: "kevin-n",
    name: "Kevin N.",
    phone: "+229 97 22 41 08",
    email: "kevin.n@example.bj",
    project: "Location",
    budget: 800_000,
    budgetLabel: "800 000 FCFA/mois",
    location: "Cocody",
    propertyType: "Villa",
    bedrooms: 4,
    moveIn: "Plus tard",
    score: 62,
    status: "New",
    stage: "New Leads",
    date: "2026-08-16",
    source: "Facebook",
    aiSummary:
      "Prospect en phase d'exploration depuis Cotonou. Projet de mutation professionnelle non confirmé. À nourrir par e-mail.",
    matches: ["villa-duplex-cocody-angre"],
    timeline: tl([
      ["Lead créé depuis la recherche IA", "16 août, 19:44", true],
      ["Qualification IA terminée — score 62/100", "16 août, 19:45", true],
    ]),
  },
  {
    id: "nadia-r",
    name: "Nadia R.",
    phone: "+225 07 31 09 55 27",
    email: "nadia.r@example.ci",
    project: "Achat",
    budget: 850_000_000,
    budgetLabel: "850 000 000 FCFA",
    location: "Riviera",
    propertyType: "Villa",
    bedrooms: 5,
    moveIn: "3 à 6 mois",
    score: 86,
    status: "Visit Scheduled",
    stage: "Visit Scheduled",
    date: "2026-08-15",
    source: "Google",
    aiSummary:
      "Acquéreuse haut de gamme, recherche une villa signature de 5 chambres à Riviera. Visite de la Villa Contemporaine Riviera 3 programmée.",
    matches: ["villa-contemporaine-riviera-3"],
    timeline: tl([
      ["Lead créé depuis la recherche IA", "15 août, 08:31", true],
      ["Qualification IA terminée — score 86/100", "15 août, 08:32", true],
      ["Visite programmée", "19 août, 16:00", true],
    ]),
  },
  {
    id: "yao-s",
    name: "Yao S.",
    phone: "+225 05 77 12 66 90",
    email: "yao.s@example.ci",
    project: "Investissement",
    budget: 190_000_000,
    budgetLabel: "190 000 000 FCFA",
    location: "Marcory",
    propertyType: "Bureau",
    bedrooms: 0,
    moveIn: "1 à 3 mois",
    score: 71,
    status: "New",
    stage: "New Leads",
    date: "2026-08-16",
    source: "Direct",
    aiSummary:
      "Investisseur cherchant un plateau de bureaux à louer ensuite à une entreprise. Sensible au rendement net.",
    matches: ["bureau-open-space-marcory"],
    timeline: tl([
      ["Lead créé depuis le formulaire", "16 août, 14:05", true],
      ["Qualification IA terminée — score 71/100", "16 août, 14:06", true],
    ]),
  },
  {
    id: "leila-c",
    name: "Leïla C.",
    phone: "+225 01 45 78 23 60",
    email: "leila.c@example.ci",
    project: "Location",
    budget: 550_000,
    budgetLabel: "550 000 FCFA/mois",
    location: "Riviera",
    propertyType: "Appartement",
    bedrooms: 3,
    moveIn: "Immédiatement",
    score: 89,
    status: "Contacted",
    stage: "Contacted",
    date: "2026-08-14",
    source: "WhatsApp",
    aiSummary:
      "Recherche urgente d'un 3 chambres à Riviera, emménagement sous 3 semaines. Dossier locatif complet déjà fourni.",
    matches: ["appartement-premium-riviera-2"],
    timeline: tl([
      ["Lead créé depuis WhatsApp", "14 août, 20:11", true],
      ["Qualification IA terminée — score 89/100", "14 août, 20:12", true],
      ["Contact conseiller établi", "15 août, 09:00", true],
    ]),
  },
  {
    id: "ibrahim-g",
    name: "Ibrahim G.",
    phone: "+225 07 65 43 21 09",
    email: "ibrahim.g@example.ci",
    project: "Achat",
    budget: 95_000_000,
    budgetLabel: "95 000 000 FCFA",
    location: "Bingerville",
    propertyType: "Terrain",
    bedrooms: 0,
    moveIn: "Plus tard",
    score: 58,
    status: "New",
    stage: "New Leads",
    date: "2026-08-16",
    source: "Instagram",
    aiSummary:
      "Budget légèrement inférieur aux terrains disponibles à Bingerville. Proposer une parcelle plus petite ou un paiement échelonné.",
    matches: ["terrain-vue-lagune-bingerville"],
    timeline: tl([["Lead créé depuis la recherche IA", "16 août, 21:02", true]]),
  },
  {
    id: "clarisse-e",
    name: "Clarisse E.",
    phone: "+225 05 90 33 74 12",
    email: "clarisse.e@example.ci",
    project: "Location",
    budget: 1_200_000,
    budgetLabel: "1 200 000 FCFA/mois",
    location: "Cocody",
    propertyType: "Villa",
    bedrooms: 4,
    moveIn: "1 à 3 mois",
    score: 82,
    status: "Qualified",
    stage: "Qualified",
    date: "2026-08-13",
    source: "Google",
    aiSummary:
      "Famille d'expatriés, mutation confirmée en octobre. Cherche une villa 4 chambres à Angré avec studio pour le personnel.",
    matches: ["villa-duplex-cocody-angre"],
    timeline: tl([
      ["Lead créé depuis la recherche IA", "13 août, 07:55", true],
      ["Qualification IA terminée — score 82/100", "13 août, 07:56", true],
      ["Sélection envoyée par e-mail", "13 août, 08:30", true],
    ]),
  },
];

export function getLead(id: string) {
  return leads.find((l) => l.id === id);
}

/* ------------------------------ Analytics ------------------------------- */

export const kpis = [
  { label: "Website visitors", value: "1 248", delta: "+18,4 %" },
  { label: "New leads", value: "186", delta: "+12,1 %" },
  { label: "Qualified leads", value: "72", delta: "+9,6 %" },
  { label: "Scheduled visits", value: "24", delta: "+6,2 %" },
  { label: "Active negotiations", value: "8", delta: "+2,0 %" },
];

export const leadsGenerated = [
  { month: "Mars", leads: 96, qualified: 34 },
  { month: "Avril", leads: 118, qualified: 41 },
  { month: "Mai", leads: 132, qualified: 52 },
  { month: "Juin", leads: 149, qualified: 58 },
  { month: "Juil.", leads: 167, qualified: 64 },
  { month: "Août", leads: 186, qualified: 72 },
];

export const trafficData = [
  { day: "Lun", visitors: 142 },
  { day: "Mar", visitors: 168 },
  { day: "Mer", visitors: 154 },
  { day: "Jeu", visitors: 201 },
  { day: "Ven", visitors: 232 },
  { day: "Sam", visitors: 196 },
  { day: "Dim", visitors: 155 },
];

export const trafficSources = [
  { name: "Instagram", value: 47 },
  { name: "Google", value: 31 },
  { name: "Facebook", value: 15 },
  { name: "Direct", value: 7 },
];

export const propertyInterest = [
  { type: "Appartement", demandes: 82 },
  { type: "Villa", demandes: 61 },
  { type: "Bureau", demandes: 28 },
  { type: "Terrain", demandes: 15 },
];

export const qualificationFunnel = [
  { step: "Visiteurs", value: 1248 },
  { step: "Recherche IA", value: 412 },
  { step: "Leads", value: 186 },
  { step: "Qualifiés", value: 72 },
  { step: "Visites", value: 24 },
  { step: "Signatures", value: 6 },
];

export const requestedLocations = [
  { name: "Cocody", value: 38 },
  { name: "Riviera", value: 27 },
  { name: "Marcory", value: 18 },
  { name: "Plateau", value: 11 },
  { name: "Bingerville", value: 6 },
];

export const requestedBudgets = [
  { name: "< 500k FCFA/mois", value: 34 },
  { name: "500k – 1M FCFA/mois", value: 29 },
  { name: "100M – 300M FCFA", value: 21 },
  { name: "> 300M FCFA", value: 16 },
];

export const aiActivity = [
  { title: "L'IA a qualifié un nouveau prospect", detail: "Kevin N. — score 62/100", time: "il y a 4 min" },
  { title: "L'IA a recommandé 3 biens", detail: "Jean K. — Cocody / Riviera", time: "il y a 22 min" },
  { title: "Nouveau prospect WhatsApp", detail: "Leïla C. — Appartement Riviera", time: "il y a 1 h" },
  { title: "Visite programmée", detail: "Nadia R. — Villa Contemporaine Riviera 3", time: "il y a 3 h" },
  { title: "L'IA a relancé un prospect inactif", detail: "Marc A. — relance automatique", time: "il y a 5 h" },
];

export const chartColors = {
  ink: "oklch(0.26 0.028 165)",
  bronze: "oklch(0.68 0.095 68)",
  teal: "oklch(0.6 0.075 190)",
  sand: "oklch(0.78 0.06 90)",
  deep: "oklch(0.45 0.05 175)",
};

export const chartPalette = [
  chartColors.ink,
  chartColors.bronze,
  chartColors.teal,
  chartColors.sand,
  chartColors.deep,
];
