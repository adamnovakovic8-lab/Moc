const path = require('path');
const express = require('express');
const data = require('./data/tips.json');
const school = require('./data/school.json');

const app = express();
// Explicit paths so Vercel's bundler includes ejs and the views folder
app.engine('ejs', require('ejs').__express);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public'))); // local only; Vercel serves public/ from its CDN
app.locals.school = school;
// '13:05' -> '1:05' for display
app.locals.clock = hhmm => hhmm.replace(/^(\d+)/, h => (h > 12 ? h - 12 : h));

const pages = [
  ['/', 'index', 'Home'],
  ['/tips', 'tips', 'Top 10 Tips'],
  ['/goals', 'goals', 'Goal Planner'],
  ['/skills', 'skills', 'Skills'],
  ['/story', 'story', 'My First Week'],
  ['/advice', 'advice', 'Good Advice'],
];
app.locals.nav = pages;

// Ontario school starts the Tuesday after Labour Day (first Monday in September)
function firstDayOfSchool(year) {
  const sept1 = new Date(year, 8, 1);
  const labourDay = 1 + ((8 - sept1.getDay()) % 7);
  return new Date(year, 8, labourDay + 1);
}

function daysUntilGrade9(now = new Date()) {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let start = firstDayOfSchool(today.getFullYear());
  if (start <= today) start = firstDayOfSchool(today.getFullYear() + 1);
  return Math.round((start - today) / 86400000);
}

// Same tip all day, a new one tomorrow
function tipOfTheDay(now = new Date()) {
  const day = Math.floor(now / 86400000);
  const i = day % data.tips.length;
  return { number: i + 1, ...data.tips[i] };
}

const toMinutes = hhmm => { const [h, m] = hhmm.split(':').map(Number); return h * 60 + m; };
for (const b of school.schedule) b.mins = toMinutes(b.end) - toMinutes(b.start);

// Which block of the Corpus day is happening right now, in Burlington time (the host may run on UTC)
function rightNow(now = new Date()) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Toronto', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23',
  }).formatToParts(now).map(p => [p.type, p.value]));
  if (parts.weekday === 'Sat' || parts.weekday === 'Sun') return null;
  const mins = Number(parts.hour) * 60 + Number(parts.minute);
  return school.schedule.find(b => mins >= toMinutes(b.start) && mins < toMinutes(b.end))?.label ?? null;
}

app.use((req, res, next) => {
  res.locals.servedAt = new Date().toLocaleDateString('en-CA', { weekday: 'long', month: 'long', day: 'numeric' });
  next();
});

for (const [route, view, title] of pages) {
  app.get(route, (req, res) => res.render(view, {
    ...data, title, path: route,
    tipOfDay: tipOfTheDay(),
    daysLeft: daysUntilGrade9(),
    nowBlock: rightNow(),
  }));
}

app.get('/api/tips', (req, res) => res.json(data.tips));

app.use((req, res) => res.status(404).render('404', { title: 'Page not found', path: '' }));

if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Running at http://localhost:${port}`));
}

// Vercel runs the exported app; helpers ride along for test.js
module.exports = Object.assign(app, { firstDayOfSchool, daysUntilGrade9, rightNow });
