"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { nextSheet, prevSheet, sheetAt, sheets } from "@/lib/sheets";

/**
 * The instrument strip along the bottom of every sheet.
 *
 * Everything on it is real: which sheet you're on, how far down it you are,
 * and the actual time in the Toronto studio. Nothing here is a claim about
 * the business — no counters, no invented metrics.
 *
 * It also owns keyboard paging between sheets, which is the fastest way
 * through the set once you know it's there.
 */
export function StatusRail() {
  const path = usePathname();
  const router = useRouter();
  const sheet = sheetAt(path);

  const [pct, setPct] = useState(0);
  const [clock, setClock] = useState<string | null>(null);

  // Scroll depth of the current sheet.
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const max = document.body.scrollHeight - window.innerHeight;
        setPct(max > 8 ? Math.round((window.scrollY / max) * 100) : 0);
        raf = 0;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [path]);

  // Studio clock. Rendered only after mount so the server and the client
  // never disagree about what time it is.
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Toronto",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const tick = () => setClock(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  // ← / → page through the set.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      // Never steal the arrow keys from someone typing or using a control.
      const el = e.target as HTMLElement | null;
      const tag = el?.tagName;
      if (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        el?.isContentEditable
      ) {
        return;
      }

      if (e.key === "ArrowRight") router.push(nextSheet(path).href);
      if (e.key === "ArrowLeft") router.push(prevSheet(path).href);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [path, router]);

  return (
    <div className="rail" role="status" aria-live="off">
      <span className="rail-cell rail-sheet">
        <b>{sheet.n}</b>
        <span className="rail-sep">/</span>
        <span>{sheets[sheets.length - 1].n}</span>
        <span className="rail-name">{sheet.drawing}</span>
      </span>

      <span className="rail-cell rail-depth" aria-hidden="true">
        <span className="rail-gauge">
          <span className="rail-gauge-fill" style={{ width: `${pct}%` }} />
        </span>
        <span className="rail-pct">{String(pct).padStart(3, "0")}%</span>
      </span>

      <span className="rail-cell rail-keys" aria-hidden="true">
        <kbd>←</kbd>
        <kbd>→</kbd>
        <span>page the set</span>
      </span>

      <span className="rail-cell rail-clock">
        <span className="rail-dot" aria-hidden="true" />
        TORONTO {clock ?? "--:--:--"}
      </span>
    </div>
  );
}
