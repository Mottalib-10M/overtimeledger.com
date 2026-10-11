import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const C = K.cal;
const Y = 2026;
const wkFri = C.paydays(Y, 'weekly', `${Y}-01-02`, false).length;
const wkThu = C.paydays(Y, 'weekly', `${Y}-01-01`, false).length;
const bi26 = C.paydays(Y, 'biweekly', `${Y}-01-09`).length;
const bi27 = C.paydays(Y, 'biweekly', `${Y}-01-02`).length;
const semi = C.paydays(Y, 'semimonthly').length;
const mon = C.paydays(Y, 'monthly').length;
const thursdays = C.weekdayCount(Y, 4);
const SAL = 62000;
const p26 = K.pay.perPaycheck(SAL, 'biweekly');
const p27 = K.pay.perPaycheck(SAL, 'biweekly', bi27);
const RATE = 24;
const hourly = K.pay.hourlyToAnnual(RATE);

export default definePage({
  id: 'pay-periods',
  group: 'calendar',
  order: 20,
  slug: 'pay-periods',
  nav: 'Pay periods',
  card: 'How many pay periods each frequency gives in 2026, and what a 27-period year does to a salary.',
  title: `Pay Periods ${Y}: Weekly, Biweekly, Semimonthly, Monthly`,
  description: `Pay periods in ${Y}: ${wkFri} or ${wkThu} weekly, ${bi26} or ${bi27} biweekly, ${semi} semimonthly, ${mon} monthly, and how a salary is split when the year holds ${bi27} biweekly periods.`,
  h1: 'Pay periods in a year, by pay frequency',
  intro: 'Choose a pay frequency and the first payday; the tool counts the pay periods of the year and the amount of each check.',
  resume: `${Y} holds ${semi} pay periods on a semimonthly payroll and ${mon} on a monthly one, every year without exception, because those payrolls are tied to dates of the month. Frequencies tied to a weekday move with the calendar. A weekly payroll gets ${wkFri} pay periods when payday is a Friday, but ${wkThu} Thursday paydays fit in the year, which starts and ends on a Thursday and contains ${thursdays} of them, as long as the New Year's Day check is not pulled back into December. A biweekly payroll gets ${bi26} periods on one Friday cycle and ${bi27} on the other, the extra one coming from a ${K.day(`${Y + 1}-01-01`)} payday moved back into December by the New Year holiday. For a salaried employee that difference is real money per check: ${K.usd(SAL)} a year divided by ${bi26} is ${K.usd(p26, 2)}, divided by ${bi27} it is ${K.usd(p27, 2)}. An hourly worker is not affected the same way, since hourly pay follows the hours actually worked in each period.`,
  faqs: [
    { q: `How many weekly pay periods are there in ${Y}?`, a: `${wkFri} if payday falls on a Friday, and ${wkThu} if it falls on a Thursday. ${Y} begins on Thursday, January 1, and ends on Thursday, December 31, so Thursday is the one weekday that occurs ${thursdays} times. January 1 is a holiday, though: paid a day early, that check counts in the prior year. Any other weekday gives ${wkFri}, one check per fixed workweek.` },
    { q: `Does my salary per paycheck go down in a ${bi27}-pay-period year?`, a: `It can. If your employer divides the annual salary by the number of paydays in the year, each check shrinks: ${K.usd(SAL)} over ${bi27} checks is ${K.usd(p27, 2)} instead of ${K.usd(p26, 2)}, about ${K.usd(p26 - p27, 2)} less. Other employers keep the per-check amount and simply pay one extra check, which raises the year's total. Your offer letter or pay policy says which method applies.` },
    { q: 'What is the difference between a pay period and a payday?', a: 'A pay period is the span of work a check covers, for example two weeks from Sunday to Saturday. The payday is the date the money is paid, often several days after the period closes so payroll can process time cards. A period that ends on December 26 can therefore be paid in January, and payroll reports generally place a check in the year of its payday.' },
    { q: `Do hourly workers earn more in a year with ${bi27} biweekly paychecks?`, a: `Not because of the extra check. Hourly pay follows hours: at ${K.usd(RATE)} an hour and ${K.F.weeklyOvertimeAfter} hours a week, the year is worth about ${K.usd(hourly)} whether it is cut into ${bi26} or ${bi27} checks. The ${bi27}th check only moves pay for days already worked into the current year. What changes is the count of checks, not the hourly rate or the hours.` },
    { q: 'Is a pay period the same as the workweek used for overtime?', a: `No. The Fair Labor Standards Act measures overtime per workweek, a fixed and recurring period of ${K.F.workweekHours} hours set by the employer. A biweekly or semimonthly pay period spans two or more workweeks, whole or partial, and the hours past ${K.F.weeklyOvertimeAfter} are counted inside each workweek, never averaged across the whole period, as Fact Sheet #23 explains.` },
  ],
  body: (h) => `
${h.mini('dSalary27')}
<h2>Pay periods per frequency in ${Y}</h2>
<p>The count depends on two things only: whether the payroll follows the month or the week, and, for weekly and biweekly payrolls, which weekday is payday. The table uses the calendar engine of this site, with paydays that fall on an observed holiday moved to the business day before.</p>
${h.table(['Frequency', 'Pay periods in ' + Y, `Gross per check on ${K.usd(SAL)}`], [
    ['Weekly, Friday payday', wkFri, K.usd(K.pay.perPaycheck(SAL, 'weekly', wkFri), 2)],
    ['Weekly, Thursday payday, Jan 1 check kept in ' + Y, wkThu, K.usd(K.pay.perPaycheck(SAL, 'weekly', wkThu), 2)],
    [`Biweekly, first payday ${K.day(`${Y}-01-09`)}`, bi26, K.usd(p26, 2)],
    [`Biweekly, first payday ${K.day(`${Y}-01-02`)}`, bi27, K.usd(p27, 2)],
    ['Semimonthly (15th and last day)', semi, K.usd(K.pay.perPaycheck(SAL, 'semimonthly', semi), 2)],
    ['Monthly (last day)', mon, K.usd(K.pay.perPaycheck(SAL, 'monthly', mon), 2)],
  ], `Number of pay periods in ${Y} and the salary per check if it is divided evenly`, ['l', 'r', 'r'])}
<p>The semimonthly and monthly lines never move, which is one reason employers with many salaried staff prefer them. The weekday-based lines are where surprises happen. A year has ${C.daysBetween(`${Y}-01-01`, `${Y + 1}-01-01`)} days, a leap year one more, so fifty-two weeks always leave a day or two over; every few years that remainder adds a full extra payday to some weekly or biweekly payrolls. In ${Y} the extra weekly payday belongs to Thursday payrolls, and the extra biweekly payday to the Friday cycle that started ${K.day(`${Y}-01-02`)}. ${h.a('biweekly-pay-schedule', 'The biweekly schedule')} lists each of those dates.</p>
<h2>Salaried pay in a year with an extra period</h2>
<p>Annual salaries are usually quoted as a yearly figure and then cut into checks. When the number of checks rises from ${bi26} to ${bi27}, the employer has two honest choices, and both appear in practice. The first divides the salary by ${bi27}: each check falls by ${K.usd(p26 - p27, 2)} on a ${K.usd(SAL)} salary, and the year's gross stays exactly at ${K.usd(SAL)}. The second keeps the usual ${K.usd(p26, 2)} check and pays it ${bi27} times, for ${K.usd(p26 * bi27, 2)} in the calendar year. That looks like a raise but is really pay pulled forward, since the following year will usually have ${bi26} checks again.</p>
<p>Neither method changes an hourly rate. Where it matters is in anything set per check: a 401(k) contribution entered as a dollar amount, a benefit premium taken from every paycheck, or a household budget built around a fixed deposit. Check your first stub of the year, and compare its gross with the salary divided by both counts. ${h.a('salary-to-hourly-calculator', 'The salary to hourly converter')} turns either figure into an hourly equivalent, and federal employees whose hourly rate is set by the ${h.src('opm_2087', 'OPM 2,087-hour divisor')} are paid on the separate ${h.src('gsa_payroll', 'GSA payroll calendar')}.</p>
<h3>Exempt status when checks get smaller</h3>
<p>The federal salary level for the white-collar exemptions is set per week, ${K.usd(K.F.exemptSalaryWeekly)} (${h.src('dol_salary', 'DOL salary levels')}), not per paycheck. Spreading a salary over more checks does not change what is earned per week, so dividing by ${bi27} does not by itself push anyone below the level. A salary close to ${K.usd(K.F.exemptSalaryAnnual)} a year deserves a second look anyway, and ${h.a('exempt-vs-nonexempt', 'the exempt versus nonexempt page')} explains the duties tests that also apply.</p>
<p>Overtime is measured on yet another clock. Whatever the pay frequency, the ${h.src('dol_fs23', 'Department of Labor')} counts hours past ${K.F.weeklyOvertimeAfter} inside each fixed workweek, so a pay period is only the envelope that carries the result. ${h.a('semimonthly-vs-biweekly', 'The semimonthly versus biweekly comparison')} shows how a period that splits a workweek is handled.</p>
`,
  tool: 'pay-periods',
  related: ['biweekly-pay-schedule', 'semimonthly-vs-biweekly', 'biweekly-pay-calculator', 'salary-to-hourly-calculator', 'exempt-vs-nonexempt'],
  sources: ['dol_fs23', 'dol_salary', 'gsa_payroll', 'opm_2087', 'opm_holidays'],
});
