"use client";

import { useEffect, useRef, useState } from "react";
import { company, industries, platforms, trust } from "@/lib/klinova";
import { usePrefersReducedMotion } from "@/components/primitives/use-reduced-motion";

/**
 * The system reporting itself on startup.
 *
 * Every line is derived from lib/klinova.ts — the platform count is
 * platforms.length, the studios are the real studios. Nothing is a
 * fabricated metric, and there is no fake latency or uptime.
 */
type Line = { key: string; value: string; accent?: boolean };

const LINES: Line[] = [
  { key: "company", value: `${company.legal} — canadian, in-house` },
  { key: "studios", value: company.studios.join(" · ").toLowerCase() },
  { key: "platforms", value: `${platforms.length} proprietary` },
  { key: "industries", value: `${industries.length} served` },
  { key: "third-party cores", value: "0", accent: true },
  { key: "licensed black boxes", value: "0", accent: true },
  { key: "baseline", value: trust.join(" · ").toLowerCase() },
  { key: "deploy targets", value: "vercel · aws · azure" },
  { key: "first reply", value: company.reply.toLowerCase() },
  { key: "status", value: "ready — what’s your idea?", accent: true },
];

export function BootLog() {
  const [typed, setTyped] = useState(0);
  const box = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  // Derived, not copied into state: with motion reduced the report is simply
  // already complete rather than being animated to completion.
  const shown = reduced ? LINES.length : typed;

  useEffect(() => {
    if (reduced) return;

    // Hold until the log is actually on screen, then print it a line at a time.
    const el = box.current;
    if (!el) return;

    let timer = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const step = () => {
          setTyped((n) => {
            if (n >= LINES.length) return n;
            timer = window.setTimeout(step, 90 + Math.random() * 130);
            return n + 1;
          });
        };
        timer = window.setTimeout(step, 240);
      },
      { threshold: 0.3 },
    );

    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(timer);
    };
  }, [reduced]);

  const done = shown >= LINES.length;

  return (
    <div className="boot" ref={box}>
      <div className="boot-bar">
        <span className="mono-sm">klinova — system report</span>
        <span className="boot-lamps" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
      </div>

      <div className="boot-body">
        <p className="boot-cmd mono">
          <span className="boot-prompt">$</span> klinova --describe
        </p>

        <dl className="boot-lines">
          {LINES.slice(0, shown).map((l) => (
            <div key={l.key} className="boot-line">
              <dt className="mono-sm">{l.key}</dt>
              <dd
                className={l.accent ? "mono is-accent" : "mono"}
                data-zero={l.value === "0" ? "" : undefined}
              >
                {l.value}
              </dd>
            </div>
          ))}
        </dl>

        {done ? null : (
          <span className="boot-caret" aria-hidden="true">
            ▍
          </span>
        )}
      </div>
    </div>
  );
}
