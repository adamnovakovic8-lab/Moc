import type { Sheet } from "@/lib/sheets";
import { sheets } from "@/lib/sheets";

/**
 * The title block every sheet opens with — number, drawing reference,
 * title, standfirst, and a strip of drawing-office metadata.
 *
 * The metadata is descriptive of the document, never of the business:
 * which sheet this is, how many there are, who drew it. No counters.
 */
export function SheetHead({
  sheet,
  children,
}: {
  sheet: Sheet;
  children?: React.ReactNode;
}) {
  const last = sheets[sheets.length - 1].n;

  return (
    <header className="sheet-head">
      <div className="sheet-head-top">
        <span className="sheet-head-n">{sheet.n}</span>
        <span className="rule-fill" />
        <span className="mono-sm">{sheet.drawing}</span>
      </div>

      <h1 className="sheet-head-title display-sm" data-reveal>
        {sheet.title}
      </h1>

      <p className="sheet-head-lede lede" data-reveal>
        {sheet.lede}
      </p>

      {children}

      <dl className="sheet-meta" aria-label="Drawing information">
        <div>
          <dt className="mono-sm">Sheet</dt>
          <dd>
            {sheet.n} of {last}
          </dd>
        </div>
        <div>
          <dt className="mono-sm">Drawn by</dt>
          <dd>Klinova, in-house</dd>
        </div>
        <div>
          <dt className="mono-sm">Third-party cores</dt>
          <dd>None</dd>
        </div>
        <div>
          <dt className="mono-sm">Baseline</dt>
          <dd>PIPEDA-ready</dd>
        </div>
      </dl>
    </header>
  );
}
