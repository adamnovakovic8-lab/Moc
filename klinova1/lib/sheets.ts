/**
 * The site is a set of drawing sheets, numbered 00–06.
 *
 * Splitting the experience across routes risks losing the thread, so every
 * sheet knows its own number, its neighbours and the line that hands the
 * reader forward. Nav, page heads and the footer all read from here.
 */
export type Sheet = {
  n: string;
  href: string;
  /** Short label for the nav rail. */
  label: string;
  /** The sheet’s own title, used in the page head and <title>. */
  title: string;
  /** One line of standfirst under the title. */
  lede: string;
  /** Drawing-office metadata, printed in the head block. */
  drawing: string;
  /** The line that carries the reader to the next sheet. */
  handoff: string;
};

export const sheets: readonly Sheet[] = [
  {
    n: "00",
    href: "/",
    label: "Entry",
    title: "Software that fits.",
    lede: "A Canadian software company. Every platform engineered entirely in-house.",
    drawing: "KLN-00 · GENERAL ARRANGEMENT",
    handoff: "Start with why any of this is built the way it is",
  },
  {
    n: "01",
    href: "/why",
    label: "Why",
    title: "Enterprise software without the mould.",
    lede: "Off-the-shelf software makes you work its way. We build the other way.",
    drawing: "KLN-01 · DESIGN INTENT",
    handoff: "Then see how it actually gets built",
  },
  {
    n: "02",
    href: "/method",
    label: "Method",
    title: "How an idea becomes software that fits.",
    lede: "Six steps from first workshop to long-term partnership.",
    drawing: "KLN-02 · PROCESS SEQUENCE",
    handoff: "Six steps, six finished systems",
  },
  {
    n: "03",
    href: "/platforms",
    label: "Platforms",
    title: "Six things we already built.",
    lede: "Proprietary platforms, engineered end-to-end, PIPEDA-ready from the first line of code.",
    drawing: "KLN-03 · SYSTEM SCHEDULE",
    handoff: "The sectors these were built for",
  },
  {
    n: "04",
    href: "/industries",
    label: "Industries",
    title: "Eight industries. One obsession: fit.",
    lede: "Each with its own regulators, its own workflows, its own definition of secure.",
    drawing: "KLN-04 · OPERATING TERRITORY",
    handoff: "Now put your own operation on the sheet",
  },
  {
    n: "05",
    href: "/idea",
    label: "Your idea",
    title: "What’s your idea?",
    lede: "Describe it the way you’d describe it to a colleague. We’ll sketch the system it wants to be.",
    drawing: "KLN-05 · CONCEPT SKETCH",
    handoff: "Take the sketch to someone who can build it",
  },
  {
    n: "06",
    href: "/contact",
    label: "Contact",
    title: "Have an idea? Let’s build it.",
    lede: "You know what the software needs to do. We’ll figure out how to make it happen.",
    drawing: "KLN-06 · ISSUE FOR CONSTRUCTION",
    handoff: "Back to the start",
  },
];

export function sheetAt(href: string): Sheet {
  return sheets.find((s) => s.href === href) ?? sheets[0];
}

/** The sheet after this one, wrapping round to 00 at the end. */
export function nextSheet(href: string): Sheet {
  const i = sheets.findIndex((s) => s.href === href);
  return sheets[(i + 1) % sheets.length];
}

export function prevSheet(href: string): Sheet {
  const i = sheets.findIndex((s) => s.href === href);
  return sheets[(i - 1 + sheets.length) % sheets.length];
}
