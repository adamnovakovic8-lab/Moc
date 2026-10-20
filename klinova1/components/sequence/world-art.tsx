/**
 * Original interface art — one bespoke drawing per platform.
 *
 * These are deliberately *fragments*, not fake dashboards: enough of a real
 * interface to show what the software does, drawn in the site's own
 * schematic language. Nothing is stock, nothing is a screenshot, and no
 * numbers are presented as Klinova's results.
 *
 * Shared grammar: 320x220 viewBox, hairline strokes, chamfered plates,
 * ink for structure and the platform's own accent for the live element.
 */

const VB = "0 0 320 220";

function Plate({ id, children }: { id: string; children: React.ReactNode }) {
  // Six of these share one document, so the clip path needs its own id.
  const clip = `plate-${id}`;
  return (
    <svg
      viewBox={VB}
      className="world-art"
      role="img"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <clipPath id={clip}>
          <path d="M0 0 H306 L320 14 V220 H0 Z" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clip})`}>{children}</g>
      <path
        d="M0 0 H306 L320 14 V220 H0 Z"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.28"
      />
    </svg>
  );
}

/** Faint construction dots, the same sheet the whole site is drawn on. */
function Dots() {
  const d: React.ReactElement[] = [];
  for (let x = 10; x < 320; x += 20) {
    for (let y = 10; y < 220; y += 20) {
      d.push(<rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" />);
    }
  }
  return (
    <g fill="currentColor" opacity="0.16">
      {d}
    </g>
  );
}

/* ── 01 · KLINOVA EMR — clinical ───────────────────────────────────── */
export function EmrArt() {
  const day = [18, 46, 74, 102, 130, 158];
  return (
    <Plate id="emr">
      <Dots />
      {/* schedule column */}
      <g stroke="currentColor" strokeOpacity="0.35" fill="none">
        <path d="M16 26 H92" />
        {day.map((y) => (
          <path key={y} d={`M16 ${y + 24} H92`} strokeOpacity="0.18" />
        ))}
      </g>
      <g fill="currentColor" opacity="0.5" fontSize="6" fontFamily="monospace">
        <text x="16" y="20">08:00 — 14:00</text>
      </g>
      {day.map((y, i) => (
        <rect
          key={y}
          x="16"
          y={y + 30}
          width={i === 2 ? 62 : 40 + (i % 3) * 9}
          height="9"
          fill={i === 2 ? "var(--accent)" : "currentColor"}
          opacity={i === 2 ? 0.9 : 0.2}
        />
      ))}

      {/* chart panel */}
      <path
        d="M108 26 H290 L302 38 V196 H108 Z"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.3"
      />
      <g fill="currentColor" opacity="0.45" fontSize="6" fontFamily="monospace">
        <text x="118" y="40">PATIENT RECORD</text>
        <text x="118" y="182">RX · SECURE MESSAGE</text>
      </g>

      {/* vitals trace — the live element */}
      <path
        d="M118 96 h22 l7 -20 l8 40 l7 -30 l6 12 h18 l9 -26 l8 34 l7 -16 h26 l8 -22 l9 30 l6 -8 h22"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <g stroke="currentColor" strokeOpacity="0.22">
        <path d="M118 120 H292" />
        <path d="M118 138 H262" />
        <path d="M118 152 H286" />
        <path d="M118 166 H236" />
      </g>
      <rect x="118" y="48" width="54" height="7" fill="currentColor" opacity="0.35" />
      <rect x="178" y="48" width="30" height="7" fill="currentColor" opacity="0.18" />
    </Plate>
  );
}

/* ── 02 · E-SIGN — evidence ────────────────────────────────────────── */
export function EsignArt() {
  return (
    <Plate id="esign">
      <Dots />
      {/* stacked documents, back to front */}
      <path d="M40 40 H196 L208 52 V196 H40 Z" fill="currentColor" opacity="0.07" />
      <path
        d="M30 30 H186 L198 42 V186 H30 Z"
        fill="var(--paper-lift)"
        stroke="currentColor"
        strokeOpacity="0.3"
      />
      <g stroke="currentColor" strokeOpacity="0.2">
        {[54, 64, 74, 84, 94, 104, 114].map((y, i) => (
          <path key={y} d={`M44 ${y} H${i % 3 === 2 ? 140 : 178}`} />
        ))}
      </g>
      <g fill="currentColor" opacity="0.45" fontSize="6" fontFamily="monospace">
        <text x="44" y="46">AGREEMENT · V4</text>
      </g>

      {/* the signature, drawn as one continuous stroke */}
      <path
        d="M50 152 c10 -16 16 6 24 -4 c8 -10 4 -22 12 -20 c9 2 -2 26 8 30 c9 4 16 -14 24 -18 c7 -4 10 8 18 4"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path d="M44 166 H178" stroke="currentColor" strokeOpacity="0.32" />
      <g fill="currentColor" opacity="0.4" fontSize="5.5" fontFamily="monospace">
        <text x="44" y="176">SIGNED · TAMPER-EVIDENT SEAL</text>
      </g>

      {/* audit trail */}
      <g stroke="var(--accent)" strokeOpacity="0.5">
        <path d="M222 44 V178" />
      </g>
      {[52, 82, 112, 142, 172].map((y, i) => (
        <g key={y}>
          <rect
            x="218"
            y={y - 3}
            width="7"
            height="7"
            fill={i === 4 ? "var(--accent)" : "var(--paper-lift)"}
            stroke="var(--accent)"
            strokeOpacity="0.7"
          />
          <rect
            x="234"
            y={y - 2}
            width={i % 2 ? 44 : 58}
            height="5"
            fill="currentColor"
            opacity="0.24"
          />
        </g>
      ))}
    </Plate>
  );
}

/* ── 03 · GRANT MASTER — adjudication ──────────────────────────────── */
export function GrantArt() {
  const lanes = [
    { x: 20, label: "INTAKE", n: 5 },
    { x: 96, label: "REVIEW", n: 3 },
    { x: 172, label: "AWARD", n: 2 },
    { x: 248, label: "REPORT", n: 1 },
  ];
  return (
    <Plate id="grant">
      <Dots />
      {lanes.map((lane, li) => (
        <g key={lane.label}>
          <path
            d={`M${lane.x} 34 H${lane.x + 52} L${lane.x + 60} 42 V190 H${lane.x} Z`}
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.26"
          />
          <text
            x={lane.x + 6}
            y="28"
            fill="currentColor"
            opacity="0.5"
            fontSize="5.5"
            fontFamily="monospace"
          >
            {lane.label}
          </text>
          {Array.from({ length: lane.n }).map((_, i) => (
            <rect
              key={i}
              x={lane.x + 7}
              y={46 + i * 22}
              width="46"
              height="15"
              fill={li === 3 ? "var(--accent)" : "currentColor"}
              opacity={li === 3 ? 0.9 : 0.16 + li * 0.06}
            />
          ))}
          {li < lanes.length - 1 && (
            <path
              d={`M${lane.x + 62} 110 H${lane.x + 74}`}
              stroke="var(--accent)"
              strokeOpacity="0.8"
              markerEnd=""
            />
          )}
        </g>
      ))}
      <g fill="currentColor" opacity="0.4" fontSize="5.5" fontFamily="monospace">
        <text x="20" y="206">LIFECYCLE · INTAKE → ADJUDICATION → DISBURSEMENT</text>
      </g>
    </Plate>
  );
}

/* ── 04 · POLICY PULSE — position ──────────────────────────────────── */
export function PolicyArt() {
  const alloc = [46, 30, 14, 10];
  let acc = 0;
  return (
    <Plate id="policy">
      <Dots />
      {/* allocation bar, one row, honest proportions */}
      <g>
        {alloc.map((a, i) => {
          const x = 20 + acc * 2.72;
          acc += a;
          return (
            <rect
              key={i}
              x={x}
              y="34"
              width={a * 2.72 - 3}
              height="18"
              fill={i === 0 ? "var(--accent)" : "currentColor"}
              opacity={i === 0 ? 0.9 : 0.32 - i * 0.06}
            />
          );
        })}
      </g>
      <text x="20" y="28" fill="currentColor" opacity="0.5" fontSize="5.5" fontFamily="monospace">
        ALLOCATION
      </text>

      {/* position sparklines */}
      {[78, 116, 154].map((y, i) => (
        <g key={y}>
          <path d={`M20 ${y + 22} H300`} stroke="currentColor" strokeOpacity="0.16" />
          <path
            d={
              i === 0
                ? `M20 ${y + 16} l30 -8 l26 6 l30 -14 l28 4 l30 -12 l26 8 l30 -6 l28 -10 l32 6`
                : i === 1
                  ? `M20 ${y + 10} l32 6 l28 -12 l26 8 l30 -4 l28 10 l30 -14 l26 6 l30 -8 l30 4`
                  : `M20 ${y + 14} l28 -4 l30 10 l26 -14 l30 6 l28 -8 l26 12 l30 -6 l28 4 l34 -10`
            }
            fill="none"
            stroke={i === 0 ? "var(--accent)" : "currentColor"}
            strokeOpacity={i === 0 ? 1 : 0.4}
            strokeWidth={i === 0 ? 1.6 : 1}
          />
          <text x="20" y={y + 4} fill="currentColor" opacity="0.42" fontSize="5.5" fontFamily="monospace">
            {["POSITION", "POLICY", "REBALANCE"][i]}
          </text>
        </g>
      ))}

      {/* rebalance ticks */}
      <g stroke="var(--accent)" strokeOpacity="0.75">
        {[92, 148, 214, 268].map((x) => (
          <path key={x} d={`M${x} 186 V196`} />
        ))}
      </g>
      <text x="20" y="206" fill="currentColor" opacity="0.4" fontSize="5.5" fontFamily="monospace">
        AUDIT-READY · EVERY POSITION, EVERY REBALANCE
      </text>
    </Plate>
  );
}

/* ── 05 · RX DELIVERY — custody ────────────────────────────────────── */
export function RxArt() {
  const stops = [
    { x: 34, y: 150 },
    { x: 92, y: 112 },
    { x: 150, y: 138 },
    { x: 214, y: 86 },
    { x: 276, y: 118 },
  ];
  return (
    <Plate id="rx">
      <Dots />
      {/* abstract road network */}
      <g stroke="currentColor" strokeOpacity="0.14">
        <path d="M0 76 H320" />
        <path d="M0 132 H320" />
        <path d="M0 178 H320" />
        <path d="M62 20 V220" />
        <path d="M132 20 V220" />
        <path d="M196 20 V220" />
        <path d="M258 20 V220" />
      </g>

      {/* optimised route */}
      <path
        d="M34 150 L62 150 L62 112 L92 112 L132 112 L132 138 L150 138 L196 138 L196 86 L214 86 L258 86 L258 118 L276 118"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="1.8"
      />
      {stops.map((s, i) => (
        <g key={i}>
          <rect
            x={s.x - 4}
            y={s.y - 4}
            width="8"
            height="8"
            fill={i === 0 || i === stops.length - 1 ? "var(--accent)" : "var(--paper-lift)"}
            stroke="var(--accent)"
          />
        </g>
      ))}
      <g fill="currentColor" opacity="0.5" fontSize="5.5" fontFamily="monospace">
        <text x="22" y="168">DISPENSARY</text>
        <text x="252" y="136">DOORSTEP</text>
      </g>

      {/* cold-chain strip */}
      <path d="M20 28 H300" stroke="currentColor" strokeOpacity="0.26" />
      <g>
        {Array.from({ length: 28 }).map((_, i) => (
          <rect
            key={i}
            x={20 + i * 10}
            y="34"
            height="10"
            width="7"
            fill={i > 21 ? "var(--accent)" : "currentColor"}
            opacity={i > 21 ? 0.85 : 0.2}
          />
        ))}
      </g>
      <text x="20" y="24" fill="currentColor" opacity="0.5" fontSize="5.5" fontFamily="monospace">
        COLD CHAIN · CHAIN OF CUSTODY
      </text>
      <text x="20" y="58" fill="currentColor" opacity="0.38" fontSize="5.5" fontFamily="monospace">
        PROOF OF DELIVERY CAPTURED AT EACH STOP
      </text>
    </Plate>
  );
}

/* ── 06 · POS + INVENTORY — floor ──────────────────────────────────── */
export function PosArt() {
  return (
    <Plate id="pos">
      <Dots />
      {/* bill of materials tree */}
      <g stroke="currentColor" strokeOpacity="0.34" fill="none">
        <path d="M28 40 V178" />
        <path d="M28 62 H62" />
        <path d="M28 92 H62" />
        <path d="M28 132 H62" />
        <path d="M28 166 H62" />
        <path d="M62 92 V116 H92" />
      </g>
      <rect x="20" y="32" width="16" height="10" fill="var(--accent)" />
      {[
        [62, 57],
        [62, 87],
        [62, 127],
        [62, 161],
        [92, 111],
      ].map(([x, y], i) => (
        <g key={i}>
          <rect x={x} y={y} width="10" height="10" fill="currentColor" opacity="0.3" />
          <rect x={x + 16} y={y + 3} width={i % 2 ? 38 : 52} height="5" fill="currentColor" opacity="0.2" />
        </g>
      ))}
      <text x="20" y="26" fill="currentColor" opacity="0.5" fontSize="5.5" fontFamily="monospace">
        BILL OF MATERIALS
      </text>

      {/* barcode */}
      <g>
        {Array.from({ length: 34 }).map((_, i) => (
          <rect
            key={i}
            x={186 + i * 3.4}
            y="34"
            width={i % 4 === 0 ? 2.2 : 1.1}
            height={i % 7 === 0 ? 30 : 22}
            fill="currentColor"
            opacity="0.7"
          />
        ))}
      </g>
      <text x="186" y="76" fill="currentColor" opacity="0.42" fontSize="5.5" fontFamily="monospace">
        SCAN · FLOOR TO FRONT OFFICE
      </text>

      {/* live stock levels */}
      {[100, 122, 144, 166].map((y, i) => (
        <g key={y}>
          <path d={`M186 ${y} H300`} stroke="currentColor" strokeOpacity="0.16" />
          <rect
            x="186"
            y={y - 7}
            width={[86, 54, 108, 30][i]}
            height="8"
            fill={i === 3 ? "var(--accent)" : "currentColor"}
            opacity={i === 3 ? 0.9 : 0.28}
          />
        </g>
      ))}
      <text x="186" y="188" fill="currentColor" opacity="0.4" fontSize="5.5" fontFamily="monospace">
        LIVE STOCK — ONE SOURCE OF TRUTH
      </text>
    </Plate>
  );
}

export const WORLD_ART = {
  emr: EmrArt,
  esign: EsignArt,
  grant: GrantArt,
  policy: PolicyArt,
  rx: RxArt,
  pos: PosArt,
} as const;
