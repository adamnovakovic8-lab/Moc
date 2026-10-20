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
