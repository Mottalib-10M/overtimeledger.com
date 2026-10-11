import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const F = K.F;
const W = F.weeklyOvertimeAfter;
const full = F.fullTimeHoursYear;
const opm = F.opmHourlyDivisor;
const s60 = K.pay.salaryToHourly(60000, W);
const o60 = K.pay.salaryToHourlyOpm(60000, opm);
const weekdays2026 = K.cal.workingDaysByMonth(2026).reduce((t, m) => t + m.weekdays, 0);
const workdays2026 = K.cal.workingDaysByMonth(2026).reduce((t, m) => t + m.business, 0);
const day = full / 52 / 5;
const SAL = [30000, 35000, 40000, 45000, 50000, 55000, 60000, 65000, 70000, 75000, 80000, 90000, 100000, 120000, 150000];
const s75at50 = K.pay.salaryToHourly(75000, 50);
const s75at40 = K.pay.salaryToHourly(75000, W);
const s48pt = K.pay.salaryToHourly(48000, 30);
const s52unpaid = K.pay.salaryToHourly(52000, W, 50);

export default definePage({
  id: 'salary-to-hourly-calculator',
  group: 'pay',
  order: 10,
  slug: 'salary-to-hourly-calculator',
  nav: 'Salary to hourly',
  card: 'An annual salary turned into an hourly rate over your real hours, with the federal 2,087-hour method beside it.',
  title: `Salary to Hourly 2026: Annual Pay Divided by ${K.num(full)} Hours`,
  description: `Salary to hourly in 2026: divide annual pay by ${K.num(full)} hours, so ${K.usd(60000)} is ${K.usd(s60, 2)} an hour, or use the ${K.num(opm)}-hour federal divisor. Table of common salaries.`,
  h1: 'Annual salary to hourly rate',
  intro: 'Type a yearly salary and the hours you really work; the converter gives the hourly, weekly and per-paycheck figures.',
  resume: `To turn an annual salary into an hourly rate, divide it by the hours paid in a year: ${K.num(full)} for a full-time schedule of ${W} hours over 52 weeks. A salary of ${K.usd(60000)} is therefore ${K.usd(s60, 2)} an hour, ${K.usd(50000)} is ${K.usd(K.pay.salaryToHourly(50000, W), 2)} and ${K.usd(100000)} is ${K.usd(K.pay.salaryToHourly(100000, W), 2)}. The quick mental version is to halve the salary and drop three zeros: ${K.usd(60000)} gives about $30, slightly high because it assumes ${K.num(2000)} hours. The federal government uses a different divisor for its own civilian staff. Under 5 U.S.C. 5504(b), OPM divides annual basic pay by ${K.num(opm)} hours, the average number of paid weekday hours in a year over a 28-year cycle, which puts ${K.usd(60000)} at ${K.usd(o60, 2)}. Both methods are correct for what they measure. When your actual week is longer or shorter than ${W} hours, or some weeks are unpaid, the converter above divides by the hours you really work, which is the number that matters when you compare a salaried offer with an hourly one.`,
  faqs: [
    { q: `Why do some employers divide salary by ${K.num(opm)} instead of ${K.num(full)}?`, a: `${K.num(full)} assumes exactly 52 weeks of ${W} hours. A real year has 52 weeks plus one or two days, so it contains ${K.num(full + day)} or ${K.num(full + 2 * day)} weekday hours in most years. OPM averages that over 28 years and uses ${K.num(opm)} under 5 U.S.C. 5504(b) for federal civilian employees. On a ${K.usd(60000)} salary the gap is ${K.usd(s60 - o60, 2)} an hour.` },
    { q: 'Is $75,000 a year still $36 an hour if I work 50 hours a week?', a: `No. ${K.usd(75000)} over ${W} hours a week is ${K.usd(s75at40, 2)} an hour, but spread over 50 hours a week it falls to ${K.usd(s75at50, 2)}. For an exempt employee nothing else changes, so every extra hour lowers the effective rate. Put your real weekly hours in the converter to see the figure that compares fairly with an hourly job.` },
    { q: 'How do I convert a part-time salary to an hourly rate?', a: `Divide by the part-time hours, not the full-time ones. A ${K.usd(48000)} salary for a 30-hour week is 30 times 52, or ${K.num(30 * 52)} hours, which gives ${K.usd(s48pt, 2)} an hour. Dividing the same salary by ${K.num(full)} would understate the rate at ${K.usd(K.pay.salaryToHourly(48000, W), 2)}, a mistake that often appears when people compare part-time offers.` },
    { q: 'Should unpaid weeks change my hourly equivalent?', a: `Yes, if the salary covers fewer working weeks. A ${K.usd(52000)} salary for 50 paid weeks of ${W} hours is ${K.usd(s52unpaid, 2)} an hour, against ${K.usd(K.pay.salaryToHourly(52000, W), 2)} over 52 weeks. Paid vacation is different: those weeks are part of the salary, so they stay in the divisor. Set the weeks field to the weeks you are paid for.` },
    { q: 'What hourly rate matches the federal exempt salary level?', a: `${K.usd(F.exemptSalaryAnnual)} a year, the Department of Labor level for the main white-collar exemptions, equals ${K.usd(K.pay.salaryToHourly(F.exemptSalaryAnnual, W), 2)} an hour over ${K.num(full)} hours, or ${K.usd(F.exemptSalaryWeekly)} a week. A salaried worker paid less than that is owed overtime past ${W} hours whatever the job title, which is covered on the exempt versus nonexempt page.` },
  ],
  body: (h) => `
${h.mini('cSalaryDivisor')}
<h2>Where ${K.num(full)} and ${K.num(opm)} come from</h2>
<p>${K.num(full)} is simply ${W} hours times 52 weeks, and it is the divisor most payroll systems, offer letters and job boards use. It is tidy, and it ignores the calendar. A year is 365 days, or 366, so it always holds 52 full weeks plus one or two extra days. In 2026 the extra day is a Thursday, which gives ${weekdays2026} weekdays, or ${K.num(weekdays2026 * day)} weekday hours at ${day} a day, ${K.num(weekdays2026 * day - full)} more than the round figure. Leap years that start on a weekday can reach ${K.num(full + 2 * day)}.</p>
<p>The federal government settled this for its own payroll in ${h.src('opm_2087', '5 U.S.C. 5504(b)')}. OPM takes the paid weekday hours of each year across a 28-year cycle, after which the calendar repeats, and averages them. Seven of those years have ${K.num(full)} hours, seventeen have ${K.num(full + day)} and four have ${K.num(full + 2 * day)}; the mean rounds to ${K.num(opm)}. Hourly rates for federal civilian employees are computed with it. Private employers are free to choose, and most keep ${K.num(full)} because it is easier to explain on a pay stub.</p>
<p>The difference looks small and adds up. On ${K.usd(60000)} it is ${K.usd(s60 - o60, 2)} an hour; on ${K.usd(150000)}, ${K.usd(K.pay.salaryToHourly(150000, W) - K.pay.salaryToHourlyOpm(150000, opm), 2)}. When a leave balance of 200 hours is cashed out, the choice of divisor moves the check by ${K.usd(200 * (K.pay.salaryToHourly(150000, W) - K.pay.salaryToHourlyOpm(150000, opm)), 2)} at the top of that range.</p>
${h.table(['Annual salary', `Hourly (${K.num(full)} h)`, `Hourly (${K.num(opm)} h)`, 'Weekly', 'Biweekly (26)'], SAL.map((a) => [K.usd(a), K.usd(K.pay.salaryToHourly(a, W), 2), K.usd(K.pay.salaryToHourlyOpm(a, opm), 2), K.usd(a / 52, 2), K.usd(K.pay.perPaycheck(a, 'biweekly'), 2)]), 'Common salaries converted to hourly, weekly and biweekly gross pay', ['l', 'r', 'r', 'r', 'r'])}
<h2>Divide by the hours you actually work</h2>
<p>Both divisors assume a ${W}-hour week. Many salaried people work more, and for an exempt employee the salary does not grow with the hours. A project manager on ${K.usd(75000)} who logs 50 hours a week earns ${K.usd(s75at50, 2)} for each of them, not ${K.usd(s75at40, 2)}. That effective rate is the honest comparison with an hourly position paying time and a half past ${W}: ${h.a('hourly-to-salary-calculator', 'the hourly to salary converter')} runs the opposite direction with overtime included.</p>
<p>A part-time salary needs its own hours too. Thirty hours a week is ${K.num(30 * 52)} hours a year, and dividing a ${K.usd(48000)} part-time salary by ${K.num(full)} instead would understate the rate by ${K.usd(s48pt - K.pay.salaryToHourly(48000, W), 2)}. School-year contracts with unpaid summer weeks are the third case: remove the weeks that are not paid, keep the paid vacation weeks in.</p>
<p>Salary conversion stops at gross pay. Benefits, a 401(k) match or health coverage are worth real money but are not wages, and taxes depend on your own situation. A nonexempt employee paid a salary below ${K.usd(F.exemptSalaryWeekly)} a week also has overtime rights, explained on ${h.a('exempt-vs-nonexempt', 'the exempt versus nonexempt page')} and calculated on ${h.a('salaried-overtime', 'the salaried overtime page')}. In 2026, ${workdays2026} of the ${weekdays2026} weekdays are workdays once the federal holidays are removed; those holidays stay paid for salaried staff, so they remain in the divisor.</p>
<h2>Reading the rate off a pay stub</h2>
<p>Pay stubs rarely print an hourly figure for salaried staff, but you can rebuild it from the gross line. Multiply the gross by the number of paychecks in the year, then divide by the yearly hours. A semimonthly check of ${K.usd(K.pay.perPaycheck(60000, 'semimonthly'), 2)} times 24 gives back ${K.usd(60000)}; a monthly one of ${K.usd(K.pay.perPaycheck(60000, 'monthly'), 2)} times 12 does the same. The trap is the biweekly schedule. Twenty-six checks of ${K.usd(K.pay.perPaycheck(60000, 'biweekly'), 2)} make the full salary, yet some years carry a twenty-seventh payday, and an employer that keeps the same check amount then pays more over the calendar year. ${h.a('biweekly-pay-calculator', 'The biweekly pay page')} counts the 2026 paydays from your first January check.</p>
<p>Once the hourly figure is known, it is often the base for extras paid by the hour on top of the salary, such as an on-call hour or a holiday shift premium under a company policy; overtime for a nonexempt salaried employee follows the hours-worked method instead. Use the same divisor your employer uses, which the handbook or the payroll office can confirm, so your check and theirs agree to the cent.</p>
`,
  tool: 'salary-to-hourly',
  related: ['hourly-to-salary-calculator', 'exempt-vs-nonexempt', 'salaried-overtime', 'biweekly-pay-calculator', 'hourly-rate-calculator'],
  sources: ['opm_2087', 'dol_salary', 'dol_fs23', 'opm_holidays'],
});
