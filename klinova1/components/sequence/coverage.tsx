import { industries, platforms } from "@/lib/klinova";
import { vars } from "@/lib/css";

/**
 * Coverage matrix — which platform already serves which industry.
 *
 * Entirely derived: a cell is filled when the platform's own sector list
 * names that industry. Nothing is asserted that isn't already in the
 * platform data, and every one of the eight industries is genuinely covered.
 */
export function Coverage() {
  return (
    <div className="matrix-wrap">
      <table className="matrix">
        <caption className="mono-sm">
          Coverage — industry against the system already built for it
        </caption>
        <thead>
          <tr>
            <th scope="col" className="mono-sm matrix-corner">
              Industry
            </th>
            {platforms.map((p) => (
              <th
                key={p.id}
                scope="col"
                className="matrix-col"
                style={vars({ "--accent": p.accent })}
              >
                <span className="matrix-col-inner">
                  <span className="mono-sm">{p.n}</span>
                  <span className="matrix-col-name">{p.name}</span>
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {industries.map((ind) => (
            <tr key={ind.n}>
              <th scope="row" className="matrix-row-h">
                <span className="mono-sm matrix-n">{ind.n}</span>
                <span className="matrix-ind">{ind.name}</span>
                <span className="matrix-line">{ind.line}</span>
              </th>
              {platforms.map((p) => {
                const hit = p.sectors.includes(ind.name);
                return (
                  <td
                    key={p.id}
                    className="matrix-cell"
                    data-on={hit ? "" : undefined}
                    style={vars({ "--accent": p.accent })}
                  >
                    {hit ? (
                      <>
                        <span className="matrix-mark" aria-hidden="true" />
                        <span className="sr-only">
                          {p.name} serves {ind.name}
                        </span>
                      </>
                    ) : (
                      <span className="sr-only">—</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
