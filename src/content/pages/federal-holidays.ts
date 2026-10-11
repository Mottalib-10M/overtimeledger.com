import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const C = K.cal;
const F = K.F;
const Y = 2026;
const H = K.holidays2026;
const H27 = C.federalHolidays(Y + 1);
const moved = H.filter((x) => x.observed !== x.date);
const moved27 = H27.filter((x) => x.observed !== x.date);
const indep = H.find((x) => x.name === 'Independence Day')!;
const wd = (d: string) => K.weekdayName(C.weekday(d));
const mondays = H.filter((x) => C.weekday(x.observed) === 1).length;
const fixedNames = ["New Year's Day", 'Juneteenth National Independence Day', 'Independence Day', 'Veterans Day', 'Christmas Day'];
const nFixed = fixedNames.length;
const yr = C.businessDaysBetween(`${Y}-01-01`, `${Y}-12-31`);
const ny28 = C.federalHolidays(Y + 2)[0];
const RATE = 19;
const holWeek = K.week([8, 8, 8, 8, 8, 6, 0], 'federal', RATE);

export default definePage({
  id: 'federal-holidays',
  group: 'calendar',
  order: 90,
  slug: 'federal-holidays',
  nav: 'Federal holidays',
  card: 'The 11 federal holidays of 2026 with their observed dates, the weekend rule, and the dates for 2027.',
  title: `Federal Holidays ${Y}: ${H.length} Dates, Observed Days, ${Y + 1} List`,
  description: `Federal holidays ${Y}: the ${H.length} dates set by law with their observed days (${indep.name} off on ${wd(indep.observed)}, ${K.day(indep.observed).replace(`, ${Y}`, '')}), the OPM weekend rule and the ${Y + 1} calendar.`,
  h1: 'Federal holidays and their observed dates',
  intro: 'The eleven federal holidays of the year, the day each one is observed, and the working days that remain.',
  resume: `There are ${H.length} federal holidays in ${Y}, from ${H[0].name} on ${K.day(H[0].date)} to ${H[H.length - 1].name} on ${K.day(H[H.length - 1].date)}. ${K.listOf(H.filter((x) => !fixedNames.includes(x.name)).map((x) => x.name.replace('Birthday of Martin Luther King, Jr.', 'Martin Luther King Jr. Day')))} fall on a set Monday or Thursday every year; the other ${nFixed} have fixed dates and can land on a weekend. When that happens the Office of Personnel Management applies a simple rule for federal employees: a Saturday holiday is observed on the Friday before, a Sunday holiday on the Monday after. In ${Y} only ${indep.name} moves, from Saturday, ${K.day(indep.date)} to ${K.day(indep.observed)}. ${Y + 1} has ${moved27.length} moved holidays: ${K.listOf(moved27.map((x) => `${x.name.replace(' National Independence Day', '')} (${K.day(x.observed).replace(`, ${Y + 1}`, '')})`))}. These dates bind federal offices. Private employers are free to choose which days they close and whether they pay them; the Fair Labor Standards Act requires no premium pay for holiday work as such.`,
  faqs: [
    { q: `How many federal holidays are there in ${Y}?`, a: `${H.length}. They are ${K.listOf(H.map((x) => x.name.replace(' National Independence Day', '').replace('Birthday of Martin Luther King, Jr.', 'Martin Luther King Jr. Day')))}. All ${H.length} are observed on a weekday in ${Y}, so they remove ${yr.holidays} working days and leave ${yr.business}. ${mondays} of them are observed on a Monday, which gives federal employees that many three-day weekends.` },
    { q: 'What happens when a federal holiday falls on a Saturday or Sunday?', a: `For federal employees on a Monday to Friday schedule, OPM moves the day off: a Saturday holiday is observed on the Friday before, and a Sunday holiday on the Monday after. ${indep.name} ${Y} is a Saturday, so federal offices close on ${K.day(indep.observed)}. In ${Y + 2}, ${ny28.name} falls on a ${wd(ny28.date)}, which puts its observed day on ${K.day(ny28.observed)}, in the previous year.` },
    { q: 'Do private employers have to give federal holidays off or pay them?', a: `The FLSA does not require it. The federal holiday list governs federal offices and employees; private employers decide which days they close and whether those days are paid, usually in a handbook or contract. The Department of Labor's Fact Sheet #23 adds that the FLSA does not require overtime pay for work on holidays as such. A contract or company policy can grant more, such as holiday premium pay.` },
    { q: 'Is working on a federal holiday paid at time and a half?', a: `Not by federal law. Hours on a holiday count like any others toward the ${F.weeklyOvertimeAfter} hours of the workweek, and only hours past ${F.weeklyOvertimeAfter} earn ${K.num(F.overtimeMultiplier, 1)} times the regular rate. A holiday week of ${K.hrs(holWeek.total)} hours at ${K.usd(RATE)} pays ${K.hrs(holWeek.ot)} hours of overtime whether or not one day was a holiday. Holiday premiums come from employer policy or a contract.` },
  ],
  body: (h) => `
${h.mini('dHolidayYear')}
<h2>The ${H.length} federal holidays of ${Y}</h2>
<p>The list below gives each holiday's legal date and the day federal offices close, as published by the ${h.src('opm_holidays', 'Office of Personnel Management')}. Only one date differs this year.</p>
${h.table(['Holiday', 'Date', 'Weekday', 'Observed'], H.map((x) => [x.name, K.day(x.date), wd(x.date), x.observed === x.date ? 'same day' : `${wd(x.observed)}, ${K.day(x.observed)}`]), `Federal holidays in ${Y} and the days they are observed`)}
<p>${H.length - nFixed} holidays are tied to a weekday by law rather than to a date. Martin Luther King Jr.'s birthday is the third Monday of January, Washington's Birthday the third Monday of February, Memorial Day the last Monday of May, Labor Day the first Monday of September, Columbus Day the second Monday of October, and Thanksgiving the fourth Thursday of November. Those never need to be moved. The ${nFixed} date-based holidays rotate through the week from one year to the next, which is why ${Y} has ${moved.length} shifted observance and ${Y + 1} has ${moved27.length}.</p>
<h2>The weekend rule and the ${Y + 1} dates</h2>
<p>The observed-date rule is written for federal employees with a Monday to Friday workweek. A holiday on a Saturday becomes a Friday off; a holiday on a Sunday becomes a Monday off. Employers outside government may copy the rule, but nothing obliges them to, and some simply let a weekend holiday pass. The rule is also why the first day of a year can be observed in the year before: ${ny28.name} ${Y + 2} is a ${wd(ny28.date)}, so it is observed on ${K.day(ny28.observed)}.</p>
${h.table(['Holiday', `${Y + 1} date`, 'Weekday', 'Observed'], H27.map((x) => [x.name, K.day(x.date), wd(x.date), x.observed === x.date ? 'same day' : `${wd(x.observed)}, ${K.day(x.observed)}`]), `Federal holidays in ${Y + 1}, computed with the rules OPM applies`)}
<p>The ${Y + 1} dates above are computed from the fixed and weekday rules with the same weekend shift, not copied from an OPM page; check the official list once OPM publishes it. With ${moved27.length} holidays falling on a weekend, ${Y + 1} hands federal employees ${['no', 'one', 'two', 'three', 'four', 'five'][moved27.length]} Fridays or Mondays off that differ from the calendar date, and ${h.a('working-days-calculator', 'the working days calculator')} counts the effect month by month for either year.</p>
<h3>Holidays and pay in the private sector</h3>
<p>For most private-sector workers the federal list is a reference, not an entitlement. Whether a holiday is a paid day off, an unpaid day off or an ordinary workday depends on the employer's policy or a contract. On pay, ${h.src('dol_fs23', 'Fact Sheet #23')} is direct: the FLSA does not require extra pay for work on Saturdays, Sundays or holidays as such. Holiday hours simply join the workweek total, and only hours past ${F.weeklyOvertimeAfter} are overtime under the ${h.src('usc_207', 'Fair Labor Standards Act')}. A week with five eight-hour days, one of them on a holiday, plus six hours on Saturday makes ${K.hrs(holWeek.total)} hours: ${K.hrs(holWeek.ot)} of them overtime at ${K.usd(RATE * F.overtimeMultiplier, 2)}, for ${K.usd(holWeek.pay.total, 2)} at ${K.usd(RATE)} an hour.</p>
<p>Holidays also move paydays and deadlines. A Friday payday on ${K.day(indep.observed)} or on Christmas Day is paid the business day before on the schedule this site uses, as ${h.a('biweekly-pay-schedule', 'the biweekly pay schedule')} shows, and ${h.a('business-days-calculator', 'the business days calculator')} skips observed holidays when it counts toward a due date.</p>
`,
  tool: 'working-days',
  related: ['working-days-calculator', 'business-days-calculator', 'biweekly-pay-schedule', 'date-calculator', 'overtime-calculator'],
  sources: ['opm_holidays', 'dol_fs23', 'usc_207', 'gsa_payroll'],
});
