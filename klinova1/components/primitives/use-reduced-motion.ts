"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

/**
 * Reads the motion preference as external state rather than copying it into
 * component state from an effect — so it's available on the first render and
 * never triggers a cascading re-render.
 *
 * Server snapshot is `false`: the markup is identical either way, and the
 * real value applies as soon as the client takes over.
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}
