/* ===================================================
   mdot.blendz — SITE CONFIG  (edit this block)
   ---------------------------------------------------
   INSTAGRAM: to show the 3 newest posts automatically,
   paste a long-lived Instagram access token below. Get
   one from the Instagram Graph API (Instagram Login).
   The feed refreshes on every page load. With no token
   set, the section shows placeholder tiles from /media.
   =================================================== */
window.MDOT_CONFIG = {
  instagramHandle: 'mdot.blendz',
  instagramUrl:    'https://instagram.com/mdot.blendz',
  instagramToken:  '',   // <-- paste Instagram access token here to go live
  instagramCount:  3
};

/* ===================================================
   mdot.blendz — interactions (AFTER DARK)
   Soft (AJAX) navigation keeps the house radio playing
   across page changes — the document never reloads.
   =================================================== */
(function () {
  'use strict';

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* refs that change on every page — refreshed by initPage() */
  let fab = null, progress = null, heroPhoto = null, fabAlways = false;

  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ============================================================
     PERSISTENT — set up once, survive soft navigation
     ============================================================ */

  /* ---------- Scroll: FAB + progress bar + hero parallax ---------- */
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

  /* ---------- House-music radio (injected once, plays through nav) ---------- */
  (function radio() {
    if (document.querySelector('.radio')) return;
    // Live house / electronic streams, tried in order for resilience.
    const STREAMS = [
      'https://streams.ilovemusic.de/iloveradio15.mp3',  // I Love House — house (primary, stable)
      'https://streams.ilovemusic.de/iloveradio2.mp3',   // I Love Dance — dance/electronic
      'https://stream.radioparadise.com/mp3-128'          // fallback mix
    ];
    const wrap = document.createElement('div');
    wrap.className = 'radio';
    wrap.innerHTML =
      '<button class="radio__btn" type="button" aria-pressed="false" aria-label="Play house radio">' +
        '<span class="radio__ico" aria-hidden="true"><span class="radio__eq"><i></i><i></i><i></i><i></i></span></span>' +
        '<span class="radio__txt"><small>House Radio</small><strong class="radio__state">Tap to play</strong></span>' +
      '</button>';
    const btn = wrap.querySelector('.radio__btn');
    const state = wrap.querySelector('.radio__state');
    const audio = new Audio();
    audio.preload = 'none';
    audio.volume = 0.8;
    let idx = 0, tuning = false, intended = false, reconnectT = null;

    function setPlaying(on) {
      wrap.classList.toggle('playing', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      btn.setAttribute('aria-label', on ? 'Pause house radio' : 'Play house radio');
      if (on) { tuning = false; state.textContent = 'Now playing'; }
      else if (!tuning) { state.textContent = 'Tap to play'; }
    }
    function tune(i) {
      idx = i;
      if (i >= STREAMS.length) { tuning = false; intended = false; setPlaying(false); state.textContent = 'Stream offline'; return; }
      tuning = true;
      state.textContent = i === 0 ? 'Tuning in…' : 'Reconnecting…';
      audio.src = STREAMS[i];
      const p = audio.play();
      if (p && p.catch) { p.catch(function () {}); } // stream failures handled by 'error'
    }
    function scheduleReconnect() {                 // live stream dropped while it should be playing
      if (!intended) return;
      tuning = false;
      wrap.classList.remove('playing');
      state.textContent = 'Reconnecting…';
      clearTimeout(reconnectT);
      reconnectT = setTimeout(function () { if (intended) tune(0); }, 2500);
    }
    function stop() {
      intended = false;
      clearTimeout(reconnectT);
      audio.pause();
      audio.removeAttribute('src'); // stop pulling the stream
      audio.load();
      setPlaying(false);
    }
    btn.addEventListener('click', function () {
      if (intended) { stop(); } else { intended = true; tune(0); }
    });
    audio.addEventListener('playing', function () { setPlaying(true); });
    audio.addEventListener('ended', function () { if (intended) scheduleReconnect(); });
    audio.addEventListener('error', function () {
      if (!audio.getAttribute('src')) return;      // ignore the error from stop()
      if (tuning) { tune(idx + 1); return; }        // try the next stream in the list
      if (intended) { scheduleReconnect(); return; } // drop mid-playback -> reconnect
      setPlaying(false); state.textContent = 'Stream offline';
    });
    document.body.appendChild(wrap);
  })();

  /* ---------- Soft navigation (keeps audio + JS state alive) ---------- */
  const canSoftNav = ('fetch' in window) && !!(window.history && history.pushState) && (typeof DOMParser !== 'undefined');
  let navigating = false;

  function swapTo(html, url, push) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    if (!doc || !doc.body) { window.location.href = url; return; }
    const radioNode = document.querySelector('.radio'); // preserve node + its live audio
    if (radioNode && radioNode.parentNode) radioNode.parentNode.removeChild(radioNode);
    document.title = doc.title || document.title;
    document.body.className = doc.body.className;
    document.body.innerHTML = doc.body.innerHTML; // new page's fresh #curtain reveals via CSS
    if (radioNode) document.body.appendChild(radioNode);
    if (push) { try { history.pushState({ soft: true }, '', url); } catch (e) {} }
    window.scrollTo(0, 0);
    initPage();
    navigating = false;
  }

  function navigateTo(url, push) {
    if (navigating) return;
    navigating = true;
    const curtain = document.getElementById('curtain');
    const useCurtain = curtain && !reduce;
    if (useCurtain) curtain.classList.add('closing');
    const cover = new Promise(function (res) { setTimeout(res, useCurtain ? 480 : 0); });
    const load = fetch(url, { credentials: 'same-origin' }).then(function (r) {
      if (!r.ok) throw new Error('bad status');
      return r.text();
    });
    Promise.all([load, cover])
      .then(function (v) { swapTo(v[0], url, push); })
      .catch(function () { window.location.href = url; }); // graceful fallback to hard nav
  }

  document.addEventListener('click', function (e) {
    const a = e.target.closest('a[href]');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href) return;
    if (a.target === '_blank' || a.hasAttribute('download')) return;
    if (/^(https?:|mailto:|tel:|sms:|#)/i.test(href)) return;          // external / actions / anchors
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return; // let new-tab through
    if (a.origin !== location.origin) return;                          // off-site
    e.preventDefault();
    const nl = document.getElementById('navLinks'), nt = document.getElementById('navToggle');
    if (nl) nl.classList.remove('open');
    if (nt) nt.classList.remove('open');
    if (!canSoftNav) { window.location.href = a.href; return; }
    navigateTo(a.href, true);
  });

  window.addEventListener('popstate', function () {
    if (!canSoftNav) return;
    navigating = false;
    fetch(location.href, { credentials: 'same-origin' })
      .then(function (r) { return r.text(); })
      .then(function (html) { swapTo(html, location.href, false); })
      .catch(function () { window.location.reload(); });
  });

  /* ============================================================
     PER-PAGE — re-run on first load and after every soft nav
     ============================================================ */

  function initMobileMenu() {
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    if (navToggle && navLinks) {
      navToggle.addEventListener('click', function () {
        const open = navLinks.classList.toggle('open');
        navToggle.classList.toggle('open', open);
      });
    }
  }

  function initReveal() {
    const revealEls = document.querySelectorAll('.reveal');
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
  }

  function initVideos() {
    document.querySelectorAll('[data-video]').forEach(function (shot) {
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
  }

  function initInstagram() {
    const grid = document.getElementById('igGrid');
    if (!grid) return;
    const cfg = window.MDOT_CONFIG || {};
    const count = cfg.instagramCount || 3;
    const url = cfg.instagramUrl || 'https://instagram.com/mdot.blendz';
    const handle = cfg.instagramHandle || 'mdot.blendz';
    const ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>';

    // Placeholder posts use mdot's own media until a token is connected.
    const placeholders = [
      { img: 'media/photo-1.jpg', caption: 'Skin fade + razor design — Caledon chair.' },
      { img: 'media/poster-3.jpg', caption: 'Curly top, clean taper + hard part.' },
      { img: 'media/still-1.jpg', caption: 'Neon nights, crispy edges. Book yours ✂' }
    ];

    function card(p) {
      const cap = String(p.caption || '').replace(/[<>]/g, '');
      const play = p.video ? '<span class="ig-card__play" aria-hidden="true">▶</span>' : '';
      return '<a class="ig-card" href="' + (p.link || url) + '" target="_blank" rel="noopener" aria-label="View on Instagram">' +
        '<span class="tape" aria-hidden="true"></span>' +
        '<span class="ig-card__badge" aria-hidden="true">' + ICON + '</span>' +
        '<span class="ig-card__media">' + play +
          '<img loading="lazy" src="' + p.img + '" alt="' + (cap || 'mdot.blendz on Instagram') + '"></span>' +
        '<span class="ig-card__cap">' + (cap || ('@' + handle)) + '</span>' +
      '</a>';
    }
    function render(posts) { grid.innerHTML = posts.slice(0, count).map(card).join(''); }

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
  }

  function initBookingForm() {
    const form = document.getElementById('bookForm');
    const hint = document.getElementById('formHint');
    if (!form) return;
    const submitBtn = form.querySelector('button[type="submit"]');
    const submitLabel = submitBtn ? submitBtn.textContent : '';
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

      const data = new FormData(form);
      data.set('subject', 'New booking — ' + name + ' (' + location + ')');

      hint.textContent = 'Sending your request…';
      hint.className = 'book__hint';
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending…'; }

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: data
      })
        .then(function (r) { return r.json(); })
        .then(function (res) {
          if (res && res.success) {
            hint.innerHTML = 'Locked in, ' + escapeHtml(name) +
              '! I\'ll confirm your spot soon — or DM <a href="https://instagram.com/mdot.blendz" target="_blank" rel="noopener">@mdot.blendz</a> to speed it up.';
            hint.className = 'book__hint ok';
            form.reset();
          } else {
            throw new Error((res && res.message) || 'Submission failed');
          }
        })
        .catch(function () {
          hint.innerHTML = 'Couldn\'t send that — DM <a href="https://instagram.com/mdot.blendz" target="_blank" rel="noopener">@mdot.blendz</a> or email <a href="mailto:hello@mdotblendz.com">hello@mdotblendz.com</a>.';
          hint.className = 'book__hint err';
        })
        .then(function () {
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = submitLabel; }
        });
    });
  }

  function initPage() {
    // refresh scroll-related refs for the new DOM
    fab = document.querySelector('.fab');
    progress = document.getElementById('progress');
    heroPhoto = document.querySelector('.hero__photo');
    fabAlways = document.body.classList.contains('inner');
    onScroll();

    initMobileMenu();
    initReveal();
    initVideos();
    initInstagram();
    initBookingForm();

    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  initPage(); // first load
})();
