import { method } from "@/lib/klinova";

/**
 * The process drawn as a pipeline, with the loop that matters: Evolve feeds
 * back into Build, because the same team stays on and keeps iterating rather
 * than handing the system over and leaving.
 */
export function MethodDiagram() {
  const W = 960;
  const H = 215;
  const pad = 34;
  const gap = (W - pad * 2) / (method.length - 1);
  const y = 70;
  /* The loop has to clear the stage labels sitting at y + 34, or it draws
     straight through the words it's meant to connect. */
  const loopTop = y + 48;
  const loopLow = y + 104;

  return (
    <figure className="mdiagram">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-labelledby="mdiagram-t">
        <title id="mdiagram-t">
          Six stages in sequence — discover, architect, build, secure, launch,
          evolve — with evolve feeding back into build.
        </title>

        {/* baseline */}
        <path
          d={`M${pad} ${y} H${W - pad}`}
          stroke="currentColor"
          strokeOpacity="0.28"
          fill="none"
        />

        {/* the feedback loop: evolve → build */}
        <path
          d={`M${pad + gap * 5} ${loopTop} C ${pad + gap * 5} ${loopLow}, ${
            pad + gap * 2
          } ${loopLow}, ${pad + gap * 2} ${loopTop}`}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="1.4"
          strokeDasharray="4 4"
        />
        <path
          d={`M${pad + gap * 2} ${loopTop} l -4 9 M${pad + gap * 2} ${loopTop} l 4 9`}
          stroke="var(--accent)"
          strokeWidth="1.4"
          fill="none"
        />
        <text
          x={pad + gap * 3.5}
          y={loopLow + 22}
          className="mdiagram-loop"
          textAnchor="middle"
        >
          the team stays on — it loops
        </text>

        {method.map((m, i) => {
          const x = pad + gap * i;
          return (
            <g key={m.n}>
              {/* chamfered node */}
              <path
                d={`M${x - 11} ${y - 11} H${x + 7} L${x + 11} ${y - 7} V${y + 11} H${x - 11} Z`}
                fill="var(--paper)"
                stroke="currentColor"
                strokeOpacity="0.5"
              />
              <rect x={x - 4} y={y - 4} width="8" height="8" fill="var(--accent)" />
              <text x={x} y={y - 24} className="mdiagram-n" textAnchor="middle">
                {m.n}
              </text>
              <text x={x} y={y + 34} className="mdiagram-label" textAnchor="middle">
                {m.title.toUpperCase()}
              </text>
            </g>
          );
        })}
      </svg>
      <figcaption className="mono-sm">
        fig. 02 — process sequence, with the iteration loop that never closes
      </figcaption>
    </figure>
  );
}
