import type { Metadata } from "next";
import { SheetHead } from "@/components/chrome/sheet-head";
import { NextSheet } from "@/components/chrome/next-sheet";
import { MethodDiagram } from "@/components/sequence/method-diagram";
import { Marginalia } from "@/components/primitives/marginalia";
import { method } from "@/lib/klinova";
import { sheetAt } from "@/lib/sheets";
import { vars } from "@/lib/css";

const sheet = sheetAt("/method");

export const metadata: Metadata = {
  title: sheet.label,
  description: sheet.lede,
};

/** A short note on what each stage actually produces, in Klinova's terms. */
const OUTPUT: Record<string, string> = {
  "01": "A map of the real workflow",
  "02": "Data model, roles, threat model",
  "03": "Working software, demoed weekly",
  "04": "A hardened, PIPEDA-ready baseline",
  "05": "Monitoring, backups, rollback",
  "06": "The same team, still here",
};

export default function Page() {
  return (
    <>
      <div className="sheet sheet-body">
        <SheetHead sheet={sheet}>
          <div data-reveal>
            <MethodDiagram />
          </div>
        </SheetHead>

        <section className="stages" aria-label="The six stages">
          {method.map((m, i) => (
            <article
              key={m.n}
              id={`stage-${m.n}`}
              className="stage-row"
              data-reveal
              style={vars({ "--d": `${i * 60}ms` })}
            >
              <div className="stage-rail" aria-hidden="true">
                <span className="stage-dot" />
                <span className="stage-wire" />
              </div>

              <p className="stage-num mono">{m.n}</p>

              <div className="stage-main">
                <h2 className="stage-title">{m.title}</h2>
                <p className="stage-body">{m.body}</p>
              </div>

              <dl className="stage-out">
                <dt className="mono-sm">Leaves behind</dt>
                <dd>{OUTPUT[m.n]}</dd>
              </dl>
            </article>
          ))}

          <Marginalia
            note="weekly demos are non-negotiable — you steer it while it's cheap to steer"
            hand="d"
            tilt={-2}
            className="stages-note"
          />
        </section>
      </div>

      <NextSheet from="/method" />
    </>
  );
}
