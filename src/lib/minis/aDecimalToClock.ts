/** Decimal hours back to hours and minutes. */
import { decimalToMinutes, hm } from '../engine/time';
import { num } from '../fmt';
import type { MiniSpec } from '../mini-types';
export default (): MiniSpec => ({
  title: 'Decimal hours back to minutes',
  cta: 'Convert both ways',
  inputs: [{ id: 'd', label: 'Decimal hours', def: 7.3, unit: 'h', max: 1000, decimals: 2 }],
  run: (v) => { const m = decimalToMinutes(v.d); return { head: ['Hours and minutes', hm(m)], rows: [['Total minutes', num(m)], ['Fraction of an hour', `${num((v.d % 1) * 60, 1)} min`]] }; },
});
