import Link from "next/link";
import { platforms } from "@/lib/klinova";
import { vars } from "@/lib/css";

/**
 * The system schedule — the six platforms as a drawing-office table.
 *
 * A real table, not a grid of cards: scannable, dense, sortable by eye.
 * Every column is a fact already held in lib/klinova.ts.
 */
export function Schedule() {
  return (
    <div className="schedule-wrap">
      <table className="schedule">
        <caption className="mono-sm">
          Schedule of systems — six platforms, all engineered in-house
        </caption>
        <thead>
          <tr>
            <th scope="col" className="mono-sm">
              Ref
            </th>
            <th scope="col" className="mono-sm">
              System
            </th>
            <th scope="col" className="mono-sm">
              Modules
            </th>
            <th scope="col" className="mono-sm">
              Sector
            </th>
            <th scope="col" className="mono-sm">
              Sheet
            </th>
          </tr>
        </thead>
        <tbody>
          {platforms.map((p) => (
            <tr key={p.id} style={vars({ "--accent": p.accent })}>
              <td className="mono sched-ref">
                <span className="sched-chip" aria-hidden="true" />
                {p.n}
              </td>
              <th scope="row" className="sched-name">
                {p.name}
              </th>
              <td className="sched-modules">
                <span className="sched-count mono-sm">
                  {String(p.parts.length).padStart(2, "0")}
                </span>
                <span className="sched-parts">{p.parts.join(" · ")}</span>
              </td>
              <td className="sched-sector mono-sm">{p.tags.join(" · ")}</td>
              <td className="sched-link">
                <Link href={`/platforms#platform-${p.id}`} className="draw">
                  Open ↗
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
