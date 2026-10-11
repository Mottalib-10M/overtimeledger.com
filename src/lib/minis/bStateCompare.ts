/** One long day compared under the federal rule and the four daily overtime states. */
import P from '../../data/params-2026.json';
import { splitWeek, type StateRule } from '../engine/overtime';
import { num, usd } from '../fmt';
import type { MiniSpec } from '../mini-types';
const KEYS = ['california', 'alaska', 'nevada', 'colorado'] as const;
export default (): MiniSpec => ({
  title: 'The same day in four daily overtime states',
  cta: 'Split a whole week by state',
  inputs: [{ id: 'h', label: 'Hours worked in the day', def: 13, unit: 'h', max: 24, decimals: 2 }, { id: 'r', label: 'Hourly rate', def: 17, unit: '$/h', max: 1000, decimals: 2 }],
  run: (v) => {
    const all = P.states as unknown as Record<string, StateRule>;
    const pay = (k: string) => { const d = splitWeek([v.h, 0, 0, 0, 0, 0, 0], all[k], v.r).days[0]; return { d, p: d.reg * v.r + d.ot * v.r * 1.5 + d.dt * v.r * 2 }; };
    const best = KEYS.map((k) => ({ k, ...pay(k) })).sort((a, b) => b.p - a.p)[0];
    return { head: [`Best paid: ${all[best.k].name}`, usd(best.p, 2)], rows: KEYS.map((k) => { const { d, p } = pay(k); return [all[k].name, `${usd(p, 2)} (${num(d.ot + d.dt, 2)} h premium)`] as [string, string]; }), note: `Federal rule alone: ${usd(pay('federal').p, 2)}, as one day cannot reach the weekly threshold.` };
  },
});
