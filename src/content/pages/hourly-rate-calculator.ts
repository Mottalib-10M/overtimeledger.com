import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const F = K.F;
const W = F.weeklyOvertimeAfter;
const base = K.pay.freelanceRate(80000, 12000, 25, 6);
const naive = K.pay.salaryToHourly(80000, W);
const full30 = K.pay.freelanceRate(80000, 12000, 30, 6);
const lowCost = K.pay.freelanceRate(80000, 4000, 25, 6);
const moreOff = K.pay.freelanceRate(80000, 12000, 25, 10);
const SCEN: Array<[number, number, number, number]> = [[50000, 6000, 25, 6], [65000, 8000, 25, 6], [80000, 12000, 25, 6], [80000, 12000, 30, 4], [100000, 15000, 25, 6], [120000, 20000, 30, 6], [150000, 25000, 30, 8]];

export default definePage({
  id: 'hourly-rate-calculator',
  group: 'pay',
  order: 30,
  slug: 'hourly-rate-calculator',
  nav: 'Hourly rate',
  card: 'The rate a freelancer or contractor has to bill to reach a target income once costs and unbilled time are counted.',
  title: 'Hourly Rate 2026: Freelance Rate from Income, Costs, Hours',
  description: `Hourly rate for 2026: a freelancer aiming at ${K.usd(80000)} with ${K.usd(12000)} of costs and 25 billable hours over 46 weeks must charge ${K.usd(base.rate, 2)} an hour. Set your own.`,
  h1: 'Hourly rate for freelancers and contractors',
  intro: 'Start from the income you want, add what the business costs, and divide by the hours a client will really pay for.',
  resume: `A freelance hourly rate is the target income plus the yearly business costs, divided by the hours you can actually bill in a year. Someone who wants ${K.usd(80000)} of income, spends ${K.usd(12000)} a year on software, equipment, insurance and a home office, bills 25 hours a week and takes 6 weeks off needs ${K.usd(base.rate, 2)} an hour: ${K.usd(92000)} spread over ${K.num(base.billable)} billable hours. The same ${K.usd(80000)} as an employee salary works out to only ${K.usd(naive, 2)} an hour over ${K.num(F.fullTimeHoursYear)} hours, which is why copying a former wage almost always leaves a contractor short. The gap has three causes. Billable time is a fraction of working time, because selling, invoicing, travel and admin are unpaid. Weeks off, holidays and sick days earn nothing. And costs an employer used to carry, from the laptop to the health plan, now come out of the rate. Raising billable hours from 25 to 30 a week lowers the required rate to ${K.usd(full30.rate, 2)}; taking ten weeks off instead of six raises it to ${K.usd(moreOff.rate, 2)}.`,
  faqs: [
    { q: 'How many billable hours a week should a freelancer plan for?', a: `Fewer than the hours you work. Planning on 25 to 30 billable hours out of a ${W}-hour week leaves room for prospecting, proposals, bookkeeping and learning, which clients do not pay for. At 25 hours and 46 working weeks you have ${K.num(base.billable)} hours to sell in a year; at 30 hours, ${K.num(full30.billable)}. Track a month of real time before you commit to a figure.` },
    { q: `Why can I not just divide my old salary by ${K.num(F.fullTimeHoursYear)} to set a contract rate?`, a: `Because ${K.num(F.fullTimeHoursYear)} counts every paid hour of an employee's year, holidays and vacation included. A contractor is paid only for billed hours and covers the costs an employer used to absorb. ${K.usd(80000)} divided by ${K.num(F.fullTimeHoursYear)} is ${K.usd(naive, 2)}, while the same income with ${K.usd(12000)} of costs and 25 billable hours over 46 weeks requires ${K.usd(base.rate, 2)}.` },
    { q: 'Which business costs belong in a freelance rate?', a: `Everything the work needs that a client does not reimburse: computer and software subscriptions, a phone line, professional insurance, a coworking desk or a share of rent, accounting fees, training, and health coverage you now buy yourself. Cutting yearly costs from ${K.usd(12000)} to ${K.usd(4000)} in the example lowers the required rate from ${K.usd(base.rate, 2)} to ${K.usd(lowCost.rate, 2)}. Taxes are a separate question that depends on your situation.` },
    { q: 'Do independent contractors get time and a half for long weeks?', a: `No. Overtime under the Fair Labor Standards Act protects employees, so a genuine contractor billing 55 hours a week is paid at the agreed rate for all of them unless the contract says otherwise. An employee on ${K.usd(40)} an hour would earn ${K.usd(K.week([11, 11, 11, 11, 11, 0, 0], 'federal', 40).pay.total, 2)} for the same 55 hours. Price long engagements with that difference in mind.` },
  ],
  body: (h) => `
${h.mini('cBillableShare')}
<h2>The formula, and where each number comes from</h2>
<p>The calculator uses one line of arithmetic: required rate equals target income plus yearly costs, divided by billable hours per week times working weeks. Every input is a decision, not a fact, and each one deserves a real number rather than a guess.</p>
<p>Target income is what you want to pay yourself before personal taxes, comparable to a gross salary. Yearly costs are what the business spends to exist, listed one by one: a designer's software and font licenses, a consultant's travel, a developer's hardware every three years divided by three. Billable hours are the hours a client will see on an invoice, which for most solo professionals is well under the hours spent working. Weeks off cover vacation, federal holidays, sick days and the slow weeks between projects; ${h.a('federal-holidays', 'the 2026 holiday list')} alone accounts for more than two weeks of weekdays.</p>
${h.table(['Target income', 'Yearly costs', 'Billable h/week', 'Weeks off', 'Billable hours/year', 'Required rate'], SCEN.map(([i, c, b, o]) => { const r = K.pay.freelanceRate(i, c, b, o); return [K.usd(i), K.usd(c), b, o, K.num(r.billable), K.usd(r.rate, 2)]; }), 'Required hourly rate for a few freelance scenarios, before taxes', ['r', 'r', 'r', 'r', 'r', 'r'])}
<h2>A contractor's rate is not an employee's wage</h2>
<p>The two numbers measure different things. An employee's hourly wage is paid for every hour on the clock, and federal law adds protections around it. The ${h.src('dol_state_table', 'Department of Labor state table')} sets minimum wages from ${K.usd(F.minimumWage, 2)} federally to ${K.usd(K.ca.minimumWage, 2)} in California, and ${h.src('dol_fs23', 'Fact Sheet #23')} requires time and a half after ${W} hours in a workweek. A paid holiday, a paid vacation week and an employer-funded health plan are all part of the package without appearing in the hourly figure.</p>
<p>A contractor's rate has to fund all of that internally. That is why a contract rate far above the wage for similar work is not greedy; it is the same income measured over fewer paid hours, with the overhead added back. In the main example, the required ${K.usd(base.rate, 2)} is ${K.num(base.rate / naive, 2)} times the ${K.usd(naive, 2)} an employee would receive for the same ${K.usd(80000)} a year. Whether a given worker is really a contractor or an employee is a legal question with its own tests; this calculator assumes you are genuinely self-employed and setting a price.</p>
<h2>Testing the rate before you quote it</h2>
<p>Run the numbers three ways. First, the floor: costs plus the lowest income you could live on, at a realistic 20 billable hours, tells you the rate under which a project loses money. Second, the plan: your real target and the billable hours you have tracked. Third, the market: compare the result with what clients in your field already pay for similar work, from quotes you have seen or lost. If the plan rate sits far above the market, the levers are fewer weeks off, more billable hours or lower costs, and the calculator shows which one moves the rate most. For employee pay in the other direction, ${h.a('hourly-to-salary-calculator', 'the hourly to salary converter')} turns a wage into a yearly figure, and ${h.a('salary-to-hourly-calculator', 'the salary to hourly converter')} does the reverse.</p>
`,
  tool: 'hourly-rate',
  related: ['hourly-to-salary-calculator', 'salary-to-hourly-calculator', 'federal-holidays', 'overtime-calculator'],
  sources: ['dol_fs23', 'dol_state_table', 'usc_207', 'opm_holidays'],
});
