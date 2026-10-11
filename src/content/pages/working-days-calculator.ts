import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const C = K.cal;
const F = K.F;
const Y = 2026;
const yr = C.businessDaysBetween(`${Y}-01-01`, `${Y}-12-31`);
const weekdays = yr.business + yr.holidays;
const months = C.workingDaysByMonth(Y);
const dayH = F.fullTimeHoursYear / 52 / 5;
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const q = [0, 1, 2, 3].map((i) => months.slice(i * 3, i * 3 + 3).reduce((s, m) => s + m.business, 0));
const best = months.reduce((a, b) => (b.business > a.business ? b : a));
const worst = months.reduce((a, b) => (b.business < a.business ? b : a));
const fullMonths = months.filter((m) => m.business === best.business).map((m) => MONTHS[m.month - 1]);
const leanMonths = months.filter((m) => m.business === worst.business).map((m) => MONTHS[m.month - 1]);
const noHol = months.filter((m) => m.holidays === 0).map((m) => MONTHS[m.month - 1]);
const indep = K.holidays2026.find((x) => x.name === 'Independence Day')!;
const PTO = 15;
const monThu = [1, 2, 3, 4].reduce((n, wd) => n + C.weekdayCount(Y, wd), 0);
const holMonThu = K.holidays2026.filter((x) => [1, 2, 3, 4].includes(C.weekday(x.observed))).length;
const fourDay = monThu - holMonThu;
const longDay = (F.weeklyOvertimeAfter / 4);
const today = `${Y}-10-12`;
const rest = C.businessDaysBetween(today, `${Y}-12-31`);

