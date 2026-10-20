import { KlinovaMark } from "@/components/brand/klinova";

/**
 * The opening — a drawing sheet that draws itself, then lifts away.
 *
 * Deliberately built with no JavaScript at all. It is plain markup driven by
 * CSS keyframes, so it always resolves: there is no state that can get stuck,
 * nothing to hydrate, and a script failure cannot leave a visitor staring at
 * a curtain. It is `pointer-events: none` from the first frame, so even
 * during the animation nothing underneath is blocked — an impatient visitor
 * can click straight through it.
 *
 * It runs once per session. The guard is a synchronous inline script in the
 * layout that stamps the <html> element before first paint, so a repeat visit
 * never flashes the curtain. Reduced motion skips it outright.
 */
export function Opening() {
  return (
    <div className="opening" aria-hidden="true">
      <span className="opening-rule opening-rule-t" />
      <span className="opening-rule opening-rule-b" />

      <div className="opening-in">
        <div className="opening-lockup">
          <KlinovaMark className="opening-mark" />
          <span className="opening-word">KLINOVA</span>
        </div>

        <div className="opening-meta">
          <span className="opening-ref">KLN · GENERAL ARRANGEMENT</span>
          <span className="opening-bar">
            <i />
          </span>
          <span className="opening-note">Software that fits.</span>
        </div>
      </div>
    </div>
  );
}
