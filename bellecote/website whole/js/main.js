/* =========================================================
   Belle Côte Festival — UI interactions
   Nav toggle · sticky header · countdown · schedule tabs ·
   FAQ accordion · scroll reveal · newsletter stub
   ========================================================= */
(function () {
  "use strict";
  var cfg = window.FESTIVAL_CONFIG || {};

  /* ----- Mobile nav ----- */
  var toggle = document.querySelector(".nav__toggle");
  var links = document.getElementById("nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        links.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ----- Sticky header shadow ----- */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ----- Countdown ----- */
  var cd = document.querySelector("[data-countdown]");
  if (cd && cfg.startDate) {
    var target = new Date(cfg.startDate).getTime();
    var units = {
      days: cd.querySelector('[data-cd="days"]'),
      hours: cd.querySelector('[data-cd="hours"]'),
      mins: cd.querySelector('[data-cd="mins"]'),
      secs: cd.querySelector('[data-cd="secs"]'),
    };
    var pad = function (n) { return String(n).padStart(2, "0"); };
    var tick = function () {
      var diff = target - Date.now();
      if (diff <= 0) {
        cd.classList.add("is-live");
        var live = cd.querySelector("[data-cd-live]");
        if (live) live.hidden = false;
        if (units.days) {
          units.days.textContent = "00"; units.hours.textContent = "00";
          units.mins.textContent = "00"; units.secs.textContent = "00";
        }
        clearInterval(timer);
        return;
      }
      var d = Math.floor(diff / 864e5);
      var h = Math.floor((diff % 864e5) / 36e5);
      var m = Math.floor((diff % 36e5) / 6e4);
      var s = Math.floor((diff % 6e4) / 1e3);
      if (units.days)  units.days.textContent = pad(d);
      if (units.hours) units.hours.textContent = pad(h);
      if (units.mins)  units.mins.textContent = pad(m);
      if (units.secs)  units.secs.textContent = pad(s);
    };
    tick();
    var timer = setInterval(tick, 1000);
  }

  /* ----- Schedule day tabs ----- */
  var tabs = document.querySelectorAll(".day-tab");
  if (tabs.length) {
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        var day = tab.getAttribute("data-day");
        tabs.forEach(function (t) {
          var active = t === tab;
          t.classList.toggle("is-active", active);
          t.setAttribute("aria-selected", active ? "true" : "false");
        });
        document.querySelectorAll(".day-panel").forEach(function (panel) {
          panel.classList.toggle("is-active", panel.getAttribute("data-day") === day);
        });
      });
    });
  }

  /* ----- FAQ accordion ----- */
  document.querySelectorAll(".faq__q").forEach(function (q) {
    q.addEventListener("click", function () {
      var item = q.closest(".faq__item");
      var answer = item.querySelector(".faq__a");
      var isOpen = item.classList.toggle("is-open");
      q.setAttribute("aria-expanded", isOpen ? "true" : "false");
      answer.style.maxHeight = isOpen ? answer.scrollHeight + "px" : "0";
    });
  });

  /* ----- Scroll reveal ----- */
  var reveals = document.querySelectorAll("[data-reveal]");
  if (reveals.length && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach(function (r) { io.observe(r); });
  } else {
    reveals.forEach(function (r) { r.classList.add("is-visible"); });
  }

  /* ----- Newsletter stub (no backend) ----- */
  var form = document.querySelector("[data-subscribe]");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var note = form.parentElement.querySelector(".form-note");
      var input = form.querySelector("input");
      if (note) note.textContent = "Thanks! We'll keep " + (input.value || "you") + " posted. 🎉";
      form.reset();
    });
  }

  /* ----- Apply config-driven links ----- */
  document.querySelectorAll("[data-ig-link]").forEach(function (a) {
    if (cfg.instagramUrl) a.href = cfg.instagramUrl;
  });
  document.querySelectorAll("[data-ig-handle]").forEach(function (n) {
    if (cfg.instagramHandle) n.textContent = "@" + cfg.instagramHandle;
  });
  document.querySelectorAll("[data-ig-handle-text]").forEach(function (n) {
    if (cfg.instagramHandle) n.textContent = cfg.instagramHandle;
  });
  document.querySelectorAll("[data-email-link]").forEach(function (a) {
    if (cfg.email) { a.href = "mailto:" + cfg.email; a.textContent = cfg.email; }
  });

  /* ----- Image fade-in on load ----- */
  document.querySelectorAll("img[data-fade]").forEach(function (img) {
    if (img.complete && img.naturalWidth > 0) {
      img.classList.add("is-loaded");
    } else {
      img.addEventListener("load", function () { img.classList.add("is-loaded"); });
      img.addEventListener("error", function () { img.classList.add("is-loaded"); });
    }
  });

  /* ----- Count-up stats ----- */
  var counters = document.querySelectorAll("[data-count]");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function finalCount(elm) {
    return elm.getAttribute("data-count") + (elm.getAttribute("data-suffix") || "");
  }
  if (counters.length && "IntersectionObserver" in window && !reduceMotion) {
    var animateCount = function (elm) {
      var target = parseFloat(elm.getAttribute("data-count")) || 0;
      var suffix = elm.getAttribute("data-suffix") || "";
      var dur = 1300, start = performance.now();
      var step = function (now) {
        var p = Math.min((now - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        elm.textContent = Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    var cObs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { animateCount(e.target); cObs.unobserve(e.target); }
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach(function (c) { cObs.observe(c); });
  } else {
    counters.forEach(function (c) { c.textContent = finalCount(c); });
  }

  /* ----- Subtle hero parallax ----- */
  var parallax = document.querySelector("[data-parallax]");
  if (parallax && !reduceMotion) {
    var onParallax = function () {
      var y = window.scrollY;
      if (y < window.innerHeight * 1.2) {
        parallax.style.transform = "translate3d(0," + y * 0.16 + "px,0) scale(1.06)";
      }
    };
    onParallax();
    window.addEventListener("scroll", onParallax, { passive: true });
  }

  /* ----- Footer year ----- */
  var yr = document.querySelector("[data-year]");
  if (yr) yr.textContent = new Date().getFullYear();
})();
