/** Hours between a start and an end typed on the 24-hour clock, overnight included, minus an unpaid break. */
import { parseClock, shiftMinutes, hm, minutesToDecimal, to12h } from '../engine/time';
import { num } from '../fmt';
import type { MiniSpec } from '../mini-types';
const clock = (n: number) => parseClock(String(Math.max(0, Math.min(2400, Math.round(n)))).padStart(3, '0'));
export default (): MiniSpec => ({
  title: 'Hours between two times, night shifts included',
  cta: 'Open the full hours calculator',
  inputs: [{ id: 'a', label: 'Start, 24-hour clock (2200 = 10 PM)', def: 2200, max: 2400 }, { id: 'b', label: 'End, 24-hour clock (0630 = 6:30 AM)', def: 630, max: 2400 }, { id: 'u', label: 'Unpaid meal break', def: 30, unit: 'min', max: 240 }],
  run: (v) => { const a = clock(v.a) ?? 0; const b = clock(v.b) ?? 0; const s = shiftMinutes(a, b, v.u, 0); return { head: ['Hours worked', `${hm(s.minutes)} (${num(minutesToDecimal(s.minutes), 2)} h)`], rows: [['From', to12h(a)], ['To', `${to12h(b)}${s.overnight ? ', next day' : ''}`], ['Before the break', hm(s.gross)]] }; },
});
