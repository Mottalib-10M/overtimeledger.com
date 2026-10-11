import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const T = K.time;
const c = (s: string) => T.parseClock(s) as number;
/** Minutes from one date and time to another (clock time, no daylight saving adjustment). */
const between = (d1: string, t1: string, d2: string, t2: string) => K.cal.daysBetween(d1, d2) * 1440 + c(t2) - c(t1);
const dhm = (m: number) => `${Math.floor(m / 1440)} d ${Math.floor((m % 1440) / 60)} h ${m % 60} min`;
const weekend = between('2026-10-16', '18:00', '2026-10-18', '7:15');
const CASES: Array<[string, string, string, string, string]> = [
  ['Evening to next morning', '2026-03-02', '22:00', '2026-03-03', '6:30'],
  ['Friday evening to Sunday morning', '2026-10-16', '18:00', '2026-10-18', '7:15'],
  ['On-call weekend', '2026-06-05', '17:00', '2026-06-08', '8:00'],
  ['Two-week project', '2026-08-03', '9:00', '2026-08-14', '17:30'],
  ['Trucking run with a layover', '2026-04-20', '4:45', '2026-04-22', '19:10'],
  ['Hospital stretch across month end', '2026-09-30', '19:00', '2026-10-01', '19:30'],
];
const onCall = between('2026-06-05', '17:00', '2026-06-08', '8:00');

