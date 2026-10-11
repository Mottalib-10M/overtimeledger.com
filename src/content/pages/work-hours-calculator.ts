import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const F = K.F;
const yr = K.cal.businessDaysBetween('2026-01-01', '2026-12-31');
const weekdays26 = yr.business + yr.holidays;
const fullWeek = F.fullTimeHoursYear / 52;
const fullDay = fullWeek / 5;
const monthly = F.fullTimeHoursYear / 12;
// Four ten-hour days: federal rule, and Alaska without an approved flexible plan.
const fed4x10 = K.week([10, 10, 10, 10, 0, 0, 0], 'federal', 24);
const ak4x10 = K.week([10, 10, 10, 10, 0, 0, 0], 'alaska', 24);
const SCHEDULES: Array<[string, number[]]> = [
  ['Five 8-hour days', [8, 8, 8, 8, 8]],
  ['Four 10-hour days', [10, 10, 10, 10]],
  ['Three 12-hour days', [12, 12, 12]],
  ['Five 7.5-hour days', [7.5, 7.5, 7.5, 7.5, 7.5]],
  ['Five 6-hour days', [6, 6, 6, 6, 6]],
  ['Four 5-hour days', [5, 5, 5, 5]],
  ['Six 9-hour days', [9, 9, 9, 9, 9, 9]],
];

