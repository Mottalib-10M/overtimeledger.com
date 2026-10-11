/** A biweekly time card: overtime counted week by week (FLSA) against a two-week average that is not allowed. */
import P from '../../data/params-2026.json';
import { splitWeek, type StateRule } from '../engine/overtime';
import { num, usd } from '../fmt';
import type { MiniSpec } from '../mini-types';
export default (): MiniSpec => ({
  title: 'Two weeks on one timesheet',
  cta: 'Fill the two-week timesheet',
  inputs: [{ id: 'w1', label: 'Hours in week 1', def: 50, unit: 'h', max: 168, decimals: 2 }, { id: 'w2', label: 'Hours in week 2', def: 30, unit: 'h', max: 168, decimals: 2 }, { id: 'r', label: 'Hourly rate', def: 20, unit: '$/h', max: 1000, decimals: 2 }],
  run: (v) => { const rule = P.states.federal as unknown as StateRule; const m = P.federal.overtimeMultiplier; const a = splitWeek([v.w1, 0, 0, 0, 0, 0, 0], rule); const b = splitWeek([v.w2, 0, 0, 0, 0, 0, 0], rule); const ot = a.ot + b.ot; const pay = (a.reg + b.reg) * v.r + ot * v.r * m; return { head: ['Overtime hours owed', num(ot, 2)], rows: [['Week 1 overtime', num(a.ot, 2)], ['Week 2 overtime', num(b.ot, 2)], ['Gross for the two weeks', usd(pay, 2)]], note: `All ${num(v.w1 + v.w2, 2)} hours at straight time would come to ${usd((v.w1 + v.w2) * v.r, 2)}; the FLSA measures each workweek alone, never an average.` }; },
});
