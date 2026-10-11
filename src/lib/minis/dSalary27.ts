/** A yearly salary split over 26 or 27 biweekly paychecks (pay years with an extra payday). */
import { perPaycheck } from '../engine/pay';
import { usd } from '../fmt';
import type { MiniSpec } from '../mini-types';
export default (): MiniSpec => ({
  title: 'Salary over 26 or 27 biweekly checks',
  cta: 'Compare every pay frequency',
  inputs: [{ id: 'a', label: 'Annual salary', def: 65000, unit: '$', max: 10000000 }],
  run: (v) => { const n = perPaycheck(v.a, 'biweekly'); const x = perPaycheck(v.a, 'biweekly', 27); return { head: ['Each check over 27 periods', usd(x, 2)], rows: [['Each check over 26 periods', usd(n, 2)], ['Smaller by', usd(n - x, 2)], ['Paid over 27 checks if not divided again', usd(n * 27, 2)]], note: 'Whether the salary is divided by 27 or a 27th check is added is the employer’s pay policy.' }; },
});
