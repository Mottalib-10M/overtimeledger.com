import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const C = K.cal;
const Y = 2026;
const jan1 = `${Y}-01-01`;
const dec31 = `${Y}-12-31`;
const yearDiff = C.daysBetween(jan1, dec31);
const ref = `${Y}-10-12`;
const xmas = K.holidays2026.find((x) => x.name === 'Christmas Day')!;
const toXmas = C.daysBetween(ref, xmas.date);
const feb26 = C.daysBetween(`${Y}-02-01`, `${Y}-03-01`);
const feb28 = C.daysBetween('2028-02-01', '2028-03-01');
const leapYear = C.daysBetween('2028-01-01', '2029-01-01');
const commonYear = C.daysBetween(`${Y}-01-01`, `${Y + 1}-01-01`);
const N = 90;
const after90 = C.addDays(ref, N);
const day90 = C.addDays(ref, N - 1);
const cross = C.daysBetween(`${Y}-12-15`, `${Y + 1}-01-15`);
const span28 = C.daysBetween('2028-02-15', '2028-03-15');
const span26 = C.daysBetween(`${Y}-02-15`, `${Y}-03-15`);
const weeksDec = C.businessDaysBetween(ref, xmas.date);

export default definePage({
  id: 'days-between-dates',
  group: 'calendar',
  order: 60,
  slug: 'days-between-dates',
  nav: 'Days between dates',
  card: 'Calendar days from one date to another, with or without the first day, leap years included.',
  title: `Days Between Dates ${Y}: Count Calendar Days, Leap Years Too`,
  description: `Days between dates in ${Y}: ${yearDiff} days from Jan 1 to Dec 31, ${yearDiff + 1} counting both ends, ${feb28} days in February 2028, and when to add one day to the difference.`,
  h1: 'Days between two dates',
  intro: 'Enter two dates; the calculator gives the calendar days between them, the count with both ends, and the weeks.',
  resume: `The number of days between two dates is the later date minus the earlier one: from ${K.day(jan1)} to ${K.day(dec31)} that is ${yearDiff} days. Counting both the first and the last day gives one more, ${yearDiff + 1}, which is the number of days in the year. Both answers are right; they answer different questions. The difference tells you how much time elapses, as on a countdown: from ${K.day(ref)} to ${K.day(xmas.date)} there are ${toXmas} days. The inclusive count tells you how many dates a period covers, as when you list the days a rental, a trip or an assignment lasted. Month lengths and leap years are handled by the calendar: February 2026 has ${feb26} days, February 2028 has ${feb28}, and the whole of 2028 has ${leapYear}. The calculator shows both figures, the weekend days and the business days, so you can pick the one your situation calls for.`,
  faqs: [
    { q: 'Should I count the first day when counting days between two dates?', a: `Not for the plain difference, which is what most date tools return: from Monday to Friday of the same week is 4 days. Count the first day when you want the number of dates covered, so the same Monday to Friday becomes 5. The difference fits countdowns and elapsed time; the inclusive count fits stays, rentals and attendance, where each date matters.` },
    { q: `How many days are there from ${K.day(ref)} to Christmas?`, a: `${toXmas} days, measured as ${K.day(xmas.date)} minus ${K.day(ref)}. If you count both the starting day and Christmas Day itself, the figure is ${toXmas + 1}. Of those dates, ${weeksDec.business} are business days on the federal calendar, once weekends and the observed holidays, ${K.listOf(K.holidays2026.filter((x) => x.observed >= ref && x.observed <= xmas.date).map((x) => x.name))}, are taken out. ${xmas.name} is a ${K.weekdayName(C.weekday(xmas.date))} in ${Y}.` },
    { q: 'How do leap years change a days between dates count?', a: `Any span that crosses a February 29 gains a day. From February 15 to March 15 is ${span26} days in ${Y} but ${span28} days in 2028, the next leap year, and the full year 2028 holds ${leapYear} days against ${commonYear} in ${Y}. A year is a leap year when it divides by 4, except century years that do not divide by 400, so 2000 was one and 2100 will not be.` },
    { q: `What is the date ${N} days after ${K.day(ref)}?`, a: `${K.day(after90)}, adding ${N} calendar days to the start. If the start date counts as day 1 instead, day ${N} is ${K.day(day90)}, one day earlier. Documents that set a period in days do not all count the same way, so check whether yours says "within ${N} days of" or "on the ${N}th day". The mini calculator above shows both dates for any start.` },
  ],
  body: (h) => `
${h.mini('dDayN')}
<h2>Difference or inclusive count: the fencepost question</h2>
<p>A fence ten yards long with a post every yard needs eleven posts. Dates behave the same way. From ${K.day(ref)} to ${K.day(after90)} the difference is ${N} days, yet the period touches ${N + 1} different dates. Neither number is a mistake; the error comes from mixing them up. A countdown, an age in days or the time since an invoice was issued uses the difference. A list of dates, a hotel stay counted in nights plus the checkout day, or a count of days attended uses the inclusive figure.</p>
<p>The calculator reports both, plus the weekend days and business days inside the span. When the question is about work time rather than calendar time, ${h.a('business-days-calculator', 'the business days calculator')} removes weekends and the observed federal holidays listed by the ${h.src('opm_holidays', 'Office of Personnel Management')}.</p>
${h.table(['From', 'To', 'Difference', 'Both ends counted'], [
    [K.day(jan1), K.day(dec31), yearDiff, yearDiff + 1],
    [K.day(ref), K.day(xmas.date), toXmas, toXmas + 1],
    [K.day(`${Y}-02-01`), K.day(`${Y}-03-01`), feb26, feb26 + 1],
    [K.day('2028-02-01'), K.day('2028-03-01'), feb28, feb28 + 1],
    [K.day(`${Y}-12-15`), K.day(`${Y + 1}-01-15`), cross, cross + 1],
  ], 'Days between dates, computed with the calendar engine of this site', ['l', 'l', 'r', 'r'])}
<h2>Months are not a fixed number of days</h2>
<p>"One month later" sounds precise but is not a fixed span. From the 15th of December to the 15th of January is ${cross} days; from the 15th of February to the 15th of March is ${span26} days in ${Y} and ${span28} in 2028. When a period is written in days, count days; when it is written in months, the calendar date is what matters, and the day count is a by-product. For a span stated in weeks, ${h.a('weeks-between-dates', 'the weeks between dates page')} converts days into whole weeks and leftover days.</p>
<p>Leap years follow the Gregorian rule: a year divisible by 4 is a leap year, except century years, which must also be divisible by 400. The next leap day is February 29, 2028. Spans that run across it, such as a 12-month lease running from mid-2027 to mid-2028, hold ${leapYear} days rather than ${commonYear}, which matters when a rent, an interest charge or a daily rate is spread over the days of the period.</p>
<h3>Days between dates at work</h3>
<p>Workplaces count days constantly: the length of an introductory or probation period, the notice an employee or employer gives, the days left before a benefit enrollment window closes, the days since the last safety incident. The rules for those periods come from the employer's policy, a contract or a specific law, and they differ on whether the first day counts and whether weekends do. The safe habit is to write down both the start date and the end date, not only the number of days, and to check the wording against a calendar. For hours rather than days, ${h.a('hours-calculator', 'the hours calculator')} handles start and end times, and ${h.a('date-calculator', 'the date calculator')} adds a number of calendar or business days to a start date.</p>
<p>Pay periods follow their own count. Federal overtime law, as described in ${h.src('dol_fs23', 'Fact Sheet #23')}, uses a fixed workweek of ${K.F.workweekHours} hours, seven consecutive days of 24 hours, no matter how many days separate two paydays.</p>
`,
  tool: 'days-between',
  related: ['weeks-between-dates', 'business-days-calculator', 'date-calculator', 'working-days-calculator', 'hours-calculator'],
  sources: ['opm_holidays', 'dol_fs23', 'usc_207'],
});