export default definePage({
  id: 'time-duration-calculator',
  group: 'clock',
  order: 60,
  slug: 'time-duration-calculator',
  nav: 'Time duration calculator',
  card: 'Elapsed time between two dates and times, in days, hours and minutes and in decimal hours.',
  title: 'Time Duration Calculator 2026: Elapsed Time Across Dates',
  description: `Time duration calculator 2026: elapsed time between two dates and times, overnight or over days, in days, hours and minutes. Fri 6 PM to Sun 7:15 AM = ${T.hm(weekend)}.`,
  h1: 'Elapsed time between two dates and times',
  intro: 'Pick a start date and time and an end date and time; the calculator gives the elapsed time in days, hours and minutes and in decimal hours.',
  resume: `A time duration that spans several dates is found by counting the whole days between the two dates, turning them into hours at 24 each, then adding the difference between the two clock times. From Friday, October 16, 2026 at 6:00 PM to Sunday, October 18 at 7:15 AM there are 2 calendar days, or 48 hours, minus the 10 hours 45 minutes between 6:00 PM and 7:15 AM, which leaves ${T.hm(weekend)}: ${dhm(weekend)}, or ${K.num(weekend / 60, 2)} decimal hours. A plain hours calculator cannot do this, because two clock times alone never tell you whether a whole day passed in between; a date has to be attached to each end. The count is in clock time. When a daylight saving change falls inside the period, the real elapsed time is one hour shorter in spring and one hour longer in fall than the clock suggests, so check any stretch that covers those weekends.`,
  faqs: [
    { q: 'How do I calculate the duration between two dates with times?', a: `Count the full days from the start date to the end date and multiply by 24 to get hours. Then add the end time and subtract the start time; if that part is negative, it simply reduces the total. October 16 at 6 PM to October 18 at 7:15 AM is 48 hours minus 10:45, or ${T.hm(weekend)}. The calculator does it with any pair of dates.` },
    { q: 'How do I show a long duration in days, hours and minutes?', a: `Divide the total minutes by 1,440 for the whole days, take the remainder and divide by 60 for the hours, and what is left is minutes. An on-call period from Friday 5 PM to Monday 8 AM lasts ${T.hm(onCall)}, which reads as ${dhm(onCall)}. Payroll would rather have the plain decimal, ${K.num(onCall / 60, 2)} hours.` },
    { q: 'Does daylight saving time change a duration that crosses it?', a: `Yes, in real hours. On the night clocks spring forward, a stretch from 10 PM to 6 AM lasts 7 hours, not 8, and on the night they fall back it lasts 9. This calculator counts clock time and does not see the shift. For a night worker paid by the hour, the hours actually on duty are the ones to pay.` },
    { q: 'Can the end time in the duration calculator be earlier than the start?', a: `If both dates are the same and you have not changed the end date, an earlier end time is read as the next morning, which suits a night shift. Once you pick an end date yourself, the calculator takes it literally, and an end before the start returns a negative duration so the error is visible instead of silently adding a day.` },
  ],
  body: (h) => `
${h.mini('aMultiDay')}
<h2>Durations that cross midnight, weekends and month ends</h2>
<p>The examples below were run through the same arithmetic as the calculator: days between the two dates times 24 hours, plus the difference in clock time. Several of them start in one month and end in the next, or run past a weekend, which is where people counting on fingers usually drop a day. The last column is the decimal form, the one to enter in a spreadsheet or a billing tool.</p>
${h.table(['Case', 'From', 'To', 'Days, hours, minutes', 'Decimal hours'], CASES.map(([name, d1, t1, d2, t2]) => { const m = between(d1, t1, d2, t2); return [name, `${h.day(d1)}, ${h.time.to12h(c(t1))}`, `${h.day(d2)}, ${h.time.to12h(c(t2))}`, dhm(m), h.num(m / 60, 2)]; }), 'Elapsed time for multi-day periods in 2026 (clock time)', ['l', 'l', 'l', 'r', 'r'])}
<p>Notice the hospital row. A start at 7:00 PM on September 30 and an end at 7:30 PM the next day reads as one day and 30 minutes, ${h.num(between('2026-09-30', '19:00', '2026-10-01', '19:30') / 60, 2)} hours. Thinking in terms of dates alone, it would be easy to call it a one-day shift and forget the half hour; thinking in clock times alone, it would look like 30 minutes. Only both together give the right answer.</p>
<h2>The daylight saving caveat</h2>
<p>Most of the United States moves clocks forward one hour on a Sunday in March and back one hour on a Sunday in November, at 2:00 AM local time. For an office job this rarely matters. For a night shift, a 24-hour hospital rotation or a long haul, it changes the real length of the stretch by an hour.</p>
<p>The calculator, like a wall clock, compares the displayed times, so it reports the clock duration. On the November night a nurse working 7:00 PM to 7:30 AM is on duty for one hour more than the clock difference, and on the March night for one hour less. Pay should follow the hours actually worked, which is the principle the ${h.src('dol_fs22', 'Department of Labor applies to hours worked')}. Adjust the result by hand when a period covers one of those two nights, and check your time clock report, since some systems handle the change and some do not.</p>
<h2>Duration, hours worked and overtime are three different things</h2>
<p>An elapsed time measures from one moment to another, nothing more. The on-call weekend in the table lasts ${h.time.hm(onCall)}, but how much of it is paid depends on how restricted the employee was, and the federal hours-worked rules treat waiting and on-call time case by case. Elapsed time also says nothing about meals and sleep; ${h.a('meal-and-rest-breaks', 'the break guide')} covers what may be deducted.</p>
<p>Overtime then works on the hours worked inside each fixed workweek of ${h.F.workweekHours} hours, not on the length of a trip or a project. A duration that straddles two workweeks has to be split at the boundary your employer uses before the weekly threshold of ${h.F.weeklyOvertimeAfter} hours is applied (${h.src('dol_fs23', 'Fact Sheet #23')}). For single shifts on the same or the next day, ${h.a('hours-calculator', 'the hours calculator')} is quicker, and to count only dates, ${h.a('days-between-dates', 'the days between dates calculator')} skips the clock entirely.</p>
`,
  tool: 'duration',
  related: ['hours-calculator', 'days-between-dates', 'time-calculator', 'date-calculator', 'military-time-converter'],
  sources: ['dol_fs22', 'dol_fs23', 'cfr_785_19'],
});
