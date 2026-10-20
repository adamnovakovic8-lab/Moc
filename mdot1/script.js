/* ===================================================
   mdot.blends — SITE CONFIG  (edit this block)
   ---------------------------------------------------
   INSTAGRAM: to show the 3 newest posts automatically,
   paste a long-lived Instagram access token below. Get
   one from the Instagram Graph API (Instagram Login).
   The feed refreshes on every page load. With no token
   set, the section shows placeholder tiles from /media.
   =================================================== */
window.MDOT_CONFIG = {
  instagramHandle: 'mdot.blends',
  instagramUrl:    'https://instagram.com/mdot.blends',
  instagramToken:  '',   // <-- paste Instagram access token here to go live
  instagramCount:  3
};

/* ===================================================
   mdot.blends — interactions (AFTER DARK)
   =================================================== */
(function () {
  'use strict';

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const nav = document.getElementById('nav');
  const navLinks = document.getElementById('navLinks');
  const navToggle = document.getElementById('navToggle');
  const fab = document.querySelector('.fab');
  const progress = document.getElementById('progress');
  const curtain = document.getElementById('curtain');

  /* ---------- Scroll: FAB + progress bar + hero parallax ---------- */
  const fabAlways = document.body.classList.contains('inner');
  const heroPhoto = document.querySelector('.hero__photo');
  function onScroll() {
    const y = window.scrollY;
    if (fab) fab.classList.toggle('show', fabAlways || y > 640);
    if (progress) {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = 'scaleX(' + (h > 0 ? Math.min(y / h, 1) : 0) + ')';
    }
    if (heroPhoto && !reduce && y < window.innerHeight) {
      heroPhoto.style.transform = 'translateY(' + (y * 0.08) + 'px)';
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  if (navToggle) {
    navToggle.addEventListener('click', function () {
      const open = navLinks.classList.toggle('open');
      navToggle.classList.toggle('open', open);
    });
  }

  /* ---------- Scroll reveal (with stagger) ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  // give grouped siblings a cascading delay
  revealEls.forEach(function (el) {
    const sibs = Array.prototype.filter.call(el.parentNode.children, function (c) {
      return c.classList && c.classList.contains('reveal');
    });
    const i = sibs.indexOf(el);
    if (i > 0) el.style.transitionDelay = Math.min(i * 70, 420) + 'ms';
  });
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Instagram feed (auto-updating) ---------- */
  (function instagram() {
    const grid = document.getElementById('igGrid');
    if (!grid) return;
    const cfg = window.MDOT_CONFIG || {};
    const count = cfg.instagramCount || 3;
    const url = cfg.instagramUrl || 'https://instagram.com/mdot.blends';
    const handle = cfg.instagramHandle || 'mdot.blends';
    const ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>';

    // Placeholder posts use mdot's own media until a token is connected.
    const placeholders = [
      { img: 'media/photo-1.jpg', caption: 'Skin fade + razor design — Woodbridge chair.' },
      { img: 'media/still-1.jpg', caption: 'Clean lineup, crispy edges. Book yours ✂' },
      { img: 'media/poster-2.jpg', caption: 'Blends only. Sherkston Shores all summer.' }
    ];

    function card(p) {
      const cap = String(p.caption || '').replace(/[<>]/g, '');
      const play = p.video ? '<span class="ig-card__play" aria-hidden="true">▶</span>' : '';
      return '<a class="ig-card" href="' + (p.link || url) + '" target="_blank" rel="noopener" aria-label="View on Instagram">' +
        '<span class="tape" aria-hidden="true"></span>' +
        '<span class="ig-card__badge" aria-hidden="true">' + ICON + '</span>' +
        '<span class="ig-card__media">' + play +
          '<img loading="lazy" src="' + p.img + '" alt="' + (cap || 'mdot.blends on Instagram') + '"></span>' +
        '<span class="ig-card__cap">' + (cap || ('@' + handle)) + '</span>' +
      '</a>';
    }
    function render(posts) { grid.innerHTML = posts.slice(0, count).map(card).join(''); }

    // wire handle + follow links from config
    document.querySelectorAll('[data-ig-link]').forEach(function (a) { a.href = url; });

    render(placeholders);                 // show something immediately
    if (!cfg.instagramToken) return;      // no token yet -> keep placeholders

    fetch('https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink&limit=' + count + '&access_token=' + cfg.instagramToken)
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (!d || !d.data || !d.data.length) return;
        render(d.data.map(function (p) {
          return {
            img: (p.media_type === 'VIDEO' && p.thumbnail_url) ? p.thumbnail_url : p.media_url,
            caption: p.caption || '', link: p.permalink, video: p.media_type === 'VIDEO'
          };
        }));
      })
      .catch(function () { /* keep placeholders on error */ });
  })();

  /* ---------- Video tiles (hover on desktop, tap on touch) ---------- */
  document.querySelectorAll('.shot[data-video]').forEach(function (shot) {
    const v = shot.querySelector('video');
    if (!v) return;
    function play() {
      const p = v.play();
      if (p && p.then) { p.then(function () { shot.classList.add('playing'); }).catch(function () {}); }
      else { shot.classList.add('playing'); }
    }
    function pause(reset) {
      v.pause();
      if (reset) { try { v.currentTime = 0; } catch (e) {} }
      shot.classList.remove('playing');
    }
    shot.addEventListener('mouseenter', play);
    shot.addEventListener('mouseleave', function () { pause(true); });
    shot.addEventListener('click', function (e) {
      e.preventDefault();
      if (v.paused) { play(); } else { pause(false); }
    });
  });

  /* ---------- Page-change curtain transition ---------- */
  if (curtain && !reduce) {
    document.addEventListener('click', function (e) {
      const a = e.target.closest('a[href]');
      if (!a) return;
      const href = a.getAttribute('href');
      if (!href) return;
      if (a.target === '_blank' || a.hasAttribute('download')) return;
      if (/^(https?:|mailto:|tel:|sms:|#)/i.test(href)) return; // external / actions / anchors
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return; // let new-tab through
      e.preventDefault();
      if (navLinks) navLinks.classList.remove('open');
      if (navToggle) navToggle.classList.remove('open');
      curtain.classList.add('closing');
      let done = false;
      const go = function () { if (done) return; done = true; window.location.href = href; };
      curtain.addEventListener('animationend', go, { once: true });
      setTimeout(go, 650); // fallback
    });
  }

  /* ---------- Booking form ---------- */
  const form = document.getElementById('bookForm');
  const hint = document.getElementById('formHint');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = form.name.value.trim();
      const phone = form.phone.value.trim();
      const location = form.location.value;
      const service = form.service.value;
      if (!name || !phone || !location || !service) {
        hint.textContent = 'Fill in your name, contact, location and service.';
        hint.className = 'book__hint err';
        return;
      }
      const summary =
        'Hey mdot! Booking request:%0A' +
        '• Name: ' + encodeURIComponent(name) + '%0A' +
        '• Contact: ' + encodeURIComponent(phone) + '%0A' +
        '• Location: ' + encodeURIComponent(location) + '%0A' +
        '• Service: ' + encodeURIComponent(service) +
        (form.notes.value.trim() ? '%0A• Notes: ' + encodeURIComponent(form.notes.value.trim()) : '');
      hint.innerHTML = 'Locked in, ' + escapeHtml(name) +
        '! Opening your email — or DM <a href="https://instagram.com/mdot.blends" target="_blank" rel="noopener">@mdot.blends</a>.';
      hint.className = 'book__hint ok';
      window.location.href =
        'mailto:hello@mdotblends.com?subject=' +
        encodeURIComponent('Booking — ' + name + ' (' + location + ')') +
        '&body=' + summary;
      form.reset();
    });
  }
  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
