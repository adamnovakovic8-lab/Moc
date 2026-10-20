// Run with: node test.js
const assert = require('assert');
const { firstDayOfSchool, daysUntilGrade9, rightNow } = require('./server');

assert.equal(firstDayOfSchool(2026).getDate(), 8); // Labour Day 2026 is Mon Sept 7
assert.equal(firstDayOfSchool(2027).getDate(), 7); // Labour Day 2027 is Mon Sept 6
assert.equal(daysUntilGrade9(new Date(2027, 8, 6)), 1);
assert.equal(daysUntilGrade9(new Date(2027, 8, 7)), 364); // already started, so count to Sept 5 2028
// Times are UTC; Burlington is UTC-4 in October
assert.equal(rightNow(new Date('2026-10-15T13:00:00Z')), 'Period 1');      // Thu 9:00 am
assert.equal(rightNow(new Date('2026-10-15T16:30:00Z')), 'Period 3 + lunch'); // Thu 12:30 pm
assert.equal(rightNow(new Date('2026-10-15T17:02:00Z')), null);            // between periods
assert.equal(rightNow(new Date('2026-10-17T13:00:00Z')), null);            // Saturday
console.log('All tests passed');
