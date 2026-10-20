

/**
 * The work order — what sheet 06 actually sends.
 *
 * Composition lives here, away from the UI, so the text a visitor sees in
 * the preview is provably the same text that goes into the email. Nothing is
 * submitted anywhere: the order is either handed to the visitor's own mail
 * client or copied to their clipboard. There is no endpoint, and the site
 * never pretends there is one.
 */
export type Order = {
  org: string;
  /** Free text — the visitor names their own sector. */
  sector: string;
  where: string;
  problem: string;
  needs: string[];
  constraints: string[];
  stage: string;
  name: string;
  email: string;
};

export const EMPTY: Order = {
  org: "",
  sector: "",
  where: "",
  problem: "",
  needs: [],
  constraints: [],
  stage: "",
  name: "",
  email: "",
};

/** The visitor's own constraints — statements about them, not about Klinova. */
export const CONSTRAINTS = [
  "Replacing an existing system",
  "Starting from scratch",
  "Handles personal health information",
  "Regulated or audited",
  "Multiple sites or locations",
  "Has to work on the floor, not just a desk",
  "Needs to talk to tools we already run",
] as const;

export const STAGES = [
  { id: "exploring", label: "Exploring — working out if this is worth doing" },
  { id: "scoping", label: "Scoping — working out what it would take" },
  { id: "ready", label: "Ready — budget agreed, looking for who builds it" },
] as const;

/** A draft reference for the visitor's own subject line. Not a record. */
export function reference(now: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  const stamp = `${String(now.getFullYear()).slice(2)}${p(now.getMonth() + 1)}${p(now.getDate())}`;
  const tail = `${p(now.getHours())}${p(now.getMinutes())}`;
  return `KLN-WO-${stamp}-${tail}`;
}

function block(title: string, lines: string[]): string {
  if (lines.length === 0) return "";
  return `${title}\n${lines.map((l) => `   ${l}`).join("\n")}\n\n`;
}

/** Wraps prose so the order still reads as a document in a plain-text email. */
function wrap(text: string, width = 62): string[] {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    if ((line + " " + w).trim().length > width) {
      lines.push(line.trim());
      line = w;
    } else {
      line = `${line} ${w}`;
    }
  }
  if (line.trim()) lines.push(line.trim());
  return lines;
}

export function compose(order: Order, ref: string, raised: string): string {
  const sector = order.sector.trim();
  const stage = STAGES.find((s) => s.id === order.stage)?.label ?? "";

  const who = [
    [order.org, sector].filter(Boolean).join(" — "),
    order.where ? `Operating in ${order.where}` : "",
  ].filter(Boolean);

  const reply = [order.name, order.email].filter(Boolean).join(" · ");

  return (
    `KLINOVA — WORK ORDER (DRAFT)\n` +
    `Reference  ${ref}\n` +
    `Raised     ${raised}\n\n` +
    block("01 · WHO", who) +
    block("02 · THE PROBLEM", wrap(order.problem)) +
    block(
      "03 · WHAT IT HAS TO DO",
      order.needs.map((n) => `· ${n}`),
    ) +
    block(
      "04 · CONSTRAINTS",
      order.constraints.map((c) => `· ${c}`),
    ) +
    block("05 · WHERE WE ARE", stage ? [stage] : []) +
    block("06 · REPLY TO", reply ? [reply] : []) +
    `—\nRaised from klinova.ca — sheet 06, work order.`
  );
}

/** What's still missing before this is worth an architect's time. */
export function gaps(order: Order): string[] {
  const missing: string[] = [];
  if (!order.problem.trim()) missing.push("what the problem is");
  if (!order.email.trim()) missing.push("an address to reply to");
  return missing;
}

export function subjectFor(order: Order, ref: string): string {
  const sector = order.sector.trim();
  const who = order.org || sector || "New enquiry";
  return `Work order ${ref} — ${who}`;
}
