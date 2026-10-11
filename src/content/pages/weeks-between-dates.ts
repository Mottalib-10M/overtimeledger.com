import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const C = K.cal;
const F = K.F;
const Y = 2026;
const wk = (a: string, b: string) => { const d = C.daysBetween(a, b); return { d, w: Math.floor(d / 7), r: d % 7, dec: d / 7 }; };
const year = wk(`${Y}-01-01`, `${Y + 1}-01-01`);
const ref = `${Y}-10-12`;
const xmas = K.holidays2026.find((x) => x.name === 'Christmas Day')!;
const toX = wk(ref, xmas.date);
const s1 = `${Y}-03-11`;
const s2 = `${Y}-04-24`;
const sp = wk(s1, s2);
const touched = (a: string, b: string, start: number) => Math.floor((((C.weekday(a) - start + 7) % 7) + C.daysBetween(a, b)) / 7) + 1;
const tSun = touched(s1, s2, 0);
const tWed = touched(s1, s2, 4);
/** ISO 8601: week 1 holds the year's first Thursday; a year starting on a Thursday has a week 53. */
const isoW1 = C.addDays(`${Y}-01-01`, -((C.weekday(`${Y}-01-01`) + 6) % 7));
const isoW53 = C.addDays(isoW1, 52 * 7);
const twelve = C.addDays(ref, 12 * 7);
const summer = wk(`${Y}-06-01`, `${Y}-08-31`);
const thursdays = C.weekdayCount(Y, 4);
const RATE = 21;
const wA = K.week([9, 9, 9, 9, 9, 0, 0], 'federal', RATE);
const wB = K.week([7, 7, 7, 7, 7, 0, 0], 'federal', RATE);

