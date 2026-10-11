/** One salary paid semimonthly or biweekly: amount and full-time hours behind each check. */
import P from '../../data/params-2026.json';
import { perPaycheck } from '../engine/pay';
import { usd, num } from '../fmt';
import type { MiniSpec } from '../mini-types';
export default (): MiniSpec => ({
  title: 'Semimonthly or biweekly check for one salary',
  cta: 'Count the pay periods of the year',
  inputs: [{ id: 'a', label: 'Annual salary', def: 58000, unit: '$', max: 10000000 }],
  run: (v) => { const s = perPaycheck(v.a, 'semimonthly'); const b = perPaycheck(v.a, 'biweekly'); const H = P.federal.fullTimeHoursYear; return { head: ['Semimonthly check', usd(s, 2)], rows: [['Biweekly check', usd(b, 2)], ['Gap per check', usd(s - b, 2)], ['Full-time hours behind each check', `${num(H / 24, 2)} h vs ${num(H / 26, 2)} h`]] }; },
});
