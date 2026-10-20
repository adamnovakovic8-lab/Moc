# Klinova

A seven-sheet marketing site for Klinova, built against the creative direction
brief. Next.js 16 (App Router, Turbopack), React 19, TypeScript, hand-written
CSS. No UI kit, no component library, no Tailwind.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run lint
```

## The idea

**Ideas enter as concepts. They leave as technology.**

The site is drawn as a set of engineering drawing sheets. Warm drafting paper,
warm-black ink, one coral accent, hairline rules with tick marks, monospace
annotations, chamfered blocks instead of rounded cards, and a fine paper grain
over everything so no surface reads as flat vector.

## The sheets

Each section is its own route, numbered 00–06. Every sheet ends by handing off
to the next one, so the narrative survives being split across pages.

| # | Route | What's on it |
|---|-------|--------------|
| 00 | `/` | Schematic assembling on canvas, the system reporting itself, schedule of what exists |
| 01 | `/why` | The premise on a dark sheet, three reasons, off-the-shelf compared side by side |
| 02 | `/method` | Process diagram with the iteration loop, then six stages in detail |
| 03 | `/platforms` | Schedule of systems, then a full sheet per platform |
| 04 | `/industries` | Editorial index, then the coverage matrix |
| 05 | `/idea` | The generator, plus an honest account of how it works |
| 06 | `/contact` | The work order, what happens next, direct email and baseline |

`lib/sheets.ts` is the spine — it drives the nav, the page heads, the
`<title>` tags, and the prev/next hand-off. Add or reorder a sheet there and
everything else follows.

## The mark

`components/brand/klinova.tsx` holds the K mark: a black stem, a chevron whose
point sits just clear of it, and two coral shapes filling the notches — a
square at the top, a triangle at the bottom. **That asymmetry is the mark's
signature; don't "fix" it.**

- The chevron is a single stroked path drawn well past the artboard and clipped
  by the SVG viewport. That's deliberate: the mark appears several times on a
  page and a shared `<clipPath>` id would collide.
- The dark parts are `currentColor`, so the mark inverts correctly on dark
  sheets and in the footer. The coral is hard-coded — it's the brand, not a
  theme value.
- `app/icon.svg` repeats the same geometry on a warm paper tile.
- The wordmark is Archivo 900 with the tracking pulled in, not traced outlines,
  so it stays crisp at any size and shares the site's own type.

> **This is a reconstruction traced by eye from a raster reference**, matched
> shape by shape against it. If the original vector exists, drop it in
> `public/brand/` and swap the `<svg>` body in `klinova.tsx` for the real
> paths — the geometry is all in one component, so nothing else changes.

## The opening

A drawing sheet rules itself, stamps the wordmark, fills a progress bar, then
lifts away — about two seconds, once per session.

It is deliberately **pure CSS with no JavaScript component**. There is no state
that can get stuck, nothing to hydrate, and a script failure cannot strand a
visitor behind a curtain. It is `pointer-events: none` from the first frame, so
even mid-animation nothing underneath is blocked and an impatient visitor can
click straight through it.

The once-per-session guard is a synchronous inline script in `app/layout.tsx`
that stamps `data-entered` on `<html>` before first paint — an effect would run
too late and the curtain would flash on every page load. That deliberate
pre-hydration DOM write is why `<html>` carries `suppressHydrationWarning`;
without it React reports an attribute mismatch on the root element.
`prefers-reduced-motion` skips the opening entirely.

## Chrome

- **Title block** (fixed, top) — the whole sheet set visible at once, numbered.
  On a phone it collapses to numbers and scrolls the current one into view.
- **Instrument rail** (fixed, bottom) — sheet number, drawing reference, scroll
  depth, and the real time in the Toronto studio. It also owns **← / →** paging
  between sheets, which is ignored while you're typing in a field.
- **Margin notes** — `components/primitives/marginalia.tsx`. Four hand-drawn
  arrow paths that wobble and overshoot, because that irregularity is the one
  mark on a page a layout engine wouldn't produce. Used four or five times
  across the whole site, never decoratively.

## Structure

```
app/
  layout.tsx          chrome, fonts, metadata, colophon
  page.tsx            sheet 00
  why|method|platforms|industries|idea|contact/page.tsx
  globals.css         design tokens, type scale, shared devices
  chrome.css          title block, rail, sheet head, hand-off, marginalia
  sequence.css        per-sheet art direction
