"use client";

import { useEffect, useRef } from "react";

type SysNode = { x: number; y: number; label: string; t: number };

/**
 * The hero's living schematic: a system drawing itself into existence.
 *
 * Deliberately a technical drawing rather than an ambient blob field —
 * chamfered node blocks, orthogonal elbow routing, and a travelling pulse
 * once the graph closes. Coordinates are normalised and asymmetric on purpose.
 */
const NODES: SysNode[] = [
  { x: 0.08, y: 0.22, label: "intake", t: 0.0 },
  { x: 0.31, y: 0.06, label: "model", t: 0.1 },
  { x: 0.2, y: 0.52, label: "roles", t: 0.2 },
  { x: 0.44, y: 0.36, label: "core", t: 0.32 },
  { x: 0.63, y: 0.18, label: "audit", t: 0.46 },
  { x: 0.58, y: 0.66, label: "records", t: 0.56 },
  { x: 0.79, y: 0.44, label: "api", t: 0.68 },
  { x: 0.88, y: 0.58, label: "deploy", t: 0.82 },
  { x: 0.5, y: 0.91, label: "backup", t: 0.9 },
];

const EDGES: [number, number][] = [
  [0, 1],
  [0, 2],
  [1, 3],
  [2, 3],
  [3, 4],
  [3, 5],
  [4, 6],
  [5, 6],
  [6, 7],
  [5, 8],
];

type Pt = { x: number; y: number };

