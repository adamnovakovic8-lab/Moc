/**
 * Every string in this file came from Klinova’s own material.
 * Nothing here is invented — no statistics, no clients, no testimonials,
 * no partnerships, no team names, no years of experience.
 * If a fact is not in here, it does not go on the site.
 */

export const company = {
  name: "Klinova",
  legal: "Klinova Inc.",
  line: "Software that fits your business.",
  studios: ["Toronto", "Montréal", "Vancouver"] as const,
  email: "hello@klinova.ca",
  careersEmail: "careers@klinova.ca",
  reply: "One business day",
  replyNote:
    "A senior architect — not a salesperson — will map your workflow and show you what in-house software could look like.",
} as const;

export const trust = [
  "PIPEDA-ready architecture",
  "Encryption at rest & in transit",
  "MFA + audit logging",
] as const;

/** The three reasons, from Klinova’s own "Why" material. */
export const reasons = [
  {
    key: "A",
    title: "100% in-house",
    body: "Every line of code written by our Canadian team. No offshore hand-offs, no third-party cores — full customization and long-term support without asking anyone’s permission.",
  },
  {
    key: "B",
    title: "Secure by architecture",
    body: "Encryption at rest and in transit, role-based access, MFA and audit logging — designed in from the first commit, with PIPEDA-ready architecture as the default.",
  },
  {
    key: "C",
    title: "Shaped to you",
    body: "Off-the-shelf software makes you work its way. Ours studies how your operation actually runs, then takes that shape — and scales as you grow.",
  },
] as const;

/** The Klinova Method — six steps, verbatim from Klinova’s process material. */
export const method = [
  {
    n: "01",
    title: "Discover",
    body: "Deep-dive workshops that map how your operation actually runs — the real workflow, not the org chart.",
  },
  {
    n: "02",
    title: "Architect",
    body: "Security-first system design: data model, roles and threat model settled before a line of code ships.",
  },
  {
    n: "03",
    title: "Build",
    body: "In-house engineering with weekly demos. You watch the software take shape and steer it as it grows.",
  },
  {
    n: "04",
    title: "Secure",
    body: "Hardening, encryption, RBAC, MFA and audit logging — verified against a PIPEDA-ready baseline before launch.",
  },
  {
    n: "05",
    title: "Launch",
    body: "Deploy to Vercel, AWS or Azure with monitoring, backups and rollback in place from day one.",
  },
  {
    n: "06",
    title: "Evolve",
    body: "The same team stays on — support, iteration and scale for the long haul, not a hand-off to a stranger.",
  },
] as const;

export type PlatformId =
  | "emr"
  | "esign"
  | "grant"
  | "policy"
  | "rx"
  | "pos";

export type Platform = {
  id: PlatformId;
  n: string;
  name: string;
  /** One-word world label used as oversized type. */
  world: string;
  blurb: string;
  /** Real capability nouns, drawn from each platform’s own description. */
  parts: readonly string[];
  tags: readonly string[];
  /** Industries this platform serves, drawn from its own sector tags. */
  sectors: readonly string[];
  /** Each platform owns a hue so it reads as its own digital world. */
  accent: string;
  /** Ink used on top of the accent. */
  onAccent: string;
};

export const platforms: readonly Platform[] = [
  {
    id: "emr",
    n: "01",
    name: "Klinova EMR",
    world: "CLINICAL",
    blurb:
      "Electronic medical records, complete: scheduling, clinical charting, e-prescribing and secure patient messaging — PIPEDA-ready from the first line of code.",
    parts: ["Scheduling", "Charting", "E-prescribing", "Messaging"],
    tags: ["Healthcare", "Clinical", "RBAC"],
    sectors: ["Healthcare"],
    accent: "#2fc4bd",
    onAccent: "#08201f",
  },
  {
    id: "esign",
    n: "02",
    name: "E-Sign",
    world: "EVIDENCE",
    blurb:
      "Legally binding e-signature workflows with tamper-evident seals and full audit trails — without routing documents through someone else’s cloud.",
    parts: ["Prepare", "Route", "Sign", "Seal", "Audit"],
    tags: ["Legal", "Professional"],
    sectors: ["Legal", "Professional Services"],
    accent: "#8c6cff",
    onAccent: "#140c33",
  },
  {
    id: "grant",
    n: "03",
    name: "Grant Master",
    world: "ADJUDICATION",
    blurb:
      "End-to-end grant lifecycle management — intake, adjudication, disbursement and reporting, built for public-funding compliance.",
    parts: ["Intake", "Adjudication", "Disbursement", "Reporting"],
    tags: ["Government", "Non-profit"],
    sectors: ["Government"],
    accent: "#23a55a",
    onAccent: "#04180d",
  },
  {
    id: "policy",
    n: "04",
    name: "Policy Pulse",
    world: "POSITION",
    blurb:
      "Investment portfolio management that keeps every policy, position and rebalance audit-ready — real-time views for advisors, clean statements for clients.",
    parts: ["Policies", "Positions", "Rebalance", "Statements"],
    tags: ["Finance", "Compliance"],
    sectors: ["Finance"],
    accent: "#ffb43d",
    onAccent: "#2a1a02",
  },
  {
    id: "rx",
    n: "05",
    name: "Rx Delivery",
    world: "CUSTODY",
    blurb:
      "Pharmacy delivery from dispensary to doorstep — route optimization, cold-chain flags, proof of delivery and full chain of custody.",
    parts: ["Dispensary", "Route", "Cold chain", "Proof of delivery"],
    tags: ["Pharmacy", "Logistics"],
    sectors: ["Pharmacy", "Logistics"],
    accent: "#2f7bff",
    onAccent: "#04122e",
  },
  {
    id: "pos",
    n: "06",
    name: "POS + Inventory",
    world: "FLOOR",
    blurb:
      "Manufacturing point-of-sale and live inventory control in one system — bill of materials, barcode scanning, floor-to-front-office sync.",
    parts: ["Bill of materials", "Barcode", "Stock", "Front office"],
    tags: ["Manufacturing"],
    sectors: ["Manufacturing"],
    accent: "#e0409a",
    onAccent: "#2b0619",
  },
];

export const industries = [
  { n: "01", name: "Healthcare", line: "Clinical systems that respect both clinicians and privacy law." },
  { n: "02", name: "Finance", line: "Audit-ready platforms for firms that answer to regulators." },
  { n: "03", name: "Government", line: "Public-sector software with public-sector accountability." },
  { n: "04", name: "Manufacturing", line: "From shop floor to front office, one source of truth." },
  { n: "05", name: "Logistics", line: "Routing, tracking and custody — visible end to end." },
  { n: "06", name: "Professional Services", line: "Workflow engines shaped around how your firm actually bills." },
  { n: "07", name: "Pharmacy", line: "Dispensing to doorstep, with the paper trail built in." },
  { n: "08", name: "Legal", line: "Documents, signatures and matters — secured and searchable." },
] as const;

export const chapters = [
  { id: "entry", n: "00", label: "Entry" },
  { id: "premise", n: "01", label: "Premise" },
  { id: "method", n: "02", label: "Method" },
  { id: "platforms", n: "03", label: "Platforms" },
  { id: "territory", n: "04", label: "Territory" },
  { id: "idea", n: "05", label: "Your idea" },
  { id: "contact", n: "06", label: "Contact" },
] as const;
