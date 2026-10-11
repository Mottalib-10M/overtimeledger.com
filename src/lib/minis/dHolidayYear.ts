/** Federal holidays of a chosen year: how many move to a Friday or a Monday, and the working days left. */
import { federalHolidays, businessDaysBetween, weekday } from '../engine/calendar';
import { num } from '../fmt';
import type { MiniSpec } from '../mini-types';
export default (): MiniSpec => ({
  title: 'Federal holidays year by year',
  cta: 'Count working days by month',
  inputs: [{ id: 'y', label: 'Year', def: 2027, options: [2026, 2027, 2028, 2029, 2030].map((y) => ({ value: String(y), label: String(y) })) }],
  run: (v) => {
    const y = Math.round(v.y); const list = federalHolidays(y); const moved = list.filter((x) => x.observed !== x.date);
    const sat = moved.filter((x) => weekday(x.date) === 6).length; const r = businessDaysBetween(`${y}-01-01`, `${y}-12-31`);
    return { head: ['Holidays observed on another day', num(moved.length)], rows: [['Saturday holidays, off the Friday before', num(sat)], ['Sunday holidays, off the Monday after', num(moved.length - sat)], [`Working days in ${y}`, num(r.business)]], note: moved.length ? moved.map((x) => x.name).join(', ') : 'Every holiday falls on a weekday.' };
  },
});
