/** California seventh consecutive day: hours that day after six worked days (DLSE, Labor Code 510). */
import P from '../../data/params-2026.json';
import { splitWeek, type StateRule } from '../engine/overtime';
import { num, usd } from '../fmt';
import type { MiniSpec } from '../mini-types';
export default (): MiniSpec => {
  const rule = P.states.california as unknown as StateRule;
  return {
    title: 'California seventh consecutive day',
    cta: 'Run the full double time calculator',
    inputs: [{ id: 'd', label: 'Hours on each of the first six days', def: 6, unit: 'h', max: 24, decimals: 2 }, { id: 'h', label: 'Hours on the seventh day', def: 10, unit: 'h', max: 24, decimals: 2 }, { id: 'r', label: 'Hourly rate', def: 22, unit: '$/h', max: 1000, decimals: 2 }],
    run: (v) => {
      const s = splitWeek([v.d, v.d, v.d, v.d, v.d, v.d, v.h], rule, v.r);
      const d7 = s.days[6];
      return { head: ['Seventh day pay', usd(d7.reg * v.r + d7.ot * v.r * 1.5 + d7.dt * v.r * 2, 2)], rows: [['Seventh day at 1.5x', `${num(d7.ot, 2)} h`], ['Seventh day at 2x', `${num(d7.dt, 2)} h`], ['Double time hours in the week', `${num(s.dt, 2)} h`]], note: v.d > 0 && v.h > 0 ? 'All seven days worked: the seventh day rule applies.' : 'A day off breaks the run: no seventh day premium.' };
    },
  };
};
