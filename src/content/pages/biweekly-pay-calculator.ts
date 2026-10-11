import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const F = K.F;
const W = F.weeklyOvertimeAfter;
const rate = 20;
const wk1 = K.week([10, 10, 10, 10, 10, 0, 0], 'federal', rate);
const wk2 = K.week([6, 6, 6, 6, 6, 0, 0], 'federal', rate);
const even = K.week([8, 8, 8, 8, 8, 0, 0], 'federal', rate);
const split = wk1.pay.total + wk2.pay.total;
const flat = even.pay.total * 2;
const thursdays = K.cal.weekdayCount(2026, 4);
const fridays = K.cal.weekdayCount(2026, 5);
const ANCH: Array<[string, string]> = [['2026-01-01', 'Thursday, January 1'], ['2026-01-02', 'Friday, January 2'], ['2026-01-08', 'Thursday, January 8'], ['2026-01-09', 'Friday, January 9']];
const rows = ANCH.map(([a, label]) => { const raw = K.cal.paydays(2026, 'biweekly', a, false); const adj = K.cal.paydays(2026, 'biweekly', a); return { label, raw: raw.length, adj: adj.length, first: adj[0], last: adj[adj.length - 1] }; });
const maxChecks = Math.max(...rows.map((r) => r.raw), ...rows.map((r) => r.adj));
const sal = 65000;

