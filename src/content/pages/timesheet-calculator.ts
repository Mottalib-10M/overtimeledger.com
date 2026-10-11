import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const F = K.F;
const rate = 20;
const wk1 = K.week([10, 10, 10, 10, 10, 0, 0], 'federal', rate);
const wk2 = K.week([6, 6, 6, 6, 6, 0, 0], 'federal', rate);
const ot = wk1.ot + wk2.ot;
const pay2 = wk1.pay.total + wk2.pay.total;
const flat = (wk1.total + wk2.total) * rate;
// Same fortnight in California, where the daily rule also applies.
const ca1 = K.week([10, 10, 10, 10, 10, 0, 0], 'california', rate);
const ca2 = K.week([6, 6, 6, 6, 6, 0, 0], 'california', rate);
// A fortnight that is even but has one long day: 4 x 8 + 1 x 12 and 4 x 8 + 1 x 4.
const evenA = K.week([8, 8, 8, 8, 12, 0, 0], 'federal', rate);
const evenB = K.week([8, 8, 8, 8, 4, 0, 0], 'federal', rate);
const caEvenA = K.week([8, 8, 8, 8, 12, 0, 0], 'california', rate);

export default definePage({
  id: 'timesheet-calculator',
  group: 'clock',
  order: 70,
  slug: 'timesheet-calculator',
  nav: 'Timesheet calculator',
  card: 'A two-week timesheet with overtime counted workweek by workweek, never averaged over the pay period.',
  title: 'Timesheet Calculator 2026: Biweekly Hours and Overtime',
  description: `Timesheet calculator 2026: fill two weeks of in and out times, get the hours, overtime past ${F.weeklyOvertimeAfter} counted per workweek, never averaged, and the gross pay. Free.`,
  h1: 'Two-week timesheet with overtime per workweek',
  intro: 'Enter the in and out times and breaks of each day for two weeks, choose your state rule and rate; the timesheet totals each week and the pay period.',
  resume: `A biweekly timesheet covers two workweeks, and overtime has to be worked out on each of them separately: under the Fair Labor Standards Act every hour past ${F.weeklyOvertimeAfter} in a workweek earns at least ${K.num(F.overtimeMultiplier, 1)} times the regular rate, and the Department of Labor does not permit averaging hours over two or more weeks (Fact Sheet #23). A pay period of ${K.hrs(wk1.total)} hours followed by ${K.hrs(wk2.total)} hours totals ${K.hrs(wk1.total + wk2.total)}, which looks like two ordinary weeks, yet the first week alone holds ${K.hrs(wk1.ot)} overtime hours. At ${K.usd(rate)} an hour the correct gross is ${K.usd(pay2, 2)}, not the ${K.usd(flat, 2)} that eighty straight-time hours would give, a gap of ${K.usd(pay2 - flat, 2)}. The calculator takes clock times for fourteen days, splits each workweek under the federal rule or the daily rules of California, Alaska, Nevada and Colorado, and prints a timesheet ready to check against the pay stub.`,
  faqs: [
    { q: `My biweekly timesheet shows ${K.hrs(wk1.total + wk2.total)} hours. Can I still be owed overtime?`, a: `Yes, if the hours were uneven. Overtime is counted per workweek, and Fact Sheet #23 says averaging two weeks is not allowed. A split of ${K.hrs(wk1.total)} and ${K.hrs(wk2.total)} hours contains ${K.hrs(wk1.ot)} overtime hours in the first week, worth ${K.usd(wk1.ot * rate * (F.overtimeMultiplier - 1), 2)} in premium at ${K.usd(rate)} an hour on top of straight time. Only an exact ${F.weeklyOvertimeAfter} and ${F.weeklyOvertimeAfter} split is free of overtime.` },
    { q: 'Which day should the first week of my timesheet start on?', a: `On the first day of your employer's workweek, a fixed and recurring period of ${F.workweekHours} hours that may begin on any day and at any hour. It is often Sunday or Monday, but not always. Starting the timesheet on the wrong day can move a long shift into the other week and change the overtime, so ask payroll if the pay stub does not say.` },
    { q: 'How does a two-week timesheet work in California compared with other states?', a: `California adds a daily rule: hours past ${K.ca.dailyOtAfter} in a day are overtime and past ${K.ca.dailyDtAfter} double time, before the weekly ${F.weeklyOvertimeAfter} is applied. A fortnight of four eights plus a twelve-hour day, then four eights plus a four-hour day, has no federal overtime at all but ${K.hrs(caEvenA.ot)} overtime hours in California, all in the first week.` },
    { q: 'What if a workweek is split between two pay periods on a semimonthly payroll?', a: `The workweek still decides the overtime, whatever the pay calendar. Payroll counts every hour of that workweek, including the days that fall after the cut-off, and the overtime only becomes known once the week has closed, so it often appears on the next check. A timesheet laid out by workweek makes this visible; one cut on the 15th and the last day of the month can hide it.` },
    { q: 'Can I fill the timesheet with decimal hours instead of clock times?', a: `The timesheet asks for in and out times because that is what time clocks record and it avoids conversion mistakes. If you only have daily totals in decimal hours, the payroll hours calculator takes them directly. Remember that 7.30 in decimal is 7 hours 18 minutes, not 7 hours 30 minutes, before mixing the two.` },
  ],
  body: (h) => `
${h.mini('aTwoWeeks')}
<h2>The fortnight from the summary, week by week</h2>
<p>The ${h.src('dol_fs23', 'Department of Labor')} treats each workweek as a separate unit, so the first step on any biweekly timesheet is to draw a line between day seven and day eight. Below, the two weeks of the example are split by the engine under the federal rule and, for comparison, under California's rule, at ${h.usd(rate)} an hour.</p>
${h.table(['Week', 'Daily hours', 'Total', 'Regular', 'Overtime', 'Gross (federal)'], [
  ['Week 1', '10, 10, 10, 10, 10', h.hrs(wk1.total), h.hrs(wk1.reg), h.hrs(wk1.ot), h.usd(wk1.pay.total, 2)],
  ['Week 2', '6, 6, 6, 6, 6', h.hrs(wk2.total), h.hrs(wk2.reg), h.hrs(wk2.ot), h.usd(wk2.pay.total, 2)],
  ['<strong>Pay period</strong>', '', h.hrs(wk1.total + wk2.total), h.hrs(wk1.reg + wk2.reg), h.hrs(ot), `<strong>${h.usd(pay2, 2)}</strong>`],
], 'Biweekly timesheet with overtime counted per workweek (federal rule)', ['l', 'l', 'r', 'r', 'r', 'r'])}
<p>The first week's ten-hour days push it ${h.hrs(wk1.ot)} hours over the weekly line, and those hours are paid at ${h.usd(rate * h.F.overtimeMultiplier, 2)}. The second week is short and has no overtime. California would reach the same ${h.hrs(ca1.ot + ca2.ot)} overtime hours here, since every hour past ${h.ca.dailyOtAfter} on those ten-hour days is already overtime by the day, but the route is different and so is the result when the days are uneven.</p>
<p>That second case is in the next table. Both weeks add up to ${h.hrs(evenA.total)} and ${h.hrs(evenB.total)} hours, so the federal rule finds nothing to pay at a premium. Under the ${h.src('ca_overtime', 'California rule')}, the twelve-hour Friday holds ${h.hrs(caEvenA.ot)} overtime hours on its own.</p>
${h.table(['Week', 'Daily hours', 'Total', 'Federal overtime', 'California overtime'], [
  ['Week 1', '8, 8, 8, 8, 12', h.hrs(evenA.total), h.hrs(evenA.ot), h.hrs(caEvenA.ot)],
  ['Week 2', '8, 8, 8, 8, 4', h.hrs(evenB.total), h.hrs(evenB.ot), h.hrs(h.week([8, 8, 8, 8, 4, 0, 0], 'california', rate).ot)],
], 'An even fortnight with one long day, federal and California rules', ['l', 'l', 'r', 'r', 'r'])}
<h2>Why averaging is the error to look for</h2>
<p>Payroll systems that pay a flat eighty hours, or supervisors who send someone home early in week two to "even out" a long week one, both rely on the idea that the pay period is what counts. It is not. Fact Sheet #23 is explicit that the workweek stands alone, and an employer cannot offset a short week against a long one. Cutting hours later in the same workweek is allowed; cutting them in the next one does not cancel overtime already earned.</p>
<p>When you check a paycheck, look at the overtime line first. If it shows zero but one of the two weeks went past ${h.F.weeklyOvertimeAfter} hours, recompute with this timesheet. A pay stub that only shows an eighty-hour total, with no weekly breakdown, is not proof of an error, but it is a reason to ask for the weekly figures. ${h.a('biweekly-pay-calculator', 'The biweekly pay calculator')} turns the corrected hours into the gross for the check.</p>
<h2>Filling the timesheet well</h2>
<p>Enter the real in and out times rather than the scheduled ones, and put the unpaid meal in the break column only when it was at least ${K.P.hoursWorked.mealUnpaidMinMinutes} minutes and duty-free. Short rest breaks stay on the clock. If your employer rounds punches, use the same rounding in the timesheet so the totals match; ${h.a('time-clock-rounding', 'the rounding guide')} explains which increments are accepted. Pick your state before reading the totals: a twelve-hour shift means something very different in California, Alaska, Nevada or Colorado than in the other states, as ${h.a('daily-overtime-states', 'the daily overtime guide')} shows. For a single week, ${h.a('home', 'the weekly time card')} does the same job with less to type.</p>
`,
  tool: 'timesheet',
  related: ['overtime-calculator', 'biweekly-pay-calculator', 'semimonthly-vs-biweekly', 'payroll-hours-calculator', 'daily-overtime-states'],
  sources: ['dol_fs23', 'usc_207', 'ca_overtime', 'dol_state_table'],
});
