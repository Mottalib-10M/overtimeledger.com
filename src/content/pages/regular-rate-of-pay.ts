import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const F = K.F;
const OT = F.weeklyOvertimeAfter;
const M = F.overtimeMultiplier;
const two = K.pay.weightedOvertime([{ hours: 30, rate: 18 }, { hours: 15, rate: 24 }], OT);
const night = K.pay.weightedOvertime([{ hours: 36, rate: 19 }, { hours: 8, rate: 21 }], OT);
const nightBase = 19 * night.hours + 19 * (M - 1) * night.otHours + 2 * 8;
const three = K.pay.weightedOvertime([{ hours: 20, rate: 16 }, { hours: 18, rate: 20 }, { hours: 12, rate: 27 }], OT);
const under = K.pay.weightedOvertime([{ hours: 25, rate: 18 }, { hours: 13, rate: 24 }], OT);

export default definePage({
  id: 'regular-rate-of-pay',
  group: 'overtime',
  order: 90,
  slug: 'regular-rate-of-pay',
  nav: 'Regular rate of pay',
  card: 'Two wages in one week: the weighted average that overtime is built on, and what pay goes into it.',
  title: 'Regular Rate of Pay 2026: Weighted Average for Overtime',
  description: `Regular rate of pay in 2026: total straight-time pay divided by all hours (29 CFR 778.115), then half of it per hour past ${OT}. Worked ${K.usd(18)} and ${K.usd(24)} example inside.`,
  h1: 'Regular rate of pay with two or more hourly rates',
  intro: 'Enter the hours and the rate of each job worked in the week; the calculator finds the weighted regular rate and the overtime premium.',
  resume: `The regular rate of pay is the hourly figure overtime is calculated on, and for a worker paid two or more rates in one workweek it is a weighted average: total straight-time earnings divided by total hours worked, under 29 CFR 778.115. Overtime then adds half that rate for each hour past ${OT}, since every hour has already been paid once at its own rate. Thirty hours at ${K.usd(18)} and fifteen at ${K.usd(24)} earn ${K.usd(two.straight, 2)} in straight time over ${K.hrs(two.hours)} hours, a regular rate of ${K.usd(two.regularRate, 2)}; the ${K.hrs(two.otHours)} overtime hours add ${K.usd(two.premium, 2)} and the week pays ${K.usd(two.total, 2)}. What goes into the regular rate is broad. The Department of Labor’s Fact Sheet #23 includes all remuneration for employment, such as shift differentials, commissions and nondiscretionary bonuses, and leaves out a closed list: discretionary bonuses, gifts, expense reimbursements, and pay for vacation, holidays or illness when no work is done.`,
  faqs: [
    { q: 'Which rate is overtime paid at when I work two jobs for the same employer?', a: `At ${K.num(M, 1)} times the weighted average, not the higher or the lower rate. Add the straight-time pay of both jobs, divide by all hours of the week, and that is the regular rate; each overtime hour then earns half of it on top. With ${K.hrs(30)} hours at ${K.usd(18)} and ${K.hrs(15)} at ${K.usd(24)}, the rate is ${K.usd(two.regularRate, 2)} and the premium ${K.usd(two.premium, 2)}.` },
    { q: 'Are expense reimbursements part of the regular rate?', a: `No. Fact Sheet #23 lists reimbursement of expenses incurred for the employer, such as mileage or tools bought for the job, among the payments excluded from the regular rate. They are not pay for work. A worker who gets ${K.usd(60)} of mileage in a ${K.hrs(45)}-hour week at ${K.usd(20)} still has a regular rate of ${K.usd(20)}, and overtime is figured on that.` },
    { q: 'Does the regular rate matter in a week under 40 hours?', a: `Not for federal overtime, since there are no overtime hours to price. In a week of ${K.hrs(under.hours)} hours at two rates, the straight-time pay of ${K.usd(under.straight, 2)} is simply what is owed, and the weighted rate of ${K.usd(under.regularRate, 2)} is a figure with no use. It matters again in a daily-overtime state, where a long day can create overtime in a short week.` },
    { q: 'Why is my overtime rate lower than 1.5 times my best hourly wage?', a: `Because federal law averages the rates of the week rather than picking the highest one. Someone who works ${K.hrs(12)} hours at ${K.usd(27)} and the rest at ${K.usd(16)} and ${K.usd(20)} has a regular rate of ${K.usd(three.regularRate, 2)} over ${K.hrs(three.hours)} hours. Each overtime hour therefore carries a premium of ${K.usd(three.regularRate / 2, 2)}, below half of ${K.usd(27)}, and that is lawful under 29 CFR 778.115.` },
  ],
  body: (h) => `
${h.mini('bTwoRates')}
<h2>The weighted average in four lines</h2>
<p>The method in ${h.src('cfr_778_115', '29 CFR 778.115')} fits on a sticky note. Multiply the hours of each rate by that rate. Add the products: that is straight-time pay for the whole week. Divide by total hours: that is the regular rate. Multiply half of it by the hours past ${OT}: that is the overtime premium owed on top. The calculator above runs exactly these steps, and the table shows them on three weeks.</p>
${h.table(['Week', 'Hours', 'Straight-time pay', 'Regular rate', 'OT hours', 'Premium', 'Total'], [
  [`${h.hrs(30)} h at ${h.usd(18)} and ${h.hrs(15)} h at ${h.usd(24)}`, h.hrs(two.hours), h.usd(two.straight, 2), h.usd(two.regularRate, 2), h.hrs(two.otHours), h.usd(two.premium, 2), h.usd(two.total, 2)],
  [`${h.hrs(36)} day h at ${h.usd(19)}, ${h.hrs(8)} night h at ${h.usd(21)}`, h.hrs(night.hours), h.usd(night.straight, 2), h.usd(night.regularRate, 2), h.hrs(night.otHours), h.usd(night.premium, 2), h.usd(night.total, 2)],
  [`Three rates: ${h.usd(16)}, ${h.usd(20)}, ${h.usd(27)}`, h.hrs(three.hours), h.usd(three.straight, 2), h.usd(three.regularRate, 2), h.hrs(three.otHours), h.usd(three.premium, 2), h.usd(three.total, 2)],
], 'Weighted regular rate computed by the site engine (29 CFR 778.115)', ['l', 'r', 'r', 'r', 'r', 'r', 'r'])}
<p>The second row is a shift differential written as a separate rate: ${h.usd(2)} more for night hours. Payroll that ignored the night premium when pricing overtime would pay ${h.usd(nightBase, 2)}, against ${h.usd(night.total, 2)} owed, a gap of ${h.usd(night.total - nightBase, 2)}. The amount is small, but it repeats every week of the year and for every night worker on the payroll. Note also that the premium is half the rate, not one and a half times: the first "1" was already paid in the straight-time column.</p>
<h2>What goes into the regular rate, and what stays out</h2>
<p>The ${h.src('dol_fs23', 'Department of Labor’s Fact Sheet #23')} starts from a wide definition. The regular rate includes all remuneration for employment except the payments the Act excludes. That brings in more than the hourly wage: shift differentials, commissions, piece-rate earnings and bonuses the employee expects because they were announced or promised, such as attendance, production or quality bonuses. The section 7 text in ${h.src('usc_207', '29 U.S.C. 207(e)')} lists what may be left out.</p>
<ul>
<li><strong>Discretionary bonuses</strong>, decided by the employer alone, with no prior promise or formula the employee could rely on.</li>
<li><strong>Gifts</strong> on special occasions, like a holiday gift not tied to hours or output.</li>
<li><strong>Expense reimbursements</strong> for costs incurred on the employer's behalf, such as travel or supplies.</li>
<li><strong>Pay for time not worked</strong>: vacation, holidays, illness, or a day the employer closes for lack of work.</li>
<li><strong>Premiums that are themselves overtime</strong>, such as time and a half already paid for hours over a daily or weekly standard.</li>
</ul>
<p>The practical test for a bonus is whether the employee could count on it. A ${h.usd(100)} monthly bonus paid whenever attendance is perfect is promised in advance, so it belongs in the regular rate; when it is paid for a month, it must be spread over that month's workweeks and extra overtime paid on the weeks that had overtime. A surprise year-end check decided by the owner, with no formula, is discretionary and stays out.</p>
<h2>Salary, piece rate and the other ways to reach the same rate</h2>
<p>A weekly salary for a nonexempt employee is turned into a regular rate by dividing it by the hours it is meant to cover; ${h.a('salaried-overtime', 'the salaried overtime page')} works through the Fact Sheet #23 example. Piece-rate pay follows the same idea as two rates: total earnings for the week divided by total hours. In California and the other daily-rule states, the regular rate is the base for daily overtime and double time as well; ${h.a('daily-overtime-states', 'the comparison of daily overtime states')} explains where those hours come from. For a single wage, ${h.a('time-and-a-half-calculator', 'the time and a half calculator')} is enough, and ${h.a('overtime-calculator', 'the overtime calculator')} splits the week once the rate is known.</p>
`,
  tool: 'regular-rate',
  related: ['time-and-a-half-calculator', 'salaried-overtime', 'overtime-calculator', 'daily-overtime-states'],
  sources: ['cfr_778_115', 'dol_fs23', 'usc_207'],
});
