/** Nevada: does daily overtime apply at this rate? */
import P from '../../data/params-2026.json';
import { usd } from '../fmt';
import type { MiniSpec } from '../mini-types';
export default (): MiniSpec => {
  const nv = P.states.nevada; const lim = nv.minimumWage * nv.dailyOtOnlyBelowMultipleOfMinimum;
  return {
    title: 'Nevada daily overtime test',
    cta: 'Run a full Nevada week',
    inputs: [{ id: 'r', label: 'Your hourly rate', def: 16.5, unit: '$/h', max: 1000, decimals: 2 }],
    run: (v) => ({ head: ['Daily overtime after 8 hours', v.r < lim ? 'Yes' : 'No'], rows: [['Limit (1.5 × minimum wage)', usd(lim, 2)], ['Weekly overtime after 40 hours', 'Yes, at any rate']] }),
  };
};