export default definePage({
  id: 'biweekly-pay-calculator',
  group: 'pay',
  order: 40,
  slug: 'biweekly-pay-calculator',
  nav: 'Biweekly pay',
  card: 'The gross amount of a two-week paycheck, with overtime counted week by week and the 2026 payday count.',
  title: `Biweekly Pay 2026: Gross Check, Overtime and ${maxChecks} Paydays`,
  description: `Biweekly pay 2026: gross pay for two weeks with overtime past ${W} hours counted in each week, not over 80 hours, and why some schedules get ${maxChecks} paychecks.`,
  h1: 'Biweekly paycheck calculator',
  intro: 'Enter the hours of each of the two weeks and your rate, or a yearly salary; the calculator returns the gross amount of the check.',
  resume: `A biweekly paycheck covers two workweeks, and its gross amount is the pay for each week added together, never the two weeks pooled. For an hourly worker at ${K.usd(rate)}, two even weeks of ${W} hours pay ${K.usd(flat, 2)}. If the same 80 hours are split 50 and 30, the first week contains ${K.hrs(wk1.ot)} overtime hours at time and a half and the check rises to ${K.usd(split, 2)}, because the FLSA measures overtime in each fixed workweek and does not allow averaging. A salaried employee's biweekly gross is usually the annual salary divided by 26: ${K.usd(sal)} becomes ${K.usd(K.pay.perPaycheck(sal, 'biweekly'), 2)} a check. The calendar complicates that count. 2026 has ${thursdays} Thursdays and ${fridays} of every other weekday, so a schedule paying every other Thursday from January 1 lands on 27 dates, and a Friday schedule from January 2 pays 27 checks once the New Year's Day payday of 2027 moves back to December 31. Employers who keep the same check in a 27-pay year pay ${K.usd(K.pay.perPaycheck(sal, 'biweekly'))} more than the salary.`,
  faqs: [
    { q: 'I worked 50 hours one week and 30 the next; is overtime owed on my biweekly check?', a: `Yes, for ${K.hrs(wk1.ot)} hours. Each workweek stands alone under Fact Sheet #23, so the 50-hour week has ${K.hrs(wk1.ot)} hours past ${W}, paid at time and a half, even though the pay period totals 80. At ${K.usd(rate)} an hour the check should be ${K.usd(split, 2)} gross, not ${K.usd(flat, 2)}. A pay stub that shows 80 straight hours for that period is short.` },
    { q: 'Will I get 27 paychecks in 2026?', a: `It depends on your payday. 2026 has ${thursdays} Thursdays, so a schedule that pays every other Thursday starting January 1 has 27 dates, although the New Year's Day check is often issued December 31, 2025. A Friday schedule starting January 2 has 26 regular dates, plus a January 1, 2027 payday that moves back to December 31. Enter your first January payday in the mini calculator.` },
    { q: 'How do employers handle a salary in a year with 27 biweekly paydays?', a: `Two ways. Some keep the usual check, annual salary divided by 26, so the employee receives one extra check and more than the stated salary for the calendar year: ${K.usd(K.pay.perPaycheck(sal, 'biweekly'), 2)} times 27 on ${K.usd(sal)}. Others divide by 27, which lowers each check to ${K.usd(K.pay.perPaycheck(sal, 'biweekly', 27), 2)}. Your handbook or offer letter should say which method applies.` },
    { q: 'Is biweekly pay the same as twice a month?', a: `No. Biweekly means every other week, 26 checks in most years, each covering exactly two workweeks. Semimonthly means twice a month, usually the 15th and the last day, 24 checks of ${K.usd(K.pay.perPaycheck(sal, 'semimonthly'), 2)} on ${K.usd(sal)}, against ${K.usd(K.pay.perPaycheck(sal, 'biweekly'), 2)} biweekly. Semimonthly periods do not line up with workweeks, which makes overtime harder to check on the stub.` },
  ],
  body: (h) => `
${h.mini('paydayCount')}
<h2>Two workweeks inside one paycheck</h2>
<p>Payroll groups time into pay periods; the overtime law groups it into workweeks. ${h.src('dol_fs23', 'Fact Sheet #23')} defines a workweek as a fixed, recurring period of ${F.workweekHours} hours, seven consecutive days chosen by the employer, and states that each one stands alone. A biweekly period is therefore two separate overtime calculations printed on one check. The calculator above asks for the days of week one and week two in separate rows for exactly that reason.</p>
<p>Take a warehouse associate at ${K.usd(rate)} an hour who covers for a colleague. Week one: five 10-hour shifts, ${K.hrs(wk1.total)} hours, of which ${K.hrs(wk1.reg)} are straight time and ${K.hrs(wk1.ot)} are overtime, paid ${K.usd(wk1.pay.total, 2)}. Week two: five 6-hour shifts, ${K.hrs(wk2.total)} hours, paid ${K.usd(wk2.pay.total, 2)}. The check is ${K.usd(split, 2)}. An employer who averaged the period would print ${K.usd(flat, 2)} and keep ${K.usd(split - flat, 2)} that belongs to the worker. In California, Alaska, Nevada or Colorado, long single days can create overtime even inside a short week; ${h.a('timesheet-calculator', 'the two-week timesheet')} applies those daily rules day by day.</p>
${h.table(['', 'Week 1', 'Week 2', 'Pay period'], [['Hours worked', K.hrs(wk1.total), K.hrs(wk2.total), K.hrs(wk1.total + wk2.total)], ['Straight time', K.hrs(wk1.reg), K.hrs(wk2.reg), K.hrs(wk1.reg + wk2.reg)], ['Overtime at 1.5x', K.hrs(wk1.ot), K.hrs(wk2.ot), K.hrs(wk1.ot + wk2.ot)], ['Gross pay', K.usd(wk1.pay.total, 2), K.usd(wk2.pay.total, 2), K.usd(split, 2)]], `An uneven 80-hour pay period at ${K.usd(rate)} an hour, federal rule`, ['l', 'r', 'r', 'r'])}
<h2>Counting the paydays of 2026</h2>
<p>Fifty-two weeks make 26 biweekly periods, but a calendar year is 52 weeks and a day, and the leftover days add up until one year holds a 27th payday. In 2026 the extra day is a Thursday: ${thursdays} Thursdays against ${fridays} Fridays. The payday you start from decides the outcome, and so does the habit of moving a payday that falls on a holiday to the previous business day. The table below counts both for four common January starting points.</p>
${h.table(['First scheduled payday', 'Dates on the cycle in 2026', 'Checks issued in 2026', 'Last check of 2026'], rows.map((r) => [r.label, r.raw, r.adj, K.day(r.last)]), 'Biweekly paydays in 2026; checks issued move to the previous business day when a payday is a weekend or federal holiday', ['l', 'r', 'r', 'l'])}
<p>The Thursday, January 1 cycle shows why the two columns differ. Its first date is New Year's Day, so that check goes out on December 31, 2025, and the year ends with 26 checks dated in 2026 even though 27 dates sit on the cycle. The Friday, January 2 cycle runs the other way: its 27th date is January 1, 2027, which moves back into December 2026. ${h.a('biweekly-pay-schedule', 'The biweekly pay schedule')} lists every date, and ${h.a('pay-periods', 'the pay periods page')} compares weekly, semimonthly and monthly counts.</p>
<h2>Salaried checks in a 27-pay year</h2>
<p>For hourly staff a 27th check is simply two more weeks of hours. For salaried staff it raises a budgeting question. Dividing ${K.usd(sal)} by 26 gives ${K.usd(K.pay.perPaycheck(sal, 'biweekly'), 2)}; paying that 27 times costs the employer an extra ${K.usd(K.pay.perPaycheck(sal, 'biweekly'), 2)} in the calendar year. Some employers simply accept it as a quirk of the calendar. Others switch to dividing by 27 for that year, ${K.usd(K.pay.perPaycheck(sal, 'biweekly', 27), 2)} a check, which keeps the yearly cost flat but trims every check by ${K.usd(K.pay.perPaycheck(sal, 'biweekly') - K.pay.perPaycheck(sal, 'biweekly', 27), 2)}. Fixed monthly bills paid from a smaller check are the practical effect to plan for. The figures here are gross; withholding is calculated per check, so the net effect of a 27-pay year depends on your own W-4. ${h.a('salary-to-hourly-calculator', 'The salary to hourly converter')} shows the hourly value of either check.</p>
`,
  tool: 'biweekly-pay',
  related: ['biweekly-pay-schedule', 'timesheet-calculator', 'pay-periods', 'semimonthly-vs-biweekly', 'overtime-calculator'],
  sources: ['dol_fs23', 'usc_207', 'opm_holidays', 'gsa_payroll'],
});
