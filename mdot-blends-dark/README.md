# mdot.blends — "AFTER DARK" (dark version)

The **dark, gritty** cut of the mdot.blends site. Same content and pages as the light
version, totally different skin.

> There are two versions in your claude code folder:
> - **`mdot-blends/`** — the light *streetwear-zine* look (bone paper + acid lime). Kept as-is.
> - **`mdot-blends-dark/`** — this one: *back-alley / after-dark* (concrete black, hazard
>   yellow + spray red, animated barber-pole stripe, caution-tape tickers, spray-paint
>   type, xerox photos).

## The look
- **Colors:** concrete black base, **hazard yellow** `#f4d000` + **spray red** `#ff3b26`.
  All tokens live at the top of `styles.css` under `:root` — change `--yellow` / `--red`
  to re-skin everything.
- **Type:** `Bungee` (urban signage display), `Barlow Condensed` (poster body/labels),
  `Rubik Spray Paint` (the "BLENDS" wordmark + prices), `Permanent Marker` (tags/captions).
- **Signature bits:** animated barber-pole stripe down the hero's left edge, caution-tape
  marquees, taped high-contrast **xerox** photos (they colorize on hover), spray-tag prices,
  hard black offset shadows.

## Same as the light version
- Six pages (`index`, `services`, `locations`, `work`, `about`, `book`) sharing nav + footer.
- Real media in `media/` — 4 video clips play on hover/tap on the Work page (grayscale →
  full colour on play), plus your photo.
- `script.js` handles nav, reveals, video play, and the booking form.
- Nav/footer are copied into each page — edit them in all six to keep in sync.

## Run it
Open `index.html`, or `python3 -m http.server 8000` in this folder.

## Still to fill in before launch
Real Instagram handle, phone, and email (placeholders in `book.html` + `script.js`).
