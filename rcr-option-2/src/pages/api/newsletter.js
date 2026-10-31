import { rateLimited, storeLead } from '../../lib/leads.js';

export const prerender = false;

// F7 — newsletter signup. Explicit CASL consent is required by the form.
// Wire NEWSLETTER_WEBHOOK to the client's email tool (Mailchimp, Klaviyo, etc).
export async function POST({ request, clientAddress }) {
  const form = await request.formData();
  const email = String(form.get('email') ?? '').trim();
  const json = request.headers.get('accept')?.includes('application/json');
  const done = (ok, message, status = 200) =>
    json
      ? Response.json({ ok, message }, { status })
      : new Response(null, { status: 303, headers: { Location: ok ? '/thanks?from=newsletter' : '/?newsletter=error#footer' } });

  if (form.get('website')) return done(true, 'Thanks!');
  if (rateLimited(clientAddress ?? 'unknown')) return done(false, 'Too many tries.', 429);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return done(false, 'That email doesn’t look right.', 422);
  if (form.get('consent') !== 'yes') return done(false, 'Please tick the consent box.', 422);

  await storeLead({ type: 'newsletter', at: new Date().toISOString(), fields: { email, consent: 'yes (CASL express)' } }).catch(() => {});
  if (process.env.NEWSLETTER_WEBHOOK) {
    await fetch(process.env.NEWSLETTER_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, consent: true, source: 'rcrperformance.ca' }),
    }).catch((e) => console.error('[newsletter]', e));
  }
  return done(true, "Thanks — you're on the list.");
}
