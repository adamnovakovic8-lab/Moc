import { platforms, trust } from "@/lib/klinova";
import { vars } from "@/lib/css";
import { WORLD_ART } from "./world-art";

/**
 * Six worlds, not six cards. Each gets a full sheet, its own hue, its own
 * interface art, its own ground, a module flow and a spec block.
 *
 * The two rhythms — which platforms go dark, and which side the art sits on —
 * run on different cycles on purpose, so the run never settles into an
 * obvious alternating template.
 */
const DARK = new Set(["esign", "policy", "pos"]);
const ART_LEFT = new Set(["esign", "grant", "pos"]);

export function Platforms() {
  return (
    <>
      {platforms.map((p) => {
        const Art = WORLD_ART[p.id];
        const dark = DARK.has(p.id);
        return (
          <article
            key={p.id}
            id={`platform-${p.id}`}
            className={`world sheet${dark ? " sheet-dark" : ""}`}
            data-art={ART_LEFT.has(p.id) ? "left" : "right"}
            style={vars({ "--accent": p.accent, "--on-accent": p.onAccent })}
            aria-labelledby={`world-${p.id}-h`}
          >
            <p className="world-ghost" aria-hidden="true">
              {p.world}
            </p>

            <div className="world-in">
              <div className="world-plate" data-reveal>
                <Art />
                <span className="world-plate-tag mono-sm">
                  fig. {p.n} — {p.name.toLowerCase()}
                </span>
              </div>

              <div className="world-say">
                <p className="world-n mono">
                  <span>{p.n}</span>
                  <span className="rule-fill" />
                  <span>{p.world}</span>
                </p>

                <h2
                  id={`world-${p.id}-h`}
                  className="world-name display-sm"
                  data-reveal
                >
                  {p.name}
                </h2>

                <p className="world-blurb body" data-reveal style={vars({ "--d": "120ms" })}>
                  {p.blurb}
                </p>

                {/* Module flow — the capability nouns routed, not bulleted. */}
                <ol className="flow" data-reveal style={vars({ "--d": "200ms" })}>
                  {p.parts.map((part, i) => (
                    <li key={part} className="flow-node">
                      <span className="flow-n mono-sm">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="flow-name">{part}</span>
                    </li>
                  ))}
                </ol>

                <dl className="world-spec" data-reveal style={vars({ "--d": "280ms" })}>
                  <div>
                    <dt className="mono-sm">Sector</dt>
                    <dd>{p.tags.join(" · ")}</dd>
                  </div>
                  <div>
                    <dt className="mono-sm">Modules</dt>
                    <dd>{String(p.parts.length).padStart(2, "0")}</dd>
                  </div>
                  <div>
                    <dt className="mono-sm">Baseline</dt>
                    <dd>{trust[0]}</dd>
                  </div>
                  <div>
                    <dt className="mono-sm">Built by</dt>
                    <dd>Klinova, in-house</dd>
                  </div>
                </dl>
              </div>
            </div>
          </article>
        );
      })}
    </>
  );
}
