import type { Metadata } from "next";
import { SheetHead } from "@/components/chrome/sheet-head";
import { NextSheet } from "@/components/chrome/next-sheet";
import { Marginalia } from "@/components/primitives/marginalia";
import { reasons } from "@/lib/klinova";
import { sheetAt } from "@/lib/sheets";
import { vars } from "@/lib/css";

const sheet = sheetAt("/why");

export const metadata: Metadata = {
  title: sheet.label,
  description: sheet.lede,
};

/**
 * 01 — WHY.
 * The premise stated once in the dark, then the three reasons, then a
 * side-by-side that puts the difference in plain terms.
 *
 * The comparison is Klinova's own positioning restated — not invented
 * benchmarks, and no numbers attached to either column.
 */
const COMPARE = [
  {
    axis: "Shape",
    them: "You reshape the operation around the product",
    us: "The product takes the shape of the operation",
  },
  {
    axis: "Core",
    them: "Licensed third-party cores you can't open",
    us: "Written here, top to bottom",
  },
  {
    axis: "Change",
    them: "File a request, join someone else's roadmap",
    us: "Full customization, no permission required",
  },
  {
    axis: "Security",
    them: "Bolted on once the product exists",
    us: "Designed in from the first commit",
  },
  {
    axis: "After launch",
    them: "Hand-off to a stranger",
    us: "The same team stays on",
  },
];

export default function Page() {
  return (
    <>
      <section className="void sheet sheet-dark" aria-labelledby="void-h">
        <p className="void-marker mono">
          <span>01</span>
          <span className="rule-fill" />
          <span>Premise</span>
        </p>

        <h1 id="void-h" className="void-line display-sm" data-reveal>
          Off-the-shelf software makes you work its way.
        </h1>

        <p className="void-turn" data-reveal style={vars({ "--d": "260ms" })}>
          We build the other way.
        </p>
      </section>

      <div className="sheet sheet-body">
        <SheetHead sheet={sheet} />

        <section className="reasons-block" aria-labelledby="reasons-h">
          <div className="rule" data-reveal>
            <span className="mono">Three reasons it fits better</span>
            <span className="rule-fill" />
            <span className="mono">A / B / C</span>
          </div>
          <h2 id="reasons-h" className="sr-only">
            Three reasons it fits better
          </h2>

          <ol className="reasons">
            {reasons.map((r, i) => (
              <li
                key={r.key}
                className="reason"
                data-slot={r.key}
                data-reveal
                style={vars({ "--d": `${i * 110}ms` })}
              >
                <span className="reason-key" aria-hidden="true">
                  {r.key}
                </span>
                <h3 className="reason-title display-sm">{r.title}</h3>
                <p className="body">{r.body}</p>
              </li>
            ))}
          </ol>

          <Marginalia
            note="third one is the one clients actually feel"
            hand="c"
            tilt={2.5}
            className="reasons-note"
          />
        </section>

        <section className="compare-block" aria-labelledby="compare-h">
          <div className="rule" data-reveal>
            <span className="mono">The difference, plainly</span>
            <span className="rule-fill" />
            <span className="mono">01.2</span>
          </div>

          <h2 id="compare-h" className="display-sm compare-h" data-reveal>
            We don&rsquo;t <s>configure</s> <em>build</em>.
          </h2>

          <div className="compare-wrap" data-reveal>
            <table className="compare">
              <caption className="sr-only">
                Off-the-shelf software compared with how Klinova builds
              </caption>
              <thead>
                <tr>
                  <th scope="col" className="mono-sm">
                    Axis
                  </th>
                  <th scope="col" className="mono-sm">
                    Off-the-shelf
                  </th>
                  <th scope="col" className="mono-sm compare-us">
                    Klinova
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARE.map((row) => (
                  <tr key={row.axis}>
                    <th scope="row" className="compare-axis">
                      {row.axis}
                    </th>
                    <td className="compare-them">{row.them}</td>
                    <td className="compare-ours">
                      <span className="compare-tick" aria-hidden="true" />
                      {row.us}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <NextSheet from="/why" />
    </>
  );
}
