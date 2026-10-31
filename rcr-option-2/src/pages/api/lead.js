import { FORM_TYPES, clean, rateLimited, storeLead, emailLead } from '../../lib/leads.js';

export const prerender = false;

function reply(request, ok, message, status, back) {
  // Forms work without JS: a plain POST redirects to a thank-you page.
  const wantsJson = request.headers.get('accept')?.includes('application/json');
  if (wantsJson) return Response.json({ ok, message }, { status });
  const target = ok ? `/thanks?from=${encodeURIComponent(back ?? '/')}` : `${back ?? '/contact'}?error=1#form`;
  return new Response(null, { status: 303, headers: { Location: target } });
}

export async function POST({ request, clientAddress }) {
  let form;
  try {
    form = await request.formData();
  } catch {
    return reply(request, false, 'Could not read that form.', 400);
  }
  const back = String(form.get('_page') ?? '/');
  const type = String(form.get('_type') ?? 'general');

  // Honeypot: real people never fill the hidden "website" field. Pretend success.
  if (form.get('website')) return reply(request, true, 'Thanks!', 200, back);
  // Bots also tend to submit instantly.
  const started = Number(form.get('_t'));
  if (started && Date.now() - started < 2500) return reply(request, true, 'Thanks!', 200, back);

  if (rateLimited(clientAddress ?? 'unknown')) {
    return reply(request, false, 'Too many messages in a row — give us a call instead.', 429, back);
  }
  if (!FORM_TYPES[type]) return reply(request, false, 'Unknown form.', 400, back);

  const fields = clean(form);
  const missing = FORM_TYPES[type].required.filter((k) => !fields[k]);
  if (missing.length) return reply(request, false, `Please fill in: ${missing.join(', ')}.`, 422, back);

  const lead = { type, at: new Date().toISOString(), page: back, fields };
  try {
    await storeLead(lead);
  } catch (e) {
    console.error('[lead] store failed', e);
  }
  try {
    await emailLead(lead);
  } catch (e) {
    console.error('[lead] email failed', e);
  }
  return reply(request, true, "Thanks — we got it. We'll be in touch soon.", 200, back);
}