export function SystemCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let w = 0;
    let h = 0;
    let raf = 0;
    let start = 0;

    // Pointer influence — the sheet bends slightly around the cursor.
    let px = -9999;
    let py = -9999;
    let pxCur = -9999;
    let pyCur = -9999;

    const styles = getComputedStyle(canvas);
    const ink = () => styles.getPropertyValue("--ink").trim() || "#12120f";
    const accent = () =>
      styles.getPropertyValue("--accent").trim() || "#ff5a2b";

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const pos = (n: SysNode): Pt => {
      let x = n.x * w;
      let y = n.y * h;
      // Bend: nodes ease away from the cursor, capped so it stays subtle.
      const dx = x - pxCur;
      const dy = y - pyCur;
      const d = Math.hypot(dx, dy);
      const R = Math.min(w, h) * 0.42;
      if (d < R && d > 0.01) {
        const force = Math.pow(1 - d / R, 2) * 22;
        x += (dx / d) * force;
        y += (dy / d) * force;
      }
      return { x, y };
    };

    /** Orthogonal elbow — the way a schematic actually routes. */
    const route = (a: Pt, b: Pt): Pt[] => {
      const midX = a.x + (b.x - a.x) * 0.55;
      return [a, { x: midX, y: a.y }, { x: midX, y: b.y }, b];
    };

    const drawGrid = () => {
      const gap = 30;
      ctx.fillStyle = ink();
      ctx.globalAlpha = 0.1;
      for (let x = gap; x < w; x += gap) {
        for (let y = gap; y < h; y += gap) {
          ctx.fillRect(x, y, 1, 1);
        }
      }
      ctx.globalAlpha = 1;
    };

    const drawNode = (p: Pt, n: SysNode, appear: number, live: boolean) => {
      const s = 9 + appear * 3;
      ctx.save();
      ctx.globalAlpha = appear;
      ctx.strokeStyle = live ? accent() : ink();
      ctx.lineWidth = 1;

      // Chamfered block — the Klinova corner.
      const k = 3.5;
      ctx.beginPath();
      ctx.moveTo(p.x - s, p.y - s);
      ctx.lineTo(p.x + s - k, p.y - s);
      ctx.lineTo(p.x + s, p.y - s + k);
      ctx.lineTo(p.x + s, p.y + s);
      ctx.lineTo(p.x - s, p.y + s);
      ctx.closePath();
      ctx.stroke();

      if (live) {
        ctx.fillStyle = accent();
        ctx.globalAlpha = appear * 0.16;
        ctx.fill();
        ctx.globalAlpha = appear;
      }

      // Narrow sheets have no room for the annotation layer — the labels
      // land on top of the copy. The drawing keeps its texture without them.
      if (w >= 700) {
        ctx.fillStyle = ink();
        ctx.globalAlpha = appear * 0.6;
        ctx.font = "500 9px ui-monospace, SFMono-Regular, monospace";
        ctx.fillText(n.label.toUpperCase(), p.x + s + 7, p.y + 3);
      }
      ctx.restore();
    };

    const render = (time: number) => {
      if (!start) start = time;
      const elapsed = (time - start) / 1000;

      pxCur += (px - pxCur) * 0.08;
      pyCur += (py - pyCur) * 0.08;

      ctx.clearRect(0, 0, w, h);
      drawGrid();

      const BUILD = 4.6; // seconds for the system to finish assembling
      const p = reduced.matches ? 1 : Math.min(elapsed / BUILD, 1);
      const points = NODES.map(pos);

      ctx.lineCap = "square";
      ctx.lineJoin = "miter";

      EDGES.forEach(([a, b], i) => {
        const startAt = Math.max(NODES[a].t, NODES[b].t) + 0.04;
        const seg = Math.max(0, Math.min((p - startAt) / 0.18, 1));
        if (seg <= 0) return;

        const pts = route(points[a], points[b]);
        const total = pts
          .slice(1)
          .reduce(
            (acc, q, j) => acc + Math.hypot(q.x - pts[j].x, q.y - pts[j].y),
            0,
          );

        let budget = total * seg;
        ctx.strokeStyle = ink();
        ctx.globalAlpha = 0.32;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let j = 1; j < pts.length && budget > 0; j++) {
          const len = Math.hypot(
            pts[j].x - pts[j - 1].x,
            pts[j].y - pts[j - 1].y,
          );
          const take = Math.min(len, budget) / (len || 1);
          ctx.lineTo(
            pts[j - 1].x + (pts[j].x - pts[j - 1].x) * take,
            pts[j - 1].y + (pts[j].y - pts[j - 1].y) * take,
          );
          budget -= len;
        }
        ctx.stroke();
        ctx.globalAlpha = 1;

        // Once assembled, data moves between the products.
        if (p >= 1 && !reduced.matches) {
          const phase = (((elapsed * 0.32 + i * 0.13) % 1) + 1) % 1;
          let travel = total * phase;
          for (let j = 1; j < pts.length; j++) {
            const len = Math.hypot(
              pts[j].x - pts[j - 1].x,
              pts[j].y - pts[j - 1].y,
            );
            if (travel <= len) {
              const r = travel / (len || 1);
              const mx = pts[j - 1].x + (pts[j].x - pts[j - 1].x) * r;
              const my = pts[j - 1].y + (pts[j].y - pts[j - 1].y) * r;
              ctx.fillStyle = accent();
              ctx.globalAlpha = 0.9;
              ctx.fillRect(mx - 1.6, my - 1.6, 3.2, 3.2);
              ctx.globalAlpha = 1;
              break;
            }
            travel -= len;
          }
        }
      });

      NODES.forEach((n, i) => {
        const appear = Math.max(0, Math.min((p - n.t) / 0.12, 1));
        if (appear <= 0) return;
        // "core" carries the accent — the centre the rest hangs off.
        drawNode(points[i], n, appear, n.label === "core" && p > 0.4);
      });

      raf = requestAnimationFrame(render);
    };

    const onPointer = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      px = e.clientX - rect.left;
      py = e.clientY - rect.top;
    };
    const onOut = () => {
      px = -9999;
      py = -9999;
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("pointerleave", onOut);
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerleave", onOut);
    };
  }, []);

  return <canvas ref={ref} className="system-canvas" aria-hidden="true" />;
}
