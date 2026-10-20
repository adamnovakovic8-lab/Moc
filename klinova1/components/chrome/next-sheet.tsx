import Link from "next/link";
import { nextSheet, prevSheet } from "@/lib/sheets";

/**
 * The hand-off. Splitting the experience across routes only works if each
 * sheet ends by pointing at the next one, so the thread survives the jump.
 */
export function NextSheet({ from }: { from: string }) {
  const next = nextSheet(from);
  const prev = prevSheet(from);

  return (
    <nav className="handoff" aria-label="Continue">
      <Link href={prev.href} className="handoff-back">
        <span className="mono-sm">← {prev.n}</span>
        <span>{prev.label}</span>
      </Link>

      <Link href={next.href} className="handoff-next">
        <span className="handoff-kicker mono-sm">
          Next — sheet {next.n}
        </span>
        <span className="handoff-line">{next.handoff}</span>
        <span className="handoff-title display-sm">{next.title}</span>
        <span className="handoff-arrow" aria-hidden="true" />
      </Link>
    </nav>
  );
}
