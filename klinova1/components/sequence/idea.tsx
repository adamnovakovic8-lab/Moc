"use client";

import { useId, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { PROMPTS, SPINE, shapeIdea } from "@/lib/shape";
import { platforms } from "@/lib/klinova";
import { vars } from "@/lib/css";

/**
 * The visitor writes what they are trying to build; the sheet draws it back
 * as a conceptual system. It says plainly that this is a sketch rather than
 * a quote, and it points at the platform Klinova has already built nearest
 * to the idea instead of pretending everything is bespoke.
 */
export function Idea() {
  const [draft, setDraft] = useState("");
  const [submitted, setSubmitted] = useState<string | null>(null);
  const fieldId = useId();
  const outRef = useRef<HTMLDivElement>(null);

  const shape = useMemo(
    () => (submitted === null ? null : shapeIdea(submitted)),
    [submitted],
  );

  const nearest = shape?.nearest
    ? platforms.find((p) => p.id === shape.nearest)
    : undefined;

  const run = (text: string) => {
    const value = text.trim();
    if (!value) return;
    setDraft(value);
    setSubmitted(value);

    // Hand the sketch to the work order on sheet 06 so nobody has to describe
    // the same operation twice. Stays in this tab; never leaves the browser.
    try {
      const drawn = shapeIdea(value);
      sessionStorage.setItem(
        "klinova:sketch",
        JSON.stringify({
          // Only carry a sector we actually recognised — the fallback label
          // is a placeholder, not something to put in their order.
          sector: drawn.sectorId === "other" ? "" : drawn.domain,
          modules: drawn.modules,
          idea: value,
        }),
      );
    } catch {
      // Storage can be blocked; the sketch still renders, it just will not carry.
    }

    // The drawing lands below the fold on a laptop; without this the visitor
    // presses "Build it" and appears to get nothing back.
    requestAnimationFrame(() => {
      outRef.current?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
        block: "center",
      });
    });
  };

  return (
    <div className="idea">
      <form
        className="idea-form"
        onSubmit={(e) => {
          e.preventDefault();
          run(draft);
        }}
      >
        <label htmlFor={fieldId} className="mono idea-label">
          Describe the software you need
        </label>

        <div className="idea-field">
          <span className="idea-caret mono" aria-hidden="true">
            &gt;
          </span>
          <input
            id={fieldId}
            className="idea-input"
            type="text"
            value={draft}
            maxLength={160}
            autoComplete="off"
            placeholder="I want software for my pharmacy."
            onChange={(e) => setDraft(e.target.value)}
          />
          <button type="submit" className="slab idea-go">
            Build it
          </button>
        </div>

        <ul className="idea-prompts">
          {PROMPTS.map((p) => (
            <li key={p}>
              <button
                type="button"
                className="idea-prompt"
                onClick={() => run(p)}
              >
                {p}
              </button>
            </li>
          ))}
        </ul>
      </form>

      <div className="idea-out" aria-live="polite" ref={outRef}>
        {shape ? (
          <div className="idea-system" key={submitted}>
            <p className="idea-domain mono">
              <span>{shape.domain}</span>
              <span className="rule-fill" />
              <span>conceptual system</span>
            </p>

            <ol className="idea-chain">
              {shape.modules.map((m, i) => (
                <li
                  key={m}
                  className="idea-node"
                  style={vars({ "--d": `${i * 130}ms` })}
                >
                  <span className="idea-node-n mono-sm">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="idea-node-name">{m}</span>
                </li>
              ))}
            </ol>

            <div
              className="idea-spine"
              style={vars({ "--d": `${shape.modules.length * 130 + 120}ms` })}
            >
              <span className="mono-sm">Underneath, always</span>
              <ul>
                {SPINE.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>

            <p
              className="idea-honest"
              style={vars({ "--d": `${shape.modules.length * 130 + 260}ms` })}
            >
              That&rsquo;s a sketch, not a quote — the real shape comes out of a
              workshop.
              {nearest ? (
                <>
                  {" "}
                  The closest thing we&rsquo;ve already built is{" "}
                  <Link
                    href={`/platforms#platform-${nearest.id}`}
                    className="draw"
                  >
                    {nearest.name}
                  </Link>
                  .
                </>
              ) : null}
            </p>

            <Link href="/contact" className="slab idea-next">
              Raise a work order from this
            </Link>
          </div>
        ) : (
          <p className="idea-idle mono-sm">
            awaiting input — the sheet is blank until you fill it
          </p>
        )}
      </div>
    </div>
  );
}
