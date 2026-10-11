import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const co = K.co;
const F = K.F;
const three13 = K.week([13, 13, 13, 0, 0, 0, 0], 'colorado', 22);
const three13Fed = K.week([13, 13, 13, 0, 0, 0, 0], 'federal', 22);
const four12 = K.week([12, 12, 12, 12, 0, 0, 0], 'colorado', 20);
const mixed = K.week([14, 8, 8, 8, 8, 0, 0], 'colorado', co.minimumWage);
const wkA = K.week([10, 10, 10, 10, 10, 0, 0], 'colorado', 20);
const wkB = K.week([6, 6, 6, 6, 6, 0, 0], 'colorado', 20);
const restRows = co.restTable.map(([upTo, n], i) => {
  const from = i === 0 ? 0 : co.restTable[i - 1][0];
  return [i === 0 ? `Up to ${upTo} hours` : `More than ${from} and up to ${upTo} hours`, String(n), `${n * co.restMinutesPer4h} min`];
});

export default definePage({
  id: 'colorado-overtime',
  group: 'overtime',
  order: 70,
  slug: 'colorado-overtime',
  nav: 'Colorado overtime',
  card: 'COMPS Order #40: overtime past 40 hours a week, 12 in a workday or 12 in a row, whichever pays more.',
  title: `Colorado Overtime 2026: COMPS Order #${co.compsOrder} Rules and Pay`,
  description: `Colorado overtime in 2026: time and a half past ${co.weeklyOtAfter} hours a week, ${co.dailyOtAfter} a workday or ${co.consecutiveOtAfter} in a row (COMPS #${co.compsOrder}), paid rest breaks, ${K.usd(co.minimumWage, 2)} minimum wage. Run your week.`,
  h1: 'Colorado overtime under COMPS Order #40',
  intro: 'The calculator is locked on Colorado: enter each workday and your rate; days past twelve hours and weeks past forty are both counted.',
  resume: `Colorado requires time and a half for hours worked past ${co.weeklyOtAfter} in a workweek, past ${co.dailyOtAfter} in a workday, or past ${co.consecutiveOtAfter} consecutive hours regardless of when the workday starts, and Rule 4.1.2 of COMPS Order #${co.compsOrder}, in force since ${K.day(co.compsEffective)}, says the calculation that pays the employee more is the one used. The daily trigger is higher than California’s but it covers short weeks the federal rule ignores. Three thirteen-hour shifts at ${K.usd(22)} hold ${K.hrs(three13.ot)} overtime hours and pay ${K.usd(three13.pay.total, 2)}, against ${K.usd(three13Fed.pay.total, 2)} under the FLSA alone. Four twelve-hour shifts reach no daily overtime, yet the week of ${K.hrs(four12.total)} hours still carries ${K.hrs(four12.ot)} through the weekly count. Rule 4.1.3 forbids averaging hours across two or more workweeks. The state minimum wage is ${K.usd(co.minimumWage, 2)} an hour in 2026, rising to ${K.usd(co.minimumWage2027, 2)} in 2027 according to the state labor department, and the order also sets a ${co.mealMinutes}-minute meal period and paid ${co.restMinutesPer4h}-minute rest breaks.`,
  faqs: [
    { q: 'Do four 12-hour shifts earn overtime in Colorado?', a: `Only through the weekly count. COMPS Order #${co.compsOrder} pays daily overtime for hours past ${co.dailyOtAfter} in a workday, and a shift of exactly ${co.dailyOtAfter} hours does not pass that line. Four of them add up to ${K.hrs(four12.total)} hours, so ${K.hrs(four12.ot)} hours past ${co.weeklyOtAfter} earn time and a half. At ${K.usd(20)} an hour, the week pays ${K.usd(four12.pay.total, 2)} before deductions.` },
    { q: 'What does 12 consecutive hours mean in Colorado overtime?', a: `It catches a stretch of work longer than ${co.consecutiveOtAfter} hours in a row even when it straddles two workdays. A shift from 6 pm to 8 am the next morning may split across the employer's workday boundary so neither workday passes ${co.dailyOtAfter} hours, yet the ${K.hrs(14)} hours worked in a row still exceed ${co.consecutiveOtAfter} by ${K.hrs(14 - co.consecutiveOtAfter)}, and those hours are overtime under Rule 4 of the order.` },
    { q: 'How many paid rest breaks does a 9-hour shift get in Colorado?', a: `Two. The rest period table of COMPS Order #${co.compsOrder} gives ${co.restTable[2][1]} paid breaks of ${co.restMinutesPer4h} minutes for a shift of more than ${co.restTable[1][0]} and up to ${co.restTable[2][0]} hours, ${co.restTable[2][1] * co.restMinutesPer4h} minutes in all, counted as time worked. The same shift also needs a ${co.mealMinutes}-minute meal period, because it runs past ${co.mealAfterHours} consecutive hours. Breaks are not deducted from the time card.` },
    { q: 'What is the Colorado minimum wage in 2026 and 2027?', a: `It is ${K.usd(co.minimumWage, 2)} an hour in 2026, and the Colorado Department of Labor and Employment announced on August 13, 2026 that it will be ${K.usd(co.minimumWage2027, 2)} in 2027. Overtime at the 2026 floor is ${K.usd(co.minimumWage * F.overtimeMultiplier, 2)} an hour, and a full ${co.weeklyOtAfter}-hour week at the minimum pays ${K.usd(co.minimumWage * co.weeklyOtAfter, 2)} before deductions.` },
    { q: 'Can Colorado overtime be balanced between a 50-hour and a 30-hour week?', a: `No. Rule 4.1.3 of COMPS Order #${co.compsOrder} rules out averaging over two or more workweeks. The ${K.hrs(wkA.total)}-hour week holds ${K.hrs(wkA.ot)} overtime hours on its own, paid at time and a half, and the ${K.hrs(wkB.total)}-hour week does nothing to cancel them. At ${K.usd(20)}, that is ${K.usd(wkA.pay.ot, 2)} of overtime pay in the first week.` },
  ],
  body: (h) => `
${h.mini('otDay', 'colorado')}
<h2>Rule 4: three overtime triggers and a tiebreaker</h2>
<p>The ${h.src('co_comps40', 'COMPS Order #' + co.compsOrder)} took effect on ${h.day(co.compsEffective)} and replaces the order that came before it. Its Rule 4 lists three ways an hour becomes overtime: it falls past ${co.weeklyOtAfter} hours in the workweek, past ${co.dailyOtAfter} hours in the workday, or past ${co.consecutiveOtAfter} consecutive hours without regard to when the workday begins. Rule 4.1.2 then settles any overlap with a short instruction: compute it each way and pay whichever result is greater. In practice that means an hour is counted once, under the trigger that reaches it first, which is how the calculator on this page applies the order.</p>
<p>Rule 4.1.3 closes the door on averaging. A workweek is a fixed, recurring period of seven days, and each one stands alone. The same holds under federal law; Colorado restates it in its own order, so a payroll that nets a long week against a short one breaks both.</p>
${h.table(['Workweek', 'Rate', 'Daily overtime', 'Weekly overtime', 'Gross pay'], [
  ['Three 13-hour shifts', h.usd(22), h.hrs(three13.ot), h.hrs(0), h.usd(three13.pay.total, 2)],
  ['Four 12-hour shifts', h.usd(20), h.hrs(0), h.hrs(four12.ot), h.usd(four12.pay.total, 2)],
  ['A 14-hour Monday, then four 8-hour days', h.usd(co.minimumWage, 2), h.hrs(mixed.days[0].ot), h.hrs(mixed.ot - mixed.days[0].ot), h.usd(mixed.pay.total, 2)],
  ['Five 10-hour days', h.usd(20), h.hrs(0), h.hrs(wkA.ot), h.usd(wkA.pay.total, 2)],
], 'Split by the site engine under COMPS Order #40, Rule 4.1.2', ['l', 'r', 'r', 'r', 'r'])}
<p>The third row combines both triggers. The ${h.hrs(14)}-hour Monday has ${h.hrs(mixed.days[0].ot)} hours past ${co.dailyOtAfter}, set aside as daily overtime. Its remaining ${h.hrs(co.dailyOtAfter)} straight hours plus the four eight-hour days make ${h.hrs(co.dailyOtAfter + 32)} straight hours, so ${h.hrs(mixed.ot - mixed.days[0].ot)} more cross the weekly line. At the ${h.usd(co.minimumWage, 2)} minimum wage, the week of ${h.hrs(mixed.total)} hours pays ${h.usd(mixed.pay.total, 2)}. Counting the Monday's excess twice, once daily and once weekly, would overpay; skipping the daily count would underpay. Rule 4.1.2 is there to stop both mistakes.</p>
<h2>Meal periods and the paid rest table</h2>
<p>Rule 5 of the same order covers breaks. An employee is entitled to a ${co.mealMinutes}-minute meal period when a shift runs past ${co.mealAfterHours} consecutive hours. Rest breaks are different: ${co.restMinutesPer4h} minutes for every four hours of work, paid, and never subtracted from hours worked. The order spells out the count in a table, reproduced below.</p>
${h.table(['Shift length', 'Paid rest breaks', 'Paid rest time'], restRows, 'COMPS Order #40, Rule 5 rest period table', ['l', 'r', 'r'])}
<p>A rest break counts as time worked, so it can push a day toward the ${co.dailyOtAfter}-hour line. A twelve-hour shift with three paid breaks is still twelve hours of work on the time card; a thirty-minute unpaid lunch on top makes the presence twelve and a half hours without changing the overtime count. The ${h.a('meal-and-rest-breaks', 'meal and rest breaks guide')} compares these rules with California's and with the federal position, under which breaks are not required at all.</p>
${h.mini('bCoRest')}
<h2>Minimum wage now and in 2027</h2>
<p>The state minimum is ${h.usd(co.minimumWage, 2)} an hour in 2026. In a ${h.src('co_min_wage_2027', 'press release of August 13, 2026')}, the state labor department announced ${h.usd(co.minimumWage2027, 2)} for 2027. A full ${co.weeklyOtAfter}-hour week at the current rate pays ${h.usd(co.minimumWage * co.weeklyOtAfter, 2)}; at next year's, ${h.usd(co.minimumWage2027 * co.weeklyOtAfter, 2)}. The overtime rate follows: ${h.usd(co.minimumWage * F.overtimeMultiplier, 2)} now, ${h.usd(co.minimumWage2027 * F.overtimeMultiplier, 2)} next year. To set Colorado next to the other daily states, see ${h.a('daily-overtime-states', 'which states pay daily overtime')}; for a salaried role, ${h.a('exempt-vs-nonexempt', 'the exemption tests')} apply before any of this.</p>
`,
  tool: 'overtime',
  toolProps: { state: 'colorado', lock: true },
  related: ['daily-overtime-states', 'meal-and-rest-breaks', 'overtime-calculator', 'exempt-vs-nonexempt', 'california-overtime'],
  sources: ['co_comps40', 'co_min_wage_2027', 'dol_state_table', 'dol_fs23'],
});
