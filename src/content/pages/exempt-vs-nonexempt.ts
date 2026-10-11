import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const F = K.F;
const caWeekly = K.caExemptAnnual / 52;
const fedHourlyEq = K.pay.salaryToHourly(F.exemptSalaryAnnual, F.weeklyOvertimeAfter);
const hceHourlyEq = K.pay.salaryToHourly(F.hceAnnual, F.weeklyOvertimeAfter);
const caHourlyEq = K.pay.salaryToHourly(K.caExemptAnnual, F.weeklyOvertimeAfter);
// A salaried assistant below the level, working 46 hours: regular rate and half-time owed (Fact Sheet #23 method).
const asst = K.pay.salariedHalfTime(650, 46, F.weeklyOvertimeAfter);
// A $60,000 salary meets the federal level but not California's.
const mid = 60000;

export default definePage({
  id: 'exempt-vs-nonexempt',
  group: 'overtime',
  order: 130,
  slug: 'exempt-vs-nonexempt',
  nav: 'Exempt vs nonexempt',
  card: 'The salary levels that separate exempt staff from employees owed overtime, federal and California.',
  title: `Exempt vs Nonexempt 2026: ${K.usd(F.exemptSalaryWeekly)} Salary Test and Overtime`,
  description: `Exempt vs nonexempt in 2026: the federal salary level is ${K.usd(F.exemptSalaryWeekly)} a week (${K.usd(F.exemptSalaryAnnual)} a year), ${K.usd(F.hceAnnual)} for HCE, and ${K.usd(K.caExemptAnnual)} in California. Check your salary.`,
  h1: 'Exempt vs nonexempt: the salary level and what it decides',
  intro: 'A job title and a salary do not settle overtime on their own; a pay level and a duties test both have to be met.',
  resume: `An employee is exempt from federal overtime only when two separate tests are met: the salary must reach a set level and the job duties must qualify. In 2026 the Department of Labor salary level for the executive, administrative and professional exemptions is ${K.usd(F.exemptSalaryWeekly)} a week, which is ${K.usd(F.exemptSalaryAnnual)} a year, and the total annual compensation level for highly compensated employees is ${K.usd(F.hceAnnual)}. Anyone below those amounts is nonexempt and owed time and a half past ${F.weeklyOvertimeAfter} hours a week, even when paid a fixed salary. California sets a higher bar: an exempt employee must earn at least twice the state minimum wage for full-time work, which comes to ${K.usd(K.caExemptAnnual)} a year at ${K.usd(K.ca.minimumWage, 2)} an hour, or about ${K.usd(caWeekly, 2)} a week. A salary of ${K.usd(mid)} clears the federal level by a wide margin yet fails the California one, so the same manager can be exempt in Texas and owed overtime in Los Angeles.`,
  faqs: [
    { q: 'Can a salaried employee still get overtime pay?', a: `Yes. Salary is a way of paying, not a status. A worker paid ${K.usd(650)} a week falls under the federal level of ${K.usd(F.exemptSalaryWeekly)}, so overtime is owed past ${F.weeklyOvertimeAfter} hours. For ${asst.otHours + F.weeklyOvertimeAfter} hours worked, the regular rate is ${K.usd(asst.regularRate, 2)} and the extra half time adds ${K.usd(asst.extra, 2)}, using the Fact Sheet #23 method for a salary that covers all hours.` },
    { q: `Does earning more than ${K.usd(F.exemptSalaryAnnual)} a year make me exempt?`, a: `Not by itself. ${K.usd(F.exemptSalaryAnnual)} is the annual form of the ${K.usd(F.exemptSalaryWeekly)} weekly level on the DOL salary levels page, and it is only the first test. The primary duties of the job must also fit one of the executive, administrative or professional exemptions. A well-paid worker whose duties do not qualify remains nonexempt and keeps the right to overtime.` },
    { q: 'What is the highly compensated employee threshold for 2026?', a: `${K.usd(F.hceAnnual)} in total annual compensation, according to the Department of Labor salary levels page. That figure works out to about ${K.usd(hceHourlyEq, 2)} an hour on a ${F.weeklyOvertimeAfter}-hour week. It is a separate route to exemption with its own conditions, and pay under it does not settle the question alone: the job still has to fit the rules that DOL page points to for that category.` },
    { q: 'Why is the exempt salary so much higher in California?', a: `California ties its level to the state minimum wage: twice the minimum for full-time work, according to the Labor Commissioner's exemptions FAQ. With ${K.usd(K.ca.minimumWage, 2)} an hour since January 1, 2026, that equals ${K.usd(K.caExemptAnnual)} a year over ${K.num(F.fullTimeHoursYear)} hours. The figure rises every time the minimum wage does, while the federal level of ${K.usd(F.exemptSalaryAnnual)} stays fixed.` },
    { q: 'If I am misclassified as exempt, how do I estimate back overtime?', a: `Rebuild each week separately. Divide the weekly salary by the hours actually worked to get the regular rate, then add half that rate for every hour past ${F.weeklyOvertimeAfter}, which is how Fact Sheet #23 treats a salary meant to cover all hours. A ${K.usd(650)} salary over ${asst.otHours + F.weeklyOvertimeAfter} hours gives ${K.usd(asst.extra, 2)} owed for that week alone.` },
  ],
  body: (h) => `
${h.mini('exempt')}
<h2>Two tests, and the salary one is pure arithmetic</h2>
<p>Exempt status is an exception to the overtime rule, and the first gate is money. The ${h.src('dol_salary', 'Department of Labor salary levels page')} sets ${K.usd(F.exemptSalaryWeekly)} a week as the minimum for the executive, administrative and professional exemptions, the group payroll departments call EAP. Paid weekly, that is ${K.usd(F.exemptSalaryWeekly)}; biweekly, ${K.usd(F.exemptSalaryWeekly * 2)}; across a year, ${K.usd(F.exemptSalaryAnnual)}. A salary under that figure ends the analysis: the position is nonexempt whatever its title, and every hour past ${F.weeklyOvertimeAfter} in the workweek earns time and a half under ${h.src('usc_207', '29 U.S.C. 207')}.</p>
<p>The second gate is the work itself. Each of the three exemptions has its own description of the primary duties it covers, and those descriptions, not the job posting or the org chart, decide the outcome. This site does not try to grade duties; a worker who reaches the salary level and wonders about the rest should read the DOL material for the exemption that seems closest. What the numbers can do is rule positions out quickly, which is often where the money is.</p>
${h.table(['Level', 'Annual', 'Weekly', 'Hourly at full time'], [['Federal EAP salary level', K.usd(F.exemptSalaryAnnual), K.usd(F.exemptSalaryWeekly), K.usd(fedHourlyEq, 2)], ['Federal highly compensated employee', K.usd(F.hceAnnual), K.usd(F.hceAnnual / 52, 2), K.usd(hceHourlyEq, 2)], ['California exempt minimum', K.usd(K.caExemptAnnual), K.usd(caWeekly, 2), K.usd(caHourlyEq, 2)]], `Salary levels that separate exempt from nonexempt in 2026; hourly figures over ${K.num(F.fullTimeHoursYear)} hours`, ['l', 'r', 'r', 'r'])}
<p>The hourly column is only a reference point: an exempt employee is not paid by the hour. It helps when comparing an offer. At ${K.usd(fedHourlyEq, 2)} an hour for a ${F.weeklyOvertimeAfter}-hour week, the federal floor sits only modestly above several state minimum wages, which is why so many salaried roles in retail and food service still qualify for overtime.</p>
<h2>California's floor moves with the minimum wage</h2>
<p>The ${h.src('ca_exempt', 'California exemptions FAQ')} requires a salary of at least twice the state minimum wage for full-time employment. With the minimum at ${K.usd(K.ca.minimumWage, 2)} from January 1, 2026 (${h.src('ca_min_wage', 'DLSE')}), the computed level is ${K.usd(K.caExemptAnnual)} a year, ${K.usd(K.caExemptAnnual / 12, 2)} a month. A salaried shift supervisor in Sacramento on ${K.usd(mid)} clears the federal test by ${K.usd(mid - F.exemptSalaryAnnual)} yet falls ${K.usd(K.caExemptAnnual - mid)} short of the state one. That supervisor is owed California overtime, which includes the daily rule after ${K.ca.dailyOtAfter} hours explained on ${h.a('california-overtime', 'the California overtime page')}.</p>
<h2>What nonexempt status means on a salaried paycheck</h2>
<p>A nonexempt employee on a salary is common and perfectly legal; the overtime just has to be added. When the salary is meant to cover whatever hours the week brings, ${h.src('dol_fs23', 'Fact Sheet #23')} describes the method: divide the salary by the hours actually worked to find that week's regular rate, then pay half of it for each overtime hour, since the straight time is already inside the salary. A ${K.usd(650)} salary over ${asst.otHours + F.weeklyOvertimeAfter} hours gives a regular rate of ${K.usd(asst.regularRate, 2)} and ${K.usd(asst.extra, 2)} of overtime, for ${K.usd(asst.total, 2)} that week. The rate falls as hours rise, which surprises people the first time they see it. ${h.a('salaried-overtime', 'The salaried overtime calculator')} runs this for any week, and ${h.a('salary-to-hourly-calculator', 'the salary to hourly converter')} shows the straight hourly equivalent of an offer.</p>
<p>Reclassification works in both directions. A raise that lifts a salary above ${K.usd(F.exemptSalaryWeekly)} a week can make a qualifying role exempt, and a pay cut below it reopens overtime from the first week it applies.</p>
`,
  tool: 'salary-to-hourly',
  related: ['salaried-overtime', 'overtime-calculator', 'california-overtime', 'salary-to-hourly-calculator', 'regular-rate-of-pay'],
  sources: ['dol_salary', 'usc_207', 'dol_fs23', 'ca_exempt', 'ca_min_wage'],
});
