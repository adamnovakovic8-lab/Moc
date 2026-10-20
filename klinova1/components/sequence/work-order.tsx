"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { SECTORS, matchSector } from "@/lib/shape";
import {
  CONSTRAINTS,
  EMPTY,
  STAGES,
  compose,
  gaps,
  reference,
  subjectFor,
  type Order,
} from "@/lib/work-order";
import { company } from "@/lib/klinova";
import { useClientOnce } from "@/components/primitives/use-client-once";

/**
 * 06 — THE WORK ORDER.
 *
 * Not a contact form. It's a document the visitor raises: sentences with the
 * blanks filled in, the way a real order reads, next to a live preview of the
 * exact plain text it will send.
 *
 * There is no endpoint and the site never pretends otherwise. Sending hands
 * the composed order to the visitor's own mail client; copying puts the same
 * text on their clipboard. Nothing is transmitted by the page, so nothing can
 * be silently lost and no fake "thanks, we'll be in touch" is ever shown.
 */
type Sketch = { sector?: string; modules?: string[]; idea?: string };

function readSketch(): Sketch | null {
  try {
    const raw = sessionStorage.getItem("klinova:sketch");
    return raw ? (JSON.parse(raw) as Sketch) : null;
  } catch {
    // Blocked or unavailable storage is not an error worth surfacing.
    return null;
  }
}

