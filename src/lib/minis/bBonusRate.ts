/** Time and a half with a weekly nondiscretionary bonus: the bonus raises the regular rate (Fact Sheet #23). */
import P from '../../data/params-2026.json';
import { salariedHalfTime } from '../engine/pay';
import { num, usd } from '../fmt';
import type { MiniSpec } from '../mini-types';
export default (): MiniSpec => {
  const F = P.federal;
  return {
    title: 'Time and a half with a weekly bonus',
    cta: 'Open the time and a half calculator',
    inputs: [{ id: 'r', label: 'Hourly wage', def: 20, unit: '$/h', max: 1000, decimals: 2 }, { id: 'h', label: 'Hours in the workweek', def: 46, unit: 'h', max: 168, decimals: 2 }, { id: 'b', label: 'Bonus earned that week', def: 92, unit: '$', max: 100000, decimals: 2 }],
    run: (v) => {
      const s = salariedHalfTime(v.r * v.h + v.b, v.h, F.weeklyOvertimeAfter);
      const plain = v.r * F.overtimeMultiplier;
      return { head: ['Gross for the week', usd(s.total, 2)], rows: [['Regular rate with the bonus', usd(s.regularRate, 2)], ['Overtime rate (1.5x regular rate)', usd(s.regularRate * F.overtimeMultiplier, 2)], ['Overtime rate on the wage alone', usd(plain, 2)], ['Overtime hours', num(s.otHours, 2)]] };
    },
  };
};
