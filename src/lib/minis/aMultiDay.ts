/** Elapsed time from a start clock time to an end clock time a number of days later. */
import { parseClock, hm } from '../engine/time';
import { num } from '../fmt';
import type { MiniSpec } from '../mini-types';
const clock = (n: number) => parseClock(String(Math.max(0, Math.min(2400, Math.round(n)))).padStart(3, '0')) ?? 0;
export default (): MiniSpec => ({
  title: 'Elapsed time over several days',
  cta: 'Measure between two dates',
  inputs: [{ id: 'a', label: 'Start, 24-hour clock', def: 1800, max: 2400 }, { id: 'd', label: 'Days later', def: 2, unit: 'days', max: 365 }, { id: 'b', label: 'End, 24-hour clock', def: 715, max: 2400 }],
  run: (v) => { const total = Math.max(0, Math.round(v.d) * 1440 + clock(v.b) - clock(v.a)); const days = Math.floor(total / 1440); const rest = total % 1440; return { head: ['Elapsed', `${days} d ${hm(rest)}`], rows: [['Total hours and minutes', hm(total)], ['Decimal hours', num(total / 60, 2)], ['Total minutes', num(total)]] }; },
});
