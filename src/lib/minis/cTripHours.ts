/** Will the PTO balance cover a trip? Balance at departure, hours the trip takes, hours left. */
import { projectBalance, daysToHours } from '../engine/pto';
import { num } from '../fmt';
import type { MiniSpec } from '../mini-types';
export default (): MiniSpec => ({
  title: 'Enough PTO for the trip?',
  cta: 'Plan the balance in detail',
  inputs: [
    { id: 'b', label: 'PTO balance today', def: 40, unit: 'h', max: 2000, decimals: 2 },
    { id: 'a', label: 'Hours added each paycheck', def: 4.62, unit: 'h', max: 100, decimals: 2 },
    { id: 'p', label: 'Paychecks before you leave', def: 5, max: 60 },
    { id: 'd', label: 'Workdays off for the trip', def: 8, max: 60 },
  ],
  run: (v) => {
    const at = projectBalance({ start: v.b, perPeriod: v.a, periods: v.p }).balance;
    const need = daysToHours(v.d, 8);
    const left = at - need;
    return { head: [left >= 0 ? 'Hours left after the trip' : 'Hours short', num(Math.abs(left), 2)], rows: [['Balance on departure', `${num(at, 2)} h`], ['Hours the trip uses (8 a day)', `${num(need, 2)} h`]], note: 'Weekends and paid holidays inside the trip do not use PTO.' };
  },
});
