/** Two durations in hours and minutes: their sum and their difference, carrying 60 minutes. */
import { sumDurations, splitSeconds } from '../engine/time';
import { num } from '../fmt';
import type { MiniSpec } from '../mini-types';
const show = (sec: number) => { const s = splitSeconds(sec); return `${s.neg ? '-' : ''}${s.h}:${String(s.m).padStart(2, '0')}`; };
export default (): MiniSpec => ({
  title: 'Add or subtract two durations',
  cta: 'Add a whole list of times',
  inputs: [{ id: 'h1', label: 'First duration, hours', def: 7, unit: 'h', max: 999 }, { id: 'm1', label: 'First duration, minutes', def: 48, unit: 'min', max: 59 }, { id: 'h2', label: 'Second duration, hours', def: 5, unit: 'h', max: 999 }, { id: 'm2', label: 'Second duration, minutes', def: 35, unit: 'min', max: 59 }],
  run: (v) => { const sum = sumDurations([{ h: v.h1, m: v.m1 }, { h: v.h2, m: v.m2 }]); const diff = sumDurations([{ h: v.h1, m: v.m1 }, { h: v.h2, m: v.m2, sign: -1 }]); return { head: ['Sum', show(sum)], rows: [['Difference (first minus second)', show(diff)], ['Sum in decimal hours', num(splitSeconds(sum).decimal, 2)]] }; },
});
