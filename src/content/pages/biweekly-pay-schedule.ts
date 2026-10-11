import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const C = K.cal;
const Y = 2026;
const A9 = `${Y}-01-09`;
const A2 = `${Y}-01-02`;
const A1 = `${Y}-01-01`;
const fri9 = C.paydays(Y, 'biweekly', A9);
const fri2 = C.paydays(Y, 'biweekly', A2);
const fri2raw = C.paydays(Y, 'biweekly', A2, false);
const thuRaw = C.paydays(Y, 'biweekly', A1, false);
const thuAdj = C.paydays(Y, 'biweekly', A1);
const thursdays = C.weekdayCount(Y, 4);
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const triple = (l: string[]) => MONTHS.filter((_, i) => l.filter((d) => +d.slice(5, 7) === i + 1).length === 3);
const t9 = triple(fri9);
const t2 = triple(fri2);
/** Cadence dates that are not business days, with the day the check moves to (next January included). */
const shifts = (anchor: string) => {
  const raw = [...C.paydays(Y, 'biweekly', anchor, false), ...C.paydays(Y + 1, 'biweekly', anchor, false).slice(0, 1)];
  return raw.filter((d) => !C.isBusinessDay(d)).map((d) => ({ from: d, to: C.previousBusinessDay(d), name: K.holidays2026.concat(C.federalHolidays(Y + 1)).find((x) => x.observed === d)?.name ?? '' }));
};
const s9 = shifts(A9);
const s2 = shifts(A2);
const xmas = K.holidays2026.find((x) => x.name === 'Christmas Day')!;
const xmasPay = C.previousBusinessDay(xmas.observed);
const ny27 = C.federalHolidays(Y + 1)[0];
const cell = (l: string[], m: number) => l.filter((d) => +d.slice(5, 7) === m).map((d) => { const w = C.weekday(d); return `${+d.slice(8)}${w === 5 ? '' : ` (${K.weekdayName(w).slice(0, 3)})`}`; }).join(', ');

