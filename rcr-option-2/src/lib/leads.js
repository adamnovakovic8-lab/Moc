import { appendFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

// F4 — every form posts here. Each lead is (1) appended to a local JSONL log so
// nothing is lost if email fails, and (2) emailed to Kim through Resend when
// RESEND_API_KEY is set. Swap step 1 for a CMS write once the CMS is chosen.

export const FORM_TYPES = {
  inquiry: { label: 'Cart inquiry', required: ['name', 'contact'] },
  'test-drive': { label: 'Test drive request', required: ['name', 'contact', 'date'] },
  rental: { label: 'Rental request', required: ['name', 'contact', 'start', 'end'] },
  storage: { label: 'Storage sign-up', required: ['name', 'contact'] },
  service: { label: 'Service booking', required: ['name', 'contact', 'issue'] },
  build: { label: 'Custom build', required: ['name', 'contact'] },
  financing: { label: 'Financing pre-qualification', required: ['name', 'contact'] },
  general: { label: 'General question', required: ['name', 'contact', 'message'] },
};

const LEAD_DIR = process.env.LEAD_DIR ?? path.resolve('data');
const MAX_FIELD = 2000;

// Simple in-memory rate limit: 5 submits per IP per 10 minutes.
const hits = new Map();
export function rateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

export function clean(form) {
  const out = {};
  for (const [k, v] of form.entries()) {
    if (typeof v !== 'string' || k.startsWith('_') || k === 'website') continue;
    const val = v.trim().slice(0, MAX_FIELD);
    if (!val) continue;
    out[k] = out[k] ? `${out[k]}, ${val}` : val;
  }
  return out;
}

export async function storeLead(lead) {
  await mkdir(LEAD_DIR, { recursive: true });
  await appendFile(path.join(LEAD_DIR, 'leads.jsonl'), JSON.stringify(lead) + '\n', 'utf8');
}

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

export async function emailLead(lead) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { skipped: true };
  const rows = Object.entries(lead.fields)
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#666">${esc(k)}</td><td>${esc(v)}</td></tr>`)
    .join('');
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.LEAD_FROM ?? 'RCR Website <website@rcrperformance.ca>',
      to: (process.env.LEAD_TO ?? 'info@rcrperformance.ca').split(','),
      reply_to: lead.fields.contact?.includes('@') ? lead.fields.contact : undefined,
      subject: `${FORM_TYPES[lead.type].label}: ${lead.fields.name}${lead.fields.cart ? ` — ${lead.fields.cart}` : ''}`,
      html: `<h2>${esc(FORM_TYPES[lead.type].label)}</h2><table>${rows}</table><p style="color:#999">From ${esc(lead.page ?? 'site')} · ${lead.at}</p>`,
    }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}`);
  return { sent: true };
}
