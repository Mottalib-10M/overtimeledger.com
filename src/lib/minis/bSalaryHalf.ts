/** Nonexempt weekly salary covering all hours: regular rate and half-time extra (Fact Sheet #23). */
import P from '../../data/params-2026.json';
import { salariedHalfTime } from '../engine/pay';
import { num, usd } from '../fmt';
import type { MiniSpec } from '../mini-types';
export default (): MiniSpec => ({
  title: 'Overtime on a weekly salary',
  cta: 'Open the salaried overtime calculator',
  inputs: [{ id: 's', label: 'Weekly salary', def: 620, unit: '$', max: 100000, decimals: 2 }, { id: 'h', label: 'Hours worked that week', def: 48, unit: 'h', max: 168, decimals: 2 }],
  run: (v) => {
    const s = salariedHalfTime(v.s, v.h, P.federal.weeklyOvertimeAfter);
    return { head: ['Overtime owed on top', usd(s.extra, 2)], rows: [['Regular rate this week', usd(s.regularRate, 2)], ['Overtime hours', num(s.otHours, 2)], ['Total pay', usd(s.total, 2)], ['Below the exempt salary level', v.s < P.federal.exemptSalaryWeekly ? 'Yes' : 'No']] };
  },
});
