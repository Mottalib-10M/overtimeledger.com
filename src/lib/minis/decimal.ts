/** Minutes to decimal hours. */
import { num } from '../fmt';
import type { MiniSpec } from '../mini-types';
export default (): MiniSpec => ({
  title: 'Minutes to decimal hours',
  cta: 'Convert a full week',
  inputs: [{ id: 'h', label: 'Hours', def: 7, unit: 'h', max: 1000 }, { id: 'm', label: 'Minutes', def: 40, unit: 'min', max: 59 }],
  run: (v) => ({ head: ['Decimal hours', num(v.h + v.m / 60, 2)], rows: [['Minutes ÷ 60', num(v.m / 60, 4)], ['Total minutes', num(v.h * 60 + v.m)]] }),
});
