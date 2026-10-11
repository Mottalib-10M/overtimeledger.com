import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const nv = K.nv;
const F = K.F;
const LIM = K.nvDailyLimit;
const below = Math.round((LIM - 0.01) * 100) / 100;
const sched = [10, 10, 10, 10, 0, 0, 0];
const under = K.week(sched, 'nevada', below);
const at = K.week(sched, 'nevada', LIM);
const mid = K.week(sched, 'nevada', 16.5);
const midFed = K.week(sched, 'federal', 16.5);
const five10 = K.week([10, 10, 10, 10, 10, 0, 0], 'nevada', 15);
const five10High = K.week([10, 10, 10, 10, 10, 0, 0], 'nevada', 25);
const minDay = K.week([12, 6, 6, 0, 0, 0, 0], 'nevada', nv.minimumWage);
const cliff = under.pay.total - at.pay.total;
const breakEven = under.pay.total / at.total;

export default definePage({
  id: 'nevada-overtime',
  group: 'overtime',
  order: 60,
  slug: 'nevada-overtime',
  nav: 'Nevada overtime',
  card: `Nevada’s daily overtime only reaches wages under ${K.usd(K.nvDailyLimit, 2)} an hour; weekly overtime reaches everyone.`,
  title: `Nevada Overtime 2026: Daily Overtime Below ${K.usd(K.nvDailyLimit, 2)} an Hour`,
  description: `Nevada overtime in 2026: past ${nv.dailyOtAfter} hours a day only if you earn under ${K.usd(LIM, 2)} an hour (1.5x the ${K.usd(nv.minimumWage, 2)} minimum), past ${nv.weeklyOtAfter} a week for all. Test your rate here.`,
  h1: 'Nevada overtime and the wage cutoff for daily hours',
  intro: 'The calculator is fixed on Nevada: your hourly rate decides whether long days count, so enter it before the hours of each day.',
  resume: `Nevada pays overtime after ${nv.dailyOtAfter} hours in a day only to employees whose hourly rate is below one and a half times the state minimum wage; everyone else gets overtime after ${nv.weeklyOtAfter} hours in the workweek, as under federal law. With the minimum at ${K.usd(nv.minimumWage, 2)} in the Department of Labor’s table of state laws, the cutoff is ${K.usd(LIM, 2)} an hour. The consequence is a cliff, not a slope. Four ten-hour days at ${K.usd(below, 2)} hold ${K.hrs(under.ot)} overtime hours and pay ${K.usd(under.pay.total, 2)}, while the same days at exactly ${K.usd(LIM, 2)} hold none and pay ${K.usd(at.pay.total, 2)}, so a raise of one cent costs ${K.usd(cliff, 2)} that week. At ${K.usd(16.5, 2)}, the four long days pay ${K.usd(mid.pay.total, 2)} against ${K.usd(midFed.pay.total, 2)} in a state without a daily rule. Long weeks stay protected at any rate: five ten-hour days carry ${K.hrs(five10High.ot)} overtime hours even at ${K.usd(25)}.`,
  faqs: [
    { q: 'I earn $18 an hour in Nevada: do I get overtime after 8 hours?', a: `No, not by the day. The daily rule covers rates below ${K.usd(LIM, 2)}, one and a half times the ${K.usd(nv.minimumWage, 2)} state minimum shown in the Department of Labor table, and a rate equal to that figure is not below it. You still earn time and a half for every hour past ${nv.weeklyOtAfter} in the workweek, so a ${K.hrs(50)}-hour week holds ${K.hrs(50 - nv.weeklyOtAfter)} overtime hours whatever the length of each day.` },
    { q: 'Would a small raise make me lose daily overtime in Nevada?', a: `It can, if it carries you from under ${K.usd(LIM, 2)} to that figure or above. On four ten-hour days, ${K.usd(below, 2)} an hour pays ${K.usd(under.pay.total, 2)} and ${K.usd(LIM, 2)} pays ${K.usd(at.pay.total, 2)}. The new rate only catches up at about ${K.usd(breakEven, 2)} an hour. On a schedule of eight-hour days the raise is pure gain, since no day passes the daily limit anyway.` },
    { q: 'Does Nevada daily overtime use the state or the federal minimum wage?', a: `The state one. The Department of Labor table describes the Nevada cutoff as one and a half times the state minimum wage, which it lists at ${K.usd(nv.minimumWage, 2)} an hour, giving ${K.usd(LIM, 2)}. The federal minimum of ${K.usd(F.minimumWage, 2)} plays no part here. When the state minimum rises, the cutoff rises with it, and more workers come under the daily rule.` },
    { q: 'Is a 12-hour shift at minimum wage overtime in Nevada?', a: `Yes, ${K.hrs(12 - nv.dailyOtAfter)} of its hours are, because ${K.usd(nv.minimumWage, 2)} is well under the ${K.usd(LIM, 2)} cutoff. A week of one ${K.hrs(12)}-hour shift and two ${K.hrs(6)}-hour shifts totals ${K.hrs(minDay.total)} hours, far from the weekly line, yet it holds ${K.hrs(minDay.ot)} overtime hours and pays ${K.usd(minDay.pay.total, 2)} gross. Under the federal rule alone the same week would pay ${K.usd(minDay.total * nv.minimumWage, 2)}.` },
  ],
  body: (h) => `
${h.mini('nvCheck')}
<h2>One rate, two answers: the ${h.usd(LIM, 2)} line</h2>
<p>Most overtime rules ask how long you worked. Nevada first asks how much you earn. The ${h.src('dol_state_table', 'Department of Labor’s table of state premium-pay laws')} sums it up: daily overtime after ${h.hrs(nv.dailyOtAfter)} hours applies to employees paid less than one and a half times the minimum wage, and weekly overtime after ${nv.weeklyOtAfter} hours applies to all. With the minimum at ${h.usd(nv.minimumWage, 2)}, multiply by ${h.num(nv.dailyOtOnlyBelowMultipleOfMinimum, 1)} and the line falls at ${h.usd(LIM, 2)}.</p>
<p>The word that matters is "less than". A housekeeper at ${h.usd(15)}, a cook at ${h.usd(16.5, 2)} and a cashier at ${h.usd(below, 2)} are all inside the daily rule. A dealer whose base is exactly ${h.usd(LIM, 2)} is outside it, and so is anyone above. Once outside, only the ${nv.weeklyOtAfter}-hour weekly count of the ${h.src('usc_207', 'FLSA')} protects the paycheck, and long days in a short week are paid straight.</p>
${h.table(['Hourly rate', 'Daily rule on?', 'Overtime hours (four 10-hour days)', 'Gross for the week'], [
  [h.usd(nv.minimumWage, 2), 'Yes', h.hrs(h.week(sched, 'nevada', nv.minimumWage).ot), h.usd(h.week(sched, 'nevada', nv.minimumWage).pay.total, 2)],
  [h.usd(16.5, 2), 'Yes', h.hrs(mid.ot), h.usd(mid.pay.total, 2)],
  [h.usd(below, 2), 'Yes', h.hrs(under.ot), h.usd(under.pay.total, 2)],
  [h.usd(LIM, 2), 'No', h.hrs(at.ot), h.usd(at.pay.total, 2)],
  [h.usd(20, 2), 'No', h.hrs(h.week(sched, 'nevada', 20).ot), h.usd(h.week(sched, 'nevada', 20).pay.total, 2)],
], `Four ten-hour days split by the site engine with the Nevada cutoff of ${h.usd(LIM, 2)}`, ['l', 'l', 'r', 'r'])}
<h2>The cliff at the cutoff, in dollars</h2>
<p>The fourth row pays less than the third. A worker moving from ${h.usd(below, 2)} to ${h.usd(LIM, 2)} on a four-day schedule loses ${h.usd(cliff, 2)} a week, because the ${h.hrs(under.ot)} hours that were paid at time and a half go back to straight time. Over a quarter of such weeks, that is ${h.usd(cliff * 13, 2)}. The raise only pays off around ${h.usd(breakEven, 2)} an hour on that schedule. Anyone negotiating a wage near the line with long shifts should run both figures in the calculator before agreeing.</p>
<p>The cliff disappears on regular schedules. Eight-hour days never trigger daily overtime, so a cent more is a cent more. It also disappears in long weeks: five ten-hour days at ${h.usd(15)} hold ${h.hrs(five10.ot)} overtime hours under the daily rule, and at ${h.usd(25)} they still hold ${h.hrs(five10High.ot)} under the weekly one. The cutoff only bites when long days sit inside a week that stays at or under ${nv.weeklyOtAfter} hours.</p>
<p>A warning on scope. Nevada's statute carries other conditions and exceptions that this page does not cover, because the legislature's own text could not be checked at the time of writing; the figures here are the ones the federal table publishes. If an employer says a particular arrangement removes daily overtime for a worker under ${h.usd(LIM, 2)}, ask for the written basis and check it with the Nevada Labor Commissioner.</p>
<h2>Weekly overtime for every Nevada wage</h2>
<p>The weekly rule is identical to the federal one: ${h.num(F.overtimeMultiplier, 1)} times the regular rate after ${nv.weeklyOtAfter} hours in a fixed workweek, with no averaging between weeks (${h.src('dol_fs23', 'Fact Sheet #23')}). Nondiscretionary bonuses and shift differentials form part of the regular rate and raise the overtime rate, which is worth checking for casino and hotel night crews. ${h.a('regular-rate-of-pay', 'The regular rate guide')} shows that calculation, ${h.a('daily-overtime-states', 'the state comparison')} sets Nevada beside California, Alaska and Colorado, and ${h.a('time-and-a-half-calculator', 'the time and a half calculator')} gives the overtime rate for any wage.</p>
`,
  tool: 'overtime',
  toolProps: { state: 'nevada', lock: true },
  related: ['daily-overtime-states', 'time-and-a-half-calculator', 'overtime-calculator', 'regular-rate-of-pay'],
  sources: ['dol_state_table', 'usc_207', 'dol_fs23'],
});
