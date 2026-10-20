import type { CSSProperties } from "react";

/**
 * Custom properties are how this site passes design intent into CSS —
 * stagger delays, per-platform accents. React's CSSProperties has no index
 * signature, so this keeps the casts in one place instead of at every call.
 */
export function vars(v: Record<string, string | number>): CSSProperties {
  return v as CSSProperties;
}
