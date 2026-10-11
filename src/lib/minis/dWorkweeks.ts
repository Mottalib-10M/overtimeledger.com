/** Weeks between two 2026 dates, and how many payroll workweeks the span touches for a chosen workweek start day. */
import { daysBetween, weekday } from '../engine/calendar';
import { num, weekdayName } from '../fmt';
import type { MiniSpec } from '../mini-types';
const M = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const months = M.map((x, i) => ({ value: String(i + 1), label: x }));
const iso = (m: number, d: number) => { const mm = Math.min(12, Math.max(1, Math.round(m))); const last = new Date(Date.UTC(2026, mm, 0)).getUTCDate(); return `2026-${String(mm).padStart(2, '0')}-${String(Math.min(last, Math.max(1, Math.round(d)))).padStart(2, '0')}`; };
export default (): MiniSpec => ({
  title: 'Weeks and workweeks between two 2026 dates',
  cta: 'Open the weeks between dates calculator',
  inputs: [{ id: 'am', label: 'From month', def: 3, options: months }, { id: 'ad', label: 'From day', def: 11, max: 31 }, { id: 'bm', label: 'To month', def: 4, options: months }, { id: 'bd', label: 'To day', def: 24, max: 31 }, { id: 'w', label: 'Workweek starts on', def: 0, options: [0, 1, 2, 3, 4, 5, 6].map((i) => ({ value: String(i), label: weekdayName(i) })) }],
  run: (v) => {
    let a = iso(v.am, v.ad); let b = iso(v.bm, v.bd); if (daysBetween(a, b) < 0) [a, b] = [b, a];
    const diff = daysBetween(a, b); const off = (weekday(a) - Math.round(v.w) + 7) % 7; const touched = Math.floor((off + diff) / 7) + 1;
    return { head: ['Weeks between', `${Math.floor(diff / 7)} wk ${diff % 7} d`], rows: [['Decimal weeks', num(diff / 7, 2)], ['Workweeks touched, both dates included', num(touched)], ['Overtime check', 'Each workweek on its own']] };
  },
});
