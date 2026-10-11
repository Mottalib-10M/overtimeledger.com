/** California paid sick leave over time: weeks to earn the usable minimum and weeks to hit the lowest allowed cap. */
import P from '../../data/params-2026.json';
import { accruedPerHours, projectBalance } from '../engine/pto';
import { num } from '../fmt';
import type { MiniSpec } from '../mini-types';
export default (): MiniSpec => {
  const s = P.states.california.sickLeave;
  return {
    title: 'When the sick leave balance tops out',
    cta: 'Track a sick leave balance',
    inputs: [{ id: 'h', label: 'Hours worked per week', def: 32, unit: 'h', max: 100, decimals: 1 }, { id: 'u', label: 'Sick hours used per year', def: 0, unit: 'h', max: 200 }],
    run: (v) => {
      const per = accruedPerHours(Math.max(0, v.h), s.accrueOneHourPer); const used = Math.max(0, v.u) / 52;
      const r = projectBalance({ start: 0, perPeriod: per, periods: 520, usedPerPeriod: used, cap: s.accrualCapHours });
      const toUse = per > 0 ? Math.ceil(s.useAtLeastHours / per) : 0;
      return { head: ['Sick hours earned per year', num(per * 52, 2)], rows: [[`Weeks to earn ${s.useAtLeastHours} hours`, per > 0 ? num(toUse) : 'never'], [`Weeks to reach an ${s.accrualCapHours}-hour cap`, r.capAt !== null && per > 0 ? num(r.capAt) : 'not within 10 years'], ['Accrual rate', `1 h per ${s.accrueOneHourPer} h worked`]], note: `Accrual pauses at the cap your employer sets, which cannot be lower than ${s.accrualCapHours} hours or ${s.accrualCapDays} days.` };
    },
  };
};
