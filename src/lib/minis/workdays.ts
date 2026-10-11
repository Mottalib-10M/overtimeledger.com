/** Working days in a month of 2026, federal holidays removed. */
import { workingDaysByMonth } from '../engine/calendar';
import type { MiniSpec } from '../mini-types';
const M = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export default (): MiniSpec => ({
  title: 'Working days in a month of 2026',
  cta: 'Count any two dates',
  inputs: [{ id: 'm', label: 'Month', def: 7, options: M.map((x, i) => ({ value: String(i + 1), label: x })) }],
  run: (v) => { const r = workingDaysByMonth(2026)[v.m - 1]; return { head: [`${M[v.m - 1]} 2026`, `${r.business} days`], rows: [['Weekdays', String(r.weekdays)], ['Federal holidays on weekdays', String(r.holidays)], ['Hours at 8 a day', String(r.business * 8)]] }; },
});
