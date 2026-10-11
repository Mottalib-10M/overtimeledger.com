import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const F = K.F;
const W = F.weeklyOvertimeAfter;
const full = F.fullTimeHoursYear;
const y20 = K.pay.hourlyToAnnual(20, W);
const y25 = K.pay.hourlyToAnnual(25, W);
const y20u = K.pay.hourlyToAnnual(20, W, 50);
const ot45 = K.week([9, 9, 9, 9, 9, 0, 0], 'federal', 22);
const plain45 = 22 * 45 * 52;
const fedMin = K.pay.hourlyToAnnual(F.minimumWage, W);
const RATES: Array<[string, number]> = [
  ['Federal minimum', F.minimumWage],
  ['Nevada minimum', K.nv.minimumWage],
  ['Alaska minimum', K.ak.minimumWage],
  ['Colorado minimum', K.co.minimumWage],
  ['California minimum', K.ca.minimumWage],
  ['', 18], ['', 20], ['', 22], ['', 25], ['', 28], ['', 30], ['', 35], ['', 40], ['', 50],
];

export default definePage({
  id: 'hourly-to-salary-calculator',
  group: 'pay',
  order: 20,
  slug: 'hourly-to-salary-calculator',
  nav: 'Hourly to salary',
  card: 'Any hourly wage turned into weekly, monthly and yearly gross pay, with unpaid weeks and overtime.',
  title: `Hourly to Salary 2026: ${W} Hours a Week Is How Much a Year`,
  description: `Hourly to salary in 2026: ${W} hours a week for 52 weeks is ${K.num(full)} hours, so ${K.usd(20)} an hour is ${K.usd(y20)} a year. Minimum wage table, unpaid weeks and overtime.`,
  h1: 'Hourly wage to yearly salary',
  intro: 'Enter an hourly rate, the hours of a usual week and the weeks you are paid; the converter returns yearly, monthly and per-check pay.',
  resume: `Working ${W} hours a week for a full year adds up to ${K.num(full)} paid hours, so the yearly salary is the hourly rate multiplied by ${K.num(full)}. At ${K.usd(20)} an hour that is ${K.usd(y20)} a year, ${K.usd(y20 / 12, 2)} a month and ${K.usd(20 * W)} a week before taxes; at ${K.usd(25)} it is ${K.usd(y25)}. The shortcut is to double the hourly wage and add three zeros, which lands close because ${K.num(full)} is near ${K.num(2000)}. Two things move the real figure. Unpaid weeks come off: two weeks without pay turn ${K.usd(20)} an hour into ${K.usd(y20u)} instead of ${K.usd(y20)}. Overtime goes on: a nonexempt worker on ${K.usd(22)} who works 45 hours every week earns time and a half for the ${K.hrs(ot45.ot)} hours past ${W}, which brings the year to ${K.usd(ot45.pay.total * 52)} rather than ${K.usd(plain45)}. At the federal minimum wage of ${K.usd(F.minimumWage, 2)}, a full-time year pays ${K.usd(fedMin)}; at California's ${K.usd(K.ca.minimumWage, 2)} it pays ${K.usd(K.pay.hourlyToAnnual(K.ca.minimumWage, W))}.`,
  faqs: [
    { q: 'How much is $20 an hour per year after two weeks of unpaid vacation?', a: `${K.usd(y20u)} gross. Fifty paid weeks of ${W} hours are ${K.num(W * 50)} hours, and ${K.num(W * 50)} times ${K.usd(20)} gives that figure, ${K.usd(y20 - y20u)} less than a full ${K.num(full)}-hour year. If those two weeks are paid time off instead, they count as paid hours and the year stays at ${K.usd(y20)}. Set the weeks field to the number of weeks you are actually paid for.` },
    { q: 'How do I include regular overtime when converting hourly pay to a salary?', a: `Work out one typical week first, then multiply by 52. A ${K.usd(22)} rate for 45 hours under federal rules pays ${K.hrs(ot45.reg)} hours straight and ${K.hrs(ot45.ot)} at time and a half, ${K.usd(ot45.pay.total, 2)} a week. That gives ${K.usd(ot45.pay.total * 52)} a year, against ${K.usd(plain45)} if all 45 hours were paid at the base rate. Daily overtime states can raise it further.` },
    { q: 'What is a full-time salary at the federal minimum wage?', a: `${K.usd(fedMin)} a year: ${K.usd(F.minimumWage, 2)} an hour times ${K.num(full)} hours, which is ${K.usd(F.minimumWage * W)} a week. Many states set a higher minimum; the Department of Labor state table lists ${K.usd(K.nv.minimumWage, 2)} in Nevada and ${K.usd(K.ak.minimumWage, 2)} in Alaska, and California's Labor Commissioner gives ${K.usd(K.ca.minimumWage, 2)} from January 1, 2026. The higher of the federal and state figures applies.` },
    { q: 'Is the double-it-and-add-three-zeros trick accurate?', a: `Close but low. Doubling ${K.usd(25)} gives ${K.usd(50000)}, while ${K.usd(25)} times ${K.num(full)} hours is ${K.usd(y25)}, a gap of ${K.usd(y25 - 50000)}. The trick assumes ${K.num(2000)} hours, which is ${K.num(full - 2000)} short of a full year of ${W}-hour weeks. It works for a quick comparison of offers and undershoots when you budget, so use the exact product for a lease application or a loan.` },
  ],
  body: (h) => `
${h.mini('yearHours')}
<h2>From an hourly wage to a yearly figure, step by step</h2>
<p>The conversion has three inputs and one multiplication: rate, hours per week, paid weeks per year. The default of ${W} hours and 52 weeks is the standard full-time year of ${K.num(full)} hours that employers quote in job ads. Change any of the three and the result follows. A nurse on three 12-hour shifts works 36 hours a week; at ${K.usd(38)} that is ${K.usd(K.pay.hourlyToAnnual(38, 36))} a year, not the ${K.usd(K.pay.hourlyToAnnual(38, W))} a ${W}-hour assumption would show. A school bus driver paid for 40 weeks of 30 hours at ${K.usd(24)} earns ${K.usd(K.pay.hourlyToAnnual(24, 30, 40))}.</p>
<p>The monthly figure is the yearly one divided by 12, which is why it rarely matches a single paycheck. Weekly and biweekly checks follow the calendar, and a month can hold four or five Fridays. Budget with the monthly average, and plan for the occasional month with an extra check. ${h.a('biweekly-pay-calculator', 'The biweekly pay calculator')} shows when those months fall in 2026.</p>
<p>The table below starts with five legal floors. The federal minimum of ${K.usd(F.minimumWage, 2)} is the national floor, and the higher state figure wins wherever one exists. Nevada (${K.usd(K.nv.minimumWage, 2)}) and Alaska (${K.usd(K.ak.minimumWage, 2)}) come from the ${h.src('dol_state_table', 'Department of Labor state table')}; Colorado's ${K.usd(K.co.minimumWage, 2)} rises to ${K.usd(K.co.minimumWage2027, 2)} in 2027 according to the ${h.src('co_min_wage_2027', 'state labor department')}; California's ${K.usd(K.ca.minimumWage, 2)} is the statewide figure from the ${h.src('ca_min_wage', 'Labor Commissioner')}, in force since January 1, 2026. A full-time year at the California floor is worth ${K.usd(K.pay.hourlyToAnnual(K.ca.minimumWage, W) - fedMin)} more than at the federal one.</p>
${h.table(['Hourly rate', 'Weekly', 'Monthly', 'Yearly (52 weeks)', 'Yearly (50 weeks)'], RATES.map(([label, r]) => [label ? `${K.usd(r, 2)} (${label})` : K.usd(r, 2), K.usd(r * W, 2), K.usd(K.pay.hourlyToAnnual(r, W) / 12, 2), K.usd(K.pay.hourlyToAnnual(r, W)), K.usd(K.pay.hourlyToAnnual(r, W, 50))]), `Gross pay at ${W} hours a week; minimum wages from the DOL state table and the California Labor Commissioner`, ['l', 'r', 'r', 'r', 'r'])}
<h2>Overtime belongs in the yearly figure when it is regular</h2>
<p>An hourly job and a salaried one stop being comparable the moment the week runs long. Under ${h.src('dol_fs23', 'Fact Sheet #23')}, a nonexempt employee earns at least ${K.num(F.overtimeMultiplier, 1)} times the regular rate for every hour past ${W} in a workweek, and the weeks cannot be averaged. Five 9-hour days at ${K.usd(22)} give ${K.hrs(ot45.reg)} hours at the base rate and ${K.hrs(ot45.ot)} overtime hours, ${K.usd(ot45.pay.total, 2)} for the week. Repeated all year, the overtime adds ${K.usd((ot45.pay.total - 22 * 45) * 52)} on top of what 45 straight hours would pay. Someone comparing that job with a salaried offer at ${K.usd(55000)} should know the hourly job pays more, but only for as long as the overtime lasts.</p>
<p>In California the same week looks different, because the daily rule counts every hour past ${K.ca.dailyOtAfter} in a day. ${h.a('overtime-calculator', 'The overtime calculator')} handles both, and its weekly result can be multiplied by the number of weeks with that schedule. Seasonal overtime, such as six busy weeks before the holidays, is better added as a lump than spread across the year.</p>
<h2>Gross is not take-home</h2>
<p>Every figure on this page is gross pay. Federal and state income tax, Social Security and Medicare, health premiums and retirement contributions all come out before the money reaches your account, and they depend on your W-4, your state and your benefit choices. For the reverse direction, from an annual offer back to an hourly rate, use ${h.a('salary-to-hourly-calculator', 'the salary to hourly converter')}. Contractors setting their own price should start from ${h.a('hourly-rate-calculator', 'the hourly rate calculator')} instead, because a contractor's hourly figure has to cover costs and unbilled time that an employee's wage does not.</p>
`,
  tool: 'hourly-to-salary',
  related: ['salary-to-hourly-calculator', 'overtime-calculator', 'biweekly-pay-calculator', 'hourly-rate-calculator', 'time-and-a-half-calculator'],
  sources: ['dol_fs23', 'dol_state_table', 'ca_min_wage', 'co_min_wage_2027', 'usc_207'],
});