export default definePage({
  id: 'biweekly-pay-schedule',
  group: 'calendar',
  order: 10,
  slug: 'biweekly-pay-schedule',
  nav: 'Biweekly pay schedule',
  card: 'Every 2026 Friday payday for both biweekly cycles, with the months that bring a third check.',
  title: `Biweekly Pay Schedule ${Y}: Every Payday, ${fri9.length} or ${fri2.length} Checks`,
  description: `Biweekly pay schedule ${Y}: every Friday payday from Jan 9 or from Jan 2, the ${t9.length + t2.length} three-check months, the ${fri2.length}-payday case and holiday paydays moved earlier.`,
  h1: 'Biweekly pay schedule for the whole year',
  intro: 'Pick the date of your first payday in January and the calendar lists every biweekly payday of the year, holidays handled.',
  resume: `A biweekly payroll in ${Y} pays ${fri9.length} times when the first Friday payday is ${K.day(A9)}, and ${fri2.length} times when it is ${K.day(A2)}. The difference comes from the calendar, not from the employer: ${Y} has ${C.daysBetween(A1, `${Y + 1}-01-01`)} days, one more than ${fri9.length} cycles of 14, so one of the two Friday rhythms picks up an extra check. On the ${K.day(A2)} cycle that extra check is due ${K.day(ny27.date)}, which is ${ny27.name}, so payroll moves it back to ${K.day(C.previousBusinessDay(ny27.date))} and it lands in ${Y}. Each rhythm also brings months with three checks instead of two: ${K.listOf(t9)} on the first, ${K.listOf(t2)} on the second. ${xmas.name} falls on a ${K.weekdayName(C.weekday(xmas.date))} this year, so the ${K.day(xmas.date)} payday of the ${K.day(A9)} cycle is paid ${K.day(xmasPay)}. The tables below list every date, with the federal holidays that push a payday earlier.`,
  faqs: [
    { q: `Which months of ${Y} bring a third biweekly paycheck?`, a: `It depends on your cycle. With Friday paydays starting ${K.day(A9)}, the three-check months are ${K.listOf(t9)}. With the cycle that starts ${K.day(A2)}, they are ${K.listOf(t2)}, the December one including the check moved back from ${ny27.name}. Households that budget on two checks a month often send the third one straight to savings or to a card balance.` },
    { q: `Why does my employer say there are ${fri2.length} pay dates in ${Y}?`, a: `Because ${Y} has ${C.daysBetween(A1, `${Y + 1}-01-01`)} days and ${fri9.length} biweekly cycles cover only ${fri9.length * 14}. On the Friday cycle that begins ${K.day(A2)}, the cycle reaches ${K.day(ny27.date)}, a federal holiday, and that check is paid on ${K.day(C.previousBusinessDay(ny27.date))}. The pay year then counts ${fri2.length} paydays even though only ${fri2raw.length} Fridays of the rhythm fall in ${Y}.` },
    { q: `When is payday in Christmas week ${Y} on a biweekly schedule?`, a: `${xmas.name} is ${K.day(xmas.date)}, a ${K.weekdayName(C.weekday(xmas.date))} and an observed federal holiday listed by OPM. Employees on the cycle that started ${K.day(A9)} have a payday that day, and the schedule here pays it on the business day before, ${K.day(xmasPay)}. Employees on the ${K.day(A2)} cycle are paid ${K.day(fri2.filter((d) => d.startsWith(`${Y}-12`)).slice(-2)[0])} and then on New Year's Eve, ${K.day(fri2[fri2.length - 1])}.` },
    { q: 'Is a biweekly payday that falls on a holiday paid before or after it?', a: `The schedule on this page pays the business day before, a common payroll practice and the safer one for cash flow. No federal rule in the Fair Labor Standards Act fixes the direction; your employer's written pay policy does. Each move is listed in the tables, such as the Juneteenth check of the ${K.day(A2)} cycle, due ${K.day(s2[0].from)} and paid ${K.day(s2[0].to)}.` },
    { q: 'Are federal employees paid on the same biweekly calendar?', a: `Not necessarily. The General Services Administration publishes its own ${Y} payroll calendar for the agencies whose pay it processes, with pay period numbers and dates that follow federal payroll rules. Check that document for federal pay dates. The schedules on this page show the two private-sector Friday rhythms and the observed holidays published by the Office of Personnel Management.` },
  ],
  body: (h) => `
${h.mini('paydayCount')}
<p>The counter above follows the 14-day rhythm alone. It reports the Fridays of the cycle that land in ${Y}; the shift of a holiday check into late December, explained below, is what turns ${fri2raw.length} Fridays into ${fri2.length} paydays on the ${K.day(A2)} cycle.</p>
<h2>All ${Y} paydays, month by month</h2>
<p>Most employers paying every other week run one of two Friday cycles. Which one you are on is printed on your first January pay stub. A day number alone means a Friday; a weekday in brackets means the check was moved because the Friday was an observed federal holiday.</p>
${h.table(['Month', `Cycle starting ${K.day(A9)}`, `Cycle starting ${K.day(A2)}`], MONTHS.map((m, i) => [m, cell(fri9, i + 1), cell(fri2, i + 1)]), `Biweekly paydays in ${Y}, moved to the previous business day when needed`)}
<p>Count the cells and the totals come out at ${fri9.length} and ${fri2.length}. The first cycle has ${t9.length} months with a third check, the second ${t2.length}. A family that budgets on two checks a month therefore receives a spare paycheck in ${K.listOf(t9)} on the first rhythm, and in ${K.listOf(t2)} on the second. Ongoing deductions taken per check, such as a fixed health plan premium, can also come out a third time in those months unless the plan spreads them over the pay periods it expects.</p>
<h2>Holiday paydays pulled forward</h2>
<p>A Friday payday collides with an observed federal holiday a few times a year, and many banks and payroll offices close for them. The ${h.src('opm_holidays', 'OPM holiday list')} gives the observed dates; this page moves each affected check to the previous business day.</p>
${h.table(['Cycle', 'Scheduled', 'Holiday', 'Paid on'], [...s9.map((s) => [`From ${K.day(A9)}`, K.day(s.from), s.name, K.day(s.to)]), ...s2.map((s) => [`From ${K.day(A2)}`, K.day(s.from), s.name, K.day(s.to)])], 'Paydays that fall on an observed holiday')}
<p>${xmas.name} is the case everyone notices: on the first cycle the check is due on ${K.day(xmas.date)} and arrives on ${K.day(xmasPay)}, a ${K.weekdayName(C.weekday(xmasPay))}. On the second cycle, the payday due on ${K.day(ny27.date)} is paid on ${K.day(C.previousBusinessDay(ny27.date))}, so the extra check counts in the ${Y} payroll year rather than the next one. Some employers instead pay after the holiday; if your handbook says so, add a business day rather than subtracting one.</p>
<h3>The rare 27th payday on Thursdays</h3>
<p>${Y} contains ${thursdays} Thursdays, the only weekday that appears ${thursdays} times, because the year starts and ends on one. A biweekly payroll with Thursday paydays starting ${K.day(A1)} therefore lists ${thuRaw.length} cadence dates, from ${K.day(thuRaw[0])} to ${K.day(thuRaw[thuRaw.length - 1])}. The catch is that ${K.day(A1)} is New Year's Day: paid a business day early, that first check moves to December 31 of the prior year, and the ${Y} count falls back to ${thuAdj.length}. Salaried employees feel a true ${fri2.length}-check year as a smaller check, since the annual salary is divided by more periods; ${h.a('pay-periods', 'the pay periods page')} works through that arithmetic, and ${h.a('semimonthly-vs-biweekly', 'the semimonthly comparison')} shows why twice-monthly payrolls never meet this problem.</p>
<p>Federal agencies follow their own calendar. The ${h.src('gsa_payroll', 'General Services Administration payroll calendar')} sets pay periods and pay dates for the agencies it services, and it should be read directly rather than inferred from a private Friday rhythm. Overtime is separate from all of this: whatever the payday, the ${h.src('dol_fs23', 'Department of Labor')} counts overtime per fixed workweek of ${K.F.workweekHours} hours, so each half of a biweekly period is checked on its own, as ${h.a('biweekly-pay-calculator', 'the biweekly pay calculator')} does.</p>
`,
  tool: 'pay-schedule',
  related: ['pay-periods', 'semimonthly-vs-biweekly', 'biweekly-pay-calculator', 'federal-holidays', 'working-days-calculator'],
  sources: ['opm_holidays', 'gsa_payroll', 'dol_fs23', 'usc_207'],
});
