import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const F = K.F;
const w45 = K.week([9, 9, 9, 9, 9, 0, 0], 'federal', 18);
const ca45 = K.week([9, 9, 9, 9, 9, 0, 0], 'california', 18);
const w52 = K.week([10, 10, 10, 10, 12, 0, 0], 'federal', 22);

export default definePage({
  id: 'overtime-calculator',
  group: 'overtime',
  order: 10,
  slug: 'overtime-calculator',
  nav: 'Overtime calculator',
  card: 'A week of daily hours split into regular, overtime and double time under your state’s rule.',
  title: 'Overtime Calculator 2026: FLSA and Daily State Rules',
  description: `Overtime calculator for 2026: enter each day’s hours and rate, get time and a half past 40 hours (FLSA) or the daily rules of CA, AK, NV and CO. Free.`,
  h1: 'Overtime calculator by day and by week',
  intro: 'Enter the hours of each day of the workweek and your rate; the calculator splits them under the federal rule or your state’s.',
  resume: `Overtime under the Fair Labor Standards Act is owed for every hour past ${F.weeklyOvertimeAfter} in a workweek, at no less than ${K.num(F.overtimeMultiplier, 1)} times the employee’s regular rate of pay. The workweek is a fixed period of ${F.workweekHours} hours chosen by the employer, and the Department of Labor does not allow hours to be averaged across two weeks or require overtime just because a day is long, a weekend or a holiday. At ${K.usd(18)} an hour, five nine-hour days come to ${K.hrs(w45.total)} hours: ${K.hrs(w45.reg)} regular and ${K.hrs(w45.ot)} overtime, for ${K.usd(w45.pay.total, 2)} gross. States can only add to this floor. California pays overtime after ${K.ca.dailyOtAfter} hours in a day, so the same week there holds ${K.hrs(ca45.ot)} overtime hours and pays ${K.usd(ca45.pay.total, 2)}; Alaska and Nevada (below ${K.usd(K.nvDailyLimit, 2)} an hour) also count after ${K.ak.dailyOtAfter} hours a day, and Colorado after ${K.co.dailyOtAfter}. The calculator applies whichever rule you choose, hour by hour.`,
  faqs: [
    { q: 'How is overtime calculated for hourly employees?', a: `Add the hours of the workweek. Every hour past ${F.weeklyOvertimeAfter} is paid at ${K.num(F.overtimeMultiplier, 1)} times the regular rate, so at $20 an hour each overtime hour is worth $30. If your state has a daily rule, hours past the daily limit are overtime first, and only the remaining straight-time hours count toward the 40.` },
    { q: 'Is working on a Saturday or a holiday automatically overtime?', a: `Not under federal law. Fact Sheet #23 says the FLSA does not require overtime pay for Saturdays, Sundays, holidays or regular days of rest as such. Those hours count toward the ${F.weeklyOvertimeAfter}-hour total like any other. Premium pay for weekends or holidays exists only when a contract, a policy or a state rule such as California’s seventh day provides it.` },
    { q: 'What hourly rate is overtime based on if I get a bonus?', a: `Overtime is based on the regular rate, which includes nondiscretionary bonuses, shift differentials and most other pay for work, not just the base hourly wage. A production bonus earned in a week raises that week’s regular rate. Discretionary gifts, expense reimbursements and pay for time not worked, such as vacation, are excluded.` },
    { q: 'Can my employer give me comp time instead of overtime pay?', a: `A private employer covered by the FLSA must pay overtime in cash in the pay period it is earned. Compensatory time off in place of overtime pay is allowed for state and local government employees under specific conditions, not for private-sector hourly workers. Time off later in the same workweek can lower the total, but not after it closes.` },
    { q: 'Why does my overtime calculator show fewer overtime hours than my long days suggest?', a: `Because under the federal rule only the weekly total matters. Two 14-hour days and three days off add up to 28 hours, which is no overtime at all in most states. Choose California, Alaska, Nevada or Colorado in the calculator if you work there: their daily limits turn those long days into overtime even in a short week.` },
  ],
  body: (h) => `
<h2>Which hours become overtime, step by step</h2>
<p>The calculator follows the order a payroll department uses when a state has a daily rule. It looks at each day first: in California, the hours past ${K.ca.dailyOtAfter} up to ${K.ca.dailyDtAfter} are time and a half and the hours past ${K.ca.dailyDtAfter} are double time; in Alaska and Nevada the hours past ${K.ak.dailyOtAfter} are time and a half; in Colorado the hours past ${K.co.dailyOtAfter}. Then it walks through the week in order and counts only the hours still paid at straight time. Once those reach ${F.weeklyOvertimeAfter}, every further straight-time hour becomes overtime. An hour is never paid twice, which is also how Colorado's ${h.src('co_comps40', 'COMPS Order #40')} words it: whichever calculation gives the greater payment applies.</p>
<p>Under the federal rule alone there is no daily step. A week of ${K.hrs(w52.total)} hours made of four ten-hour days and one twelve-hour day at $22 gives ${K.hrs(w52.reg)} regular hours and ${K.hrs(w52.ot)} overtime hours, ${K.usd(w52.pay.total, 2)} before taxes. The twelve-hour Friday is not special in Texas, Florida or New York; it is special in California, where it would add double time.</p>
${h.mini('otDay', 'california')}
<h2>The regular rate is not always the hourly wage</h2>
<p>Time and a half means one and a half times the regular rate, and the ${h.src('dol_fs23', 'Department of Labor')} defines that rate broadly: all pay for employment except the exclusions listed in the Act. A night-shift differential of $1.50 an hour, a weekly attendance bonus or a piece-rate payment all raise it. When two jobs at two rates are worked in one week for the same employer, the regular rate is their weighted average under ${h.src('cfr_778_115', '29 CFR 778.115')}; ${h.a('regular-rate-of-pay', 'the regular rate calculator')} handles that case, and ${h.a('salaried-overtime', 'the salaried overtime page')} covers nonexempt workers paid a weekly salary.</p>
<p>The quick check for a pay stub is therefore not "overtime hours × 1.5 × base wage" but "is the overtime line at least half the regular rate on top of straight time for every hour past 40". When a bonus is paid later for a period of several weeks, it has to be spread back over those weeks and extra overtime paid on the weeks that had overtime.</p>
<h2>Weekly totals do not carry over</h2>
<p>A frequent misunderstanding comes from biweekly paychecks. Eighty hours in two weeks look like two normal weeks, but if the split was 50 and 30, the first week contains 10 overtime hours. The FLSA measures each workweek on its own and forbids averaging. ${h.a('timesheet-calculator', 'The two-week timesheet')} splits the overtime week by week for that reason, and ${h.a('biweekly-pay-calculator', 'the biweekly pay calculator')} shows the paycheck that results.</p>
<p>Another one comes from the start of the workweek. Your employer picks it, and it may start on a Wednesday at 6 pm if that is the fixed, recurring period. A double shift on Sunday can fall in one workweek or the next depending on that choice, and the overtime follows the workweek, not the calendar week printed on the schedule.</p>
<h2>Who the federal rule does not cover</h2>
<p>Overtime is owed to nonexempt employees. Executives, administrators and professionals can be exempt if they meet a duties test and are paid a salary of at least ${K.usd(F.exemptSalaryWeekly)} a week (${h.src('dol_salary', 'DOL salary levels')}); some occupations have their own exemptions. Being paid a salary is not enough on its own: a salaried assistant earning $650 a week is owed overtime. ${h.a('exempt-vs-nonexempt', 'The exempt versus nonexempt guide')} explains the tests, and the state pages explain where California and Colorado set higher floors.</p>
`,
  tool: 'overtime',
  related: ['time-and-a-half-calculator', 'california-overtime', 'daily-overtime-states', 'regular-rate-of-pay', 'timesheet-calculator'],
  sources: ['dol_fs23', 'usc_207', 'cfr_778_115', 'dol_state_table', 'co_comps40', 'dol_salary'],
});
