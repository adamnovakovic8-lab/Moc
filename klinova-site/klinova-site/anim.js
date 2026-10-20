/* ============================================================
   KLINOVA — anim.js  (reconstructed canvas background engine)
   Draws a generative background per section, keyed off
   [data-anim] : tunnel | plasma | code | blobs | constellation
   Optional [data-anim-hue] (0..1) tints plasma.
   Only the on-screen section animates (IntersectionObserver).
   ============================================================ */
(() => {
  "use strict";
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const lerp = (a, b, t) => a + (b - a) * t;

  function fit(canvas) {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const r = canvas.getBoundingClientRect();
    const w = Math.max(1, Math.round(r.width));
    const h = Math.max(1, Math.round(r.height));
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { w, h, ctx };
  }

  /* ---------------- tunnel / hyperspace ---------------- */
  function tunnel(canvas) {
    let W = 0, H = 0, cx = 0, cy = 0, ctx = null;
    const N = 320;
    let stars = [];
    const spawn = () => ({ x: Math.random() * 2 - 1, y: Math.random() * 2 - 1, z: Math.random() });
    function resize() {
      const f = fit(canvas); W = f.w; H = f.h; ctx = f.ctx; cx = W / 2; cy = H / 2;
      if (!stars.length) stars = Array.from({ length: N }, spawn);
    }
    function frame(dt) {
      if (!ctx) return;
      ctx.fillStyle = "rgba(6,6,13,0.32)";
      ctx.fillRect(0, 0, W, H);
      const spread = Math.max(W, H) * 0.75;
      for (const s of stars) {
        const oz = s.z;
        s.z -= dt * 0.00028;
        if (s.z <= 0.02) { const n = spawn(); s.x = n.x; s.y = n.y; s.z = 1; continue; }
        const k = spread / s.z, ok = spread / oz;
        const x = cx + s.x * k, y = cy + s.y * k;
        const px = cx + s.x * ok, py = cy + s.y * ok;
        if (x < -80 || x > W + 80 || y < -80 || y > H + 80) { const n = spawn(); s.x = n.x; s.y = n.y; s.z = 1; continue; }
        const t = 1 - s.z;
        ctx.strokeStyle = `rgba(${lerp(34, 160, t) | 0},${lerp(224, 90, t) | 0},255,${0.35 + 0.55 * t})`;
        ctx.lineWidth = Math.max(0.6, t * 2.4);
        ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(x, y); ctx.stroke();
      }
    }
    return { resize, frame };
  }

  /* ---------------- plasma ---------------- */
  function plasma(canvas, hueParam) {
    let W = 0, H = 0, ctx = null;
    const base = isNaN(hueParam) ? 0.55 : hueParam;
    const M = 5;
    const blobs = Array.from({ length: M }, (_, i) => ({
      fx: Math.random() * 6.28, fy: Math.random() * 6.28,
      sx: 0.5 + Math.random() * 0.7, sy: 0.5 + Math.random() * 0.7,
      h: base * 360 + (i - M / 2) * 20 + Math.random() * 12
    }));
    function resize() { const f = fit(canvas); W = f.w; H = f.h; ctx = f.ctx; }
    function frame(_dt, now) {
      if (!ctx) return;
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "#06060d";
      ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = "lighter";
      const t = now * 0.00018;
      const R = Math.max(W, H) * 0.6;
      for (const b of blobs) {
        const x = W * (0.5 + 0.4 * Math.sin(t * b.sx + b.fx));
        const y = H * (0.5 + 0.4 * Math.cos(t * b.sy + b.fy));
        const g = ctx.createRadialGradient(x, y, 0, x, y, R);
        g.addColorStop(0, `hsla(${b.h},95%,62%,0.30)`);
        g.addColorStop(0.45, `hsla(${b.h},95%,55%,0.09)`);
        g.addColorStop(1, "hsla(0,0%,0%,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
      }
      ctx.globalCompositeOperation = "source-over";
    }
    return { resize, frame };
  }

  /* ---------------- code / matrix rain ---------------- */
  function code(canvas) {
    let W = 0, H = 0, ctx = null, cols = 0, drops = [];
    const fs = 16;
    const chars = "01<>{}/=;:•KLINOVA()[]#$*+".split("");
    function resize() {
      const f = fit(canvas); W = f.w; H = f.h; ctx = f.ctx;
      cols = Math.ceil(W / fs);
      drops = Array.from({ length: cols }, () => Math.random() * -60);
    }
    function frame(dt) {
      if (!ctx) return;
      ctx.fillStyle = "rgba(6,6,13,0.10)";
      ctx.fillRect(0, 0, W, H);
      ctx.font = `500 ${fs - 3}px "JetBrains Mono", ui-monospace, monospace`;
      const step = dt / 16;
      for (let i = 0; i < cols; i++) {
        const c = chars[(Math.random() * chars.length) | 0];
        const x = i * fs, y = drops[i] * fs;
        if (y > 0 && y < H) {
          ctx.fillStyle = Math.random() < 0.015 ? "rgba(180,255,255,0.95)" : "rgba(46,190,255,0.48)";
          ctx.fillText(c, x, y);
        }
        drops[i] += 0.35 + step * 0.55;
        if (y > H && Math.random() > 0.975) drops[i] = Math.random() * -20;
      }
    }
    return { resize, frame };
  }

  /* ---------------- blobs (light / liquid) ---------------- */
  function blobs(canvas) {
    let W = 0, H = 0, ctx = null;
    const cols = [[255, 90, 43], [255, 122, 82], [201, 191, 168], [120, 110, 95]];
    const M = 6;
    const arr = Array.from({ length: M }, (_, i) => ({
      fx: Math.random() * 6.28, fy: Math.random() * 6.28,
      sx: 0.4 + Math.random() * 0.6, sy: 0.4 + Math.random() * 0.6,
      c: cols[i % cols.length], r: 0.5 + Math.random() * 0.4
    }));
    function resize() { const f = fit(canvas); W = f.w; H = f.h; ctx = f.ctx; }
    function frame(_dt, now) {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = "source-over";
      const t = now * 0.00022;
      const R = Math.max(W, H) * 0.42;
      for (const b of arr) {
        const x = W * (0.5 + 0.42 * Math.sin(t * b.sx + b.fx));
        const y = H * (0.5 + 0.42 * Math.cos(t * b.sy + b.fy));
        const rr = R * b.r;
        const g = ctx.createRadialGradient(x, y, 0, x, y, rr);
        g.addColorStop(0, `rgba(${b.c[0]},${b.c[1]},${b.c[2]},0.42)`);
        g.addColorStop(1, `rgba(${b.c[0]},${b.c[1]},${b.c[2]},0)`);
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
      }
    }
    return { resize, frame };
  }

  /* ---------------- constellation (light / network) ---------------- */
  function constellation(canvas) {
    let W = 0, H = 0, ctx = null, pts = [];
    const N = 66, LINK = 130;
    function resize() {
      const f = fit(canvas); W = f.w; H = f.h; ctx = f.ctx;
      pts = Array.from({ length: N }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.12, vy: (Math.random() - 0.5) * 0.12
      }));
    }
    function frame(dt) {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);
      for (const p of pts) {
        p.x += p.vx * dt; p.y += p.vy * dt;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
      }
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const a = pts[i], b = pts[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < LINK * LINK) {
            const al = (1 - Math.sqrt(d2) / LINK) * 0.45;
            ctx.strokeStyle = `rgba(22,21,15,${al})`;
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }
      ctx.fillStyle = "rgba(255,90,43,0.85)";
      for (const p of pts) { ctx.beginPath(); ctx.arc(p.x, p.y, 1.7, 0, 6.283); ctx.fill(); }
    }
    return { resize, frame };
  }

  const BUILDERS = { tunnel, plasma, code, blobs, constellation };

  function build(sec) {
    const canvas = sec.querySelector("canvas.sec-canvas");
    if (!canvas) return null;
    const fn = BUILDERS[sec.dataset.anim];
    if (!fn) return null;
    const inst = fn(canvas, parseFloat(sec.dataset.animHue));
    inst.resize();
    return inst;
  }

  const items = [];
  document.querySelectorAll("[data-anim]").forEach((sec) => {
    const inst = build(sec);
    if (inst) items.push({ sec, inst, visible: false });
  });

  let rt = null;
  addEventListener("resize", () => {
    clearTimeout(rt);
    rt = setTimeout(() => items.forEach((o) => o.inst.resize()), 160);
  }, { passive: true });

  if (reduced) {
    items.forEach((o) => o.inst.frame(16, 0));
    return;
  }

  const io = new IntersectionObserver((es) => {
    es.forEach((e) => {
      const o = items.find((x) => x.sec === e.target);
      if (o) o.visible = e.isIntersecting;
    });
  }, { threshold: 0.01 });
  items.forEach((o) => io.observe(o.sec));

  let last = performance.now();
  (function loop(now) {
    const dt = Math.min(48, now - last);
    last = now;
    for (const o of items) if (o.visible) o.inst.frame(dt, now);
    requestAnimationFrame(loop);
  })(last);
})();
