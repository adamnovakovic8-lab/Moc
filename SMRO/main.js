/* ============================================================
   SMRO — shared site script (multi-page)
   Injects header/footer/menu, handles page transitions + all UX
   ============================================================ */
(function () {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasGSAP = typeof window.gsap !== "undefined";
  const hasScrollTrigger = hasGSAP && typeof window.ScrollTrigger !== "undefined";
  if (hasScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  const DONATE = "https://form-renderer-app.donorperfect.io/give/saint-moses-relief-organization/donation-for-causes";

  /* ---------- shared SVG bits ---------- */
  // Real SMRO mark (extracted from official artwork). Two colour variants:
  // mint for dark backgrounds, teal for light surfaces — toggled via CSS.
  const MARK = '<img class="lm lm-mint" src="assets/logo-mark-mint.png" alt="SMRO logo"><img class="lm lm-teal" src="assets/logo-mark.png" alt="">';
  const HEART = '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M12 21s-7.5-4.6-10-9.3C.7 9 1.7 5.6 4.6 4.6 6.8 3.8 9 4.8 12 7.8c3-3 5.2-4 7.4-3.2 2.9 1 3.9 4.4 2.6 7.1C19.5 16.4 12 21 12 21z"/></svg>';

  const NAV = [
    ["index.html", "home", "Home"],
    ["about.html", "about", "About"],
    ["programs.html", "programs", "Programs"],
    ["impact.html", "impact", "Impact"],
    ["give.html", "give", "Ways to Give"],
    ["events.html", "events", "Events"],
    ["contact.html", "contact", "Contact"],
  ];

  const page = document.body.dataset.page || "home";

  /* ============================================================
     INJECT SHARED MARKUP
     ============================================================ */
  function buildHeader() {
    const links = NAV.map(function (n) {
      return '<a href="' + n[0] + '" data-link data-cursor="hover"' + (n[1] === page ? ' class="is-active"' : "") + ">" + n[2] + "</a>";
    }).join("");
    return '<header class="nav" id="nav">' +
      '<a href="index.html" class="nav__brand" data-link data-cursor="hover"><span class="logo-badge">' + MARK + '</span>' +
      '<span class="nav__name">SMRO<i>Let there be light</i></span></a>' +
      '<nav class="nav__links" aria-label="Primary">' + links + "</nav>" +
      '<a class="btn btn--gold nav__cta" href="' + DONATE + '" target="_blank" rel="noopener" data-cursor="hover"><span>Donate</span>' + HEART + "</a>" +
      '<button class="nav__burger" id="burger" aria-label="Menu" aria-expanded="false"><span></span><span></span></button>' +
      "</header>";
  }

  function buildMenu() {
    const links = NAV.map(function (n, i) {
      return '<a href="' + n[0] + '" data-link data-cursor="hover"><i>0' + (i + 1) + "</i> " + n[2] + "</a>";
    }).join("");
    return '<div class="mobile-menu" id="mobileMenu" aria-hidden="true"><nav>' + links + "</nav>" +
      '<a class="btn btn--gold btn--lg" href="' + DONATE + '" target="_blank" rel="noopener">Donate today</a>' +
      '<div class="mobile-menu__contact"><a href="tel:+14169007159">+1 (416) 900-7159</a><a href="mailto:info@smro.ca">info@smro.ca</a></div></div>';
  }

  function buildFooter() {
    return '<div class="footer__top"><div class="footer__brand">' +
      '<a href="index.html" class="nav__brand" data-link data-cursor="hover"><span class="logo-badge">' + MARK + '</span>' +
      '<span class="nav__name nav__name--light">SMRO<i>Let there be light</i></span></a>' +
      '<p class="footer__mission">Saint Moses Relief Organization — helping families escape poverty in Egypt, Sudan &amp; South Sudan since 2012.</p>' +
      '<div class="footer__social"><a href="https://facebook.com/helppoorfam/" target="_blank" rel="noopener" aria-label="Facebook" data-cursor="hover"><svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M13 22v-8h2.7l.4-3H13V9.1c0-.9.3-1.5 1.6-1.5H16V5c-.3 0-1.2-.1-2.2-.1-2.2 0-3.8 1.4-3.8 3.9V11H7.5v3H10v8h3z"/></svg></a>' +
      '<a href="https://instagram.com/saint_moses_relief" target="_blank" rel="noopener" aria-label="Instagram" data-cursor="hover"><svg viewBox="0 0 24 24" width="20" height="20"><path fill="none" stroke="currentColor" stroke-width="1.8" d="M4 8a4 4 0 014-4h8a4 4 0 014 4v8a4 4 0 01-4 4H8a4 4 0 01-4-4z"/><circle cx="12" cy="12" r="3.4" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="17.2" cy="6.8" r="1.1" fill="currentColor"/></svg></a></div></div>' +
      '<div class="footer__cols"><div class="footer__col"><h5>Explore</h5>' +
      '<a href="about.html" data-link data-cursor="hover">About us</a><a href="programs.html" data-link data-cursor="hover">Programs</a><a href="impact.html" data-link data-cursor="hover">Our impact</a><a href="events.html" data-link data-cursor="hover">Events</a><a href="give.html" data-link data-cursor="hover">Ways to give</a></div>' +
      '<div class="footer__col"><h5>Programs</h5><a href="programs.html" data-link data-cursor="hover">Education</a><a href="programs.html" data-link data-cursor="hover">Sponsor a child</a><a href="programs.html" data-link data-cursor="hover">Medical care</a><a href="programs.html" data-link data-cursor="hover">Water wells</a><a href="programs.html" data-link data-cursor="hover">Home renovation</a></div>' +
      '<div class="footer__col footer__contact"><h5>Get in touch</h5><a href="tel:+14169007159" data-cursor="hover"><span>Call</span>+1 (416) 900-7159</a><a href="mailto:info@smro.ca" data-cursor="hover"><span>Email</span>info@smro.ca</a><a class="btn btn--gold btn--sm" href="' + DONATE + '" target="_blank" rel="noopener" data-cursor="hover"><span>Donate now</span></a></div></div></div>' +
      '<div class="footer__bar"><p>© <span id="year"></span> Saint Moses Relief Organization. A registered Canadian non-profit.</p>' +
      '<div class="footer__legal"><a href="#" data-cursor="hover">Privacy policy</a><a href="#" data-cursor="hover">Terms &amp; conditions</a></div></div>';
  }

  function injectShared() {
    const h = document.getElementById("site-header");
    if (h) h.innerHTML = buildHeader();
    const f = document.getElementById("site-footer");
    if (f) { f.className = "footer"; f.innerHTML = buildFooter(); }
    document.body.insertAdjacentHTML("beforeend", buildMenu());

    // cover inner
    const ci = document.getElementById("coverInner");
    if (ci) {
      ci.innerHTML = '<span class="logo-badge">' + MARK + '</span>' +
        '<div class="page-cover__count"><span id="plCount">0</span><i>%</i></div>' +
        '<div class="page-cover__word">SMRO</div>' +
        '<div class="page-cover__tag">Let there be light</div>';
    }
    const y = document.getElementById("year");
    if (y) y.textContent = new Date().getFullYear();
  }

  /* ============================================================
     LENIS smooth scroll
     ============================================================ */
  let lenis = null;
  function initLenis() {
    if (prefersReduced || typeof window.Lenis === "undefined") return;
    lenis = new Lenis({ duration: 1.15, easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); }, smoothWheel: true, touchMultiplier: 1.6 });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    if (hasScrollTrigger) { lenis.on("scroll", ScrollTrigger.update); gsap.ticker.add(function (t) { lenis.raf(t * 1000); }); gsap.ticker.lagSmoothing(0); }
    document.documentElement.classList.add("lenis");
  }

  /* ============================================================
     PAGE COVER — reveal + transitions
     ============================================================ */
  function revealCover(afterDelay) {
    setTimeout(function () {
      document.body.classList.add("cover-hidden");
      afterReveal();
    }, afterDelay);
  }

  function runCover() {
    const isHomeFirst = page === "home" && !sessionStorage.getItem("smro_seen");
    if (prefersReduced) {
      document.body.classList.add("cover-hidden");
      afterReveal();
      return;
    }
    if (isHomeFirst) {
      sessionStorage.setItem("smro_seen", "1");
      const countEl = document.getElementById("plCount");
      const total = 1050, start = performance.now();
      (function tick(now) {
        const p = Math.min(1, (now - start) / total);
        if (countEl) countEl.textContent = Math.round(p * 100);
        if (p < 1) requestAnimationFrame(tick);
        else revealCover(120);
      })(start);
    } else {
      document.body.classList.add("no-counter");
      revealCover(420);
    }
  }

  function afterReveal() {
    // hero word intro
    const words = document.querySelectorAll(".hero__title .w");
    if (words.length) {
      if (hasGSAP && !prefersReduced) {
        gsap.to(words, { y: "0%", duration: 1.05, ease: "power4.out", stagger: 0.08, delay: 0.1 });
        gsap.fromTo(".hero .reveal-up", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out", stagger: 0.1, delay: 0.4 });
        gsap.fromTo(".hero__chips .chip", { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.9, ease: "back.out(1.6)", stagger: 0.12, delay: 0.7 });
      } else {
        words.forEach(function (w) { w.style.transform = "translateY(0)"; });
        document.querySelectorAll(".hero .reveal-up").forEach(function (el) { el.classList.add("in"); });
      }
    }
    initScrollAnimations();
  }

  // intercept internal links -> cover-in then navigate
  function coverNavigate(href) {
    const cover = document.getElementById("cover");
    if (!cover || prefersReduced) { window.location.href = href; return; }
    const inner = cover.querySelector(".page-cover__count");
    if (inner) inner.style.display = "none";
    cover.style.transition = "none";
    cover.style.transform = "translateY(100%)";
    document.body.classList.remove("cover-hidden");
    void cover.offsetHeight;
    cover.style.transition = "transform .55s cubic-bezier(.65,.05,.36,1)";
    cover.style.transform = "translateY(0)";
    setTimeout(function () { window.location.href = href; }, 520);
  }

  function isInternal(a) {
    const href = a.getAttribute("href");
    if (!href) return false;
    if (a.target === "_blank") return false;
    if (href.charAt(0) === "#") return false;
    if (/^(mailto:|tel:|https?:)/.test(href)) return false;
    return /\.html(\?.*)?$/.test(href) || href === "" || href === "/";
  }

  function bindLinks() {
    document.addEventListener("click", function (e) {
      const a = e.target.closest("a[data-link]");
      if (!a || !isInternal(a)) return;
      const href = a.getAttribute("href");
      // same page? just close menu
      if (a.classList.contains("is-active") && page !== "home") { /* still navigate */ }
      e.preventDefault();
      closeMenu();
      coverNavigate(href);
    });
    // restore on bfcache back
    window.addEventListener("pageshow", function (ev) {
      if (ev.persisted) {
        const cover = document.getElementById("cover");
        if (cover) { cover.style.transition = "none"; cover.style.transform = ""; }
        document.body.classList.add("cover-hidden");
      }
    });
  }

  /* ============================================================
     SCROLL REVEALS + PARALLAX + COUNTERS
     ============================================================ */
  function initScrollAnimations() {
    const reveals = document.querySelectorAll(".reveal-up:not(.in)");
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) { if (entry.isIntersecting) { entry.target.classList.add("in"); io.unobserve(entry.target); } });
      }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
      reveals.forEach(function (el) { io.observe(el); });
    } else reveals.forEach(function (el) { el.classList.add("in"); });

    const counters = document.querySelectorAll("[data-count]");
    if ("IntersectionObserver" in window) {
      const cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) { if (entry.isIntersecting) { animateCount(entry.target); cio.unobserve(entry.target); } });
      }, { threshold: 0.4 });
      counters.forEach(function (el) { cio.observe(el); });
    } else counters.forEach(function (el) { animateCount(el); });

    if (hasScrollTrigger && !prefersReduced) {
      document.querySelectorAll("[data-parallax]").forEach(function (el) {
        const amt = parseFloat(el.dataset.parallax) || 0.2;
        gsap.to(el, { yPercent: amt * 100, ease: "none", scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true } });
      });
      gsap.utils.toArray(".feature__photo").forEach(function (el) {
        gsap.fromTo(el, { yPercent: -8 }, { yPercent: 8, ease: "none", scrollTrigger: { trigger: el.closest(".feature"), start: "top bottom", end: "bottom top", scrub: true } });
      });
    }
  }

  function animateCount(el) {
    const target = parseFloat(el.dataset.count) || 0;
    const suffix = el.dataset.suffix || "";
    const dur = 1700, start = performance.now();
    (function step(now) {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString("en-US") + (p === 1 ? suffix : "");
      if (p < 1) requestAnimationFrame(step);
    })(start);
  }

  /* ============================================================
     NAV scroll state + progress
     ============================================================ */
  function initNav() {
    const nav = document.getElementById("nav");
    const progress = document.getElementById("scrollProgress");
    function onScroll() {
      const y = window.scrollY || window.pageYOffset;
      if (nav) nav.classList.toggle("scrolled", y > 60);
      if (progress) {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ============================================================
     MOBILE MENU
     ============================================================ */
  function openMenu() { document.body.classList.add("menu-open"); const b = document.getElementById("burger"); if (b) b.setAttribute("aria-expanded", "true"); if (lenis) lenis.stop(); }
  function closeMenu() { if (!document.body.classList.contains("menu-open")) return; document.body.classList.remove("menu-open"); const b = document.getElementById("burger"); if (b) b.setAttribute("aria-expanded", "false"); if (lenis) lenis.start(); }
  function initMenu() {
    const burger = document.getElementById("burger");
    if (burger) burger.addEventListener("click", function () { document.body.classList.contains("menu-open") ? closeMenu() : openMenu(); });
  }

  /* ============================================================
     SWIPER (home + programs preview)
     ============================================================ */
  function initSwiper() {
    if (typeof window.Swiper === "undefined" || !document.querySelector(".programs__swiper")) return;
    new Swiper(".programs__swiper", {
      slidesPerView: 1.1, spaceBetween: 18, grabCursor: true, speed: 650,
      pagination: { el: ".programs__pagination", clickable: true },
      navigation: { nextEl: "#prog-next", prevEl: "#prog-prev" },
      breakpoints: { 640: { slidesPerView: 1.8, spaceBetween: 20 }, 900: { slidesPerView: 2.4, spaceBetween: 24 }, 1200: { slidesPerView: 3, spaceBetween: 28 } },
    });
  }

  /* ============================================================
     GIVE selector
     ============================================================ */
  const giveImpacts = {
    10: "A learning kit with basic stationery and textbooks for a child.",
    25: "Warm blankets and bedding to help a family through the season.",
    50: "Essential medications and treatment for someone in need.",
    120: "A month of full sponsorship — home, meals, education & care for a child.",
    500: "A meaningful share toward building a solar well that serves ~2,000 people.",
  };
  function initGive() {
    const wrap = document.getElementById("giveAmounts");
    if (!wrap) return;
    const textEl = document.getElementById("giveImpactText");
    const ctaAmt = document.getElementById("giveCtaAmt");
    wrap.addEventListener("click", function (e) {
      const btn = e.target.closest(".amount");
      if (!btn) return;
      wrap.querySelectorAll(".amount").forEach(function (b) { b.classList.remove("is-active"); });
      btn.classList.add("is-active");
      const amt = btn.dataset.amt;
      if (textEl) { textEl.style.opacity = "0"; setTimeout(function () { textEl.textContent = giveImpacts[amt] || "Every gift makes a difference."; textEl.style.opacity = "1"; }, 180); }
      if (ctaAmt) ctaAmt.textContent = "$" + amt;
    });
  }

  /* ============================================================
     CONTACT form (mailto)
     ============================================================ */
  function initContact() {
    const form = document.getElementById("contactForm");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const name = (form.querySelector("#cf-name") || {}).value || "";
      const email = (form.querySelector("#cf-email") || {}).value || "";
      const msg = (form.querySelector("#cf-msg") || {}).value || "";
      const note = document.getElementById("formNote");
      const body = encodeURIComponent("Name: " + name + "\nEmail: " + email + "\n\n" + msg);
      window.location.href = "mailto:info@smro.ca?subject=" + encodeURIComponent("Website enquiry from " + name) + "&body=" + body;
      if (note) note.textContent = "Opening your email app… or write to us directly at info@smro.ca";
    });
  }

  /* ============================================================
     CUSTOM CURSOR + magnetic float
     ============================================================ */
  function initCursor() {
    if (window.matchMedia("(hover:none)").matches) return;
    const cursor = document.querySelector(".cursor");
    if (!cursor) return;
    let mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my;
    window.addEventListener("mousemove", function (e) { mx = e.clientX; my = e.clientY; });
    (function loop() { cx += (mx - cx) * 0.18; cy += (my - cy) * 0.18; cursor.style.transform = "translate(" + cx + "px," + cy + "px)"; requestAnimationFrame(loop); })();
    document.addEventListener("mouseover", function (e) {
      const el = e.target.closest("[data-cursor]");
      cursor.classList.remove("is-hover", "is-drag");
      if (el) { const t = el.dataset.cursor; cursor.classList.toggle("is-hover", t === "hover"); cursor.classList.toggle("is-drag", t === "drag"); }
    });
  }
  function initFloat() {
    if (prefersReduced || !hasGSAP) return;
    document.querySelectorAll("[data-float]").forEach(function (el, i) {
      gsap.to(el, { y: i % 2 === 0 ? 14 : -14, duration: 2.6 + i * 0.3, ease: "sine.inOut", yoyo: true, repeat: -1 });
    });
  }

  /* ============================================================
     BOOT
     ============================================================ */
  function boot() {
    injectShared();
    initLenis();
    initNav();
    initMenu();
    bindLinks();
    initSwiper();
    initGive();
    initContact();
    initCursor();
    initFloat();
    runCover();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();

  // safety: force reveal if something stalls
  setTimeout(function () {
    if (!document.body.classList.contains("cover-hidden")) {
      document.body.classList.add("cover-hidden");
      document.querySelectorAll(".hero__title .w").forEach(function (w) { w.style.transform = "translateY(0)"; });
      document.querySelectorAll(".reveal-up").forEach(function (el) { el.classList.add("in"); });
    }
  }, 3500);
})();
