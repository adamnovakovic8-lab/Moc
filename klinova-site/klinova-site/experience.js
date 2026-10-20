/* ============================================================
   KLINOVA — experience.js
   Homepage immersive WebGL: monitor-dive intro -> white flash ->
   scroll-driven holographic industry journey. HUD + skip + parallax.
   Requires THREE (r128), GSAP, window.KLINOVA_SCENES + _INDUSTRIES.
   Runs after main.js so window.__lenis exists.
   ============================================================ */
(function () {
  "use strict";
  const body = document.body;
  if (!body || body.dataset.page !== "home") return;
  const canvas = document.getElementById("xpCanvas");
  const INDU = window.KLINOVA_INDUSTRIES, SCENES = window.KLINOVA_SCENES;
  if (!canvas || typeof THREE === "undefined" || !INDU || !SCENES) { document.documentElement.classList.add("xp-off"); return; }

  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasGsap = typeof gsap !== "undefined";
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const smooth = (t) => t * t * (3 - 2 * t);
  const $ = (id) => document.getElementById(id);
  const vpW = () => (canvas.clientWidth || window.innerWidth || document.documentElement.clientWidth || 1);
  const vpH = () => (canvas.clientHeight || window.innerHeight || document.documentElement.clientHeight || 1);

  const stage = $("xpStage"), hud = $("xpHud"), flash = $("xpFlash"),
    elNum = $("xpNum"), elEye = $("xpEye"), elName = $("xpName"), elTag = $("xpTag"),
    elBlurb = $("xpBlurb"), elMore = $("xpMore"), rail = $("xpRail"), hint = $("xpHint"), skipBtn = $("xpSkip");

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  } catch (e) { fail(); return; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));
  renderer.setSize(innerWidth, innerHeight, false);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x06060d, 0.05);
  const camera = new THREE.PerspectiveCamera(52, innerWidth / innerHeight, 0.1, 120);
  camera.position.set(0, 0.6, 8);

  /* ---- persistent ambient (continuity between sectors) ---- */
  const grid = new THREE.GridHelper(80, 80, 0x21507a, 0x142a44);
  grid.material.transparent = true; grid.material.opacity = 0.2; grid.material.depthWrite = false;
  grid.position.y = -2.6; scene.add(grid);

  const starPts = [];
  for (let i = 0; i < 1500; i++) starPts.push(new THREE.Vector3((Math.random() - 0.5) * 70, (Math.random() - 0.5) * 46, (Math.random() - 0.5) * 70));
  const stars = new THREE.Points(new THREE.BufferGeometry().setFromPoints(starPts),
    new THREE.PointsMaterial({ color: 0x6a86ff, size: 0.07, transparent: true, opacity: 0.55, depthWrite: false, blending: THREE.AdditiveBlending }));
  scene.add(stars);

  /* ---- industry scenes ---- */
  const N = INDU.length;
  const items = INDU.map((ind, i) => {
    const g = SCENES[ind.scene]({ main: ind.accent, alt: ind.accent2 });
    g.visible = false; scene.add(g);
    return { g, ind, i };
  });
  function setFade(g, f) {
    g.visible = f > 0.004;
    g.traverse((o) => { const m = o.material; if (m && m.userData && m.userData.base != null) m.opacity = f * m.userData.base; });
  }

  /* ---- intro monitor with live code texture ---- */
  const monitor = new THREE.Group(); scene.add(monitor); monitor.visible = false; monitor.position.set(0, 0.35, 0);
  const cc = document.createElement("canvas"); cc.width = 512; cc.height = 512; const cx = cc.getContext("2d");
  const codeTex = new THREE.CanvasTexture(cc);
  monitor.add(new THREE.Mesh(new THREE.PlaneGeometry(3.4, 2.12), new THREE.MeshBasicMaterial({ map: codeTex, transparent: true, opacity: 0.96 })));
  const cyan = 0x22e0ff;
  const bezMat = new THREE.LineBasicMaterial({ color: cyan, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false });
  monitor.add(new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(3.74, 2.46, 0.14)), bezMat));
  const stand = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(0.5, 0.5, 0.2)), bezMat); stand.position.y = -1.5; monitor.add(stand);
  const foot = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(1.4, 0.08, 0.6)), bezMat); foot.position.y = -1.78; monitor.add(foot);
  const CODE = ["const klinova = build({", "  inHouse: true, offshore: false,", "  security: ['RBAC','MFA','AES-256'],", "  region: 'CA', pipeda: true", "})", "await deploy(platform, { audit: true })", "function shapeToFit(workflow) {", "  return engineer(workflow, team.CA)", "}", "// no third-party cores", "systems.consolidate(5).into(1)", "if (secure && scalable) ship()"];
  function drawCode(now) {
    cx.fillStyle = "#04040c"; cx.fillRect(0, 0, 512, 512);
    cx.font = "600 17px 'JetBrains Mono', monospace";
    const scroll = (now * 0.045) % 26;
    for (let r = -1; r < 30; r++) {
      const y = r * 26 + 20 - scroll;
      const s = CODE[((r % CODE.length) + CODE.length) % CODE.length];
      cx.fillStyle = r % 6 === 0 ? "rgba(126,249,255,0.95)" : "rgba(60,200,255,0.5)";
      cx.fillText(s, 14, y);
    }
    cx.strokeStyle = "rgba(34,224,255,0.10)"; for (let gy = 0; gy < 512; gy += 4) { cx.beginPath(); cx.moveTo(0, gy); cx.lineTo(512, gy); cx.stroke(); }
    codeTex.needsUpdate = true;
  }

  /* ---- HUD wiring ---- */
  INDU.forEach((ind, i) => {
    const li = document.createElement("li");
    li.innerHTML = '<b>' + String(i + 1).padStart(2, "0") + '</b><span>' + ind.name + '</span>';
    li.addEventListener("click", () => scrollToIndustry(i));
    rail.appendChild(li);
  });
  const railItems = [...rail.children];
  let active = -1;
  function setActive(i) {
    if (i === active) return; active = i;
    const ind = INDU[i];
    hud.style.setProperty("--xa", ind.accentCss);
    hud.style.setProperty("--xb", ind.accent2Css);
    elNum.textContent = String(i + 1).padStart(2, "0");
    elName.textContent = ind.name; elTag.textContent = ind.tag; elBlurb.textContent = ind.blurb;
    elMore.setAttribute("href", "industry.html?id=" + ind.id);
    railItems.forEach((li, k) => li.classList.toggle("on", k === i));
    hud.classList.remove("swap"); void hud.offsetWidth; hud.classList.add("swap");
  }

  /* ---- scroll metrics ---- */
  function scrollable() { return Math.max(1, stage.offsetHeight - vpH()); }
  function progress() { return clamp((window.scrollY - stage.offsetTop) / scrollable(), 0, 1); }
  function scrollToIndustry(i) {
    const target = stage.offsetTop + (i / (N - 1)) * scrollable();
    if (window.__lenis) window.__lenis.scrollTo(target, { duration: 1.1 });
    else window.scrollTo({ top: target, behavior: "smooth" });
  }

  /* ---- intro ---- */
  let introDone = false, running = true;
  function lock() { if (window.__lenis) window.__lenis.stop(); document.documentElement.classList.add("xp-lock"); window.scrollTo(0, 0); }
  function unlock() { if (window.__lenis) window.__lenis.start(); document.documentElement.classList.remove("xp-lock"); }
  function endIntro() {
    if (introDone) return; introDone = true;
    monitor.visible = false; camera.position.set(0, 0.6, 8);
    unlock(); body.classList.remove("xp-intro"); body.classList.add("xp-run");
    setActive(0);
  }
  function doFlash() {
    if (!flash) return;
    if (hasGsap) { gsap.set(flash, { opacity: 1 }); gsap.to(flash, { opacity: 0, duration: 0.9, ease: "power2.out" }); }
    else { flash.style.opacity = 1; setTimeout(() => (flash.style.transition = "opacity .9s", flash.style.opacity = 0), 30); }
  }
  function playIntro() {
    body.classList.add("xp-intro");
    if (reduced || !hasGsap) { endIntro(); return; }
    lock(); monitor.visible = true; camera.position.set(0, 0.35, 9.2); monitor.scale.setScalar(1);
    const tl = gsap.timeline({ onComplete: endIntro });
    tl.to(camera.position, { z: 0.18, duration: 2.7, ease: "power2.in" }, 0.35);
    tl.to(monitor.scale, { x: 1.7, y: 1.7, duration: 2.7, ease: "power2.in" }, 0.35);
    tl.add(doFlash, 2.72);
    tl.set(monitor, { visible: false }, 2.82);
  }

  /* ---- parallax ---- */
  let mx = 0, my = 0, cx0 = 0, cy0 = 0;
  addEventListener("mousemove", (e) => { mx = (e.clientX / vpW() - 0.5); my = (e.clientY / vpH() - 0.5); }, { passive: true });

  /* ---- resize ---- */
  function resize() { const w = vpW(), h = vpH(); renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); }
  addEventListener("resize", resize);

  /* ---- skip ---- */
  if (skipBtn) skipBtn.addEventListener("click", () => {
    if (hasGsap) gsap.killTweensOf([camera.position, monitor.scale]);
    endIntro();
    const site = document.getElementById("site");
    const top = site ? site.offsetTop : stage.offsetTop + stage.offsetHeight;
    if (window.__lenis) window.__lenis.scrollTo(top, { duration: 1.0 });
    else window.scrollTo({ top, behavior: "smooth" });
  });

  /* ---- render loop ---- */
  let last = performance.now(), clock = 0;
  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000); last = now; clock += dt;
    stars.rotation.y += dt * 0.008; grid.position.z = (clock * 0.4) % 4;

    if (!introDone) {
      drawCode(now);
      camera.lookAt(0, 0.35, 0);
    } else {
      const p = progress(), fpos = p * (N - 1);
      setActive(clamp(Math.round(fpos), 0, N - 1));
      for (const it of items) {
        const local = fpos - it.i, d = Math.abs(local);
        const f = d < 1 ? smooth(1 - d) : 0;
        setFade(it.g, f);
        if (f > 0.004) {
          it.g.position.set(local * 0.7, 0, -local * 3.4);
          const s = (1 - Math.min(1, d) * 0.34) * (it.ind.scale || 1);
          it.g.scale.setScalar(s);
          it.g.rotation.z = local * 0.12;
          if (it.g.userData.update) it.g.userData.update(clock, dt, f);
        }
      }
      // fade whole experience out as the regular site scrolls in
      const site = document.getElementById("site");
      const exit = site ? clamp(1 - site.getBoundingClientRect().top / vpH(), 0, 1) : 0;
      canvas.style.opacity = String(1 - exit);
      hud.style.opacity = String(1 - Math.min(1, exit * 1.4));
      hud.style.pointerEvents = exit > 0.4 ? "none" : "";
      cx0 += (mx * 0.9 - cx0) * 0.05; cy0 += (my * 0.5 - cy0) * 0.05;
      camera.position.set(cx0, 0.6 - cy0, 8);
      camera.lookAt(0, 0.25, 0);
    }
    renderer.render(scene, camera);
    if (running) requestAnimationFrame(frame);
  }

  function fail() { document.documentElement.classList.add("xp-off"); unlock && unlock(); }

  // hide scroll hint after first real scroll
  addEventListener("scroll", () => { if (introDone && window.scrollY > innerHeight * 0.15 && hint) hint.classList.add("gone"); }, { passive: true });

  // boot it
  resize();
  playIntro();
  requestAnimationFrame(frame);
})();
