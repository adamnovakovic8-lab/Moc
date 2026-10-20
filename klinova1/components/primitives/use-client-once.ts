"use client";

import { useRef, useSyncExternalStore } from "react";

/** Never changes, so the store never notifies. Stable identity by design. */
const NEVER = () => () => {};

/**
 * Reads a browser-only value once — the clock, sessionStorage — without
 * copying it into component state from an effect.
 *
 * `useSyncExternalStore` is the right tool here rather than a workaround:
 * it renders `server` during SSR and hydration, then swaps to the real
 * client value on the first commit, so there's no hydration mismatch and no
 * cascading render. The computed value is cached because getSnapshot must
 * return a stable reference or React will re-render forever.
 */
export function useClientOnce<T>(compute: () => T, server: T): T {
  const cache = useRef<{ v: T } | null>(null);
  return useSyncExternalStore(
    NEVER,
    () => (cache.current ??= { v: compute() }).v,
    () => server,
  );
}
