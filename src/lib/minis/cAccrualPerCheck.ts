/** Vacation days a year to hours accrued per paycheck and per hour worked. */
import P from '../../data/params-2026.json';
import { accrualPerPeriod, daysToHours } from '../engine/pto';
import { num } from '../fmt';
import type { MiniSpec } from '../mini-types';
const FREQ = [52, 26, 24, 12];
const NAME = ['weekly', 'biweekly', 'semimonthly', 'monthly'];
export default (): MiniSpec => ({
  title: 'Days a year to hours per paycheck',
  cta: 'Project the balance with a cap',
  inputs: [
    { id: 'd', label: 'PTO days per year', def: 15, unit: 'days', max: 365, decimals: 1 },
    { id: 'f', label: 'Pay frequency', def: 1, options: NAME.map((n, i) => ({ value: String(i), label: `${n[0].toUpperCase()}${n.slice(1)} (${FREQ[i]})` })) },
  ],
  run: (v) => {
    const yearly = daysToHours(v.d, 8);
    const i = Math.max(0, Math.min(3, Math.round(v.f)));
    return { head: ['Hours per paycheck', num(accrualPerPeriod(yearly, FREQ[i]), 2)], rows: [['Hours a year at 8 a day', num(yearly, 1)], [`Per hour worked (${P.federal.fullTimeHoursYear.toLocaleString('en-US')} h)`, num(yearly / P.federal.fullTimeHoursYear, 4)], ['Paychecks a year', String(FREQ[i])]] };
  },
});
