import type { Metadata } from "next";
import { SheetHead } from "@/components/chrome/sheet-head";
import { NextSheet } from "@/components/chrome/next-sheet";
import { Idea } from "@/components/sequence/idea";
import { Marginalia } from "@/components/primitives/marginalia";
import { sheetAt } from "@/lib/sheets";

const sheet = sheetAt("/idea");

export const metadata: Metadata = {
  title: sheet.label,
  description: sheet.lede,
};

/**
 * 05 — YOUR IDEA.
 * The generator, plus an honest account of what it is. Saying plainly that
 * it's a keyword map rather than implying a model is the whole point — a
 * software company that oversells a text box has already told you something.
 */
export default function Page() {
  return (
    <>
      <div className="sheet sheet-dark sheet-body">
        <SheetHead sheet={sheet} />

        <Idea />

        <section className="howitworks" aria-labelledby="howitworks-h">
          <div className="rule">
            <span className="mono">How this actually works</span>
            <span className="rule-fill" />
            <span className="mono">05.2</span>
          </div>

          <h2 id="howitworks-h" className="howitworks-h">
            No model. A lookup table.
          </h2>

          <div className="howitworks-grid">
            <p className="body">
              This reads your sentence, matches it against a short list of
              sector keywords, and draws the modules that sector usually
              needs. It runs entirely in your browser. Nothing is sent
              anywhere, nothing is stored, and no one is emailed.
            </p>
            <p className="body">
              We could have dressed it up as something cleverer. But a shop
              that oversells a text box will oversell a platform, and the
              modules it draws are the same ones we actually ship — so the
              sketch is honest even though the mechanism is simple.
            </p>
          </div>

          <Marginalia
            note="if it guessed wrong, tell us — that's a better conversation anyway"
            hand="c"
            tilt={-2}
            className="howitworks-note"
          />
        </section>
      </div>

      <NextSheet from="/idea" />
    </>
  );
}
