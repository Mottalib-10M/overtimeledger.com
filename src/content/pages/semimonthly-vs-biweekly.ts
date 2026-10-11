import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const C = K.cal;
const F = K.F;
const Y = 2026;
const semi = C.paydays(Y, 'semimonthly');
const semiRaw = C.paydays(Y, 'semimonthly', undefined, false);
const moved = semiRaw.map((d, i) => ({ from: d, to: semi[i] })).filter((x) => x.from !== x.to);
const nSemi = semi.length;
const nBi = C.paydays(Y, 'biweekly', `${Y}-01-09`).length;
const hSemi = F.fullTimeHoursYear / nSemi;
const hBi = F.fullTimeHoursYear / nBi;
const dayH = F.fullTimeHoursYear / 52 / 5;
const SAL = 58000;
const cSemi = K.pay.perPaycheck(SAL, 'semimonthly', nSemi);
const cBi = K.pay.perPaycheck(SAL, 'biweekly', nBi);
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const last = (m: number) => new Date(Date.UTC(Y, m, 0)).getUTCDate();
const mm = (m: number) => String(m).padStart(2, '0');
const halves = MONTHS.map((_, i) => {
  const m = i + 1;
  return { first: C.businessDaysBetween(`${Y}-${mm(m)}-01`, `${Y}-${mm(m)}-15`, false).business, second: C.businessDaysBetween(`${Y}-${mm(m)}-16`, `${Y}-${mm(m)}-${last(m)}`, false).business };
});
const all = halves.flatMap((x) => [x.first, x.second]);
const lo = Math.min(...all);
const hi = Math.max(...all);
const RATE = 22;
const hits = semiRaw.filter((d) => !C.isWeekend(d) && C.isFederalHoliday(d)).length;
const ord = (n: number) => `${n}${n % 10 === 1 && n !== 11 ? 'st' : n % 10 === 2 && n !== 12 ? 'nd' : n % 10 === 3 && n !== 13 ? 'rd' : 'th'}`;
/** A Monday-to-Sunday workweek that straddles the 15th: Mon Jun 8 to Sun Jun 14 stays in one period; Mon Jun 15 to Sun Jun 21 is split. */
const wkStart = `${Y}-06-15`;
const wkEnd = C.addBusinessDays(wkStart, 4, false);
const straddle = K.week([10, 10, 9, 9, 8, 0, 0], 'federal', RATE);

