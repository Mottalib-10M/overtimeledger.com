/** Hours a week to hours and pay a year. */
import { usd, num } from '../fmt';
import type { MiniSpec } from '../mini-types';
export default (): MiniSpec => ({
  title: 'From a weekly schedule to a year',
  cta: 'Open the salary calculator',
  inputs: [{ id: 'h', label: 'Hours per week', def: 40, unit: 'h', max: 100, decimals: 1 }, { id: 'r', label: 'Hourly rate', def: 20, unit: '$/h', max: 1000, decimals: 2 }],
  run: (v) => ({ head: ['Yearly pay (52 weeks)', usd(v.h * v.r * 52)], rows: [['Hours a year', num(v.h * 52)], ['Monthly average', usd((v.h * v.r * 52) / 12)]] }),
});
