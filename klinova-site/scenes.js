/* ============================================================
   KLINOVA — scenes.js
   Holographic wireframe industry dioramas.
   Each builder: fn({main,alt}) -> THREE.Group with
   group.userData.update(t, dt). Shared by experience.js
   (homepage journey) and industry.js (detail pages).
   Requires global THREE (r128). Exposes window.KLINOVA_SCENES.
   ============================================================ */
(function () {
  "use strict";
  if (typeof THREE === "undefined") { console.warn("scenes.js: THREE missing"); return; }
  const TAU = Math.PI * 2;
  const V = (x, y, z) => new THREE.Vector3(x, y, z);

  function lmat(color, opacity) {
    const m = new THREE.LineBasicMaterial({ color, transparent: true, opacity, depthWrite: false, blending: THREE.AdditiveBlending });
    m.userData.base = opacity; return m;
  }
  function pmat(color, size, opacity) {
    const m = new THREE.PointsMaterial({ color, size, transparent: true, opacity, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true });
    m.userData.base = opacity; return m;
  }
  function fmat(color, opacity) {
    const m = new THREE.MeshBasicMaterial({ color, transparent: true, opacity, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending });
    m.userData.base = opacity; return m;
  }
  const wire = (geo, c, o = 0.75) => new THREE.LineSegments(new THREE.WireframeGeometry(geo), lmat(c, o));
  const edge = (geo, c, o = 0.95) => new THREE.LineSegments(new THREE.EdgesGeometry(geo, 18), lmat(c, o));
  const poly = (points, c, o = 0.95) => new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), lmat(c, o));
  const dots = (points, c, s = 0.05, o = 0.95) => new THREE.Points(new THREE.BufferGeometry().setFromPoints(points), pmat(c, s, o));

  const S = {};

  /* 1 · HEALTHCARE — cross + pulse rings + ECG */
  S.healthcare = function (A) {
    const g = new THREE.Group();
    const cross = new THREE.Group();
    cross.add(edge(new THREE.BoxGeometry(0.72, 2.1, 0.5), A.main));
    cross.add(edge(new THREE.BoxGeometry(2.1, 0.72, 0.5), A.main));
    g.add(cross);
    const rings = [];
    for (let i = 0; i < 3; i++) {
      const r = new THREE.Mesh(new THREE.RingGeometry(1.05, 1.1, 72), fmat(A.alt, 0.5));
      r.userData.phase = i / 3; g.add(r); rings.push(r);
    }
    const ecgPts = [];
    for (let i = 0; i <= 160; i++) { const x = (i / 160) * 6.4 - 3.2; const s = i % 32; let y = 0; if (s === 13) y = 0.12; if (s === 15) y = 1.0; if (s === 17) y = -0.55; if (s === 19) y = 0.18; ecgPts.push(V(x, y - 1.95, 0)); }
    const ecg = poly(ecgPts, A.alt, 0.9); g.add(ecg);
    g.userData.update = (t) => {
      cross.rotation.y = Math.sin(t * 0.4) * 0.55; cross.position.y = Math.sin(t * 0.8) * 0.05;
      rings.forEach((r) => { const p = ((t * 0.32) + r.userData.phase) % 1; const s = 0.5 + p * 2.6; r.scale.set(s, s, 1); r.material.opacity = (1 - p) * 0.55; });
      ecg.position.x = -((t * 1.1) % 2);
    };
    return g;
  };

  /* 2 · PHARMACY — DNA double helix + orbiting capsules */
  S.pharmacy = function (A) {
    const g = new THREE.Group();
    const H = 3.2, turns = 2.4, N = 120, R = 0.9;
    const s1 = [], s2 = [];
    for (let i = 0; i <= N; i++) { const t = i / N, a = t * turns * TAU, y = t * H - H / 2; s1.push(V(Math.cos(a) * R, y, Math.sin(a) * R)); s2.push(V(Math.cos(a + Math.PI) * R, y, Math.sin(a + Math.PI) * R)); }
    const helix = new THREE.Group();
    helix.add(poly(s1, A.main, 0.9)); helix.add(poly(s2, A.alt, 0.9));
    helix.add(dots(s1.filter((_, i) => i % 6 === 0), A.main, 0.07)); helix.add(dots(s2.filter((_, i) => i % 6 === 0), A.alt, 0.07));
    for (let i = 0; i <= N; i += 6) { helix.add(poly([s1[i], s2[i]], A.main, 0.4)); }
    g.add(helix);
    const caps = [];
    for (let i = 0; i < 3; i++) {
      const c = new THREE.Group();
      const cap = wire(new THREE.CylinderGeometry(0.16, 0.16, 0.5, 10), i % 2 ? A.alt : A.main, 0.9);
      cap.rotation.z = Math.PI / 2; c.add(cap);
      c.userData.a = (i / 3) * TAU; c.userData.r = 1.9 + i * 0.15; g.add(c); caps.push(c);
    }
    g.userData.update = (t) => {
      helix.rotation.y = t * 0.5;
      caps.forEach((c, i) => { const a = c.userData.a + t * (0.6 - i * 0.12); c.position.set(Math.cos(a) * c.userData.r, Math.sin(a * 1.3) * 0.7, Math.sin(a) * c.userData.r); c.rotation.y = a; });
    };
    return g;
  };

  /* 3 · LEGAL — colonnade + pediment + scales of justice */
  S.legal = function (A) {
    const g = new THREE.Group();
    const gold = A.main;
    const temple = new THREE.Group();
    const base = edge(new THREE.BoxGeometry(3.4, 0.28, 1.4), gold); base.position.y = -1.35; temple.add(base);
    const arch = edge(new THREE.BoxGeometry(3.2, 0.26, 1.25), gold); arch.position.y = 0.55; temple.add(arch);
    for (let i = 0; i < 5; i++) { const col = wire(new THREE.CylinderGeometry(0.16, 0.16, 1.6, 12), gold, 0.7); col.position.set(-1.4 + i * 0.7, -0.42, 0); temple.add(col); }
    // pediment (triangle) front + back
    const tri = [V(-1.7, 0.68, 0), V(0, 1.5, 0), V(1.7, 0.68, 0), V(-1.7, 0.68, 0)];
    const t1 = poly(tri.map((p) => V(p.x, p.y, 0.62)), gold, 0.9); const t2 = poly(tri.map((p) => V(p.x, p.y, -0.62)), gold, 0.9);
    temple.add(t1, t2); temple.add(poly([V(0, 1.5, 0.62), V(0, 1.5, -0.62)], gold, 0.6));
    temple.position.y = -0.2; g.add(temple);
    // scales floating above
    const scales = new THREE.Group(); scales.position.y = 1.35;
    scales.add(wire(new THREE.CylinderGeometry(0.03, 0.03, 1.0, 6), A.alt, 0.9)); // post
    const beam = wire(new THREE.BoxGeometry(2.0, 0.05, 0.05), A.alt, 0.95); beam.position.y = 0.5; scales.add(beam);
    const pans = [];
    [-1, 1].forEach((s) => { const pan = new THREE.Group(); pan.add(poly([V(0, 0.5, 0), V(s * 0.9, 0.5, 0)], A.alt, 0.5)); const dish = wire(new THREE.CylinderGeometry(0.28, 0.22, 0.14, 14, 1, true), A.alt, 0.9); dish.position.set(s * 0.9, 0.16, 0); pan.add(dish); pan.add(poly([V(s * 0.9, 0.5, 0), V(s * 0.9, 0.23, 0)], A.alt, 0.4)); scales.add(pan); pans.push(pan); });
    g.add(scales);
    g.userData.update = (t) => { g.rotation.y = Math.sin(t * 0.25) * 0.5; beam.rotation.z = Math.sin(t * 0.9) * 0.09; pans[0].rotation.z = 0; scales.position.y = 1.35 + Math.sin(t) * 0.05; };
    return g;
  };

  /* 4 · FINANCE — tower cluster + candlesticks + trend line */
  S.finance = function (A) {
    const g = new THREE.Group();
    const towers = new THREE.Group();
    const hs = [2.6, 1.8, 3.2, 2.1, 1.4];
    hs.forEach((h, i) => { const b = edge(new THREE.BoxGeometry(0.6, h, 0.6), A.alt, 0.8); b.position.set(-1.6 + i * 0.8, h / 2 - 1.6, 0); towers.add(b); });
    g.add(towers);
    const sticks = [];
    for (let i = 0; i < 10; i++) { const st = new THREE.Group(); const bar = wire(new THREE.BoxGeometry(0.16, 0.5, 0.16), A.main, 0.9); st.add(bar); st.add(poly([V(0, -0.5, 0), V(0, 0.5, 0)], A.main, 0.6)); st.position.set(-2.2 + i * 0.5, 1.4, 0.9); st.userData.i = i; sticks.push(st); g.add(st); }
    const trendPts = []; for (let i = 0; i <= 10; i++) trendPts.push(V(-2.2 + i * 0.5, 0.6 + Math.sin(i * 0.8) * 0.3 + i * 0.12, 0.9));
    const trend = poly(trendPts, A.main, 0.9); g.add(trend); g.add(dots(trendPts, A.main, 0.08));
    g.userData.update = (t) => { towers.rotation.y = Math.sin(t * 0.3) * 0.4; sticks.forEach((st) => { const h = 0.3 + (Math.sin(t * 1.5 + st.userData.i) * 0.5 + 0.5) * 0.9; st.children[0].scale.y = h; }); };
    return g;
  };

  /* 5 · GOVERNMENT — domed capitol + portico + flag */
  S.government = function (A) {
    const g = new THREE.Group();
    const c = A.main;
    const dome = wire(new THREE.SphereGeometry(0.95, 20, 10, 0, TAU, 0, Math.PI / 2), c, 0.7); dome.position.y = 0.5; g.add(dome);
    g.add(poly([V(0, 1.45, 0), V(0, 1.75, 0)], A.alt, 0.9)); g.add(dots([V(0, 1.8, 0)], A.alt, 0.14));
    const drum = wire(new THREE.CylinderGeometry(0.95, 0.95, 0.4, 20, 1, true), c, 0.6); drum.position.y = 0.3; g.add(drum);
    const arch = edge(new THREE.BoxGeometry(3.6, 0.24, 1.5), c); arch.position.y = 0.05; g.add(arch);
    for (let i = 0; i < 6; i++) { const col = wire(new THREE.CylinderGeometry(0.14, 0.14, 1.5, 12), c, 0.7); col.position.set(-1.5 + i * 0.6, -0.75, 0.55); g.add(col); }
    const tri = [V(-1.9, 0.18, 0.55), V(0, 0.85, 0.55), V(1.9, 0.18, 0.55), V(-1.9, 0.18, 0.55)]; g.add(poly(tri, c, 0.9));
    for (let i = 0; i < 3; i++) { const step = edge(new THREE.BoxGeometry(3.8 - i * 0.3, 0.12, 1.6 - i * 0.2), c, 0.5); step.position.set(0, -1.6 + i * 0.12, 0.2); g.add(step); }
    const flag = wire(new THREE.PlaneGeometry(0.6, 0.36, 4, 2), A.alt, 0.9); flag.position.set(1.9, 1.5, 0);
    const pole = poly([V(1.6, 0.9, 0), V(1.6, 1.85, 0)], A.alt, 0.8); g.add(pole); flag.position.set(1.9, 1.62, 0); g.add(flag);
    g.userData.update = (t) => { g.rotation.y = Math.sin(t * 0.25) * 0.45; flag.rotation.z = Math.sin(t * 2) * 0.04; };
    return g;
  };

  /* 6 · MANUFACTURING — meshing gears + robotic arm + conveyor */
  S.manufacturing = function (A) {
    const g = new THREE.Group();
    function gear(r, teeth, c) {
      const grp = new THREE.Group();
      grp.add(wire(new THREE.TorusGeometry(r, 0.08, 8, 40), c, 0.8));
      grp.add(wire(new THREE.CylinderGeometry(r * 0.28, r * 0.28, 0.12, 12), c, 0.6).rotateX(Math.PI / 2));
      for (let i = 0; i < teeth; i++) { const a = (i / teeth) * TAU; const tooth = edge(new THREE.BoxGeometry(0.14, 0.14, 0.16), c, 0.9); tooth.position.set(Math.cos(a) * r, Math.sin(a) * r, 0); grp.add(tooth); }
      for (let i = 0; i < 4; i++) { const a = (i / 4) * TAU; grp.add(poly([V(0, 0, 0), V(Math.cos(a) * r * 0.85, Math.sin(a) * r * 0.85, 0)], c, 0.4)); }
      return grp;
    }
    const g1 = gear(0.9, 12, A.main); g1.position.set(-0.8, 0.4, 0);
    const g2 = gear(0.6, 9, A.alt); g2.position.set(0.75, 0.9, 0);
    const g3 = gear(0.5, 8, A.main); g3.position.set(0.6, -0.4, 0);
    g.add(g1, g2, g3);
    // robotic arm
    const arm = new THREE.Group(); arm.position.set(-1.9, -1.2, 0.3);
    const s1 = wire(new THREE.BoxGeometry(0.18, 1.1, 0.18), A.alt, 0.9); s1.position.y = 0.55; arm.add(s1);
    const j = new THREE.Group(); j.position.y = 1.1; arm.add(j);
    const s2 = wire(new THREE.BoxGeometry(0.15, 1.0, 0.15), A.alt, 0.9); s2.position.y = 0.5; j.add(s2);
    const tip = dots([V(0, 1.0, 0)], A.main, 0.12); j.add(tip);
    g.add(arm);
    // conveyor
    const conv = new THREE.Group(); conv.position.y = -1.5;
    for (let i = 0; i < 8; i++) conv.add(poly([V(-2 + i * 0.55, 0, 0.4), V(-2 + i * 0.55, 0, -0.4)], A.main, 0.4));
    conv.add(poly([V(-2, 0, 0.4), V(2.2, 0, 0.4)], A.main, 0.5)); conv.add(poly([V(-2, 0, -0.4), V(2.2, 0, -0.4)], A.main, 0.5));
    g.add(conv);
    g.userData.update = (t) => { g1.rotation.z = t * 0.8; g2.rotation.z = -t * 1.2; g3.rotation.z = -t * 1.44; arm.rotation.z = Math.sin(t * 0.7) * 0.25; j.rotation.z = Math.sin(t * 0.7 + 1) * 0.5; };
    return g;
  };

  /* 7 · LOGISTICS — wireframe globe + route arcs + package */
  S.logistics = function (A) {
    const g = new THREE.Group();
    const globe = wire(new THREE.SphereGeometry(1.35, 22, 14), A.main, 0.45); g.add(globe);
    function onSphere(lat, lon, r) { const p = (90 - lat) * Math.PI / 180, th = (lon + 180) * Math.PI / 180; return V(-r * Math.sin(p) * Math.cos(th), r * Math.cos(p), r * Math.sin(p) * Math.sin(th)); }
    const arcs = [];
    const routes = [[20, -100, 51, 0], [51, 0, 35, 139], [35, 139, -33, 151], [40, -3, -23, -46]];
    routes.forEach((r, k) => { const a = onSphere(r[0], r[1], 1.36), b = onSphere(r[2], r[3], 1.36); const mid = a.clone().add(b).multiplyScalar(0.5).setLength(2.05); const curve = new THREE.QuadraticBezierCurve3(a, mid, b); const arc = poly(curve.getPoints(40), A.alt, 0.9); g.add(arc); const dot = dots([a], A.alt, 0.12); g.add(dot); arcs.push({ curve, dot, off: k * 0.25 }); });
    const pkg = wire(new THREE.BoxGeometry(0.3, 0.3, 0.3), A.alt, 0.95); g.add(pkg);
    g.userData.update = (t) => { globe.rotation.y = t * 0.25; arcs.forEach((o) => { const p = ((t * 0.3) + o.off) % 1; o.dot.geometry.setFromPoints([o.curve.getPoint(p)]); }); const pa = t * 0.6; pkg.position.set(Math.cos(pa) * 2.1, Math.sin(pa * 1.4) * 0.9, Math.sin(pa) * 2.1); pkg.rotation.set(t, t * 0.7, 0); };
    return g;
  };

  /* 8 · PROFESSIONAL SERVICES — node network + data core */
  S.professional = function (A) {
    const g = new THREE.Group();
    const core = wire(new THREE.IcosahedronGeometry(0.6, 0), A.main, 0.8); g.add(core);
    const nodes = []; const N = 22;
    for (let i = 0; i < N; i++) { const a = Math.acos(1 - 2 * (i + 0.5) / N), b = TAU * i * 0.618; const r = 1.7 + (i % 3) * 0.2; nodes.push(V(r * Math.sin(a) * Math.cos(b), r * Math.cos(a) * 0.8, r * Math.sin(a) * Math.sin(b))); }
    g.add(dots(nodes, A.alt, 0.08));
    const edgesPairs = [];
    for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) { if (nodes[i].distanceTo(nodes[j]) < 1.5) { g.add(poly([nodes[i], nodes[j]], A.main, 0.22)); edgesPairs.push([nodes[i], nodes[j]]); } }
    const packets = []; for (let i = 0; i < 6; i++) { const e = edgesPairs[(i * 7) % edgesPairs.length]; const p = dots([e[0]], A.alt, 0.13); g.add(p); packets.push({ e, p, off: Math.random() }); }
    g.userData.update = (t) => { g.rotation.y = t * 0.3; core.rotation.x = t * 0.5; core.rotation.y = -t * 0.4; packets.forEach((o) => { const k = ((t * 0.5) + o.off) % 1; o.p.geometry.setFromPoints([o.e[0].clone().lerp(o.e[1], k)]); }); };
    return g;
  };

  window.KLINOVA_SCENES = S;
})();
