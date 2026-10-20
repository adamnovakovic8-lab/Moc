"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * One observer for every [data-reveal] on the page, so server components can
 * opt in with a plain attribute and no client boundary of their own.
 *
 * The hidden state is applied by CSS only once this has mounted
 * (html.reveal-ready). If JS never runs, the page renders fully visible
 * rather than blank.
 *
 * It re-scans on every route change. This component lives in the root layout
 * and so never unmounts, and a client-side navigation swaps in a whole new
 * page of elements that the original scan could not have seen — without the
 * re-scan those arrive hidden and stay hidden, holding their layout space.
 */
export function RevealEngine() {
  const pathname = usePathname();

  // The hidden state belongs to the document for as long as the engine is
  // alive, so it is set up once rather than torn down on every navigation.
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;

    const root = document.documentElement;
    root.classList.add("reveal-ready");
    return () => root.classList.remove("reveal-ready");
  }, []);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    // Anything not yet revealed — on first load that's the whole page, on a
    // navigation it's whatever the new route just mounted.
    const pending = () =>
      document.querySelectorAll<HTMLElement>(
        '[data-reveal]:not([data-reveal="in"])',
      );

    if (reduced.matches) {
      pending().forEach((el) => el.setAttribute("data-reveal", "in"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-reveal", "in");
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
    );

    pending().forEach((el) => {
      // Anything already on screen reveals outright. The observer's rootMargin
      // holds its trigger line above the fold, which would otherwise leave
      // first-screen content invisible until the visitor happened to scroll.
      if (el.getBoundingClientRect().top < window.innerHeight) {
        el.setAttribute("data-reveal", "in");
        return;
      }
      io.observe(el);
    });

    return () => io.disconnect();
  }, [pathname]);

  return null;
}
