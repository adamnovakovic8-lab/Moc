"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { sheets } from "@/lib/sheets";
import { company } from "@/lib/klinova";
import { KlinovaMark } from "@/components/brand/klinova";

/**
 * The title block of a drawing set: who drew it, and which sheets exist.
 * Every sheet is numbered and always visible — the reader can see the whole
 * set at once rather than discovering it a page at a time.
 */
export function Masthead() {
  const path = usePathname();
  const strip = useRef<HTMLOListElement>(null);

  // On a phone the tab strip scrolls, and the later sheets start off-screen.
  // Bring the current one into view so you can always see where you are.
  useEffect(() => {
    const current = strip.current?.querySelector<HTMLElement>("[aria-current]");
    current?.scrollIntoView({ block: "nearest", inline: "center" });
  }, [path]);

  return (
    <header className="masthead">
      <div className="masthead-in">
        <Link href="/" className="wordmark" aria-label="Klinova — home">
          <KlinovaMark className="wordmark-mark" />
          <span className="wordmark-text">
            <span className="wordmark-name">KLINOVA</span>
            <span className="wordmark-sub mono-sm">
              {company.studios.length} studios · in-house
            </span>
          </span>
        </Link>

        <nav className="sheet-tabs" aria-label="Sheets">
          <ol ref={strip}>
            {sheets.map((s) => {
              const current = path === s.href;
              return (
                <li key={s.href}>
                  <Link
                    href={s.href}
                    aria-current={current ? "page" : undefined}
                  >
                    <span className="tab-n mono-sm">{s.n}</span>
                    <span className="tab-label">{s.label}</span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </nav>

        <Link href="/contact" className="masthead-cta">
          <span className="mono-sm">Start a build</span>
        </Link>
      </div>
    </header>
  );
}
