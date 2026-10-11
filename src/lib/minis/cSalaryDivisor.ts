/** Annual salary to an hourly rate: 2,080 scheduled hours against the OPM 2,087-hour divisor. */
import P from '../../data/params-2026.json';
import { salaryToHourly, salaryToHourlyOpm } from '../engine/pay';
import { usd } from '../fmt';
import type { MiniSpec } from '../mini-types';
export default (): MiniSpec => {
  const F = P.federal;
  return {
    title: 'One salary, two hourly rates',
    cta: 'Change the hours and weeks',
    inputs: [{ id: 'a', label: 'Annual salary', def: 55000, unit: '$', max: 10000000 }],
    run: (v) => {
      const std = salaryToHourly(v.a, F.weeklyOvertimeAfter, 52);
      const opm = salaryToHourlyOpm(v.a, F.opmHourlyDivisor);
      return { head: [`Hourly over ${F.fullTimeHoursYear.toLocaleString('en-US')} hours`, usd(std, 2)], rows: [[`Federal divisor ${F.opmHourlyDivisor.toLocaleString('en-US')} hours`, usd(opm, 2)], ['Difference per hour', usd(std - opm, 2)], ['Weekly equivalent', usd(v.a / 52, 2)]] };
    },
  };
};
