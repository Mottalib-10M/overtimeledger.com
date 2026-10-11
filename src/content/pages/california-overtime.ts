import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const ca = K.ca;
const F = K.F;
const four10 = K.week([10, 10, 10, 10, 0, 0, 0], 'california', 20);
const four10Fed = K.week([10, 10, 10, 10, 0, 0, 0], 'federal', 20);
const six9 = K.week([9, 9, 9, 9, 9, 9, 0], 'california', 18);
const minWeek = K.week([8, 8, 8, 8, 8, 6, 0], 'california', ca.minimumWage);
const allSeven = K.week([7, 7, 7, 7, 7, 7, 7], 'california', 21);

export default definePage({
  id: 'california-overtime',
  group: 'overtime',
  order: 40,
  slug: 'california-overtime',
  nav: 'California overtime',
  card: 'Labor Code 510 applied to your week: daily overtime past 8 hours, double time past 12, the seventh day.',
  title: 'California Overtime 2026: Daily, Weekly and Seventh Day',
  description: `California overtime in 2026: time and a half past ${ca.dailyOtAfter} hours a day or ${ca.weeklyOtAfter} a week, double time past ${ca.dailyDtAfter}, seventh day rule, ${K.usd(ca.minimumWage, 2)} minimum wage. Split your week.`,
  h1: 'California overtime: the daily, weekly and seventh-day count',
  intro: 'The calculator is locked on California: type each day of your workweek and your rate to see straight time, time and a half and double time.',
  resume: `California overtime starts after ${ca.dailyOtAfter} hours in a workday, not only after ${ca.weeklyOtAfter} hours in a week. Labor Code 510, as the Labor Commissioner (DLSE) explains it, pays time and a half for hours past ${ca.dailyOtAfter} up to ${ca.dailyDtAfter} in one day, double time past ${ca.dailyDtAfter}, time and a half for the first ${ca.seventhDayOtUpTo} hours on the seventh consecutive day of the workweek and double time after that, plus time and a half for straight-time hours beyond ${ca.weeklyOtAfter} in the week. Each hour is paid once, at the highest rate it qualifies for. The practical effect shows on a four-day schedule: four ten-hour days at ${K.usd(20)} contain ${K.hrs(four10.ot)} overtime hours in California and pay ${K.usd(four10.pay.total, 2)}, while the same ${K.hrs(four10.total)} hours earn ${K.usd(four10Fed.pay.total, 2)} under federal law alone. The state minimum wage is ${K.usd(ca.minimumWage, 2)} an hour since January 1, 2026, which puts the minimum overtime rate at ${K.usd(ca.minimumWage * F.overtimeMultiplier, 2)}.`,
  faqs: [
    { q: 'Do four 10-hour days count as overtime in California?', a: `Yes, under the daily rule of Labor Code 510 that the Labor Commissioner applies to nonexempt employees. Each ten-hour day holds ${K.hrs(10 - ca.dailyOtAfter)} overtime hours, so a four-day week at ${K.usd(20)} pays ${K.usd(four10.pay.total, 2)}, with ${K.hrs(four10.ot)} hours at ${K.usd(20 * F.overtimeMultiplier, 2)}. The weekly total of ${K.hrs(four10.total)} hours is not what triggers it; the length of each day is.` },
    { q: 'What salary makes a California employee exempt from overtime in 2026?', a: `The salary must be at least twice the state minimum wage for full-time work. With ${K.usd(ca.minimumWage, 2)} an hour, that is ${K.usd(K.caExemptAnnual)} a year, or ${K.usd(K.caExemptAnnual / 52, 2)} a week, far above the federal ${K.usd(F.exemptSalaryWeekly)}. The job duties must also be executive, administrative or professional as the Labor Commissioner defines them. A salary below the figure means overtime is owed whatever the title.` },
    { q: 'If I work seven 7-hour days in California, what is overtime?', a: `Only the seventh day changes. Seven days of ${K.hrs(7)} hours make ${K.hrs(allSeven.total)} hours, and the first six stay at straight time because no day passes ${ca.dailyOtAfter} hours. The seventh day of the same workweek is paid at time and a half for up to ${ca.seventhDayOtUpTo} hours, so all ${K.hrs(allSeven.days[6].ot)} hours that day earn the premium, and the weekly line adds ${K.hrs(allSeven.ot - allSeven.days[6].ot)} more. At ${K.usd(21)} the week pays ${K.usd(allSeven.pay.total, 2)}.` },
    { q: 'Does a missed meal break in California add an hour of pay?', a: `Yes. When a required meal or rest period is not provided, the employer owes ${ca.premiumHoursMissedBreak} additional hour of pay at the regular rate for each workday it happens, under Labor Code 226.7 as the Labor Commissioner explains it. The meal is due once a shift passes ${ca.mealAfterHours} hours. At ${K.usd(20)} an hour, three days with a skipped lunch add ${K.usd(3 * ca.premiumHoursMissedBreak * 20)} to the paycheck, separately from any overtime.` },
    { q: 'Can a California employer average overtime over a two-week pay period?', a: `No. Overtime is measured on each workday and each workweek, and a short week cannot cancel a long day. Someone who works ${K.hrs(10)} hours on Monday has ${K.hrs(10 - ca.dailyOtAfter)} overtime hours that day even if the rest of the two weeks is light. Biweekly paychecks only change when the money arrives, not how overtime is counted under Labor Code 510.` },
  ],
  body: (h) => `
${h.mini('otDay', 'california')}
<h2>Labor Code 510 as the Labor Commissioner applies it</h2>
<p>The ${h.src('ca_overtime', 'DLSE overtime FAQ')} lists five layers, and payroll applies them in this order. First the day: past ${h.ca.dailyOtAfter} hours the rate rises to ${h.num(F.overtimeMultiplier, 1)} times, past ${h.ca.dailyDtAfter} hours to double. Then the seventh consecutive day in a workweek, which is premium from its first hour. Last the week: straight-time hours that pass ${h.ca.weeklyOtAfter} become overtime. The employer's workweek is fixed and recurring, seven consecutive 24-hour periods, and the seventh-day rule only bites when all seven of those days were worked.</p>
<p>Nothing in California law lets a long Monday be offset by a short Friday, and nothing makes Saturday or Sunday special by name. What counts is the place of the day in the workweek. If the workweek starts on a Wednesday, the seventh consecutive day is a Tuesday. The rate that gets multiplied is the regular rate of pay, not always the posted wage; ${h.a('regular-rate-of-pay', 'the regular rate page')} shows the arithmetic when a week holds two hourly rates.</p>
<h2>Three California weeks on the time card</h2>
${h.table(['Workweek', 'Rate', 'Straight', 'At 1.5x', 'At 2x', 'Gross pay'], [
  ['Four 10-hour days', h.usd(20), h.hrs(four10.reg), h.hrs(four10.ot), h.hrs(four10.dt), h.usd(four10.pay.total, 2)],
  ['Six 9-hour days', h.usd(18), h.hrs(six9.reg), h.hrs(six9.ot), h.hrs(six9.dt), h.usd(six9.pay.total, 2)],
  ['Five 8-hour days and a 6-hour Saturday', h.usd(h.ca.minimumWage, 2), h.hrs(minWeek.reg), h.hrs(minWeek.ot), h.hrs(minWeek.dt), h.usd(minWeek.pay.total, 2)],
  ['Seven 7-hour days', h.usd(21), h.hrs(allSeven.reg), h.hrs(allSeven.ot), h.hrs(allSeven.dt), h.usd(allSeven.pay.total, 2)],
], 'Split by the site engine under Labor Code 510 (DLSE reading), rates chosen for the example', ['l', 'r', 'r', 'r', 'r', 'r'])}
<p>The six-day row is the one that surprises people. Each nine-hour day carries ${h.hrs(9 - h.ca.dailyOtAfter)} daily overtime hour, which makes ${h.hrs(6 * (9 - h.ca.dailyOtAfter))} for the week. The straight-time hours, ${h.hrs(h.ca.dailyOtAfter)} a day, reach ${h.ca.weeklyOtAfter} at the end of the fifth day, so the sixth day's straight portion turns into weekly overtime as well: ${h.hrs(six9.ot)} premium hours in total and ${h.usd(six9.pay.total, 2)} at ${h.usd(18)}. A federal-only calculation would find ${h.hrs(54 - F.weeklyOvertimeAfter)} overtime hours, the same count here by coincidence, all of them piled on the fifth and sixth days instead of spread across the week.</p>
<p>The minimum-wage row shows the floor. At ${h.usd(h.ca.minimumWage, 2)} the six-hour Saturday falls entirely past the weekly line, and the week pays ${h.usd(minWeek.pay.total, 2)} before deductions. A double-time hour at that wage is worth ${h.usd(h.ot.grossPay({ reg: 0, ot: 0, dt: 1 }, h.ca.minimumWage).total, 2)}. For hours paid twice the rate in more detail, see ${h.a('double-time-calculator', 'the double time calculator')}.</p>
<h2>Exempt salary, minimum wage and breaks in 2026</h2>
<p>An employee is outside these rules only if the duties qualify and the salary reaches twice the state minimum wage for full-time work, according to the ${h.src('ca_exempt', 'Labor Commissioner’s exemptions FAQ')}. With the ${h.src('ca_min_wage', '2026 minimum wage')} of ${h.usd(h.ca.minimumWage, 2)}, the threshold is ${h.usd(h.caExemptAnnual)} a year. A manager on ${h.usd(62000)} in Sacramento is therefore owed overtime in California even though the same pay clears the federal ${h.usd(F.exemptSalaryAnnual)} level by a wide margin. ${h.a('exempt-vs-nonexempt', 'The exempt versus nonexempt guide')} goes through the duties tests.</p>
<p>Breaks affect the time card too. A ${h.ca.mealMinutes}-minute meal period is due for a workday of more than ${h.ca.mealAfterHours} hours and a second one past ${h.ca.secondMealAfterHours} hours, and a paid ${h.ca.restMinutesPer4h}-minute rest break for every four hours or major fraction, with none required for a workday under ${h.num(h.ca.restNotRequiredUnderHours, 1)} hours (${h.src('ca_meal', 'meal periods FAQ')}, ${h.src('ca_rest', 'rest periods FAQ')}). Each day without a compliant break adds ${h.ca.premiumHoursMissedBreak} hour of pay at the regular rate. ${h.a('meal-and-rest-breaks', 'The meal and rest breaks page')} compares those rules with the federal ones.</p>
`,
  tool: 'overtime',
  toolProps: { state: 'california', lock: true },
  related: ['double-time-calculator', 'meal-and-rest-breaks', 'exempt-vs-nonexempt', 'daily-overtime-states', 'california-sick-leave'],
  sources: ['ca_overtime', 'ca_min_wage', 'ca_exempt', 'ca_meal', 'ca_rest', 'dol_state_table'],
});
