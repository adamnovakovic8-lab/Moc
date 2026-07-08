# Belle Côte Days Festival — website

A fast, all-static multi-page website. No build step, no framework — just open it or drop it on any host.

```
belle-cote-festival/
├── index.html      Home (hero, countdown, highlights, schedule + IG preview)
├── events.html     Schedule — interactive 5-day line-up
├── story.html      Our Story — history, milestones, values
├── gallery.html    Gallery — live, auto-updating Instagram feed
├── visit.html      Visit — getting here, stay, FAQ, volunteer, newsletter
├── css/styles.css  All styling (brand colours + Montserrat)
└── js/
    ├── config.js     ← EDIT THIS: links, dates, Instagram feed
    ├── instagram.js  Auto-feed logic
    └── main.js       Nav, countdown, tabs, FAQ, reveals
```

## 1. Quick start

Just open `index.html` in a browser, or serve the folder:

```bash
cd belle-cote-festival
python3 -m http.server 5173   # then visit http://localhost:5173
```

## 2. Make it yours — edit `js/config.js`

One file controls the changeable bits:

| Setting            | What it does                                   |
| ------------------ | ---------------------------------------------- |
| `startDate`/`endDate` | Powers the hero countdown                   |
| `instagramHandle`  | Your @handle (no @) — used across the site     |
| `instagramUrl`     | Link target for every Instagram button         |
| `beholdFeedId`     | Turns the **automatic** Instagram feed on       |
| `email`            | Contact email used in footer/contact links     |

Festival name, copy, and event details live directly in the `.html` files — search for the text you want to change.

## 3. The automatic Instagram feed ⭐

The Gallery page (and the home-page preview) show your **newest Instagram posts automatically**. As soon as you post on Instagram, it appears on the site — no edits, no re-deploy.

This uses a free service called **Behold.so**, which is the supported, Instagram-approved way to do this from a static site (Instagram blocks scraping its public pages directly).

**Set it up once (~3 minutes):**

1. Go to **https://behold.so** and create a free account.
2. Connect your festival's Instagram account.
   - Works best with an Instagram **Business or Creator** account (free to switch in the Instagram app: *Settings → Account type*).
3. Create a feed, then copy its **Feed ID**.
4. Open `js/config.js` and paste it:
   ```js
   beholdFeedId: "YOUR_FEED_ID_HERE",
   ```
5. Save and reload. Done — the grid now shows live posts.

**Until you add a Feed ID**, the grid shows tasteful branded placeholder tiles so nothing ever looks broken.

**How "automatic" works:** the site fetches the latest posts every time the page loads, and re-checks every 5 minutes while a visitor has the page open (`feedRefreshMs` in the config). Behold keeps the feed in sync with Instagram, so new posts flow through on their own.

> Prefer a different provider? Any service that returns a JSON list of posts works. The fetch + render lives in `js/instagram.js` — swap the `FEED_ENDPOINT` and the `normalize()` mapping.

## 4. Publish it (free options)

- **Netlify / Cloudflare Pages / Vercel:** drag the `belle-cote-festival` folder onto the dashboard, or connect a Git repo. Done.
- **GitHub Pages:** push the folder to a repo, enable Pages on the `main` branch.

No server is required — it's pure HTML/CSS/JS.

## Brand reference

Fonts: **Montserrat** — SemiBold 600 (headings), Medium 500 (nav/buttons), Regular 400 (body).

| Token       | Hex       | Use            |
| ----------- | --------- | -------------- |
| Navy        | `#1F3A63` | Text / headings |
| Ocean blue  | `#2E8BCB` | Primary actions |
| Seafoam     | `#6FAFB2` | Secondary      |
| Coastal green | `#3F8A3C` | Accents       |
| Light green | `#9FBF3B` | Accents        |
| Sand        | `#D8A05B` | Accents        |
| Driftwood   | `#C8A885` | Accents        |

All colours are defined as CSS variables at the top of `css/styles.css`.

---

> Note: the festival name, dates, history, and event details are realistic **placeholders** so the site looks complete. Swap in your real copy before going live.
