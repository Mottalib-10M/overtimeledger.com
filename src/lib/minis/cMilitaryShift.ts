/** Length of a shift written in military time, overnight included. */
import { parseClock, span, to12h, hm, minutesToDecimal } from '../engine/time';
import { num } from '../fmt';
import type { MiniSpec } from '../mini-types';
const read = (n: number) => parseClock(String(Math.max(0, Math.min(2400, Math.round(n)))).padStart(4, '0'));
export default (): MiniSpec => ({
  title: 'A shift in military time',
  cta: 'Convert any time',
  inputs: [{ id: 'a', label: 'Start (four digits, e.g. 1900)', def: 1900, max: 2400 }, { id: 'b', label: 'End (four digits, e.g. 0730)', def: 730, max: 2400 }],
  run: (v) => {
    const a = read(v.a); const b = read(v.b);
    if (a === null || b === null) return { head: ['Shift length', 'Check the times'], rows: [['Minutes must be 00 to 59', '']] };
    const m = span(a, b);
    return { head: ['Shift length', hm(m)], rows: [['Start', to12h(a)], ['End', `${to12h(b)}${b <= a ? ' (next day)' : ''}`], ['Decimal hours', num(minutesToDecimal(m), 2)]] };
  },
});
