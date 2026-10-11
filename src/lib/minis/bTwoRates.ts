/** Two rates in one workweek: weighted average regular rate and half-time premium (29 CFR 778.115). */
import P from '../../data/params-2026.json';
import { weightedOvertime } from '../engine/pay';
import { num, usd } from '../fmt';
import type { MiniSpec } from '../mini-types';
export default (): MiniSpec => ({
  title: 'Regular rate with two jobs at two rates',
  cta: 'Open the full regular rate calculator',
  inputs: [{ id: 'a', label: 'Hours at rate A', def: 30, unit: 'h', max: 168, decimals: 2 }, { id: 'ra', label: 'Rate A', def: 18, unit: '$/h', max: 1000, decimals: 2 }, { id: 'b', label: 'Hours at rate B', def: 15, unit: 'h', max: 168, decimals: 2 }, { id: 'rb', label: 'Rate B', def: 24, unit: '$/h', max: 1000, decimals: 2 }],
  run: (v) => {
    const w = weightedOvertime([{ hours: v.a, rate: v.ra }, { hours: v.b, rate: v.rb }], P.federal.weeklyOvertimeAfter);
    return { head: ['Regular rate', usd(w.regularRate, 2)], rows: [['Straight-time pay', usd(w.straight, 2)], ['Overtime hours', num(w.otHours, 2)], ['Half-time premium', usd(w.premium, 2)], ['Total for the week', usd(w.total, 2)]] };
  },
});
