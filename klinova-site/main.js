/* ============================================================
   KLINOVA — MERGED / multi-page interactions
   Native scroll + CSS scroll-snap. IntersectionObserver reveals
   (no ScrollTrigger, so nothing fights the snap).
   ============================================================ */
(() => {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasGsap = typeof gsap !== "undefined";
  if (reduced) document.documentElement.classList.add("reduced");
  const yearEl = document.getElementById("year"); if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- smooth momentum scroll (Lenis) — loaded on homepage only; degrades to native scroll ---------- */
  if (!reduced && typeof Lenis !== "undefined") {
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true, touchMultiplier: 1.6 });
    window.__lenis = lenis;
    const rafLoop = (t) => { lenis.raf(t); requestAnimationFrame(rafLoop); };
    requestAnimationFrame(rafLoop);
    document.documentElement.classList.add("lenis", "lenis-smooth");
  }

  /* ---------- page-transition warp ---------- */
  const pagefade = document.getElementById("pagefade");
  if (pagefade) requestAnimationFrame(() => requestAnimationFrame(() => pagefade.classList.add("gone")));
  const warpTo = (href) => { if (pagefade) { pagefade.classList.remove("gone"); setTimeout(() => (location.href = href), 500); } else location.href = href; };
  document.querySelectorAll("a[href]").forEach((a) => {
    const href = a.getAttribute("href");
    if (!href || !href.endsWith(".html")) return;
    a.addEventListener("click", (e) => { e.preventDefault(); closeMenu(); warpTo(href); });
  });

  /* ---------- in-page anchors ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((a) => a.addEventListener("click", (e) => {
    const el = document.querySelector(a.getAttribute("href")); if (!el) return;
    e.preventDefault(); closeMenu(); el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  }));

  /* ---------- cursor ---------- */
  const cursor = document.getElementById("cursor");
  if (cursor && matchMedia("(hover: hover) and (pointer: fine)").matches) {
    let cx = -100, cy = -100, tx = -100, ty = -100;
    addEventListener("mousemove", (e) => { tx = e.clientX; ty = e.clientY; });
    (function loop() { cx += (tx - cx) * 0.25; cy += (ty - cy) * 0.25; cursor.style.transform = `translate(${cx}px,${cy}px)`; requestAnimationFrame(loop); })();
    document.querySelectorAll("[data-hover], a, button").forEach((el) => {
      el.addEventListener("mouseenter", () => cursor.classList.add("is-hover"));
      el.addEventListener("mouseleave", () => cursor.classList.remove("is-hover"));
    });
  }

  /* ---------- magnetic ---------- */
  if (!reduced && hasGsap) document.querySelectorAll("[data-magnetic]").forEach((el) => {
    el.addEventListener("mousemove", (e) => { const r = el.getBoundingClientRect(); gsap.to(el, { x: (e.clientX - r.left - r.width / 2) * 0.3, y: (e.clientY - r.top - r.height / 2) * 0.3, duration: 0.4, ease: "power2.out" }); });
    el.addEventListener("mouseleave", () => gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1,0.4)" }));
  });

  /* ---------- menu ---------- */
  const menu = document.getElementById("menu"), burger = document.getElementById("burger");
  function closeMenu() { if (!menu || !menu.classList.contains("is-open")) return; menu.classList.remove("is-open"); document.body.classList.remove("menu-open"); menu.setAttribute("aria-hidden", "true"); burger.setAttribute("aria-expanded", "false"); }
  if (burger) {
    burger.addEventListener("click", () => {
      const open = menu.classList.toggle("is-open"); document.body.classList.toggle("menu-open", open);
      menu.setAttribute("aria-hidden", open ? "false" : "true"); burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });
  }

  /* ---------- progress + theme flip ---------- */
  const bar = document.getElementById("progressBar");
  const themed = [...document.querySelectorAll("[data-theme]")].filter((s) => s.tagName === "SECTION");
  let ticking = false;
  function onScroll() {
    if (ticking) return; ticking = true;
    requestAnimationFrame(() => {
      if (bar) { const max = document.body.scrollHeight - innerHeight; bar.style.width = (max > 0 ? scrollY / max * 100 : 0) + "%"; }
      const mid = innerHeight * 0.5; let theme = "dark";
      for (const s of themed) { const r = s.getBoundingClientRect(); if (r.top <= mid && r.bottom > mid) { theme = s.dataset.theme; break; } }
      document.body.classList.toggle("on-light", theme === "light");
      ticking = false;
    });
  }
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  /* ---------- split text ---------- */
  const splitWords = (el) => { const w = el.textContent.trim().split(/\s+/); el.innerHTML = w.map((x) => `<span class="w">${x}</span>`).join(" "); return el.querySelectorAll(".w"); };
  document.querySelectorAll("[data-split]").forEach((el) => {
    el.innerHTML = el.innerHTML.split(/<br\s*\/?>/i).map((l) => `<span class="split-line" style="display:block;overflow:hidden">${`<span class="split-inner" style="display:block">${l}</span>`}</span>`).join("");
  });

  /* ---------- IntersectionObserver reveals ---------- */
  if (reduced) {
    document.querySelectorAll("[data-reveal], [data-split]").forEach((el) => el.classList.add("in"));
    const tt = document.getElementById("thesisText"); if (tt) splitWords(tt).forEach((w) => (w.style.opacity = 1));
  } else {
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.15, rootMargin: "0px 0px -6% 0px" });
    document.querySelectorAll("[data-reveal], [data-split]").forEach((el) => io.observe(el));

    // thesis word illumination on enter
    const tEl = document.getElementById("thesisText");
    if (tEl) {
      const words = splitWords(tEl);
      const tio = new IntersectionObserver((es) => {
        es.forEach((e) => { if (e.isIntersecting) { words.forEach((w, i) => { w.style.transition = "opacity .5s"; setTimeout(() => (w.style.opacity = 1), 120 + i * 45); }); tio.unobserve(e.target); } });
      }, { threshold: 0.35 });
      tio.observe(tEl);
    }

    // counters
    document.querySelectorAll("[data-count]").forEach((el) => {
      const cio = new IntersectionObserver((es) => {
        es.forEach((e) => {
          if (!e.isIntersecting) return; cio.unobserve(e.target);
          const end = parseFloat(el.dataset.count), suf = el.dataset.suffix || ""; const t0 = performance.now(), dur = 1300;
          (function tick(now) { const p = Math.min((now - t0) / dur, 1); const v = Math.round((1 - Math.pow(1 - p, 3)) * end); el.textContent = v + suf; if (p < 1) requestAnimationFrame(tick); })(t0);
        });
      }, { threshold: 0.6 });
      cio.observe(el);
    });
  }

  /* ---------- boot code stream (immersive-style) — homepage only ---------- */
  const bootStream = document.getElementById("bootStream");
  let streamTimer = null;
  const stopStream = () => { if (streamTimer) clearTimeout(streamTimer); streamTimer = null; };
  if (bootStream && !reduced) {
    const cols = Math.max(160, Math.ceil((screen.width || 1600) / 7));
    const rows = Math.max(52, Math.ceil((screen.height || 900) / 15));
    const chars = "01<>{}/=;:•KLINOVA()[]#$*+";
    const rnd = () => chars[(Math.random() * chars.length) | 0];
    const mkLine = () => Array.from({ length: cols }, rnd).join("");
    let lines = Array.from({ length: rows }, mkLine);
    const tick = () => { lines.pop(); lines.unshift(mkLine()); bootStream.textContent = lines.join("\n"); streamTimer = setTimeout(() => requestAnimationFrame(tick), 60); };
    tick();
  }

  /* ---------- boot sequence (homepage only) ---------- */
  const boot = document.getElementById("boot"), bootFill = document.getElementById("bootFill"), bootPct = document.getElementById("bootPct"), bootStatus = document.getElementById("bootStatus");
  const phases = ["INITIALIZING KLINOVA.CORE", "COMPILING MODULES", "ENCRYPTING CHANNELS", "MOUNTING PLATFORMS", "READY"];
  const revealHero = () => {
    const lines = document.querySelectorAll(".hero-title .line > span");
    if (!hasGsap) { lines.forEach((s) => (s.style.transform = "none")); document.querySelectorAll(".hero-eyebrow, .hero-sub, .hero-cta").forEach((el) => { el.style.opacity = 1; el.style.transform = "none"; }); return; }
    gsap.to(".hero-title .line > span", { y: 0, duration: 1.1, stagger: 0.1, ease: "power4.out", delay: 0.1 });
    gsap.to(".hero-eyebrow, .hero-sub, .hero-cta", { opacity: 1, y: 0, duration: 0.9, stagger: 0.1, ease: "power3.out", delay: 0.5 });
  };
  const startBoot = () => {
    if (!boot) { revealHero(); return; }
    if (boot.dataset.on) return; boot.dataset.on = "1";
    if (!hasGsap || reduced) { stopStream(); boot.style.display = "none"; revealHero(); return; }
    gsap.to(".bm", { strokeDashoffset: 0, duration: 1.0, stagger: 0.1, ease: "power2.inOut" });
    const st = { v: 0 };
    gsap.to(st, { v: 100, duration: 2.1, ease: "power1.inOut",
      onUpdate: () => { const v = Math.round(st.v); bootPct.textContent = v + "%"; bootFill.style.width = v + "%"; bootStatus.textContent = phases[Math.min(4, Math.floor(v / 22))]; },
      onComplete: () => { stopStream(); gsap.timeline().to(".boot-core", { scale: 1.12, opacity: 0, duration: 0.4, ease: "power2.in" }, 0).to(boot, { opacity: 0, duration: 0.6, ease: "power2.inOut", onComplete: () => (boot.style.display = "none") }, 0.15).add(revealHero, 0.2); } });
  };
  if (boot) { if (document.readyState === "complete") startBoot(); else window.addEventListener("load", startBoot); setTimeout(startBoot, 4400); }
  else { revealHero(); }
})();
