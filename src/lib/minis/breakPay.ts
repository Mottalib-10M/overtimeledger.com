/** Is a break paid under the federal hours-worked rules? */
import P from '../../data/params-2026.json';
import { num } from '../fmt';
import type { MiniSpec } from '../mini-types';
export default (): MiniSpec => ({
  title: 'Paid or unpaid break? (federal rule)',
  cta: 'Count a shift with its breaks',
  inputs: [{ id: 's', label: 'Shift from in to out', def: 8.5, unit: 'h', max: 24, decimals: 2 }, { id: 'b', label: 'Break length', def: 15, unit: 'min', max: 240 }],
  run: (v) => { const H = P.hoursWorked; const unpaid = v.b >= H.mealUnpaidMinMinutes; const paid = v.s - (unpaid ? v.b / 60 : 0); return { head: ['Hours to pay', num(paid, 2)], rows: [['Break treatment', unpaid ? 'Meal period, unpaid if fully relieved' : v.b <= H.restPaidMaxMinutes ? 'Rest break, counts as work' : 'Between 20 and 30 min: treat as paid unless relieved for a meal']] }; },
});
