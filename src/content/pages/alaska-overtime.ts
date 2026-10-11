import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const ak = K.ak;
const F = K.F;
const flexRule = { ...K.rules.alaska, dailyOtAfter: ak.flexPlanDailyOtAfter };
const flex = (hours: number[], rate: number) => { const s = K.ot.splitWeek(hours, flexRule, rate); return { ...s, pay: K.ot.grossPay(s, rate) }; };
const four10 = K.week([10, 10, 10, 10, 0, 0, 0], 'alaska', 24);
const four10Flex = flex([10, 10, 10, 10, 0, 0, 0], 24);
const five10 = K.week([10, 10, 10, 10, 10, 0, 0], 'alaska', 24);
const five10Fed = K.week([10, 10, 10, 10, 10, 0, 0], 'federal', 24);
const three12 = K.week([12, 12, 12, 0, 0, 0, 0], 'alaska', ak.minimumWage);
const three12Flex = flex([12, 12, 12, 0, 0, 0, 0], ak.minimumWage);
const three12Fed = K.week([12, 12, 12, 0, 0, 0, 0], 'federal', ak.minimumWage);

export default definePage({
  id: 'alaska-overtime',
  group: 'overtime',
  order: 50,
  slug: 'alaska-overtime',
  nav: 'Alaska overtime',
  card: 'Alaska’s 8-hour day and 40-hour week, the four-employee threshold and the 10-hour flexible plan.',
  title: `Alaska Overtime 2026: ${ak.dailyOtAfter}-Hour Day Rule and Flex Plans`,
  description: `Alaska overtime in 2026: time and a half past ${ak.dailyOtAfter} hours a day or ${ak.weeklyOtAfter} a week at employers with ${ak.employersFrom}+ workers, ${ak.flexPlanDailyOtAfter}-hour days on an approved flex plan, ${K.usd(ak.minimumWage, 2)} minimum.`,
  h1: 'Alaska overtime after eight hours in a day',
  intro: 'The calculator is set to Alaska: enter the hours of each day and your wage to count daily and weekly overtime the way the state does.',
  resume: `Alaska pays overtime by the day as well as by the week: time and a half for every hour past ${ak.dailyOtAfter} in a day and past ${ak.weeklyOtAfter} in a workweek, according to the state Wage and Hour Act and the Department of Labor’s table of state laws. The rule binds employers with ${ak.employersFrom} or more employees. A second figure matters for long shifts: under a voluntary flexible work hour plan approved by the state, daily overtime starts after ${ak.flexPlanDailyOtAfter} hours instead of ${ak.dailyOtAfter}. Four ten-hour days at ${K.usd(24)} show the difference plainly. Without a plan they hold ${K.hrs(four10.ot)} overtime hours and pay ${K.usd(four10.pay.total, 2)}; with an approved plan they hold ${K.hrs(four10Flex.ot)} and pay ${K.usd(four10Flex.pay.total, 2)}. Five such days give ${K.hrs(five10.ot)} overtime hours either way, because the weekly line catches what the daily one does not. The Alaska minimum wage shown in the federal table is ${K.usd(ak.minimumWage, 2)}, so an overtime hour at the floor is worth ${K.usd(ak.minimumWage * F.overtimeMultiplier, 2)}.`,
  faqs: [
    { q: 'Does a company with three employees owe daily overtime in Alaska?', a: `Not under the Alaska daily rule, which the Department of Labor table limits to employers with ${ak.employersFrom} or more employees. A business that small may still be covered by the federal FLSA, in which case overtime is owed past ${F.weeklyOvertimeAfter} hours in the workweek, but a single ${K.hrs(11)}-hour day would carry no premium on its own. The size test is the first thing to settle.` },
    { q: 'What is a flexible work hour plan in Alaska?', a: `It is a voluntary arrangement, approved by the state, under which daily overtime begins after ${ak.flexPlanDailyOtAfter} hours instead of ${ak.dailyOtAfter}. It suits four-day schedules: four ${K.hrs(ak.flexPlanDailyOtAfter)}-hour days at ${K.usd(24)} then pay ${K.usd(four10Flex.pay.total, 2)} rather than ${K.usd(four10.pay.total, 2)}. Weekly overtime past ${ak.weeklyOtAfter} hours still applies. Ask your employer for the approval if your long days are paid straight.` },
    { q: 'Are three 12-hour shifts overtime in Alaska?', a: `Yes, ${K.hrs(three12.ot)} of the ${K.hrs(three12.total)} hours are overtime under the default rule, because each shift runs ${K.hrs(12 - ak.dailyOtAfter)} hours past the daily limit. At the ${K.usd(ak.minimumWage, 2)} minimum, the week pays ${K.usd(three12.pay.total, 2)}. Under an approved flexible plan the count drops to ${K.hrs(three12Flex.ot)} hours and ${K.usd(three12Flex.pay.total, 2)}; under federal law alone there would be none.` },
    { q: 'Why did my Alaska paycheck show the same overtime as a federal week?', a: `Because in a week of equal long days the two rules can land on the same number. Five ${K.hrs(10)}-hour days hold ${K.hrs(five10.ot)} overtime hours whether you count ${K.hrs(10 - ak.dailyOtAfter)} extra hours per day or everything past ${ak.weeklyOtAfter}. Alaska only pays more when the long days fall in a week that stays short, or when days are uneven, as in a four-day schedule.` },
  ],
  body: (h) => `
${h.mini('otDay', 'alaska')}
<h2>Four employees and up: who the daily count reaches</h2>
<p>The ${h.src('ak_wage_hour', 'Alaska Wage and Hour Act')} adds a daily layer to the federal weekly one. The ${h.src('dol_state_table', 'Department of Labor’s state table')} summarizes it in a line: premium pay after ${h.hrs(ak.dailyOtAfter)} hours a day and ${ak.weeklyOtAfter} a week, for employers of ${ak.employersFrom} or more employees, with the flexible plan noted in the margin. That size threshold is the first thing to check on a disputed paycheck from a small Anchorage contractor or a family lodge. Three people on the payroll: the state daily rule is off, and only the federal test may apply. Four: every hour past ${h.hrs(ak.dailyOtAfter)} in a day earns ${h.num(F.overtimeMultiplier, 1)} times the regular rate.</p>
<p>Alaska has no double time and no seventh-day premium in the table. Its rule is plain time and a half, which makes the arithmetic shorter than in California: count the daily excess, then count straight-time hours past ${ak.weeklyOtAfter}, and never pay an hour twice. An ${h.hrs(11)}-hour Tuesday inside a ${h.hrs(30)}-hour week gives ${h.hrs(11 - ak.dailyOtAfter)} overtime hours that a worker in a state with only the weekly federal standard would not see.</p>
<h2>Ten-hour days under a flexible work hour plan</h2>
<p>Four-day rotations of long shifts are where the flexible plan earns its place. The employer and the employees agree to it voluntarily and the state approves it; once it is in place, the daily trigger moves from ${h.hrs(ak.dailyOtAfter)} to ${h.hrs(ak.flexPlanDailyOtAfter)} hours. Nothing else changes: the weekly line stays at ${ak.weeklyOtAfter} and the rate stays at time and a half. The table below runs the same schedules through both versions and through the federal rule.</p>
${h.table(['Schedule', 'Rate', 'Default Alaska rule', 'Approved flex plan', 'FLSA only'], [
  ['Four 10-hour days', h.usd(24), `${h.hrs(four10.ot)} OT h, ${h.usd(four10.pay.total, 2)}`, `${h.hrs(four10Flex.ot)} OT h, ${h.usd(four10Flex.pay.total, 2)}`, `${h.hrs(h.week([10, 10, 10, 10, 0, 0, 0], 'federal', 24).ot)} OT h, ${h.usd(h.week([10, 10, 10, 10, 0, 0, 0], 'federal', 24).pay.total, 2)}`],
  ['Five 10-hour days', h.usd(24), `${h.hrs(five10.ot)} OT h, ${h.usd(five10.pay.total, 2)}`, `${h.hrs(flex([10, 10, 10, 10, 10, 0, 0], 24).ot)} OT h, ${h.usd(flex([10, 10, 10, 10, 10, 0, 0], 24).pay.total, 2)}`, `${h.hrs(five10Fed.ot)} OT h, ${h.usd(five10Fed.pay.total, 2)}`],
  ['Three 12-hour shifts', h.usd(ak.minimumWage, 2), `${h.hrs(three12.ot)} OT h, ${h.usd(three12.pay.total, 2)}`, `${h.hrs(three12Flex.ot)} OT h, ${h.usd(three12Flex.pay.total, 2)}`, `${h.hrs(three12Fed.ot)} OT h, ${h.usd(three12Fed.pay.total, 2)}`],
], 'Overtime hours and gross pay split by the site engine; flex plan column uses the 10-hour daily trigger', ['l', 'r', 'r', 'r', 'r'])}
<p>Read the middle row carefully. With five ten-hour days, the plan saves the employer nothing, since all ${h.hrs(five10.total - ak.weeklyOtAfter)} hours past ${ak.weeklyOtAfter} are overtime under any version. The plan only changes the pay of schedules that stay at or under ${ak.weeklyOtAfter} hours with long days, which is exactly the four-day rotation. A worker on such a rotation who is paid straight time for every hour should ask to see the approval: without it, the default ${h.hrs(ak.dailyOtAfter)}-hour rule applies.</p>
<h2>Paychecks at the Alaska minimum</h2>
<p>The federal table lists the Alaska minimum wage at ${h.usd(ak.minimumWage, 2)} an hour, almost double the federal ${h.usd(F.minimumWage, 2)}. Overtime at that floor is ${h.usd(ak.minimumWage * F.overtimeMultiplier, 2)} an hour, and a standard ${ak.weeklyOtAfter}-hour week earns ${h.usd(ak.minimumWage * ak.weeklyOtAfter, 2)} before any deduction. The calculator uses whatever hourly wage you type, so a higher contract rate works the same way. For other states that count overtime by the day, ${h.a('daily-overtime-states', 'the daily overtime comparison')} lines them up, and ${h.a('overtime-calculator', 'the main overtime calculator')} lets you switch rules on the same week. If the employer pays a weekly salary instead of an hourly wage, ${h.a('salaried-overtime', 'the salaried overtime page')} shows how the regular rate is found.</p>
`,
  tool: 'overtime',
  toolProps: { state: 'alaska', lock: true },
  related: ['daily-overtime-states', 'overtime-calculator', 'california-overtime', 'time-and-a-half-calculator'],
  sources: ['ak_wage_hour', 'dol_state_table', 'dol_fs23', 'usc_207'],
});
