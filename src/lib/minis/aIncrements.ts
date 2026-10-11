/** One day's minutes entered in payroll as hundredths, tenths or quarters of an hour. */
import { roundTo } from '../engine/time';
import { num } from '../fmt';
import type { MiniSpec } from '../mini-types';
export default (): MiniSpec => ({
  title: 'Hundredths, tenths or quarters',
  cta: 'Convert a whole pay period',
  inputs: [{ id: 'h', label: 'Hours', def: 8, unit: 'h', max: 24 }, { id: 'm', label: 'Minutes', def: 22, unit: 'min', max: 59 }],
  run: (v) => { const t = Math.round(v.h) * 60 + Math.min(59, Math.round(v.m)); const tenth = roundTo(t, 6); const q = roundTo(t, 15); return { head: ['Hundredths (exact to the minute)', num(t / 60, 2)], rows: [['Tenths (6-minute steps)', `${num(tenth / 60, 1)} (${tenth - t >= 0 ? '+' : ''}${tenth - t} min)`], ['Quarters (15-minute steps)', `${num(q / 60, 2)} (${q - t >= 0 ? '+' : ''}${q - t} min)`]] }; },
});
