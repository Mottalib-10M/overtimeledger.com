/** Colorado paid rest periods for a shift (COMPS Order #40, Rule 5 table) and the meal period trigger. */
import P from '../../data/params-2026.json';
import type { MiniSpec } from '../mini-types';
export default (): MiniSpec => {
  const co = P.states.colorado;
  return {
    title: 'Colorado rest and meal periods for one shift',
    cta: 'Count the week in the Colorado calculator',
    inputs: [{ id: 'h', label: 'Shift length', def: 9, unit: 'h', max: 24, decimals: 2 }],
    run: (v) => {
      const row = co.restTable.find(([upTo]) => v.h <= upTo) ?? co.restTable[co.restTable.length - 1];
      const n = v.h > 0 ? row[1] : 0;
      return { head: ['Paid rest periods', String(n)], rows: [['Paid rest time', `${n * co.restMinutesPer4h} min`], ['Meal period', v.h > co.mealAfterHours ? `${co.mealMinutes} min owed (shift over ${co.mealAfterHours} h)` : 'Not triggered']], note: `The meal period applies past ${co.mealAfterHours} consecutive hours of work; rest breaks are paid time.` };
    },
  };
};
