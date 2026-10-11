import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const F = K.F;
const OT = F.weeklyOvertimeAfter;
const fs = K.pay.salariedHalfTime(405, 45, OT);
const S = 620;
const hoursList = [OT, 44, 48, 50, 55, 60];
const rows = hoursList.map((hh) => ({ hh, ...K.pay.salariedHalfTime(S, hh, OT) }));
const r48 = K.pay.salariedHalfTime(S, 48, OT);
const asHourly = K.week([10, 10, 10, 10, 8, 0, 0], 'federal', S / OT);
const big = K.pay.salariedHalfTime(900, 50, OT);

export default definePage({
  id: 'salaried-overtime',
  group: 'overtime',
  order: 100,
  slug: 'salaried-overtime',
  nav: 'Salaried overtime',
  card: 'A weekly salary that is not exempt: the regular rate it gives and the half-time owed past 40 hours.',
  title: 'Salaried Overtime 2026: Nonexempt Salary and Half-Time Pay',
  description: `Salaried overtime in 2026: a nonexempt salary over hours worked gives the regular rate, plus half of it per hour past ${OT}. ${K.usd(405)} for ${K.hrs(45)} hours pays ${K.usd(fs.extra, 2)} more.`,
  h1: 'Overtime for salaried nonexempt employees',
  intro: 'Enter the weekly salary and the hours actually worked; the calculator divides one by the other and adds half the rate for each overtime hour.',
  resume: `A salaried employee is owed overtime unless the job meets an exemption, and a salary alone never creates one. For a nonexempt worker whose weekly salary covers all the hours worked, the Department of Labor’s Fact Sheet #23 sets out the method: divide the salary by the hours actually worked to find that week’s regular rate, then pay half of it for every hour past ${OT}. Its own example uses ${K.usd(405)} for ${K.hrs(45)} hours: the regular rate is ${K.usd(fs.regularRate, 2)}, and the ${K.hrs(fs.otHours)} overtime hours add ${K.usd(fs.extra, 2)}, for ${K.usd(fs.total, 2)} in the week. The salary already pays straight time for every hour, which is why only the half is added. Because the rate drops as hours rise, a ${K.usd(S)} salary is worth ${K.usd(r48.regularRate, 2)} an hour in a ${K.hrs(48)}-hour week and the overtime top-up is ${K.usd(r48.extra, 2)}. The federal exemption for white-collar jobs needs at least ${K.usd(F.exemptSalaryWeekly)} a week plus duties that qualify; below that figure, overtime is owed whatever the job title.`,
  faqs: [
    { q: 'Can I be paid a salary and still get overtime?', a: `Yes. Being salaried is a way of paying, not an exemption. A worker on ${K.usd(S)} a week falls below the federal salary level of ${K.usd(F.exemptSalaryWeekly)}, so overtime is owed whatever the duties. In a ${K.hrs(48)}-hour week, Fact Sheet #23's method gives a regular rate of ${K.usd(r48.regularRate, 2)} and ${K.usd(r48.extra, 2)} of overtime on top of the salary. Pay stubs should show the hours.` },
    { q: 'Why does my salaried overtime pay only half the hourly rate?', a: `Because the salary has already paid every hour of the week at straight time, including the hours past ${OT}. Fact Sheet #23 then requires only the missing half for those hours. With ${K.usd(405)} for ${K.hrs(45)} hours, the rate is ${K.usd(fs.regularRate, 2)} and the half is ${K.usd(fs.regularRate / 2, 2)}, times ${K.hrs(fs.otHours)} hours. The total overtime value per hour is still ${K.num(F.overtimeMultiplier, 1)} times the rate.` },
    { q: 'Does a manager title make a salaried job exempt from overtime?', a: `No. The executive, administrative and professional exemptions need two things together: a salary of at least ${K.usd(F.exemptSalaryWeekly)} a week (${K.usd(F.exemptSalaryAnnual)} a year, Department of Labor salary levels) and duties that meet the tests. A shift manager who mostly runs a register is judged on what the job involves, not on the label. California sets its own salary floor of ${K.usd(K.caExemptAnnual)} a year.` },
    { q: 'Is a $900 weekly salary for 50 hours legal without overtime?', a: `Only if the job meets an exemption. The ${K.usd(900)} salary passes the federal salary level of ${K.usd(F.exemptSalaryWeekly)}, but the duties test must also be met. If the employee is nonexempt, the regular rate that week is ${K.usd(big.regularRate, 2)}, and ${K.hrs(big.otHours)} overtime hours add ${K.usd(big.extra, 2)}, for ${K.usd(big.total, 2)}. In California the salary would also fall short of the ${K.usd(K.caExemptAnnual / 52, 2)} weekly floor.` },
  ],
  body: (h) => `
${h.mini('bSalaryHalf')}
<h2>The Fact Sheet #23 method, line by line</h2>
<p>The ${h.src('dol_fs23', 'Department of Labor’s Fact Sheet #23')} treats salaried nonexempt workers the same way it treats piece workers and commissioned staff: overtime is computed on an average hourly rate found by dividing the week's pay by the hours actually worked. For a salary intended to cover whatever hours are worked, that gives a figure that changes each week. Long weeks lower it, short weeks raise it. The overtime top-up is then half of that rate, multiplied by the hours past ${OT}.</p>
<p>Run the agency's own figures. ${h.usd(405)} over ${h.hrs(45)} hours is ${h.usd(fs.regularRate, 2)} an hour. Half of that is ${h.usd(fs.regularRate / 2, 2)}. Five hours past the line make ${h.usd(fs.extra, 2)}. The paycheck is ${h.usd(fs.total, 2)}, not ${h.usd(405)}. The arithmetic is the same at any amount, and the calculator above repeats it with your salary and your hours.</p>
${h.table(['Hours worked', 'Regular rate', 'Overtime hours', 'Half-time owed', 'Total for the week'], rows.map((r) => [h.hrs(r.hh), h.usd(r.regularRate, 2), h.hrs(r.otHours), h.usd(r.extra, 2), h.usd(r.total, 2)]), `A ${h.usd(S)} weekly salary covering all hours, computed by the site engine (Fact Sheet #23 method)`, ['r', 'r', 'r', 'r', 'r'])}
<p>The table shows the trade-off for the employer and the employee. At ${h.hrs(OT)} hours the ${h.usd(S)} salary works out to ${h.usd(rows[0].regularRate, 2)} an hour; at ${h.hrs(60)} hours, to ${h.usd(rows[5].regularRate, 2)}. Overtime still rises with each hour, but by less than it would for an hourly worker at the starting rate. An hourly worker paid ${h.usd(S / OT, 2)}, the same money for a ${h.hrs(OT)}-hour week, would earn ${h.usd(asHourly.pay.total, 2)} for ${h.hrs(asHourly.total)} hours, against ${h.usd(r48.total, 2)} for the salaried worker. The difference, ${h.usd(asHourly.pay.total - r48.total, 2)} in that week, comes entirely from the falling regular rate.</p>
<h2>Salary is not an exemption</h2>
<p>A common misunderstanding treats "salaried" and "exempt" as the same word. They are not. The white-collar exemptions need a salary of at least ${h.usd(F.exemptSalaryWeekly)} a week, set by the ${h.src('dol_salary', 'Department of Labor’s salary levels page')}, and a primary duty that is executive, administrative or professional. A separate level for highly compensated employees, ${h.usd(F.hceAnnual)} a year, comes with its own test. Below ${h.usd(F.exemptSalaryWeekly)} a week, nobody in those categories is exempt, title or not.</p>
<p>California raises the floor to twice its minimum wage for full-time work, ${h.usd(h.caExemptAnnual)} a year in 2026, and counts overtime by the day as well. A salaried office coordinator in San Diego on ${h.usd(60000)} a year is nonexempt there, and long days count. ${h.a('exempt-vs-nonexempt', 'The exempt versus nonexempt guide')} walks through the duties tests; ${h.a('california-overtime', 'the California overtime page')} covers the daily rules, and ${h.a('regular-rate-of-pay', 'the regular rate page')} explains how bonuses paid with a salary change the rate.</p>
<h2>Checking a salaried pay stub</h2>
<p>Three questions catch most errors. Are hours recorded at all? Overtime can only be checked against hours written down, and ${h.a('timesheet-calculator', 'the timesheet')} produces that record. Does the stub show an overtime line in weeks past ${OT} hours? If the salary is the same in a ${h.hrs(38)}-hour week and a ${h.hrs(52)}-hour week, something is missing. Is the half-time computed on that week's hours, not on a fixed figure? Dividing by the actual hours is what the Fact Sheet describes for a salary that covers all hours worked; a stub that shows the same rate every week deserves a question to payroll.</p>
`,
  tool: 'salaried-ot',
  related: ['exempt-vs-nonexempt', 'regular-rate-of-pay', 'time-and-a-half-calculator', 'salary-to-hourly-calculator', 'overtime-calculator'],
  sources: ['dol_fs23', 'dol_salary', 'ca_exempt', 'usc_207'],
});
