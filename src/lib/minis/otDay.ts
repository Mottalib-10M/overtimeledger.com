/** Hours worked in one day under a state's daily rule (arg: rule key). */
import P from '../../data/params-2026.json';
import { splitWeek, type StateRule } from '../engine/overtime';
import { num, usd } from '../fmt';
import type { MiniSpec } from '../mini-types';
export default (arg?: string): MiniSpec => {
  const key = (arg ? JSON.parse(arg) : 'california') as string;
  const rule = (P.states as unknown as Record<string, StateRule>)[key];
  return {
    title: `One long day in ${rule.name}: how the hours split`,
    cta: 'Open the full weekly time card',
    inputs: [{ id: 'h', label: 'Hours worked that day', def: key === 'colorado' ? 13 : 11, unit: 'h', max: 24, decimals: 2 }, { id: 'r', label: 'Hourly rate', def: 18, unit: '$/h', max: 1000, decimals: 2 }],
    run: (v) => { const s = splitWeek([v.h, 0, 0, 0, 0, 0, 0], rule, v.r).days[0]; const pay = s.reg * v.r + s.ot * v.r * 1.5 + s.dt * v.r * 2; return { head: ['Pay for the day', usd(pay, 2)], rows: [['Regular', `${num(s.reg, 2)} h`], ['Overtime 1.5x', `${num(s.ot, 2)} h`], ['Double time 2x', `${num(s.dt, 2)} h`]], note: `Same day under the federal rule alone: ${usd(v.h * v.r, 2)}, no overtime until 40 hours in the week.` }; },
  };
};
