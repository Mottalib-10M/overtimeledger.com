/** California paid sick leave: 1 hour per 30 worked. */
import P from '../../data/params-2026.json';
import { accruedPerHours } from '../engine/pto';
import { num } from '../fmt';
import type { MiniSpec } from '../mini-types';
export default (): MiniSpec => {
  const s = P.states.california.sickLeave;
  return {
    title: 'California sick hours earned',
    cta: 'Track the balance',
    inputs: [{ id: 'h', label: 'Hours worked', def: 600, unit: 'h', max: 100000 }],
    run: (v) => ({ head: ['Sick leave accrued', `${num(accruedPerHours(v.h, s.accrueOneHourPer), 2)} h`], rows: [['Rate', `1 h per ${s.accrueOneHourPer} h`], ['Usable each year, at least', `${s.useAtLeastHours} h or ${s.useAtLeastDays} days`]] }),
  };
};
