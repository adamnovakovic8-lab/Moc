// localStorage can throw in private mode, so every read/write goes through these
const load = (key, fallback) => { try { return JSON.parse(localStorage[key]) ?? fallback; } catch { return fallback; } };
const save = (key, value) => { try { localStorage[key] = JSON.stringify(value); } catch {} };
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Mobile menu
const menuBtn = document.getElementById('menu-btn');
menuBtn.addEventListener('click', () => {
  const open = document.getElementById('nav').classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', open);
});

// Dark mode
const themeBtn = document.getElementById('theme');
const moon = 'M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z';
const sun = 'M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0-5 1.5 3h-3L12 2Zm0 20-1.5-3h3L12 22ZM2 12l3-1.5v3L2 12Zm20 0-3 1.5v-3l3 1.5ZM4.9 4.9l3.2 1-2.1 2.1-1.1-3.1Zm14.2 14.2-3.2-1 2.1-2.1 1.1 3.1ZM4.9 19.1l1-3.2 2.1 2.1-3.1 1.1ZM19.1 4.9l-1 3.2-2.1-2.1 3.1-1.1Z';
const syncTheme = () => {
  const dark = document.documentElement.dataset.theme === 'dark';
  themeBtn.querySelector('path').setAttribute('d', dark ? sun : moon);
  themeBtn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
};
syncTheme();
themeBtn.addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  try { localStorage.theme = next; } catch {}
  syncTheme();
});

// Top 10 lockers: open a locker, show its tip, fill the progress bar
const lockers = [...document.querySelectorAll('.locker-bank .locker')];
if (lockers.length) {
  const dialog = document.getElementById('tip-dialog');
  const body = dialog.querySelector('.dialog-body');
  const nextBtn = document.getElementById('tip-next');
  const read = new Set(load('tipsRead', []));
  let current = 0;

  const update = () => {
    lockers.forEach((l, i) => l.classList.toggle('read', read.has(i)));
    document.querySelector('.progress-fill').style.transform = `scaleX(${read.size / lockers.length})`;
    document.querySelector('.progress').setAttribute('aria-valuenow', read.size);
    document.getElementById('read-count').textContent = read.size;
  };

  const show = i => {
    current = i;
    body.replaceChildren(dialog.querySelector(`template[data-tip="${i}"]`).content.cloneNode(true));
    nextBtn.textContent = i === lockers.length - 1 ? 'Back to tip 1' : 'Next tip';
    read.add(i);
    save('tipsRead', [...read]);
    update();
    if (!dialog.open) dialog.showModal();
  };

  lockers.forEach((locker, i) => locker.addEventListener('click', () => {
    // Let the door swing open first, then show the tip
    const door = locker.querySelector('.locker-door');
    door.style.transform = 'rotateY(-70deg)';
    setTimeout(() => { door.style.transform = ''; show(i); }, reducedMotion ? 0 : 320);
  }));
  nextBtn.addEventListener('click', () => show((current + 1) % lockers.length));
  document.getElementById('tip-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => lockers[current].focus());

  // Links like /tips#tip-7 open that tip straight away
  const fromHash = Number(location.hash.replace('#tip-', '')) - 1;
  if (lockers[fromHash]) show(fromHash);
  update();
}

// Goal checklist
const goals = document.querySelectorAll('[data-goal]');
if (goals.length) {
  const done = load('goalsDone', {});
  const count = () => { document.getElementById('goal-count').textContent = Object.values(done).filter(Boolean).length; };
  goals.forEach(box => {
    box.checked = !!done[box.dataset.goal];
    box.addEventListener('change', () => { done[box.dataset.goal] = box.checked; save('goalsDone', done); count(); });
  });
  count();
}

// Skill cards flip
document.querySelectorAll('.flip').forEach(card => card.addEventListener('click', () => {
  card.setAttribute('aria-pressed', card.getAttribute('aria-pressed') !== 'true');
}));
