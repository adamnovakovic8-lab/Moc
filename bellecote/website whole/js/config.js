/* =========================================================
   Belle Côte Festival — site configuration
   Edit this ONE file to update links, dates and the Instagram feed.
   ========================================================= */
window.FESTIVAL_CONFIG = {
  /* ----- Event ----- */
  // Festival start date/time (used by the hero countdown). Local time, 24h.
  startDate: "2026-07-22T09:00:00",
  endDate:   "2026-07-26T22:00:00",

  /* ----- Instagram ----- */
  // Your public Instagram handle (no @).
  instagramHandle: "bellecotedays",
  instagramUrl:    "https://www.instagram.com/bellecotedays/",

  // AUTOMATIC FEED ─────────────────────────────────────────
  // The site pulls your newest posts automatically from a free Behold.so feed.
  // 1. Go to https://behold.so  →  create a free account
  // 2. Connect your festival's Instagram account
  // 3. Create a feed and copy its Feed ID
  // 4. Paste it below (e.g. "AbCd1234EfGh"). Leave blank to show placeholders.
  beholdFeedId: "",

  // How many posts to display on each surface.
  feedLimitHome: 6,
  feedLimitGallery: 12,

  // Re-check for new posts while the page is open (ms). 0 = only on load.
  feedRefreshMs: 5 * 60 * 1000,

  /* ----- Contact ----- */
  email: "hello@bellecotedays.ca",
  facebookUrl: "https://www.facebook.com/",
};
