import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { shortDay } from '../../lib/fmt';

const C = K.cal;
const Y = 2026;
const hol = (n: string) => K.holidays2026.find((x) => x.name === n)!;
const xmas = hol('Christmas Day');
const indep = hol('Independence Day');
const vets = hol('Veterans Day');
const thanks = hol('Thanksgiving Day');
const d1 = `${Y}-12-23`;
const d1b = C.addBusinessDays(d1, 2);
const d1c = C.addDays(d1, 2);
const d2 = `${Y}-10-12`;
const d2c = C.addDays(d2, 30);
const d2w = C.addDays(d2, 6 * 7);
const d3 = `${Y}-07-01`;
const d3b = C.addBusinessDays(d3, 3);
const d3n = C.addBusinessDays(d3, 3, false);
const d4 = `${Y}-11-25`;
const d4b = C.addBusinessDays(d4, 1);
const d5 = `${Y}-12-31`;
const d5b = C.addBusinessDays(d5, -10);
const d6 = `${Y}-01-31`;
const d6c = C.addDays(d6, 30);
const closed = (d: string) => !C.isBusinessDay(d);

export default definePage({
  id: 'date-calculator',
  group: 'calendar',
  order: 80,
  slug: 'date-calculator',
  nav: 'Date calculator',
  card: 'Add or subtract calendar days, weeks or business days from a date, federal holidays skipped.',
  title: `Date Calculator ${Y}: Add Days, Weeks or Business Days`,
  description: `Date calculator for ${Y}: add days, weeks or business days to any date, or subtract them. ${shortDay(d1)} + 2 business days = ${shortDay(d1b)}, with Christmas skipped.`,
  h1: 'Date calculator: add or subtract days',
  intro: 'Pick a start date, a number and a unit (calendar days, weeks or business days) and get the resulting date.',
  resume: `Adding days to a date gives a different answer depending on the unit you count in, and this calculator handles all three. Two calendar days after ${K.day(d1)} is ${K.day(d1c)}, ${xmas.name}. Two business days after the same date is ${K.day(d1b)}, because the count skips the ${K.weekdayName(C.weekday(xmas.observed))} holiday and the weekend that follows. Weeks are the simplest unit: six weeks after ${K.day(d2)} is ${K.day(d2w)}, always the same weekday as the start. In every mode the start date itself is not counted, so day one is the next calendar day or the next business day. Business days skip Saturdays, Sundays and the ${K.holidays2026.length} federal holidays on the dates they are observed, such as ${K.day(indep.observed)} for ${indep.name}. A negative number counts backwards, which is how a cutoff is set before a closing date: ten business days before ${K.day(d5)} is ${K.day(d5b)}.`,
  faqs: [
    { q: `What date is 2 business days after ${K.day(d1)}?`, a: `${K.day(d1b)}. ${K.day(d1)} is a ${K.weekdayName(C.weekday(d1))}; the first business day after it is ${K.day(C.addBusinessDays(d1, 1))}. ${xmas.name}, ${K.day(xmas.observed)}, is an observed federal holiday, and the weekend follows, so the second business day is the ${K.weekdayName(C.weekday(d1b))}. Counted in calendar days instead, two days after ${K.day(d1)} is ${K.day(d1c)}, the holiday itself.` },
    { q: 'What happens when a calendar-day deadline lands on a holiday?', a: `The calculator gives the exact date and does not move it. Thirty days after ${K.day(d2)} is ${K.day(d2c)}, which is ${vets.name}, a federal holiday. Whether a deadline that falls on a weekend or holiday moves to the next business day depends on the rule or contract that sets it, so read that wording before relying on the date.` },
    { q: 'Does adding a month equal adding 30 days?', a: `No. Thirty days after ${K.day(d6)} is ${K.day(d6c)}, already in March, while "one month later" would usually be read as the end of February. Months run from 28 to 31 days, so convert a period stated in months by calendar date, and a period stated in days by counting days. The calculator works in days, weeks and business days for that reason.` },
    { q: 'Is the day after Thanksgiving counted when adding business days?', a: `Yes. Only ${thanks.name} is a federal holiday, so one business day after ${K.day(d4)} is ${K.day(d4b)}, the Friday. If your employer or the office you deal with is closed that Friday, add one more day by hand. The same applies to state holidays, which the calculator does not remove because they vary from one state to the next.` },
  ],
  body: (h) => `
${h.mini('dDateShift')}
<h2>Calendar days, weeks and business days compared</h2>
<p>The three units diverge as soon as a weekend or a holiday sits in the way. Calendar days are a plain count on the calendar, weekends included. Weeks multiply by seven and land on the same weekday. Business days walk forward one weekday at a time and step over the observed federal holidays published by the ${h.src('opm_holidays', 'Office of Personnel Management')}. The table runs each unit from real ${Y} dates.</p>
${h.table(['Start', 'Added', 'Result', 'Note'], [
    [K.day(d1), '2 calendar days', K.day(d1c), closed(d1c) ? 'lands on a holiday' : ''],
    [K.day(d1), '2 business days', K.day(d1b), 'skips the holiday and the weekend'],
    [K.day(d2), '30 calendar days', K.day(d2c), closed(d2c) ? `${vets.name}` : ''],
    [K.day(d2), '6 weeks', K.day(d2w), 'same weekday'],
    [K.day(d3), '3 business days', K.day(d3b), `skips ${K.day(indep.observed)}`],
    [K.day(d3), '3 weekdays, holidays ignored', K.day(d3n), 'one day earlier'],
    [K.day(d5), 'minus 10 business days', K.day(d5b), 'counted backwards'],
  ], `Dates added and subtracted in ${Y}, computed with the calendar engine of this site`)}
<p>The ${indep.name} row shows why the observed date matters. ${indep.name} itself is a Saturday in ${Y}, a day that would never count anyway; the federal day off is the Friday before. Three business days after ${K.day(d3)} is therefore ${K.day(d3b)}, while a tool that ignores holidays answers ${K.day(d3n)}.</p>
<h2>Counting rules the calculator follows</h2>
<p>The start date is day zero. Adding one calendar day to a Monday gives Tuesday; adding one business day to a Friday gives Monday, or Tuesday when the Monday is a holiday such as Labor Day. Subtracting works the same way in reverse. A result is never adjusted after the fact: if thirty calendar days lands on a Sunday, the result is that Sunday, which the mini calculator above marks as closed, and the page leaves the decision to the rule you are applying.</p>
<p>Counting backwards uses the same steps. Ten business days before ${K.day(d5)} is ${K.day(d5b)}: the count steps back over two weekends and over ${xmas.name}, so the result sits ${C.daysBetween(d5b, d5)} calendar days before the target. A payroll team that needs time cards ten business days before a year-end payday would set ${K.day(d5b)} as the cutoff, not ${K.day(C.addDays(d5, -10))}.</p>
<p>Holidays are the federal ones only. Private employers set their own holiday schedules, state governments add their own days, and banks follow yet another calendar, so a business-day result can be a day off for your office. The holiday switch in the calculator lets you treat federal holidays as workdays when your organization stays open. For the full list of observed dates in ${Y} and ${Y + 1}, see ${h.a('federal-holidays', 'the federal holidays page')}.</p>
<h3>Where a date calculation shows up at work</h3>
<p>Typical uses are a start date set a number of days after an offer, the end of an introductory period, the date a leave request has to be filed by, or the last day to submit a time card before payroll closes. Each of those is set by a policy, a contract or a specific rule, and that text decides whether weekends count and whether day one is the start date. When the question is the gap between two known dates rather than a date to find, ${h.a('days-between-dates', 'the days between dates calculator')} and ${h.a('business-days-calculator', 'the business days calculator')} do the reverse job. Overtime does not use any of these counts: the ${h.src('dol_fs23', 'Department of Labor')} measures it per fixed workweek of ${K.F.workweekHours} hours.</p>
`,
  tool: 'date-add',
  related: ['business-days-calculator', 'days-between-dates', 'weeks-between-dates', 'federal-holidays', 'working-days-calculator'],
  sources: ['opm_holidays', 'dol_fs23', 'usc_207'],
});
