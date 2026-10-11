/** Where a punch lands under 5, 6 and 15-minute rounding (29 CFR 785.48(b)). */
import { roundTo } from '../engine/time';
import type { MiniSpec } from '../mini-types';
const t = (m: number) => `:${String(((m % 60) + 60) % 60).padStart(2, '0')}${m % 60 === 0 && m > 0 ? ' (next hour)' : ''}`;
export default (): MiniSpec => ({
  title: 'Round one punch',
  cta: 'Round a whole shift',
  inputs: [{ id: 'm', label: 'Minutes past the hour on the punch', def: 7, unit: 'min', max: 59 }],
  run: (v) => { const m = Math.min(59, Math.max(0, Math.round(v.m))); const q = roundTo(m, 15); return { head: ['Quarter-hour rounding', t(q)], rows: [['Nearest 5 minutes', t(roundTo(m, 5))], ['Nearest tenth (6 min)', t(roundTo(m, 6))], ['Minutes gained or lost (quarter)', `${q - m > 0 ? '+' : ''}${q - m}`]] }; },
});
