import type { Metadata } from "next";
import { SheetHead } from "@/components/chrome/sheet-head";
import { NextSheet } from "@/components/chrome/next-sheet";
import { Platforms } from "@/components/sequence/platforms";
import { Schedule } from "@/components/sequence/schedule";
import { Marginalia } from "@/components/primitives/marginalia";
import { sheetAt } from "@/lib/sheets";

const sheet = sheetAt("/platforms");

export const metadata: Metadata = {
  title: sheet.label,
  description: sheet.lede,
};

/**
 * 03 — PLATFORMS.
 * The schedule first, so the whole set is legible at a glance, then each
 * system gets a full sheet of its own.
 */
export default function Page() {
  return (
    <>
      <div className="sheet sheet-body">
        <SheetHead sheet={sheet}>
          <div data-reveal>
            <Schedule />
          </div>
        </SheetHead>

        <Marginalia
          note="every one of these is in production — none are concepts"
          hand="a"
          tilt={-2.5}
          className="platforms-note"
        />
      </div>

      <Platforms />

      <NextSheet from="/platforms" />
    </>
  );
}
