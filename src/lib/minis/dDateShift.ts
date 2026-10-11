/** The same number added to a 2026 date as calendar days, weeks and business days, side by side. */
import { addDays, addBusinessDays, isBusinessDay, weekday } from '../engine/calendar';
import { day, weekdayName } from '../fmt';
import type { MiniSpec } from '../mini-types';
const M = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const show = (d: string) => `${day(d)} (${weekdayName(weekday(d)).slice(0, 3)}${isBusinessDay(d) ? '' : ', closed'})`;
export default (): MiniSpec => ({
  title: 'One number, three ways to add it',
  cta: 'Add or subtract from any date',
  inputs: [{ id: 'm', label: 'Start month (2026)', def: 12, options: M.map((x, i) => ({ value: String(i + 1), label: x })) }, { id: 'd', label: 'Start day', def: 23, max: 31 }, { id: 'n', label: 'Number to add', def: 2, max: 1000 }],
  run: (v) => {
    const mm = Math.min(12, Math.max(1, Math.round(v.m))); const last = new Date(Date.UTC(2026, mm, 0)).getUTCDate(); const dd = Math.min(last, Math.max(1, Math.round(v.d)));
    const s = `2026-${String(mm).padStart(2, '0')}-${String(dd).padStart(2, '0')}`; const n = Math.max(0, Math.round(v.n));
    return { head: [`${n} business days later`, day(addBusinessDays(s, n))], rows: [[`${n} calendar days later`, show(addDays(s, n))], [`${n} weeks later`, show(addDays(s, n * 7))]], note: '“Closed” marks a weekend or an observed federal holiday.' };
  },
});
