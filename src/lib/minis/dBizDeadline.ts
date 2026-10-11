/** A deadline of N business days from a 2026 date, start day excluded, weekends and observed federal holidays skipped. */
import { addBusinessDays, businessDaysBetween, addDays, daysBetween } from '../engine/calendar';
import { day, num } from '../fmt';
import type { MiniSpec } from '../mini-types';
const M = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export default (): MiniSpec => ({
  title: 'Business-day deadline from a 2026 date',
  cta: 'Count business days between two dates',
  inputs: [{ id: 'm', label: 'Start month', def: 6, options: M.map((x, i) => ({ value: String(i + 1), label: x })) }, { id: 'd', label: 'Start day', def: 29, max: 31 }, { id: 'n', label: 'Business days to add', def: 10, unit: 'days', max: 500 }],
  run: (v) => {
    const mm = Math.min(12, Math.max(1, Math.round(v.m))); const last = new Date(Date.UTC(2026, mm, 0)).getUTCDate(); const dd = Math.min(last, Math.max(1, Math.round(v.d)));
    const start = `2026-${String(mm).padStart(2, '0')}-${String(dd).padStart(2, '0')}`; const n = Math.max(0, Math.round(v.n));
    const end = addBusinessDays(start, n); const span = n > 0 ? businessDaysBetween(addDays(start, 1), end) : { holidays: 0, weekend: 0 };
    return { head: ['Deadline', day(end)], rows: [['Calendar days later', num(daysBetween(start, end))], ['Weekend days skipped', num(span.weekend)], ['Federal holidays skipped', num(span.holidays)]], note: 'The start day is not counted; day 1 is the next business day.' };
  },
});
