/* ============================================================
   KLINOVA — industry.js
   Dynamic per-sector detail page. Reads ?id=, renders content
   from window.KLINOVA_INDUSTRIES, and mounts the matching
   holographic scene as a live hero. Runs after main.js.
   ============================================================ */
(function () {
  "use strict";
  const INDU = window.KLINOVA_INDUSTRIES || [];
  const id = new URLSearchParams(location.search).get("id");
  const data = INDU.find((x) => x.id === id) || INDU[0];
  if (!data) return;

  const root = document.documentElement;
  root.style.setProperty("--xa", data.accentCss);
  root.style.setProperty("--xb", data.accent2Css);
  document.title = data.name + " — Industries — KLINOVA";
  const set = (elId, txt) => { const el = document.getElementById(elId); if (el) el.textContent = txt; };
  set("indCrumb", data.name.toUpperCase());
  set("indName", data.name);
  set("indTag", data.tag);
  set("indLead", data.lead);
  set("indStat", data.stat || "");
  set("indStatLabel", data.statLabel || "");

  const help = document.getElementById("indHelp");
  if (help) help.innerHTML = data.help.map((h, i) =>
    '<div class="step in"><span>' + String(i + 1).padStart(2, "0") + "</span><h3>" + h.t + "</h3><p>" + h.d + "</p></div>").join("");
  const plat = document.getElementById("indPlatforms");
  if (plat) plat.innerHTML = (data.platforms || []).map((p) => "<span>" + p + "</span>").join("");

  /* ---- holographic hero ---- */
  const canvas = document.getElementById("indHeroCanvas");
  if (!canvas || typeof THREE === "undefined" || !window.KLINOVA_SCENES) return;
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true }); } catch (e) { return; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x06060d, 0.05);
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.set(0, 0.4, 8);

  const grid = new THREE.GridHelper(64, 64, 0x21507a, 0x142a44);
  grid.material.transparent = true; grid.material.opacity = 0.15; grid.material.depthWrite = false; grid.position.y = -2.6; scene.add(grid);
  const sp = [];
  for (let i = 0; i < 900; i++) sp.push(new THREE.Vector3((Math.random() - 0.5) * 62, (Math.random() - 0.5) * 42, (Math.random() - 0.5) * 62));
  scene.add(new THREE.Points(new THREE.BufferGeometry().setFromPoints(sp),
    new THREE.PointsMaterial({ color: 0x6a86ff, size: 0.06, transparent: true, opacity: 0.42, depthWrite: false, blending: THREE.AdditiveBlending })));

  const g = window.KLINOVA_SCENES[data.scene]({ main: data.accent, alt: data.accent2 });
  scene.add(g);

  function size() { const r = canvas.getBoundingClientRect(); renderer.setSize(r.width, r.height, false); camera.aspect = r.width / Math.max(1, r.height); camera.updateProjectionMatrix(); }
  size(); addEventListener("resize", size);

  let mx = 0, my = 0, cx = 0, cy = 0;
  addEventListener("mousemove", (e) => { mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5; }, { passive: true });

  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let last = performance.now(), clock = 0;
  (function loop(now) {
    const dt = Math.min(0.05, (now - last) / 1000); last = now; clock += dt;
    if (g.userData.update) g.userData.update(clock, dt, 1);
    if (!reduced) { cx += (mx * 1.1 - cx) * 0.05; cy += (my * 0.5 - cy) * 0.05; }
    camera.position.set(cx, 0.4 - cy, 8);
    camera.lookAt(0, 0.2, 0);
    renderer.render(scene, camera);
    requestAnimationFrame(loop);
  })(last);
})();
