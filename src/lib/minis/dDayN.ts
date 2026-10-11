/** N calendar days from a 2026 date, read two ways: N days after the start, or day N when the start is day 1. */
import { addDays, weekday } from '../engine/calendar';
import { day, weekdayName } from '../fmt';
import type { MiniSpec } from '../mini-types';
const M = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export default (): MiniSpec => ({
  title: 'Day 90 or 90 days after?',
  cta: 'Count the days between two dates',
  inputs: [{ id: 'm', label: 'Start month (2026)', def: 10, options: M.map((x, i) => ({ value: String(i + 1), label: x })) }, { id: 'd', label: 'Start day', def: 12, max: 31 }, { id: 'n', label: 'Number of days', def: 90, unit: 'days', max: 3650 }],
  run: (v) => {
    const mm = Math.min(12, Math.max(1, Math.round(v.m))); const last = new Date(Date.UTC(2026, mm, 0)).getUTCDate(); const dd = Math.min(last, Math.max(1, Math.round(v.d)));
    const start = `2026-${String(mm).padStart(2, '0')}-${String(dd).padStart(2, '0')}`; const n = Math.max(1, Math.round(v.n));
    const after = addDays(start, n); const nth = addDays(start, n - 1);
    return { head: [`${n} days after the start`, day(after)], rows: [[`Day ${n}, start counted as day 1`, day(nth)], ['Weekday of that last day', weekdayName(weekday(nth))]] };
  },
});
