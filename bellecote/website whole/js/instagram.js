/* =========================================================
   Instagram auto-feed
   Pulls the festival's newest posts from a Behold.so JSON feed and
   renders them. New posts that appear on Instagram show up on the
   site automatically — on every page load, and (optionally) on a
   timer while the page stays open. No code changes needed.

   Containers opt in with:  <div data-ig-feed data-limit="6"></div>
   ========================================================= */
(function () {
  "use strict";

  var cfg = window.FESTIVAL_CONFIG || {};
  var FEED_ENDPOINT = cfg.beholdFeedId
    ? "https://feeds.behold.so/" + cfg.beholdFeedId
    : null;

  var igIcon =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<rect x="2" y="2" width="20" height="20" rx="5"/>' +
    '<circle cx="12" cy="12" r="4"/>' +
    '<circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>';

  function el(html) {
    var t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }

  function escapeHtml(str) {
    return (str || "").replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  // Behold may return either an array or { posts: [...] }. Normalise both,
  // and tolerate the different field names the API has used over time.
  function normalize(data) {
    var raw = Array.isArray(data) ? data : (data && data.posts) || [];
    return raw.map(function (p) {
      var img =
        p.mediaType === "VIDEO"
          ? p.thumbnailUrl || p.sizes && p.sizes.medium && p.sizes.medium.mediaUrl || p.mediaUrl
          : (p.sizes && p.sizes.medium && p.sizes.medium.mediaUrl) || p.mediaUrl || p.thumbnailUrl;
      return {
        img: img,
        link: p.permalink || cfg.instagramUrl,
        caption: p.caption || p.prunedCaption || "",
        isVideo: p.mediaType === "VIDEO",
        time: p.timestamp ? new Date(p.timestamp).getTime() : 0,
      };
    });
  }

  function cardHtml(post) {
    var cap = escapeHtml(post.caption).slice(0, 140);
    var badge = post.isVideo
      ? '<span class="ig-card__badge" aria-hidden="true"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></span>'
      : '<span class="ig-card__badge" aria-hidden="true">' + igIcon + "</span>";
    return (
      '<a class="ig-card" href="' + post.link + '" target="_blank" rel="noopener" ' +
      'aria-label="View this post on Instagram">' +
      '<img loading="lazy" src="' + post.img + '" alt="' + (cap || "Festival Instagram photo") + '">' +
      badge +
      '<span class="ig-card__overlay"><span>' + cap + "</span></span>" +
      "</a>"
    );
  }

  // Curated, festival-themed photos shown until a Behold feed ID is added.
  // (Real, license-free imagery so the grid always looks intentional.)
  var PLACEHOLDER_PHOTOS = [
    "1488459716781-31db52582fe9", // farmers' market
    "1459749411175-04bf5292ceea", // live music crowd
    "1498931299472-f7a63a5a1cfa", // fireworks over water
    "1505228395891-9a51e7e86bf6", // turquoise wave
    "1467810563316-b5476525c0f9", // sparklers by the shore
    "1556910103-1c02745aae4d",    // community cooking
    "1492684223066-81342ee5ff30", // confetti celebration
    "1470229722913-7c0e2dbbafd3", // concert at golden hour
    "1483193722442-5422d99849bc", // a child at the festival
    "1414235077428-338989a2e8c0", // seaside dining
    "1519046904884-53103b34b206", // beach day
    "1473116763249-2faaef81ccda", // dusk on the shore
    "1533230408708-8f9f91d1235a", // fireworks finale
    "1507525428034-b723cf961d3e", // sunset over the sea
  ];

  function photoUrl(id, w) {
    return "https://images.unsplash.com/photo-" + id + "?auto=format&fit=crop&w=" + (w || 640) + "&q=72";
  }

  // Branded gradient used as a last-resort fallback if a photo fails to load.
  function gradientUri(i) {
    var palettes = [
      ["#2E8BCB", "#6FAFB2"], ["#6FAFB2", "#9FBF3B"], ["#3F8A3C", "#9FBF3B"],
      ["#D8A05B", "#C8A885"], ["#1F3A63", "#2E8BCB"], ["#C8A885", "#6FAFB2"],
    ];
    var pair = palettes[i % palettes.length];
    var svg =
      '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">' +
      '<defs><linearGradient id="g' + i + '" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="' + pair[0] + '"/>' +
      '<stop offset="1" stop-color="' + pair[1] + '"/></linearGradient></defs>' +
      '<rect width="100" height="100" fill="url(#g' + i + ')"/>' +
      '<circle cx="78" cy="22" r="10" fill="rgba(255,255,255,.35)"/>' +
      '<path d="M0 74 Q25 60 50 72 T100 70 V100 H0 Z" fill="rgba(255,255,255,.18)"/>' +
      '<path d="M0 84 Q25 72 50 82 T100 80 V100 H0 Z" fill="rgba(255,255,255,.22)"/>' +
      "</svg>";
    return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
  }

  function placeholderHtml(i) {
    var id = PLACEHOLDER_PHOTOS[i % PLACEHOLDER_PHOTOS.length];
    return (
      '<a class="ig-card" href="' + (cfg.instagramUrl || "#") + '" target="_blank" rel="noopener" ' +
      'aria-label="Follow us on Instagram">' +
      '<img loading="lazy" src="' + photoUrl(id) + '" ' +
      "onerror=\"this.onerror=null;this.src='" + gradientUri(i) + "'\" " +
      'alt="Belle Côte Days Festival moment">' +
      '<span class="ig-card__badge" aria-hidden="true">' + igIcon + "</span>" +
      '<span class="ig-card__overlay"><span>@' + (cfg.instagramHandle || "bellecotedays") + "</span></span>" +
      "</a>"
    );
  }

  function renderPosts(container, posts) {
    var limit = parseInt(container.getAttribute("data-limit"), 10) || posts.length;
    container.innerHTML = "";
    posts.slice(0, limit).forEach(function (p) {
      container.appendChild(el(cardHtml(p)));
    });
    setStatus(container, "");
  }

  function renderPlaceholders(container) {
    var limit = parseInt(container.getAttribute("data-limit"), 10) || 6;
    container.innerHTML = "";
    for (var i = 0; i < limit; i++) container.appendChild(el(placeholderHtml(i)));
  }

  function setStatus(container, msg) {
    var status = container.parentElement.querySelector(".ig-status");
    if (status) status.textContent = msg;
  }

  function getContainers() {
    return Array.prototype.slice.call(document.querySelectorAll("[data-ig-feed]"));
  }

  function load() {
    var containers = getContainers();
    if (!containers.length) return;

    if (!FEED_ENDPOINT) {
      containers.forEach(renderPlaceholders);
      return;
    }

    fetch(FEED_ENDPOINT, { headers: { Accept: "application/json" } })
      .then(function (r) {
        if (!r.ok) throw new Error("Feed HTTP " + r.status);
        return r.json();
      })
      .then(function (data) {
        var posts = normalize(data)
          .filter(function (p) { return p.img; })
          .sort(function (a, b) { return b.time - a.time; }); // newest first
        if (!posts.length) throw new Error("Feed empty");
        containers.forEach(function (c) { renderPosts(c, posts); });
      })
      .catch(function (err) {
        console.warn("[Instagram] falling back to placeholders:", err.message);
        containers.forEach(renderPlaceholders);
      });
  }

  document.addEventListener("DOMContentLoaded", function () {
    load();
    if (FEED_ENDPOINT && cfg.feedRefreshMs > 0) {
      setInterval(load, cfg.feedRefreshMs);
    }
  });
})();
