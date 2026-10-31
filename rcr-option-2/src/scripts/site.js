window.dataLayer = window.dataLayer || [];

/* ---------- Conversion tracking (F8) ---------- */
document.addEventListener('click', (e) => {
  const a = e.target.closest?.('a[href^="tel:"], a[href^="mailto:"]');
  if (!a) return;
  window.dataLayer.push({
    event: a.href.startsWith('tel:') ? 'call_click' : 'email_click',
    link_location: a.dataset.track ?? 'page',
    page_path: location.pathname,
  });
});

/* ---------- Lead forms (progressive enhancement) ---------- */
document.querySelectorAll('form[data-lead]').forEach((form) => {
  const t = form.querySelector('input[name="_t"]');
  if (t) t.value = String(Date.now());
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const status = form.querySelector('[data-status]');
    const btn = form.querySelector('button[type="submit"]');
    btn?.setAttribute('disabled', '');
    status.textContent = 'Sending…';
    status.dataset.state = '';
    try {
      const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
      const data = await res.json();
      status.textContent = data.message;
      status.dataset.state = data.ok ? 'ok' : 'error';
      if (data.ok) {
        window.dataLayer.push({ event: 'form_submit', form_type: form.dataset.lead, page_path: location.pathname });
        form.reset();
      }
    } catch {
      status.textContent = 'That didn’t go through. Please call us at 905-348-1965.';
      status.dataset.state = 'error';
    } finally {
      btn?.removeAttribute('disabled');
      status.focus();
    }
  });
});

/* ---------- Prints settle onto the page as they scroll in ---------- */
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const prints = document.querySelectorAll('[data-drop]');
if (!reduced && prints.length && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const en of entries) {
        if (!en.isIntersecting) continue;
        en.target.classList.add('is-in');
        io.unobserve(en.target);
      }
    },
    { rootMargin: '0px 0px -10% 0px' },
  );
  prints.forEach((p) => {
    p.classList.add('will-drop');
    io.observe(p);
  });
}
