/** A quoted hourly rate against the hours really worked: what a contractor earns per hour at the desk. */
import { usd, num } from '../fmt';
import type { MiniSpec } from '../mini-types';
export default (): MiniSpec => ({
  title: 'Your quoted rate per hour actually worked',
  cta: 'Set a rate from your target income',
  inputs: [
    { id: 'r', label: 'Rate you bill', def: 75, unit: '$/h', max: 10000, decimals: 2 },
    { id: 'b', label: 'Billable hours a week', def: 25, unit: 'h', max: 100, decimals: 1 },
    { id: 't', label: 'Total hours worked a week', def: 40, unit: 'h', max: 120, decimals: 1 },
  ],
  run: (v) => {
    const t = Math.max(v.t, v.b);
    const weekly = v.r * v.b;
    return { head: ['Earned per hour worked', usd(t > 0 ? weekly / t : 0, 2)], rows: [['Billed each week', usd(weekly, 2)], ['Billable share of your time', `${num(t > 0 ? (v.b / t) * 100 : 0, 0)}%`], ['Unbilled hours a week', num(t - v.b, 1)]], note: 'Before business costs and self-employment taxes.' };
  },
});
