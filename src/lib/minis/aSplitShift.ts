/** Two pairs of punches in one day: hours on the clock, and the gap between the pairs. */
import { parseClock, span, hm, minutesToDecimal } from '../engine/time';
import { num } from '../fmt';
import type { MiniSpec } from '../mini-types';
const clock = (n: number) => parseClock(String(Math.max(0, Math.min(2400, Math.round(n)))).padStart(3, '0')) ?? 0;
export default (): MiniSpec => ({
  title: 'Two punch pairs in one day',
  cta: 'Enter every punch of the day',
  inputs: [{ id: 'a', label: 'In, 24-hour clock', def: 700, max: 2400 }, { id: 'b', label: 'Out', def: 1130, max: 2400 }, { id: 'c', label: 'Back in', def: 1615, max: 2400 }, { id: 'd', label: 'Out for the day', def: 1945, max: 2400 }],
  run: (v) => { const p1 = span(clock(v.a), clock(v.b)); const gap = span(clock(v.b), clock(v.c)); const p2 = span(clock(v.c), clock(v.d)); const t = p1 + p2; return { head: ['Time on the clock', `${hm(t)} (${num(minutesToDecimal(t), 2)} h)`], rows: [['First pair', hm(p1)], ['Gap off the clock', hm(gap)], ['Second pair', hm(p2)]] }; },
});
