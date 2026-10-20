/**
 * The Klinova mark and lockup.
 *
 * Geometry: a black stem, a chevron whose point sits just clear of it, and
 * two coral shapes filling the notches — a square at the top, a triangle at
 * the bottom. That asymmetry is the mark's signature; don't "fix" it.
 *
 * The chevron is one stroked path drawn well past the artboard and clipped by
 * the SVG viewport, which is why there's no <clipPath> here — the mark appears
 * several times on a page and shared clip-path ids would collide.
 *
 * The dark parts are `currentColor` so the mark inverts correctly on the dark
 * sheets. The coral is fixed: it's the brand, not a theme value.
 */
const CORAL = "#ff4d1c";

export function KlinovaMark({
  className,
  title,
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 116 100"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
    >
      {/* stem */}
      <rect x="0" y="0" width="27" height="100" fill="currentColor" />

      {/* the two coral notches */}
      <rect x="31" y="0" width="29" height="29" fill={CORAL} />
      <path d="M31 57 L31 100 L74 100 Z" fill={CORAL} />

      {/* chevron — overshoots the artboard and is clipped by the viewport */}
      <path
        d="M160 -58 L35 50 L160 158"
        fill="none"
        stroke="currentColor"
        strokeWidth="32"
      />
    </svg>
  );
}

/**
 * Mark plus wordmark. The wordmark is set in Archivo at its heaviest weight
 * with the tracking pulled in, rather than traced to outlines — it stays
 * crisp at every size and inherits the site's own type.
 */
export function KlinovaLockup({
  className,
  sub,
}: {
  className?: string;
  sub?: string;
}) {
  return (
    <span className={`lockup ${className ?? ""}`.trim()}>
      <KlinovaMark className="lockup-mark" />
      <span className="lockup-text">
        <span className="lockup-name">KLINOVA</span>
        {sub ? <span className="lockup-sub mono-sm">{sub}</span> : null}
      </span>
    </span>
  );
}
