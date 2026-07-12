/* ============================================================
   KLINOVA — industry-data.js
   Single source of truth for the 8 sectors. Consumed by
   experience.js (homepage HUD) and industry.js (detail pages).
   accent/accent2 are THREE hex numbers; *Css are CSS strings.
   ============================================================ */
window.KLINOVA_INDUSTRIES = [
  {
    id: "healthcare", scene: "healthcare", name: "Healthcare", tag: "Clinical systems, humane by design",
    accent: 0x22e0ff, accent2: 0xff5470, accentCss: "#22e0ff", accent2Css: "#ff5470",
    blurb: "EMR, charting and patient messaging that respect both clinicians and privacy law.",
    lead: "Clinicians lose hours to software built for billing departments, not bedsides. Klinova builds clinical systems around the real flow of care — fast to chart, hard to breach, and PIPEDA-ready from the first commit.",
    help: [
      { t: "Charting that keeps up", d: "Scheduling, clinical notes and e-prescribing tuned to your specialty so documentation takes seconds, not minutes." },
      { t: "Privacy engineered in", d: "Encryption, role-based access, MFA and full audit logging — verified, not bolted on after the fact." },
      { t: "One connected record", d: "Labs, imaging and pharmacy stitched into a single patient record with no third-party black boxes." }
    ],
    platforms: ["Klinova EMR", "Rx Delivery", "E-Sign"], stat: "-32%", statLabel: "admin time per visit"
  },
  {
    id: "pharmacy", scene: "pharmacy", name: "Pharmacy", tag: "Dispensary to doorstep",
    accent: 0x2ee6a6, accent2: 0x22e0ff, accentCss: "#2ee6a6", accent2Css: "#22e0ff",
    blurb: "Delivery, cold-chain and full chain of custody, with the paper trail built in.",
    lead: "Every prescription that leaves the counter is a compliance event. Klinova tracks each one from dispensary to doorstep — routing, cold-chain flags, proof of delivery and an unbroken chain of custody.",
    help: [
      { t: "Optimized last mile", d: "Route optimization and live driver tracking that shrink delivery windows without adding headcount." },
      { t: "Cold-chain assurance", d: "Temperature flags and exception handling so sensitive medication never ships out of spec." },
      { t: "Proof at every step", d: "Signature capture, photo proof and a tamper-evident custody log for every package." }
    ],
    platforms: ["Rx Delivery", "Klinova EMR", "POS + Inventory"], stat: "200k+", statLabel: "Rx deliveries / year"
  },
  {
    id: "legal", scene: "legal", name: "Legal", tag: "Documents, signatures and matters — secured",
    accent: 0xd9b04a, accent2: 0xb98bff, accentCss: "#d9b04a", accent2Css: "#b98bff",
    blurb: "Legally binding e-signature and matter management, secured and searchable.",
    lead: "Legal work runs on documents that must be provable years later. Klinova builds matter, document and signature systems that are tamper-evident, fully searchable, and never routed through someone else's cloud.",
    help: [
      { t: "Binding e-signature", d: "Tamper-evident seals and complete audit trails on every executed document — court-ready by default." },
      { t: "Matter-centric workflow", d: "Every document, deadline and note organized around the matter, not scattered across drives." },
      { t: "Searchable & secure", d: "Full-text search across privileged material with encryption and granular access control." }
    ],
    platforms: ["E-Sign", "Klinova EMR", "Grant Master"], stat: "100%", statLabel: "in-house, no third-party cores"
  },
  {
    id: "finance", scene: "finance", name: "Finance", tag: "Audit-ready by default",
    accent: 0x3ad07a, accent2: 0x22e0ff, accentCss: "#3ad07a", accent2Css: "#22e0ff",
    blurb: "Portfolio platforms for firms that answer to regulators — clean statements, real-time views.",
    lead: "When you answer to regulators, every position and rebalance has to be provable. Klinova builds portfolio and investment platforms that stay audit-ready in real time — clear for advisors, clean for clients.",
    help: [
      { t: "Real-time portfolio views", d: "Live positions, exposures and performance for advisors without waiting on overnight batches." },
      { t: "Audit-ready ledger", d: "Every policy, position and rebalance captured with an immutable, reviewable trail." },
      { t: "Client-clean statements", d: "Statements and reporting that read plainly for clients and satisfy compliance at once." }
    ],
    platforms: ["Policy Pulse", "E-Sign", "Grant Master"], stat: "5→1", statLabel: "systems consolidated"
  },
  {
    id: "government", scene: "government", name: "Government", tag: "Public-sector accountability",
    accent: 0x6a7bff, accent2: 0xeaf4ff, accentCss: "#6a7bff", accent2Css: "#eaf4ff",
    blurb: "Grant lifecycle and public-service platforms built for public-sector scrutiny.",
    lead: "Public money demands public accountability. Klinova builds grant and service platforms for the compliance realities of the public sector — transparent, auditable, and resilient at scale.",
    help: [
      { t: "End-to-end grants", d: "Intake, adjudication, disbursement and reporting in one auditable lifecycle." },
      { t: "Built for scrutiny", d: "Full audit logging and reporting designed to withstand FOI requests and oversight." },
      { t: "Canadian residency", d: "Data stays in Canada, on infrastructure hardened for public-sector requirements." }
    ],
    platforms: ["Grant Master", "E-Sign", "Policy Pulse"], stat: "PIPEDA", statLabel: "ready architecture"
  },
  {
    id: "manufacturing", scene: "manufacturing", name: "Manufacturing", tag: "Shop floor to front office",
    accent: 0xff8a3c, accent2: 0x22e0ff, accentCss: "#ff8a3c", accent2Css: "#22e0ff",
    blurb: "POS, inventory and BOM in one system — floor-to-office sync, one source of truth.",
    lead: "The gap between the shop floor and the front office is where margin leaks. Klinova closes it with one system for point-of-sale, live inventory and bill-of-materials — synced in real time.",
    help: [
      { t: "Live inventory", d: "Barcode scanning and real-time stock so what the office sees matches what's on the floor." },
      { t: "BOM to invoice", d: "Bill-of-materials, production and sales connected end to end in a single platform." },
      { t: "One source of truth", d: "No re-keying between systems — the floor and the office read from the same data." }
    ],
    platforms: ["POS + Inventory", "Grant Master", "E-Sign"], stat: "1", statfull: true, statLabel: "unified floor-to-office system"
  },
  {
    id: "logistics", scene: "logistics", name: "Logistics", tag: "Visible end to end",
    accent: 0x35c0ff, accent2: 0xeaf4ff, accentCss: "#35c0ff", accent2Css: "#eaf4ff",
    blurb: "Routing, tracking and custody — visible from origin to destination.",
    lead: "You can't manage what you can't see. Klinova builds routing and tracking platforms that make every shipment visible from origin to destination, with custody you can prove at any point.",
    help: [
      { t: "Smart routing", d: "Route optimization that adapts to load, priority and real-world constraints." },
      { t: "End-to-end tracking", d: "Live location and status for every shipment, surfaced to staff and customers alike." },
      { t: "Provable custody", d: "A continuous, tamper-evident custody record from pickup to final delivery." }
    ],
    platforms: ["Rx Delivery", "POS + Inventory", "Policy Pulse"], stat: "0", statLabel: "chain-of-custody gaps"
  },
  {
    id: "professional", scene: "professional", name: "Pro Services", tag: "Shaped around how you bill",
    accent: 0xb23bff, accent2: 0x22e0ff, accentCss: "#b23bff", accent2Css: "#22e0ff",
    blurb: "Workflow engines shaped around how your firm actually bills and delivers.",
    lead: "Professional firms run on billable time and repeatable delivery. Klinova builds workflow engines shaped around how your firm actually works — from intake to invoice — instead of forcing you into someone else's template.",
    help: [
      { t: "Workflow that fits", d: "Engagement, delivery and approval flows modeled on your real process, not a generic CRM." },
      { t: "Time to invoice", d: "Time capture that flows straight into clean, defensible client invoicing." },
      { t: "Connected knowledge", d: "Documents, clients and matters linked so nothing lives in a silo or a single inbox." }
    ],
    platforms: ["E-Sign", "Grant Master", "Policy Pulse"], stat: "1 day", statLabel: "architect reply time"
  }
];
