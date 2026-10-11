/** FLSA salary level test ($684 a week) and the California level. */
import P from '../../data/params-2026.json';
import { usd } from '../fmt';
import type { MiniSpec } from '../mini-types';
export default (): MiniSpec => ({
  title: 'Does a salary reach the exempt level?',
  cta: 'Convert the salary to an hourly rate',
  inputs: [{ id: 'a', label: 'Annual salary', def: 42000, unit: '$', max: 10000000 }],
  run: (v) => { const ca = P.states.california.exemptSalaryMultiple * P.states.california.minimumWage * P.federal.fullTimeHoursYear; return { head: ['Weekly salary', usd(v.a / 52, 2)], rows: [[`Federal level ${usd(P.federal.exemptSalaryWeekly)}/week`, v.a / 52 >= P.federal.exemptSalaryWeekly ? 'reached' : 'not reached'], [`California level ${usd(ca)}/year`, v.a >= ca ? 'reached' : 'not reached']], note: 'The salary is one test; the job duties must also qualify.' }; },
});