export default definePage({
  id: 'work-hours-calculator',
  group: 'clock',
  order: 20,
  slug: 'work-hours-calculator',
  nav: 'Work hours calculator',
  card: 'A regular schedule turned into hours per week, per month and per year.',
  title: 'Work Hours Calculator 2026: Week, Month and Year Totals',
  description: `Work hours calculator 2026: turn a regular schedule into hours per week, month and year. ${K.num(F.fullTimeHoursYear)} hours a year at full time, ${K.num(monthly, 2)} a month on average. Free.`,
  h1: 'Work hours per week, month and year',
  intro: 'Enter your usual start and end, the unpaid break, the days a week and the paid weeks a year; the calculator gives the weekly, monthly and yearly totals.',
  resume: `A regular schedule of ${K.hrs(fullDay)} hours a day, five days a week, adds up to ${K.hrs(fullWeek)} hours a week, ${K.num(monthly, 2)} hours in an average month and ${K.num(F.fullTimeHoursYear)} hours in a year of 52 weeks, the figure payroll and salary conversions use as full time. The monthly figure is an average because months hold between four and five weeks; dividing the yearly total by 12 is what keeps it fair. The calendar year does not line up exactly with 52 weeks: 2026 has ${weekdays26} weekdays, so someone paid for every weekday at ${K.hrs(fullDay)} hours would log ${K.num(weekdays26 * fullDay)} hours, and federal agencies use an average of ${K.num(F.opmHourlyDivisor)} hours for that reason. Compressed schedules change the days, not always the total: four ten-hour days also make ${K.hrs(fed4x10.total)} hours. Under the federal rule overtime starts only after ${F.weeklyOvertimeAfter} hours in the workweek, but some states count by the day, which the calculator shows.`,
  faqs: [
    { q: 'How many work hours are in a year for a full-time schedule?', a: `Payroll usually counts ${K.num(F.fullTimeHoursYear)} hours: ${K.hrs(fullWeek)} hours a week multiplied by 52 weeks. Paid holidays and vacation are included in that figure because they are paid hours, even though nobody is at work. Counting the real calendar of 2026 instead gives ${weekdays26} weekdays, or ${K.num(weekdays26 * fullDay)} hours at ${K.hrs(fullDay)} a day.` },
    { q: `Why does a monthly schedule show ${K.num(monthly, 2)} hours instead of ${K.num(fullWeek * 4)}?`, a: `Four weeks of ${K.hrs(fullWeek)} hours make ${K.num(fullWeek * 4)}, but a month averages about 4.33 weeks, not 4. Spreading ${K.num(F.fullTimeHoursYear)} yearly hours over 12 months gives ${K.num(monthly, 2)}. Using ${K.num(fullWeek * 4)} would understate eight months of the year and make an hourly rate derived from a monthly salary look higher than it really is.` },
    { q: 'Does a 4x10 schedule cause overtime pay?', a: `Not under the federal rule: four ten-hour days total ${K.hrs(fed4x10.total)} hours, which does not pass the ${F.weeklyOvertimeAfter}-hour weekly threshold. States with a daily limit differ. In Alaska, employers with ${K.ak.employersFrom} or more workers owe ${K.hrs(ak4x10.ot)} overtime hours on that week unless a flexible plan approved by the state sets the daily limit at ${K.ak.flexPlanDailyOtAfter} hours.` },
    { q: 'How do I find my hours per week when every week is different?', a: `Add the hours of a long, representative stretch, such as the last 13 weeks from your pay stubs, and divide by the number of weeks. That average is useful for budgeting or a loan application. It is not how overtime works: each workweek is counted alone, so a ${K.hrs(48)}-hour week followed by a ${K.hrs(32)}-hour week still includes overtime.` },
    { q: 'How many hours a year is a part-time job of 20 hours a week?', a: `Multiply by 52: ${K.num(20 * 52)} hours a year, which is half of the ${K.num(F.fullTimeHoursYear)}-hour full-time figure. Per month that averages ${K.num((20 * 52) / 12, 2)} hours. Federal wage law does not define part-time or full-time, so employers and benefit plans set their own cut-offs; check your handbook if a benefit depends on hours.` },
  ],
  body: (h) => `
${h.mini('yearHours')}
<h2>Schedules side by side</h2>
<p>Every row below comes from the hours of each workday multiplied out by the engine: the week, the year at 52 weeks, and the average month at one twelfth of the year. The column on the right is the overtime the week holds under the federal rule alone, which counts only the weekly total. A schedule with zero there can still produce overtime in a state that counts by the day.</p>
${h.table(['Schedule', 'Hours a week', 'Hours a year', 'Average month', 'Federal OT a week'], SCHEDULES.map(([name, d]) => { const w = h.week([...d, 0, 0, 0, 0, 0, 0, 0].slice(0, 7), 'federal', 20); return [name, h.hrs(w.total), h.num(w.total * 52), h.num((w.total * 52) / 12, 2), h.hrs(w.ot)]; }), 'Regular weekly schedules converted to monthly and yearly hours', ['l', 'r', 'r', 'r', 'r'])}
<p>The six-day row is the one people misjudge most. Fifty-four hours feel like a long week, and they are: ${h.hrs(h.week([9, 9, 9, 9, 9, 9, 0], 'federal', 20).ot)} of them are paid at ${h.num(h.F.overtimeMultiplier, 1)} times the regular rate under the ${h.src('dol_fs23', 'federal overtime rule')}, every single week. Over a year that is a large share of earnings that a simple hours times rate estimate leaves out, so ${h.a('overtime-calculator', 'the overtime calculator')} is the better tool for that pattern.</p>
<h2>Where the yearly figure of ${h.num(h.F.fullTimeHoursYear)} comes from, and when it is off</h2>
<p>The figure is pure arithmetic: ${h.hrs(fullWeek)} hours times 52 weeks. It assumes every week is paid, holidays and vacation included, which is how most salaried jobs and most hourly-to-salary conversions treat the year. ${h.a('salary-to-hourly-calculator', 'The salary to hourly calculator')} uses it as its default divisor.</p>
<p>A real calendar year is 52 weeks and one or two days. In 2026 the extra day is a Thursday, giving ${weekdays26} weekdays, of which ${yr.holidays} are observed federal holidays and ${yr.business} are ordinary business days. An hourly worker paid for every weekday at ${h.hrs(fullDay)} hours ends the year with ${h.num(weekdays26 * fullDay)} hours rather than ${h.num(h.F.fullTimeHoursYear)}. The ${h.src('opm_2087', 'Office of Personnel Management')} averages the long cycle of 28 years to ${h.num(h.F.opmHourlyDivisor)} hours, the divisor federal agencies apply to annual salaries.</p>
<p>The gap matters mostly for people paid a salary who want to compare offers by the hour, or for budgets built on a monthly figure. For a weekly or biweekly paycheck it changes nothing, because each check pays the hours of its own weeks. ${h.a('working-days-calculator', 'The working days calculator')} counts any month of 2026 if you need the exact number for a period.</p>
<h2>Compressed and part-time schedules</h2>
<p>Four tens, three twelves and the nine-day fortnight all aim at the same number of hours in fewer days. Under federal law the workweek total is what counts, so four ten-hour days at $24 an hour pay ${h.usd(fed4x10.pay.total, 2)}, exactly the same as five eights. Moving that schedule to a state that measures each day can change the paycheck. Alaska, for example, counts overtime after ${h.ak.dailyOtAfter} hours in a day for employers of ${h.ak.employersFrom} or more workers, so the same week there would contain ${h.hrs(ak4x10.ot)} overtime hours and pay ${h.usd(ak4x10.pay.total, 2)}, unless an approved flexible schedule raises the daily threshold to ${h.ak.flexPlanDailyOtAfter} hours (${h.src('ak_wage_hour', 'Alaska Wage and Hour Act')}). California, Nevada and Colorado have their own daily limits, compared in ${h.a('daily-overtime-states', 'the daily overtime guide')}.</p>
<p>For part-time work, the arithmetic is the same and only the inputs shrink. Three five-hour shifts make 15 hours a week and ${h.num(15 * 52)} a year. The federal Fair Labor Standards Act does not draw a line between part-time and full-time, so whether a schedule qualifies for health insurance or paid leave depends on the employer's plan or on other laws, not on this calculator.</p>
`,
  tool: 'work-hours',
  related: ['hours-calculator', 'salary-to-hourly-calculator', 'working-days-calculator', 'daily-overtime-states', 'overtime-calculator'],
  sources: ['dol_fs23', 'opm_2087', 'ak_wage_hour', 'opm_holidays'],
});
