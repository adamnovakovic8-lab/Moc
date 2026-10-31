# RCR Performance Golf Carts — website, Option 2: "Race Day"

Same content, data, forms and functionality as Option 1 (`../rcr-performance`), with a different design: a vintage race-programme look. Deep RCR purple instead of black, cool white content, Archivo Expanded Italic headlines with IBM Plex Mono labels, race-number roundels on each cart, a staggered "starting grid" for inventory, slanted section cuts, livery stripes and a pit-board contact block.

To run both side by side: Option 1 on port 4321, this one with `PORT=4322`.

Custom Astro + Node.js rebuild of rcrperformance.ca, built to the Website Redesign PRD (Draft v1, Oct 13 2026).

```bash
npm install
npm run dev        # http://localhost:4321
npm run build && npm start   # production Node server (dist/server/entry.mjs)
```

Node 22+ required.

## Where things live

| What | File |
|---|---|
| Phone, address, hours, financing rate/terms, seasonal banner on/off, GTM ID | `src/data/site.json` |
| Inventory (add/edit/sell a cart, badges, sale price, photos) | `src/data/carts.json` |
| Reviews | `src/data/reviews.json` |
| Rental rates, storage inclusions, service menu (`null` price = "call for rates") | `src/data/services.json` |
| Custom builds (name, description, photos) — also feeds the Gallery | `src/data/builds.json` |
| Photos | `src/assets/photos/` (shop/, builds/, inventory/) |
| Location pages (local SEO) | `src/data/towns.json` → `/golf-carts/[town]` |
| Old WordPress URL → new URL redirects (F9) | `astro.config.mjs` |
| Opening animation "Ignition" (§6) | `src/components/Ignition.astro` |
| Site-wide motion, tracking, form handling | `src/scripts/site.js` |
| Design tokens (colours, type) | `src/styles/global.css` |

All inventory reads go through `src/lib/inventory.js`, so swapping JSON for Sanity or headless WooCommerce (PRD §14 Q1) only touches that file.

### Adding photos to a cart

Drop the image in `src/assets/photos/inventory/` and add it to the cart's `photos` array (the path is relative to `src/assets/photos/`):

```json
"photos": [{ "src": "inventory/IMG_1234.jpg", "alt": "Red 6-passenger limo, side view" }]
```

The first photo is the cover. Astro resizes every photo into AVIF/WebP at several widths at build time.

All photos currently on the site came from RCR's existing WordPress media library (their own phone and shoot photos).

## Forms (F4, F7)

Every form posts to `/api/lead` (or `/api/newsletter`). Leads are appended to `data/leads.jsonl` and emailed via Resend when configured. Spam protection: honeypot field, minimum fill time, 5 posts / 10 min per IP rate limit, plus Astro's built-in same-origin check. Forms work with JavaScript off (redirect to `/thanks`).

Environment variables — see `.env.example`.

**Hosting note:** `data/leads.jsonl` needs a persistent disk. On Vercel/Netlify serverless, rely on the Resend email (or move lead storage into the CMS) — the local file won't survive between invocations.

## Analytics (F8)

Set `gtmId` in `site.json`. The site pushes these `dataLayer` events: `form_submit` (with `form_type`), `call_click`, `email_click`, `newsletter_signup`.

## Before launch — needs input from RCR

- Logo vector master → `src/components/Logo.astro` is an SVG redraw of the RCR logo (flag, chrome RCR, yellow tagline) so the intro can animate it; check it against the original artwork. Brand colours (`--accent` yellow #edd513, `--purple` #533e7f) were sampled from the logo PNG — confirm against the source file
- Higher-resolution inventory photos — the current listing photos are 640px wide (that's what's on the old site). A photo of Rob and Kim for the About page. A default OG image
- Before/after photos of a build, to bring back the before/after slider (F10)
- Inventory, prices, features and reviews are taken from the live site (Oct 2026) — confirm they're current. The Rosso Red and Cherry Red limo listings share one photo set on the old site; get separate photos if they're different carts
- Business hours (`hours` in `site.json` — until set, the site says "call before you come by")
- Rental and storage pricing (or keep "call for rates")
- Financing rate, terms and disclaimer wording
- Full URL audit of the old site to complete the redirect map
- Client approval of all copy (it's written in Rob & Kim's voice, but by us)
- Privacy policy review (PIPEDA / CASL)
- Instagram feed widget (F11) — drop it into `[data-instagram-feed]` on the Gallery page
