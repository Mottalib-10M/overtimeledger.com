/** Working days and hours left in 2026 after federal holidays and the employee's own days off. */
import { businessDaysBetween } from '../engine/calendar';
import { num } from '../fmt';
import type { MiniSpec } from '../mini-types';
export default (): MiniSpec => ({
  title: 'Your working year in 2026',
  cta: 'Count working days between any two dates',
  inputs: [{ id: 'h', label: 'Hours per working day', def: 8, unit: 'h', max: 24, decimals: 2 }, { id: 'o', label: 'Vacation and personal days taken', def: 10, unit: 'days', max: 250 }],
  run: (v) => { const y = businessDaysBetween('2026-01-01', '2026-12-31'); const days = Math.max(0, y.business - Math.round(v.o)); return { head: ['Days actually worked', num(days)], rows: [['Hours worked in the year', num(days * v.h, 2)], ['Weekdays in 2026', num(y.business + y.holidays)], ['Observed federal holidays on weekdays', num(y.holidays)]] }; },
});