export default definePage({
  id: 'working-days-calculator',
  group: 'calendar',
  order: 40,
  slug: 'working-days-calculator',
  nav: 'Working days calculator',
  card: 'Working days and hours in each month of 2026, weekends and the 11 federal holidays removed.',
  title: `Working Days Calculator ${Y}: ${yr.business} Days, Month by Month`,
  description: `Working days calculator for ${Y}: ${weekdays} weekdays, ${yr.business} working days once the ${yr.holidays} federal holidays are off, the count for each month and the hours at ${dayH} a day.`,
  h1: 'Working days calculator',
  intro: 'Pick the year and whether federal holidays come off; the calculator gives the working days and hours of every month.',
  resume: `There are ${yr.business} working days in ${Y} in the United States on the federal calendar: the year has ${yr.calendar} days, of which ${yr.weekend} fall on a Saturday or Sunday, which leaves ${weekdays} weekdays, and the ${yr.holidays} federal holidays listed by the Office of Personnel Management all land on a weekday this year once observed. At ${dayH} hours a day those ${yr.business} days hold ${K.num(yr.business * dayH)} hours of work, while the ${weekdays} weekdays hold ${K.num(weekdays * dayH)}, the figure a full-time salary pays when holidays are paid. Months range from ${worst.business} working days (${K.listOf(leanMonths)}) to ${best.business} (${K.listOf(fullMonths)}). ${indep.name} falls on a Saturday, so the day off is ${K.day(indep.observed)}. Private employers choose their own holiday list, so a company closed on fewer of these days has more working days than the federal count shown here.`,
  faqs: [
    { q: `How many working days are there in ${Y}?`, a: `${yr.business} on the federal calendar. ${Y} has ${weekdays} weekdays, and each of the ${yr.holidays} federal holidays is observed on a weekday, so all of them come off. An employer that closes only on some of those holidays has more: closing on six of them would leave ${weekdays - 6} working days. Count your own employer's closed days against the ${weekdays} weekdays.` },
    { q: `How many work hours are in ${Y} for a full-time job?`, a: `It depends on what you count. The ${weekdays} weekdays at ${dayH} hours give ${K.num(weekdays * dayH)} hours, slightly above the ${K.num(F.fullTimeHoursYear)} of a 52-week year because ${Y} has one extra weekday. Taking out the ${yr.holidays} federal holidays leaves ${K.num(yr.business * dayH)} hours actually at work, before any vacation or sick days.` },
    { q: `Which month of ${Y} has the most working days?`, a: `${K.listOf(fullMonths)}, with ${best.business} working days each. ${K.listOf(noHol)} have no federal holiday at all, while July has ${months[6].weekdays} weekdays and loses one to the observed ${indep.name}. ${K.listOf(leanMonths)} ${leanMonths.length > 1 ? 'are' : 'is'} the leanest, with ${worst.business}, since ${leanMonths.length > 1 ? 'each loses' : 'it loses'} weekdays to the short month or to holidays.` },
    { q: 'How many working days are left in the year from mid-October?', a: `From ${K.day(today)} to ${K.day(`${Y}-12-31`)} inclusive there are ${rest.business} working days, after ${rest.holidays} federal holidays on weekdays: ${K.listOf(K.holidays2026.filter((x) => x.observed >= today).map((x) => x.name))}. That is ${K.num(rest.business * dayH)} hours at ${dayH} a day. Subtract any vacation booked before year end to see the days you will really be at work.` },
  ],
  body: (h) => `
${h.mini('workdays')}
<h2>Working days in each month of ${Y}</h2>
<p>The table counts Monday to Friday in each month and removes the federal holidays on the dates they are observed, as published by the ${h.src('opm_holidays', 'Office of Personnel Management')}. Hours use a ${dayH}-hour day; the second mini calculator further down takes your own day length.</p>
${h.table(['Month', 'Weekdays', 'Federal holidays', 'Working days', `Hours at ${dayH} h`], [...months.map((m) => [MONTHS[m.month - 1], m.weekdays, m.holidays, m.business, m.business * dayH]), ['Year', weekdays, yr.holidays, yr.business, yr.business * dayH]], `Working days in ${Y}, federal calendar`, ['l', 'r', 'r', 'r', 'r'])}
<p>By quarter, the year splits into ${q[0]}, ${q[1]}, ${q[2]} and ${q[3]} working days. The first quarter is the shortest because February has only ${months[1].weekdays} weekdays and January carries two holidays, New Year's Day and the birthday of Martin Luther King, Jr. The third quarter is the longest even with ${indep.name} and Labor Day in it.</p>
<h2>Why ${weekdays} weekdays and not 260</h2>
<p>Fifty-two weeks make 260 weekdays, yet ${Y} has ${weekdays}. A common year is 52 weeks and one day, and that day is the weekday the year starts on: ${Y} starts on a Thursday, so it holds one extra Thursday and one extra weekday. A leap year that starts on a Monday, Tuesday, Wednesday or Thursday carries two. The ${h.src('opm_2087', 'OPM 2,087-hour divisor')} exists for that reason: federal hourly rates average the years with ${K.num(260 * dayH)}, ${K.num(261 * dayH)} and ${K.num(262 * dayH)} weekday hours over a 28-year cycle, instead of dividing by ${K.num(F.fullTimeHoursYear)} every time.</p>
<p>For a salaried employee the extra weekday is invisible: the salary is the same for ${weekdays} weekdays as for 260. For an hourly worker on a five-day schedule it is one more day of pay. For an employer pricing a contract by the year, it is ${dayH} more hours per person. The mini calculator below turns the year into the days you personally work once vacation is out.</p>
${h.mini('dWorkYear')}
<h3>Four-day weeks and other schedules</h3>
<p>The federal count assumes Monday to Friday. A crew on four ${longDay}-hour days from Monday to Thursday has a different year: ${Y} holds ${monThu} of those weekdays, and ${holMonThu} of the observed holidays land on them, so ${fourDay} days are worked, ${K.num(fourDay * longDay)} hours in all. Holidays that fall on a Friday, such as ${K.day(indep.observed)} and Christmas, cost that crew nothing. The calculator above assumes the standard Monday to Friday week; for a Tuesday to Saturday retail schedule or fixed part-time days, count the weekdays you work and take out only the holidays that land on them.</p>
<h3>Using working days for leave and deadlines</h3>
<p>Leave policies are often written in working days, and ${PTO} days of vacation at ${dayH} hours a day is ${K.pto.daysToHours(PTO, dayH)} hours, about ${K.pct(PTO / yr.business)} of the ${yr.business} working days. ${h.a('pto-calculator', 'The PTO calculator')} converts days to hours and values them at your rate. For a deadline that runs a set number of business days from a starting date, ${h.a('business-days-calculator', 'the business days calculator')} moves forward or back and shows each skipped date, and ${h.a('federal-holidays', 'the federal holidays page')} lists the observed dates of ${Y} and ${Y + 1}.</p>
<p>Holidays also leave the federal overtime line where it was. ${h.src('dol_fs23', 'Fact Sheet #23')} says the FLSA does not require overtime pay for work on holidays as such: hours on a holiday count toward the ${F.weeklyOvertimeAfter} hours of the workweek like any other hours, and premium holiday pay exists only when an employer policy or a contract grants it.</p>
`,
  tool: 'working-days',
  related: ['business-days-calculator', 'federal-holidays', 'days-between-dates', 'pto-calculator', 'date-calculator'],
  sources: ['opm_holidays', 'opm_2087', 'dol_fs23', 'dol_fs22'],
});