function stamp() {
  const now = new Date();
  return {
    ref: reference(now),
    raised: new Intl.DateTimeFormat("en-CA", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(now),
  };
}

export function WorkOrder() {
  // Whatever the visitor has actually typed. Everything else is derived.
  const [edits, setEdits] = useState<Partial<Order>>({});
  const [copied, setCopied] = useState(false);
  const [customNeed, setCustomNeed] = useState("");
  const copyTimer = useRef<number | undefined>(undefined);
  const uid = useId();

  const { ref, raised } = useClientOnce(stamp, {
    ref: "KLN-WO-DRAFT",
    raised: "—",
  });

  // If they came from the sketch on sheet 05, start from it rather than
  // making them describe the same operation twice.
  const sketch = useClientOnce<Sketch | null>(readSketch, null);

  const order: Order = useMemo(() => {
    const seeded: Order = {
      ...EMPTY,
      sector: sketch?.sector ?? "",
      needs: sketch?.modules ?? [],
      problem: sketch?.idea ?? "",
    };
    return { ...seeded, ...edits };
  }, [sketch, edits]);

  const set = <K extends keyof Order>(key: K, value: Order[K]) =>
    setEdits((e) => ({ ...e, [key]: value }));

  const toggle = (key: "needs" | "constraints", value: string) => {
    const current = order[key];
    set(
      key,
      current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value],
    );
  };

  const addNeed = () => {
    const value = customNeed.trim();
    if (!value) return;
    if (!order.needs.includes(value)) set("needs", [...order.needs, value]);
    setCustomNeed("");
  };

  useEffect(() => () => window.clearTimeout(copyTimer.current), []);

  // Modules offered follow the sector, so the options are the ones Klinova
  // would actually draw for that kind of operation. Anything already chosen
  // stays on the list even if the sector changes underneath it.
  const { matched } = useMemo(
    () => matchSector(order.sector),
    [order.sector],
  );

  const offered = useMemo(() => {
    const base = order.sector.trim()
      ? matchSector(order.sector).sector.modules
      : [];
    return [...new Set([...base, ...order.needs])];
  }, [order.sector, order.needs]);

  const text = useMemo(() => compose(order, ref, raised), [order, ref, raised]);
  const missing = gaps(order);
  const ready = missing.length === 0;

  const send = () => {
    window.location.href =
      `mailto:${company.email}` +
      `?subject=${encodeURIComponent(subjectFor(order, ref))}` +
      `&body=${encodeURIComponent(text)}`;
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.clearTimeout(copyTimer.current);
      copyTimer.current = window.setTimeout(() => setCopied(false), 2600);
    } catch {
      // Clipboard can be refused; the preview stays selectable as a fallback.
      setCopied(false);
    }
  };

  return (
    <div className="wo">
      <div className="wo-doc">
        <div className="wo-head">
          <span className="mono-sm">Klinova · work order</span>
          <span className="mono-sm wo-ref">{ref}</span>
        </div>

        <div className="wo-body">
          {/* 01 — who */}
          <section className="wo-clause">
            <p className="wo-n mono-sm">01 · Who</p>
            <p className="wo-say">
              We&rsquo;re{" "}
              <label className="sr-only" htmlFor={`${uid}-org`}>
                Your organisation
              </label>
              <input
                id={`${uid}-org`}
                className="wo-in wo-in-lg"
                value={order.org}
                onChange={(e) => set("org", e.target.value)}
                placeholder="an independent pharmacy"
                size={22}
                maxLength={80}
              />
              , working in{" "}
              <label className="sr-only" htmlFor={`${uid}-sector`}>
                Sector
              </label>
              {/* A combobox, not a dropdown: the nine we've built for are
                  offered as suggestions, but any sector can be typed. */}
              <input
                id={`${uid}-sector`}
                className="wo-in wo-in-sector"
                list={`${uid}-sectors`}
                value={order.sector}
                onChange={(e) => set("sector", e.target.value)}
                placeholder="your sector"
                size={16}
                maxLength={60}
                autoComplete="off"
              />
              <datalist id={`${uid}-sectors`}>
                {SECTORS.map((s) => (
                  <option key={s.id} value={s.domain} />
                ))}
              </datalist>
              , based in{" "}
              <label className="sr-only" htmlFor={`${uid}-where`}>
                Where you operate
              </label>
              <input
                id={`${uid}-where`}
                className="wo-in"
                value={order.where}
                onChange={(e) => set("where", e.target.value)}
                placeholder="Ontario"
                size={12}
                maxLength={60}
              />
              .
            </p>
          </section>

          {/* 02 — the problem */}
          <section className="wo-clause">
            <p className="wo-n mono-sm">02 · The problem</p>
            <label className="wo-say wo-say-block" htmlFor={`${uid}-problem`}>
              Right now,
            </label>
            <textarea
              id={`${uid}-problem`}
              className="wo-area"
              value={order.problem}
              onChange={(e) => set("problem", e.target.value)}
              placeholder="orders come in three different ways and nothing reconciles at the end of the day."
              rows={3}
              maxLength={600}
            />
          </section>

          {/* 03 — what it has to do */}
          <section className="wo-clause">
            <p className="wo-n mono-sm">03 · What it has to do</p>
            {order.sector.trim() ? (
              <>
                <p className="wo-say wo-say-block">It has to handle&nbsp;—</p>
                <ul className="wo-chips">
                  {offered.map((m) => {
                    const on = order.needs.includes(m);
                    return (
                      <li key={m}>
                        <label className="wo-chip" data-on={on ? "" : undefined}>
                          <input
                            type="checkbox"
                            checked={on}
                            onChange={() => toggle("needs", m)}
                          />
                          <span className="wo-chip-mark" aria-hidden="true" />
                          {m}
                        </label>
                      </li>
                    );
                  })}
                </ul>

                {/* Any sector means any module — the list is a start, not a menu. */}
                <div className="wo-add">
                  <label className="sr-only" htmlFor={`${uid}-add`}>
                    Add a module of your own
                  </label>
                  <input
                    id={`${uid}-add`}
                    className="wo-in wo-add-in"
                    value={customNeed}
                    onChange={(e) => setCustomNeed(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key !== "Enter") return;
                      e.preventDefault();
                      addNeed();
                    }}
                    placeholder="add something of your own"
                    size={22}
                    maxLength={48}
                  />
                  <button
                    type="button"
                    className="wo-add-go"
                    onClick={addNeed}
                    disabled={!customNeed.trim()}
                  >
                    Add +
                  </button>
                </div>

                <p className="wo-hint mono-sm">
                  {matched
                    ? "These are the modules we’d sketch for that sector. Add or drop as you like — the order is yours."
                    : "We haven’t shipped for that sector yet, so these are the pieces almost every system needs. Add your own — the order is yours."}
                </p>
              </>
            ) : (
              <p className="wo-waiting mono-sm">
                name a sector above — any sector — and the modules appear here
              </p>
            )}
          </section>

          {/* 04 — constraints */}
          <section className="wo-clause">
            <p className="wo-n mono-sm">04 · Constraints</p>
            <ul className="wo-chips">
              {CONSTRAINTS.map((c) => {
                const on = order.constraints.includes(c);
                return (
                  <li key={c}>
                    <label className="wo-chip" data-on={on ? "" : undefined}>
                      <input
                        type="checkbox"
                        checked={on}
                        onChange={() => toggle("constraints", c)}
                      />
                      <span className="wo-chip-mark" aria-hidden="true" />
                      {c}
                    </label>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* 05 — where we are */}
          <fieldset className="wo-clause wo-fieldset">
            <legend className="wo-n mono-sm">05 · Where we are</legend>
            <ul className="wo-stages">
              {STAGES.map((s) => (
                <li key={s.id}>
                  <label
                    className="wo-stage"
                    data-on={order.stage === s.id ? "" : undefined}
                  >
                    <input
                      type="radio"
                      name={`${uid}-stage`}
                      checked={order.stage === s.id}
                      onChange={() => set("stage", s.id)}
                    />
                    <span className="wo-stage-mark" aria-hidden="true" />
                    {s.label}
                  </label>
                </li>
              ))}
            </ul>
          </fieldset>

          {/* 06 — reply to */}
          <section className="wo-clause">
            <p className="wo-n mono-sm">06 · Reply to</p>
            <p className="wo-say">
              <label className="sr-only" htmlFor={`${uid}-name`}>
                Your name
              </label>
              <input
                id={`${uid}-name`}
                className="wo-in"
                value={order.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="your name"
                size={16}
                maxLength={80}
              />
              {" · "}
              <label className="sr-only" htmlFor={`${uid}-email`}>
                Your email address
              </label>
              <input
                id={`${uid}-email`}
                className="wo-in wo-in-lg"
                type="email"
                value={order.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="you@yourcompany.ca"
                size={22}
                maxLength={120}
                inputMode="email"
              />
            </p>
          </section>
        </div>

        <div className="wo-foot">
          <div className="wo-actions">
            <button
              type="button"
              className="slab wo-send"
              onClick={send}
              disabled={!ready}
            >
              Send to a senior architect
            </button>
            <button type="button" className="wo-copy" onClick={copy}>
              {copied ? "Copied ✓" : "Copy the order"}
            </button>
          </div>

          <p className="wo-status mono-sm" role="status">
            {ready
              ? `Opens your mail app, addressed to ${company.email}. Nothing is sent by this page.`
              : `Still needs ${missing.join(" and ")}.`}
          </p>
        </div>
      </div>

      {/* The exact text that goes out — no hidden fields, nothing else. */}
      <aside className="wo-preview" aria-labelledby={`${uid}-prev`}>
        <div className="wo-preview-bar">
          <span className="mono-sm" id={`${uid}-prev`}>
            What gets sent
          </span>
          <span className="mono-sm wo-count">{text.length} chars</span>
        </div>
        <pre className="wo-pre">{text}</pre>
      </aside>
    </div>
  );
}
