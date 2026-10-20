import { vars } from "@/lib/css";

/**
 * A note scrawled in the margin, with an arrow pointing at what it's about.
 *
 * The arrow paths are hand-drawn rather than geometric — they wobble, they
 * overshoot slightly, and no two are the same. That irregularity is the
 * point: it's the one mark on the page a layout engine wouldn't produce.
 *
 * Used sparingly. Four or five across the whole site, never decoratively.
 */
const ARROWS = {
  // Each path is a different hand, drawn once and kept.
  a: "M4 6 C22 3 41 9 57 18 C70 25 76 34 74 44",
  b: "M78 5 C58 6 36 14 21 27 C11 36 7 44 9 52",
  c: "M6 44 C10 27 22 13 40 7 C54 2 66 4 76 11",
  d: "M74 47 C70 30 58 15 40 8 C27 3 15 4 6 10",
} as const;

const HEADS = {
  a: "M74 44 L66 36 M74 44 L80 34",
  b: "M9 52 L4 42 M9 52 L18 47",
  c: "M76 11 L66 10 M76 11 L72 20",
  d: "M6 10 L6 20 M6 10 L15 9",
} as const;

export function Marginalia({
  note,
  hand = "a",
  tilt = -2,
  className = "",
}: {
  note: string;
  /** Which of the four hands draws the arrow. */
  hand?: keyof typeof ARROWS;
  /** Degrees of rotation. Small numbers. Never zero. */
  tilt?: number;
  className?: string;
}) {
  return (
    <aside
      className={`marginalia ${className}`.trim()}
      style={vars({ "--tilt": `${tilt}deg` })}
    >
      <svg viewBox="0 0 84 56" aria-hidden="true" focusable="false">
        <path
          d={ARROWS[hand]}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d={HEADS[hand]}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
      <p>{note}</p>
    </aside>
  );
}