components/
  chrome/             masthead, status rail, sheet head, hand-off
  sequence/           canvas, boot log, schedule, coverage, diagram, worlds
  primitives/         reveal engine, marginalia, reduced-motion hook
lib/
  klinova.ts          all site copy (see below)
  sheets.ts           the sheet map
  shape.ts            idea → conceptual system mapping
```

## Content rule

`lib/klinova.ts` is the only source of copy, and everything in it came from
Klinova's own material. Per §16 of the brief there are **no invented client
names, statistics, awards, testimonials, partnerships, case-study results,
team members or years of experience**.

This matters most where the site looks most "technical". Density here comes
from *structuring and visualising facts that already exist*, never from
filler:

- The boot log on sheet 00 reads `platforms.length` and the real studio list.
- The coverage matrix is derived — a cell fills when a platform's own
  `sectors` names that industry.
- Sheet metadata (`Sheet 02 of 06`, `Drawn by`) describes the *document*, not
  the business. There are no counters, no uptime, no fake latency.
- The studio clock is the actual time in Toronto.

Earlier Klinova material carried case-study figures (−32%, 200k+/yr, 3×,
5 → 1). They are deliberately left out because they could not be verified. If
Klinova confirms them, they belong in `lib/klinova.ts` and nowhere else.

## The idea generator

`lib/shape.ts` maps a plain-English sentence to a conceptual system using a
small, readable, deterministic keyword table. It runs entirely in the browser
and sends nothing anywhere. Sheet 05 says so out loud — a shop that oversells
a text box will oversell a platform.

To extend it, add a rule to `RULES`. First match wins, so put specific sectors
above general ones.

## The work order (sheet 06)

Sheet 06 is not a contact form. It's a **work order** the visitor raises: a
document with the blanks filled into sentences, beside a live preview of the
exact plain text it will send. Nothing about it is hidden from them.

**There is no endpoint, and the page never pretends there is one.** *Send to a
senior architect* hands the composed order to the visitor's own mail client via
`mailto:`; *Copy the order* puts the same text on their clipboard. Because the
page transmits nothing, nothing can be silently lost, and no fake "thanks,
we'll be in touch" is ever shown.

- Composition lives in `lib/work-order.ts`, away from the UI, so the preview is
  provably the same text that goes into the email.
- Sending is gated until there's a problem statement and a reply address, and
  the status line names exactly what's still missing.
- **Sector is free text**, not a dropdown. The nine sectors Klinova has built
  for are offered as `<datalist>` suggestions, but anything can be typed and
  the order prints it verbatim. `matchSector()` in `lib/shape.ts` keyword-matches
  whatever they wrote, so "veterinary clinic" gets the healthcare modules while
  "brewery" gets the pieces every system needs — and the hint underneath says
  honestly which of the two happened rather than implying we've shipped for
  that sector before.
- Any sector means any module: `Add +` appends a module of the visitor's own.
- A sketch made on sheet 05 carries into the order via `sessionStorage`
  (`klinova:sketch`), so nobody describes their operation twice. It stays in
  the tab and never leaves the browser.

**To make it post to a backend later**, add a server action and call it from
`send()` in `components/sequence/work-order.tsx` — but keep the preview, and
only claim delivery once something has actually accepted it.

## Behaviour and accessibility

- **Reduced motion** is honoured everywhere: the canvas paints its finished
  state, the boot log is already complete, reveals are disabled.
- **No-JS**: content is hidden only after the reveal engine mounts, so a
  script failure leaves the page fully readable rather than blank.
- Semantic landmarks, a skip link, visible focus rings, real `<table>` markup
  with scoped headers, `aria-live` on the generator output, `sr-only` text in
  every matrix cell so the pattern isn't colour-only.
- Keyboard paging never fires from inside an input, textarea, select or
  contenteditable.

## Notes for whoever picks this up

- Platform hues live on each entry in `platforms`. Which platforms go dark and
  which side their art sits on are two separate cycles (`DARK` and `ART_LEFT`
  in `components/sequence/platforms.tsx`) — keep them out of phase so the run
  of six never settles into an obvious alternating template.
- `app/globals.css` is the design system. Corners are square or chamfered; the
  `.slab` clip-path is the house style. No rounded cards, no pill buttons, no
  glassmorphism, no gradient text.
- The dark circle in the bottom-left during development is Next.js's own dev
  indicator. It doesn't ship.
- Brand assets from the previous site are at
  `C:\Users\nova2\Claude\klinova\assets` if a raster logo is ever needed; the
  current site draws the wordmark as type.
