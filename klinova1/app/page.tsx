import Link from "next/link";
import { SystemCanvas } from "@/components/sequence/system-canvas";
import { BootLog } from "@/components/sequence/boot-log";
import { Schedule } from "@/components/sequence/schedule";
import { NextSheet } from "@/components/chrome/next-sheet";
import { Marginalia } from "@/components/primitives/marginalia";
import { company, platforms } from "@/lib/klinova";
import { vars } from "@/lib/css";

/**
 * 00 — ENTRY.
 * The visitor arrives while a system is still being drawn, with the machine
 * reporting itself alongside. Type and schematic share the same space rather
 * than sitting in separate bands.
 */
export default function Page() {
  return (
    <>
      <section className="hero sheet" aria-labelledby="hero-h">
        <SystemCanvas />

        <div className="hero-in">
          <div className="hero-say">
            <p className="hero-marker mono">
              <span>00</span>
              <span className="rule-fill" />
              <span>Entry</span>
            </p>

            <h1 id="hero-h" className="hero-title display wipe" data-reveal>
              <span>
                <span style={vars({ "--d": "80ms" })}>Software</span>
              </span>
              <span>
                <span style={vars({ "--d": "200ms" })}>
                  that fits<em className="hero-stop">.</em>
                </span>
              </span>
            </h1>

            <p className="lede hero-lede" data-reveal style={vars({ "--d": "380ms" })}>
              {company.name} is a Canadian software company. Every platform is
              engineered entirely in-house — secure, scalable and shaped to
              your workflow.
            </p>

            <p className="hero-flat" data-reveal style={vars({ "--d": "460ms" })}>
              No third-party cores. No licensed black boxes.
            </p>

            <div className="hero-act" data-reveal style={vars({ "--d": "540ms" })}>
              <Link href="/platforms" className="slab">
                See what we&rsquo;ve built
              </Link>
              <Link href="/idea" className="hero-alt draw">
                or start with your idea
              </Link>
            </div>
          </div>

          <div className="hero-log" data-reveal style={vars({ "--d": "620ms" })}>
            <BootLog />
            <Marginalia
              note="the zeroes are the whole pitch"
              hand="b"
              tilt={-3}
              className="hero-note"
            />
          </div>
        </div>
      </section>

      <section className="built sheet" aria-labelledby="built-h">
        <div className="built-head">
          <p className="mono built-marker">
            <span>00.1</span>
            <span className="rule-fill" />
            <span>What exists today</span>
          </p>
          <h2 id="built-h" className="display-sm" data-reveal>
            We&rsquo;d rather show you
            <br />
            the {platforms.length} we&rsquo;ve shipped.
          </h2>
          <p className="body built-lede" data-reveal>
            Not a capability list. Six systems in production, each one written,
            secured and supported by the same team that answers the phone.
          </p>
        </div>

        <div data-reveal>
          <Schedule />
        </div>
      </section>

      <NextSheet from="/" />
    </>
  );
}
