import type { Metadata } from "next";
import { SheetHead } from "@/components/chrome/sheet-head";
import { NextSheet } from "@/components/chrome/next-sheet";
import { WorkOrder } from "@/components/sequence/work-order";
import { Marginalia } from "@/components/primitives/marginalia";
import { company, trust } from "@/lib/klinova";
import { sheetAt } from "@/lib/sheets";
import { vars } from "@/lib/css";

const sheet = sheetAt("/contact");

export const metadata: Metadata = {
  title: sheet.label,
  description: sheet.lede,
};

/** What actually happens after you raise the order. */
const WHAT_HAPPENS = [
  {
    n: "01",
    t: "You raise the order",
    b: "Five minutes. No account, no funnel, no discovery call to book a discovery call.",
  },
  {
    n: "02",
    t: "A senior architect reads it",
    b: "Not a salesperson. They reply within one business day.",
  },
  {
    n: "03",
    t: "We map the real workflow",
    b: "A working session on how your operation actually runs.",
  },
  {
    n: "04",
    t: "You see the shape of it",
    b: "What in-house software could look like, before anyone commits.",
  },
];

export default function Page() {
  return (
    <>
      <div className="sheet sheet-body">
        <SheetHead sheet={sheet} />

        <section className="wo-block" aria-labelledby="wo-h">
          <div className="rule">
            <span className="mono">Raise a work order</span>
            <span className="rule-fill" />
            <span className="mono">06.1</span>
          </div>

          <div className="wo-intro">
            <h2 id="wo-h" className="display-sm wo-h" data-reveal>
              Tell us what it has to do.
            </h2>
            <p className="body wo-intro-say" data-reveal>
              Not a contact form — an order. Fill in the blanks, read exactly
              what it says, then send it. It goes straight to{" "}
              <a href={`mailto:${company.email}`} className="draw">
                {company.email}
              </a>
              , and a senior architect answers it.
            </p>
          </div>

          <div data-reveal>
            <WorkOrder />
          </div>

          <Marginalia
            note="half-finished is fine — we'd rather see the real problem than a tidy one"
            hand="c"
            tilt={-2}
            className="wo-note"
          />
        </section>

        <section className="happens" aria-labelledby="happens-h">
          <div className="rule">
            <span className="mono">What happens next</span>
            <span className="rule-fill" />
            <span className="mono">06.2</span>
          </div>

          <h2 id="happens-h" className="display-sm happens-h" data-reveal>
            No forms. No funnel.
          </h2>

          <ol className="happens-list">
            {WHAT_HAPPENS.map((s, i) => (
              <li
                key={s.n}
                className="happens-step"
                data-reveal
                style={vars({ "--d": `${i * 70}ms` })}
              >
                <span className="mono happens-n">{s.n}</span>
                <h3 className="happens-t">{s.t}</h3>
                <p className="happens-b">{s.b}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="contact-in" aria-labelledby="direct-h">
          <div className="contact-say">
            <h2 id="direct-h" className="mono-sm contact-kicker">
              Or just write to a person
            </h2>
            <a href={`mailto:${company.email}`} className="contact-mail">
              {company.email}
            </a>
            <p className="body contact-note">{company.replyNote}</p>
          </div>

          <aside className="contact-spec" aria-label="Technical baseline">
            <div className="rule">
              <span className="mono">Baseline</span>
              <span className="rule-fill" />
            </div>
            <ul className="contact-trust">
              {trust.map((t) => (
                <li key={t}>
                  <span className="contact-trust-node" aria-hidden="true" />
                  {t}
                </li>
              ))}
            </ul>

            <div className="rule">
              <span className="mono">Studios</span>
              <span className="rule-fill" />
            </div>
            <ul className="contact-studios">
              {company.studios.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>

            <div className="rule">
              <span className="mono">Reply time</span>
              <span className="rule-fill" />
            </div>
            <p className="contact-reply">{company.reply}</p>

            <div className="rule">
              <span className="mono">Careers</span>
              <span className="rule-fill" />
            </div>
            <p className="contact-careers">
              <a href={`mailto:${company.careersEmail}`} className="draw">
                {company.careersEmail}
              </a>
            </p>
          </aside>
        </section>

        <p className="closing" data-reveal>
          Ideas enter Klinova as concepts.
          <br />
          <em>They leave as technology.</em>
        </p>
      </div>

      <NextSheet from="/contact" />
    </>
  );
}
