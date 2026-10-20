import type { Metadata } from "next";
import { SheetHead } from "@/components/chrome/sheet-head";
import { NextSheet } from "@/components/chrome/next-sheet";
import { Coverage } from "@/components/sequence/coverage";
import { Marginalia } from "@/components/primitives/marginalia";
import { industries } from "@/lib/klinova";
import { sheetAt } from "@/lib/sheets";
import { vars } from "@/lib/css";

const sheet = sheetAt("/industries");

export const metadata: Metadata = {
  title: sheet.label,
  description: sheet.lede,
};

/**
 * 04 — INDUSTRIES.
 * The editorial index first, then the coverage matrix that shows every one
 * of the eight already has a system built for it.
 */
export default function Page() {
  return (
    <>
      <div className="sheet sheet-body">
        <SheetHead sheet={sheet} />

        <section className="territory" aria-label="Industries">
          <ol className="territory-list">
            {industries.map((ind, i) => (
              <li
                key={ind.n}
                className="territory-row"
                data-reveal
                style={vars({ "--d": `${i * 55}ms` })}
              >
                <span className="mono-sm territory-n">{ind.n}</span>
                <h2 className="territory-name">{ind.name}</h2>
                <p className="territory-line">{ind.line}</p>
                <span className="territory-bar" aria-hidden="true" />
              </li>
            ))}
          </ol>
        </section>

        <section className="coverage-block" aria-labelledby="coverage-h">
          <div className="rule" data-reveal>
            <span className="mono">Coverage</span>
            <span className="rule-fill" />
            <span className="mono">04.2</span>
          </div>

          <h2 id="coverage-h" className="display-sm coverage-h" data-reveal>
            Eight for eight.
          </h2>
          <p className="body coverage-lede" data-reveal>
            Every industry on this sheet already has a system built for it —
            not a proposal, a product that exists.
          </p>

          <div data-reveal>
            <Coverage />
          </div>

          <Marginalia
            note="the gaps are honest — we only claim what we shipped"
            hand="b"
            tilt={2}
            className="coverage-note"
          />
        </section>
      </div>

      <NextSheet from="/industries" />
    </>
  );
}
