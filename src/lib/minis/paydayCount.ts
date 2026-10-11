/** Biweekly paydays in 2026 from the first payday's date in January. */
import { paydays } from '../engine/calendar';
import type { MiniSpec } from '../mini-types';
export default (): MiniSpec => ({
  title: 'How many biweekly paychecks in 2026?',
  cta: 'See every payday',
  inputs: [{ id: 'd', label: 'First payday in January 2026', def: 2, options: Array.from({ length: 14 }, (_, i) => ({ value: String(i + 1), label: new Date(Date.UTC(2026, 0, i + 1)).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' }) })) }],
  run: (v) => { const iso = `2026-01-${String(v.d).padStart(2, '0')}`; const raw = paydays(2026, 'biweekly', iso, false); return { head: ['Paydays in 2026', String(raw.length)], rows: [['Last payday', raw[raw.length - 1]], ['Months with three checks', String(new Set(raw.map((d) => d.slice(0, 7)).filter((m, _i, a) => a.filter((x) => x === m).length === 3)).size)]] }; },
});