export default definePage({
  id: 'semimonthly-vs-biweekly',
  group: 'calendar',
  order: 30,
  slug: 'semimonthly-vs-biweekly',
  nav: 'Semimonthly vs biweekly',
  card: 'Twice a month or every other week: checks, hours per period, overtime and paydays compared.',
  title: `Semimonthly vs Biweekly ${Y}: ${nSemi} or ${nBi} Checks Compared`,
  description: `Semimonthly vs biweekly pay in ${Y}: ${nSemi} checks of ${K.num(hSemi, 2)} full-time hours or ${nBi} of ${K.num(hBi)}, overtime still counted per workweek, and every payday moved off a weekend.`,
  h1: 'Semimonthly versus biweekly pay',
  intro: 'Compare the two most common pay frequencies on one salary or one hourly rate, with the real paydays of the year.',
  resume: `Semimonthly pay means ${nSemi} checks a year, on the 15th and the last day of each month; biweekly pay means ${nBi} checks, one every 14 days, and ${nBi + 1} in some years. On a full-time schedule of ${K.num(F.fullTimeHoursYear)} hours a year, each semimonthly check covers ${K.num(hSemi, 2)} hours on average and each biweekly check exactly ${K.num(hBi)}. A ${K.usd(SAL)} salary therefore pays ${K.usd(cSemi, 2)} twice a month or ${K.usd(cBi, 2)} every other Friday, the same year either way. The frequencies differ in rhythm, not in total. Biweekly checks always land on the same weekday and bring two months with a third check; semimonthly checks land on fixed dates, which move to the previous business day ${moved.length} times in ${Y} because the 15th or the month end falls on a weekend. Overtime does not follow either period: under the FLSA it is counted in each fixed workweek of ${F.workweekHours} hours, even when that week is cut in two by the 15th.`,
  faqs: [
    { q: 'Is semimonthly pay better than biweekly pay for an employee?', a: `In total, neither pays more: a salary of ${K.usd(SAL)} is ${K.usd(SAL)} on both. Semimonthly checks are larger, ${K.usd(cSemi, 2)} against ${K.usd(cBi, 2)}, and line up with rent and bills due on the 1st. Biweekly gives two months a year with a third check and a payday that is always the same weekday. Hourly workers paid semimonthly see the size of each check vary more.` },
    { q: 'How many hours are in a semimonthly pay period for full-time work?', a: `On average ${K.num(hSemi, 2)}, which is ${K.num(F.fullTimeHoursYear)} hours divided by ${nSemi} periods. The real count changes with the calendar: in ${Y} a half-month holds between ${lo} and ${hi} weekdays, so ${lo * dayH} to ${hi * dayH} scheduled hours at ${dayH} a day. A biweekly period is always ten weekdays, ${K.num(hBi)} hours, which is why time cards are easier to check on that frequency.` },
    { q: 'When the 15th falls on a weekend, when is a semimonthly payday?', a: `On the calendar used here, the business day before. In ${Y} that happens ${moved.length} times, for example ${K.day(moved[0].from)}, paid ${K.day(moved[0].to)}. A payday on an observed federal holiday moves the same way. Your employer's written policy fixes the direction, and some pay after the weekend instead; the list in the page shows each shifted date of the year.` },
    { q: 'How is overtime paid when a workweek is split between two semimonthly periods?', a: `The workweek is still counted as one unit. If ${K.hrs(straddle.total)} hours are worked from Monday ${K.day(wkStart)} to ${K.weekdayName(C.weekday(wkEnd))}, ${K.hrs(straddle.ot)} of them are overtime, even though part of the week belongs to the first half of June and part to the second. Payroll settles the overtime once the week has closed; it cannot drop it because neither half reached ${F.weeklyOvertimeAfter} hours.` },
  ],
  body: (h) => `
${h.mini('dSemiBi')}
<h2>The same year cut two ways</h2>
<p>A semimonthly payroll ties checks to the date: the 15th and the last day of the month. A biweekly payroll ties them to a weekday, usually Friday, every fourteenth day. That single choice explains every other difference. Twenty-four fixed dates divide the year evenly into halves of months that are not equal, from ${lo} to ${hi} weekdays each in ${Y}. Fourteen-day blocks are perfectly equal, ten weekdays apiece, but they do not divide the year evenly, so ${nBi} of them leave a day or two over, and every so often a ${nBi + 1}th payday appears.</p>
${h.table(['Month', 'Weekdays, 1st to 15th', 'Weekdays, 16th to end', `Hours at ${dayH} a day`], MONTHS.map((m, i) => [m, halves[i].first, halves[i].second, `${halves[i].first * dayH} / ${halves[i].second * dayH}`]), `Weekdays in each semimonthly period of ${Y} (holidays not removed)`, ['l', 'r', 'r', 'r'])}
<p>For a salaried employee the table changes nothing: the check is ${K.usd(cSemi, 2)} whether the half-month holds ${lo} weekdays or ${hi}. For an hourly worker at ${K.usd(RATE)} it matters a great deal, since a ${hi}-weekday half pays ${K.usd(hi * dayH * RATE)} of straight time and a ${lo}-weekday half ${K.usd(lo * dayH * RATE)}. On a biweekly payroll the same worker would see ${K.usd(hBi * RATE)} on every regular check. ${h.a('pay-periods', 'The pay periods page')} counts the checks of each frequency, and ${h.a('biweekly-pay-schedule', 'the biweekly schedule')} lists the Friday dates.</p>
<h2>Overtime ignores the 15th</h2>
<p>Neither frequency changes the federal overtime rule. The ${h.src('dol_fs23', 'Department of Labor')} measures overtime in a workweek, a fixed period of ${F.workweekHours} consecutive hours, and does not allow two weeks to be averaged. On a biweekly payroll that is easy, because each period is usually two whole workweeks. A semimonthly period starts and stops on dates, so most of them begin or end in the middle of a workweek.</p>
<p>Take the week starting Monday ${K.day(wkStart)}. Monday the 15th closes the first half of June, while Tuesday to Friday belong to the second, so payroll has to look across the line. Ten, ten, nine, nine and eight hours make ${K.hrs(straddle.total)}, of which ${K.hrs(straddle.ot)} are overtime at ${K.usd(RATE * F.overtimeMultiplier, 2)} an hour, ${K.usd(straddle.pay.total, 2)} gross for the week. The hours are paid in the period where they were worked, and the overtime is added once the workweek is complete. ${h.a('timesheet-calculator', 'The two-week timesheet')} keeps each workweek separate so this never gets lost.</p>
<h3>Semimonthly paydays moved in ${Y}</h3>
<p>Fixed dates collide with weekends. In ${Y}, ${moved.length} semimonthly paydays move to the business day before: ${K.listOf(moved.map((x) => `${K.day(x.from).replace(`, ${Y}`, '')} to ${K.weekdayName(C.weekday(x.to))} the ${ord(+x.to.slice(8))}`))}. ${hits === 0 ? `None of the ${nSemi} dates lands on a weekday holiday in ${Y}` : `${hits} of them fall on a weekday holiday`}; observed holidays come from the ${h.src('opm_holidays', 'OPM list')}. Biweekly Friday paydays move less often, only when a Friday is a holiday.</p>
<p>Some employers pick semimonthly pay for salaried staff, because the check is identical every time and lines up with monthly benefit premiums, and biweekly for hourly staff, because every check covers two complete workweeks. Some run both. When you change from one to the other, the transition check is the one to read closely, since it can cover a stub period that is shorter or longer than usual.</p>
`,
  tool: 'pay-periods',
  related: ['pay-periods', 'biweekly-pay-schedule', 'biweekly-pay-calculator', 'timesheet-calculator', 'overtime-calculator'],
  sources: ['dol_fs23', 'usc_207', 'opm_holidays', 'dol_fs22'],
});
