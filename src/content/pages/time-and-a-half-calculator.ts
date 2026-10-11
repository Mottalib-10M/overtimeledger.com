import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const F = K.F;
const M = F.overtimeMultiplier;
const OT = F.weeklyOvertimeAfter;
const w48 = K.week([10, 10, 10, 10, 8, 0, 0], 'federal', 21);
const bonus = K.pay.salariedHalfTime(20 * 46 + 92, 46, OT);
const naive = 20 * OT + 20 * M * (46 - OT) + 92;
const rates = [F.minimumWage, 12, 15, K.ca.minimumWage, 18, 20, 22.5, 25, 30, 35, 40];

export default definePage({
  id: 'time-and-a-half-calculator',
  group: 'overtime',
  order: 20,
  slug: 'time-and-a-half-calculator',
  nav: 'Time and a half',
  card: 'Your hourly wage turned into the overtime rate, with a bonus folded into the regular rate.',
  title: 'Time and a Half Calculator 2026: Overtime Rate Table',
  description: `Time and a half in 2026: the regular rate x ${K.num(M, 1)} for each hour past ${OT} a week. Rate table from ${K.usd(F.minimumWage, 2)} to $40 and how a weekly bonus lifts your overtime rate.`,
  h1: 'Time and a half: from your hourly wage to the overtime rate',
  intro: 'Type your hourly wage and the overtime hours; the calculator multiplies the regular rate and adds the premium to straight time.',
  resume: `Time and a half is the federal overtime rate: ${K.num(M, 1)} times the regular rate of pay for every hour worked past ${OT} in a workweek, under section 7 of the Fair Labor Standards Act. The multiplier applies to the regular rate, which is broader than the posted wage, since nondiscretionary bonuses, shift differentials and commissions earned that week are part of it. At ${K.usd(20)} an hour, an overtime hour is worth ${K.usd(20 * M, 2)}; at the federal minimum of ${K.usd(F.minimumWage, 2)} it is ${K.usd(F.minimumWage * M, 2)}. A week of four ten-hour days plus an eight-hour Friday at ${K.usd(21)} adds up to ${K.hrs(w48.total)} hours, so ${K.hrs(w48.ot)} of them are paid at ${K.usd(21 * M, 2)} and the check before taxes reaches ${K.usd(w48.pay.total, 2)}. Add a ${K.usd(92)} production bonus to a ${K.hrs(46)}-hour week at ${K.usd(20)} and the regular rate climbs to ${K.usd(bonus.regularRate, 2)}, which moves the overtime rate to ${K.usd(bonus.regularRate * M, 2)}.`,
  faqs: [
    { q: 'How much is time and a half on $18 an hour?', a: `It is ${K.usd(18 * M, 2)} for each overtime hour, because ${K.usd(18)} times ${K.num(M, 1)} gives that figure. Of it, ${K.usd(18)} is the straight time and ${K.usd(18 * (M - 1), 2)} is the premium. Ten overtime hours in a week are worth ${K.usd(180 * M, 2)}, on top of the ${K.usd(18 * OT)} earned for the first ${OT} hours, before any tax or deduction comes off.` },
    { q: 'Does a shift differential change my time and a half rate?', a: `Yes. A night or weekend differential is pay for work, so the Department of Labor counts it in the regular rate (Fact Sheet #23). Someone earning ${K.usd(19)} plus ${K.usd(1.5, 2)} on every hour of a night schedule has a regular rate of ${K.usd(20.5, 2)}, and the overtime rate becomes ${K.usd(20.5 * M, 2)} instead of ${K.usd(19 * M, 2)}. Mixed day and night hours call for a weighted average.` },
    { q: 'Is time and a half paid on the hours of a paid holiday?', a: `Not under federal law. Fact Sheet #23 lists holiday pay for a day not worked among the exclusions from the regular rate, and the ${OT}-hour threshold counts hours actually worked. A week with an eight-hour paid holiday and ${K.hrs(36)} hours actually worked therefore has no overtime, even though the paycheck shows ${K.hrs(44)} paid hours. A contract can be more generous.` },
    { q: 'Why is my time and a half not exactly 1.5 times my wage?', a: `Usually because the pay stub uses the regular rate, not the base wage. A nondiscretionary bonus, a commission or a differential earned in the week raises the regular rate, and the overtime line follows it. With a ${K.usd(92)} bonus on a ${K.hrs(46)}-hour week at ${K.usd(20)}, the rate on the stub becomes ${K.usd(bonus.regularRate * M, 2)} an hour. Rounding of punches can also shift a few cents.` },
    { q: 'Can an employer pay time and a half only after 45 hours?', a: `Not to an employee covered by the FLSA. The federal threshold is ${OT} hours in a fixed workweek of ${F.workweekHours} hours, and a company policy cannot push it higher. California, Alaska, Nevada and Colorado go further with daily limits. An employer can be more generous, for example paying time and a half for Saturday work, but never start the premium later than the law.` },
  ],
  body: (h) => `
${h.mini('bBonusRate')}
<h2>The rate table: straight time, overtime rate, premium</h2>
<p>The table multiplies a range of common wages by ${h.num(M, 1)}. The third column is what one overtime hour pays in total; the fourth is the extra half alone, which is the amount many payroll systems print as the "OT premium" when they have already paid every hour at straight time. A worker who sees a premium line of ${h.usd(10, 2)} an hour on a ${h.usd(20)} wage has not been shorted: the other ${h.usd(20)} sits in the regular earnings line. The last column gives the value of five overtime hours, a common amount for someone who stays an extra hour each weekday.</p>
${h.table(['Hourly wage', 'Time and a half', 'Premium alone', 'Five overtime hours'], rates.map((r) => [h.usd(r, 2), h.usd(r * M, 2), h.usd(r * (M - 1), 2), h.usd(5 * r * M, 2)]), `Overtime rate at ${h.num(M, 1)}x the regular rate (29 U.S.C. 207)`, ['l', 'r', 'r', 'r'])}
<p>Two rows are legal floors rather than examples: ${h.usd(F.minimumWage, 2)} is the federal minimum wage, and ${h.usd(h.ca.minimumWage, 2)} is the California minimum in force since January 1, 2026. Nobody covered by those laws can receive less than the matching overtime rate. For any other figure, the calculator above does the multiplication to the cent and splits a full week once you enter the total hours.</p>
<p>The multiplier never changes with seniority, industry or the size of the paycheck. What changes is the base it multiplies. Federal law sets it at the regular rate of pay, defined in ${h.src('usc_207', 'section 7 of the FLSA')} as all remuneration for employment minus a closed list of exclusions. That is why the same ${h.usd(20)} job can produce three different overtime rates in three different weeks.</p>
<h2>Bonuses and differentials that lift the multiplier's base</h2>
<p>The ${h.src('dol_fs23', 'Department of Labor’s Fact Sheet #23')} names the payments that stay inside the regular rate: shift differentials, nondiscretionary bonuses tied to attendance, production or quality, commissions and most pay for the work itself. A bonus announced in advance, like ${h.usd(92)} for hitting a weekly target, is nondiscretionary because the worker expects it once the target is met. It is divided over every hour of the week, not just the overtime ones.</p>
<p>Take ${h.hrs(46)} hours at ${h.usd(20)} with that ${h.usd(92)} bonus. Straight time and bonus add up to ${h.usd(20 * 46 + 92, 2)}, which divided by ${h.hrs(46)} hours gives a regular rate of ${h.usd(bonus.regularRate, 2)}. The ${h.hrs(bonus.otHours)} overtime hours each earn half of that again, ${h.usd(bonus.extra, 2)} in all, and the week totals ${h.usd(bonus.total, 2)}. A payroll that ignored the bonus would compute ${h.usd(naive, 2)}, short by ${h.usd(bonus.total - naive, 2)}. Small per week, the gap repeats in every overtime week of the year.</p>
<p>What stays outside: gifts at the employer's discretion, such as an unannounced holiday bonus, expense reimbursements, pay for vacation, holidays or sick days not worked, and premium pay that is itself already an overtime rate. Those amounts are paid, but they do not raise the base of the multiplier.</p>
<h2>When the week holds two wages or a salary</h2>
<p>A cashier who also covers the stockroom at a higher wage has two straight-time rates in one week. The regular rate is then their weighted average, and the overtime premium is half of that average for each hour past ${OT}; ${h.a('regular-rate-of-pay', 'the regular rate guide')} works the method through. A nonexempt employee on a fixed weekly salary has a regular rate that falls as hours rise, which ${h.a('salaried-overtime', 'the salaried overtime calculator')} handles. In California and the other daily-rule states, some of those overtime hours may come from long days rather than the weekly total: ${h.a('overtime-calculator', 'the overtime calculator')} splits a week day by day, and ${h.a('double-time-calculator', 'the double time page')} covers the hours paid at twice the rate.</p>
`,
  tool: 'time-and-a-half',
  related: ['overtime-calculator', 'double-time-calculator', 'regular-rate-of-pay', 'salaried-overtime', 'hourly-rate-calculator'],
  sources: ['usc_207', 'dol_fs23', 'cfr_778_115', 'ca_min_wage'],
});