export default definePage({
  id: 'weeks-between-dates',
  group: 'calendar',
  order: 70,
  slug: 'weeks-between-dates',
  nav: 'Weeks between dates',
  card: 'Whole weeks and leftover days between two dates, in decimal weeks too, and the workweeks a span touches.',
  title: `Weeks Between Dates ${Y}: Whole Weeks, Days and Workweeks`,
  description: `Weeks between dates in ${Y}: ${year.w} weeks and ${year.r} day in the year, ${toX.w} weeks ${toX.r} days to Christmas from Oct 12, decimal weeks, and the ${F.workweekHours}-hour workweek for overtime.`,
  h1: 'Weeks between two dates',
  intro: 'Enter two dates; the calculator splits the gap into whole weeks and leftover days and gives the decimal figure.',
  resume: `To find the weeks between two dates, take the number of days between them and divide by seven: the whole number is the full weeks, the remainder is the leftover days. From ${K.day(ref)} to ${K.day(xmas.date)} there are ${toX.d} days, which is ${toX.w} weeks and ${toX.r} days, or ${K.num(toX.dec, 2)} weeks in decimal form. A full year of ${Y} holds ${year.d} days, so ${year.w} weeks and ${year.r} day, the extra day being the reason ${Y} contains ${thursdays} Thursdays. Decimal weeks suit averages and rates, such as hours per week over a season; weeks and days suit planning, such as a twelve-week project that starts on ${K.day(ref)} and ends ${K.day(twelve)}. Payroll uses a third notion. Under the FLSA a workweek is a fixed, recurring period of ${F.workweekHours} hours, seven consecutive 24-hour days, which the employer may start on any day, and overtime is counted inside each one of them separately.`,
  faqs: [
    { q: 'How do I convert days into weeks and days?', a: `Divide the days by seven. The whole part is the weeks, and the remainder, between 0 and 6, is the extra days. ${toX.d} days divided by seven is ${toX.w} with ${toX.r} left over, so ${toX.w} weeks and ${toX.r} days. For the decimal figure keep dividing: ${toX.d} / 7 = ${K.num(toX.dec, 2)} weeks, which is the form a spreadsheet or an average needs.` },
    { q: `How many weeks are in ${Y}?`, a: `${year.w} weeks and ${year.r} day, since the year has ${year.d} days. The leftover day is a Thursday, which is why ${Y} has ${thursdays} Thursdays and a weekly payroll paid on Thursdays can count ${thursdays} paydays. Under the ISO week numbering used in many business calendars, a year that starts on a Thursday has 53 numbered weeks, and ${Y} is one of them.` },
    { q: 'How many workweeks does a pay period or project cover?', a: `It depends on the day your employer's workweek starts. From ${K.day(s1)} to ${K.day(s2)} there are ${sp.w} weeks and ${sp.r} days, but the span touches ${tSun} workweeks when they start on Sunday and ${tWed} when they start on Thursday. Each of those workweeks is checked separately for hours past ${F.weeklyOvertimeAfter}, partial ones included.` },
    { q: 'Can my employer count overtime over two weeks instead of one?', a: `Not under federal law. Fact Sheet #23 says each workweek stands alone and hours cannot be averaged over two or more weeks. A worker on ${K.hrs(wA.total)} hours one week and ${K.hrs(wB.total)} the next is owed ${K.hrs(wA.ot)} overtime hours for the first week, about ${K.usd(wA.ot * RATE * (F.overtimeMultiplier - 1), 2)} of premium at ${K.usd(RATE)} an hour, even though the two weeks average exactly ${F.weeklyOvertimeAfter} hours.` },
  ],
  body: (h) => `
${h.mini('dWorkweeks')}
<h2>Whole weeks, leftover days, decimal weeks</h2>
<p>Every weeks question starts as a days question. The calculator subtracts the earlier date from the later one, then splits the result two ways. The first split is the one people say out loud: "six weeks and two days". The second is the decimal, which divides the days by seven without stopping at the whole number. Both come from the same count, so if the day count is wrong, both figures are wrong; ${h.a('days-between-dates', 'the days between dates page')} explains when to count both ends of the span.</p>
${h.table(['From', 'To', 'Days', 'Weeks and days', 'Decimal weeks'], [
    [K.day(`${Y}-01-01`), K.day(`${Y + 1}-01-01`), year.d, `${year.w} wk ${year.r} d`, K.num(year.dec, 2)],
    [K.day(ref), K.day(xmas.date), toX.d, `${toX.w} wk ${toX.r} d`, K.num(toX.dec, 2)],
    [K.day(s1), K.day(s2), sp.d, `${sp.w} wk ${sp.r} d`, K.num(sp.dec, 2)],
    [K.day(`${Y}-06-01`), K.day(`${Y}-08-31`), summer.d, `${summer.w} wk ${summer.r} d`, K.num(summer.dec, 2)],
  ], 'Weeks between dates, computed with the calendar engine of this site', ['l', 'l', 'r', 'r', 'r'])}
<p>Decimal weeks are what you need to average something per week. A seasonal worker who logged 520 hours from ${K.day(`${Y}-06-01`)} to ${K.day(`${Y}-08-31`)} averaged ${K.num(520 / summer.dec, 1)} hours over ${K.num(summer.dec, 2)} weeks. Weeks and days are what you need to plan: a twelve-week assignment starting ${K.day(ref)} ends on ${K.day(twelve)}, a ${K.weekdayName(C.weekday(twelve))}, the same weekday it started.</p>
<h2>The workweek is not the calendar week</h2>
<p>A calendar week is whatever your planner prints, usually Sunday to Saturday or Monday to Sunday. The workweek that matters for pay is defined by the ${h.src('dol_fs23', 'Department of Labor')}: a fixed and regularly recurring period of ${F.workweekHours} hours, seven consecutive 24-hour periods. It can begin on any day and at any hour, such as Wednesday at 6 a.m., but once set it recurs on that same schedule every week, whatever the calendar shows. The ${h.src('usc_207', 'Fair Labor Standards Act')} then sets overtime at ${K.num(F.overtimeMultiplier, 1)} times the regular rate for every hour past ${F.weeklyOvertimeAfter} in that workweek.</p>
<p>That has a practical effect on any weeks count tied to pay. The span from ${K.day(s1)} to ${K.day(s2)} is ${sp.w} weeks and ${sp.r} days, but it overlaps ${tSun} Sunday-start workweeks and ${tWed} Thursday-start ones. The first and last are partial: hours worked inside the span may combine with hours worked just before or after it when the workweek is checked for overtime. When a job starts or ends mid-week, ask which workweek the first and last days belong to.</p>
<h3>Week numbers on business calendars</h3>
<p>Many planning tools number the weeks of the year under the ISO 8601 standard, where weeks run Monday to Sunday and week 1 is the one holding the year's first Thursday. Because ${Y} opens on a Thursday, its week 1 starts on ${K.day(isoW1)}, and the year runs to a week 53 that begins on ${K.day(isoW53)} and ends on ${K.day(C.addDays(isoW53, 6))}. The same weekday five week numbers later is therefore exactly 35 days away, whatever the month.</p>
<h3>No averaging across weeks</h3>
<p>Weeks are also the boundary for overtime. Two weeks of ${K.hrs(wA.total)} and ${K.hrs(wB.total)} hours make ${K.hrs(wA.total + wB.total)}, a perfect average of ${F.weeklyOvertimeAfter}, yet the first week alone carries ${K.hrs(wA.ot)} overtime hours, and at ${K.usd(RATE)} that week pays ${K.usd(wA.pay.total, 2)}. ${h.a('timesheet-calculator', 'The two-week timesheet')} keeps the weeks apart for that reason, and ${h.a('overtime-calculator', 'the overtime calculator')} handles one workweek day by day, including the states that add daily overtime.</p>
`,
  tool: 'weeks-between',
  related: ['days-between-dates', 'date-calculator', 'timesheet-calculator', 'overtime-calculator', 'pay-periods'],
  sources: ['dol_fs23', 'usc_207', 'opm_holidays'],
});
