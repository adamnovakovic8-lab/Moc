import type { PlatformId } from "./klinova";

/**
 * Turns a plain-English idea into a conceptual system sketch.
 *
 * This is deliberately a small, readable, deterministic keyword map — not a
 * model, and it never claims to be one. The site says out loud that the
 * result is a sketch rather than a quote, and the shapes it draws are the
 * same building blocks Klinova actually ships.
 *
 * The same table backs the work order on sheet 06, so picking a sector there
 * offers exactly the modules the sketch would have drawn.
 */
export type Sector = {
  id: string;
  /** Sector label shown back to the visitor. */
  domain: string;
  /** The conceptual modules, in flow order. */
  modules: readonly string[];
  /** The closest thing Klinova has already built, if there is one. */
  nearest?: PlatformId;
  /** Words that point at this sector. */
  test: RegExp;
};

export const SECTORS: readonly Sector[] = [
  {
    id: "pharmacy",
    domain: "Pharmacy",
    modules: ["Patients", "Prescriptions", "Inventory", "Delivery", "Analytics"],
    nearest: "rx",
    test: /pharmac|prescrip|dispens|\brx\b|drug|medicat/i,
  },
  {
    id: "healthcare",
    domain: "Healthcare",
    modules: ["Patients", "Scheduling", "Charting", "E-prescribing", "Reporting"],
    nearest: "emr",
    test: /clinic|health|patient|medical|doctor|\bemr\b|chart|hospital|therap|dental/i,
  },
  {
    id: "public-funding",
    domain: "Public funding",
    modules: ["Applicants", "Intake", "Adjudication", "Disbursement", "Reporting"],
    nearest: "grant",
    test: /grant|funding|subsid|applicat|non-?profit|charit|bursar/i,
  },
  {
    id: "finance",
    domain: "Finance",
    modules: ["Clients", "Policies", "Positions", "Rebalancing", "Statements"],
    nearest: "policy",
    test: /invest|portfolio|wealth|advis|fund|asset|broker|insur|polic/i,
  },
  {
    id: "legal",
    domain: "Legal",
    modules: ["Documents", "Routing", "Signature", "Seal", "Audit trail"],
    nearest: "esign",
    test: /sign|document|contract|legal|\blaw\b|agreement|notar|matter/i,
  },
  {
    id: "manufacturing",
    domain: "Manufacturing",
    modules: ["Products", "Bill of materials", "Stock", "Point of sale", "Reporting"],
    nearest: "pos",
    test: /manufactur|inventor|stock|warehouse|factory|\bpos\b|retail|shop floor|assembl/i,
  },
  {
    id: "logistics",
    domain: "Logistics",
    modules: ["Orders", "Routing", "Tracking", "Proof of delivery", "Analytics"],
    nearest: "rx",
    test: /logistic|deliver|fleet|route|shipp|courier|dispatch|freight|track/i,
  },
  {
    id: "government",
    domain: "Government",
    modules: ["Citizens", "Intake", "Review", "Decision", "Reporting"],
    nearest: "grant",
    test: /govern|public|municipal|city|ministry|agency|permit|licen[cs]/i,
  },
  {
    id: "professional",
    domain: "Professional services",
    modules: ["Clients", "Matters", "Time", "Billing", "Reporting"],
    nearest: "esign",
    test: /bill|invoic|timesheet|\bfirm\b|consult|account|agency|client work|profession/i,
  },
];

export const FALLBACK: Sector = {
  id: "other",
  domain: "Your operation",
  modules: ["People", "Records", "Workflow", "Reporting", "Access control"],
  test: /(?!)/,
};

export type Shape = {
  domain: string;
  modules: readonly string[];
  nearest?: PlatformId;
  /** Which sector matched, so the work order can pick up where this left off. */
  sectorId: string;
};

/** The layer Klinova puts under everything, regardless of sector. */
export const SPINE = ["Roles & permissions", "Audit logging", "Encryption"] as const;

export function shapeIdea(input: string): Shape {
  const text = input.trim();
  const hit = text ? SECTORS.find((s) => s.test.test(text)) : undefined;
  const sector = hit ?? FALLBACK;
  return {
    domain: sector.domain,
    modules: sector.modules,
    nearest: sector.nearest,
    sectorId: sector.id,
  };
}

export function sectorById(id: string): Sector {
  return SECTORS.find((s) => s.id === id) ?? FALLBACK;
}

/**
 * Matches whatever the visitor typed against the sector table.
 *
 * Klinova has built for nine sectors, but people don't arrive in nine kinds.
 * Anything unrecognised falls back to the pieces every system needs, and
 * `matched` is returned so the UI can say honestly which of the two happened
 * rather than quietly implying we've done this exact thing before.
 */
export function matchSector(text: string): {
  sector: Sector;
  matched: boolean;
} {
  const t = text.trim();
  const hit = t ? SECTORS.find((s) => s.test.test(t)) : undefined;
  return { sector: hit ?? FALLBACK, matched: Boolean(hit) };
}

/** A few real starting points, so nobody faces an empty field. */
export const PROMPTS = [
  "I want software for my pharmacy.",
  "We need to get grant applications off spreadsheets.",
  "Contracts still get signed by email.",
  "Our shop floor and front office disagree on stock.",
] as const;
