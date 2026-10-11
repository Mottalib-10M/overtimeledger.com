import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const HW = K.P.hoursWorked;
const ca = K.ca;
const co = K.co;
const rate = 21;
// An 8.5-hour span with a 30-minute meal: 8 paid hours. The same span with only two short rests: all paid.
const span = K.time.shiftMinutes(K.time.parseClock('7:30'), K.time.parseClock('16:00'), HW.mealUnpaidMinMinutes, 0);
const spanNoMeal = K.time.shiftMinutes(K.time.parseClock('7:30'), K.time.parseClock('16:00'), 0, 0);
// California rest periods: 10 minutes per 4 hours or major fraction (more than 2 hours), none under 3.5 hours.
const caRests = (h: number) => (h < ca.restNotRequiredUnderHours ? 0 : Math.floor(h / 4) + (h % 4 > 2 ? 1 : 0));
const caMeals = (h: number) => (h > ca.secondMealAfterHours ? 2 : h > ca.mealAfterHours ? 1 : 0);
const premium = ca.premiumHoursMissedBreak * rate;

export default definePage({
  id: 'meal-and-rest-breaks',
  group: 'overtime',
  order: 120,
  slug: 'meal-and-rest-breaks',
  nav: 'Meal and rest breaks',
  card: 'Which breaks come off the time card and which stay paid, with the California and Colorado break schedules.',
  title: 'Meal and Rest Breaks 2026: Federal, California, Colorado',
  description: `Meal and rest breaks in 2026: short rests of ${HW.restPaidMinMinutes} to ${HW.restPaidMaxMinutes} minutes stay paid, a ${HW.mealUnpaidMinMinutes}-minute meal can be unpaid, plus the full California and Colorado schedules.`,
  h1: 'Meal and rest breaks: what is paid and what is required',
  intro: 'Two separate questions sit behind every break: does the law require it, and does it count as paid time on the card.',
  resume: `Federal law does not require employers to give meal or rest breaks at all, but when a break is given, its length decides whether it is paid. Under 29 CFR 785.18, short rest breaks of about ${HW.restPaidMinMinutes} to ${HW.restPaidMaxMinutes} minutes count as hours worked and stay on the time card. A bona fide meal period, ordinarily ${HW.mealUnpaidMinMinutes} minutes or more during which the worker is completely relieved of duties, is not work time under 785.19 and can be deducted. A shift punched from 7:30 AM to 4:00 PM with a real half-hour lunch therefore pays ${K.hrs(span.minutes / 60)} hours, or ${K.usd((span.minutes / 60) * rate, 2)} at ${K.usd(rate)} an hour. Some states add requirements on top of this. California requires a ${ca.mealMinutes}-minute meal for a workday longer than ${ca.mealAfterHours} hours, a second one past ${ca.secondMealAfterHours} hours, and a paid ${ca.restMinutesPer4h}-minute rest for every four hours or major fraction; a missed break costs the employer ${ca.premiumHoursMissedBreak} extra hour of pay for that day. Colorado requires a ${co.mealMinutes}-minute meal after ${co.mealAfterHours} consecutive hours and a paid ${co.restMinutesPer4h}-minute rest per four hours.`,
  faqs: [
    { q: 'Can my boss make me take an unpaid 20-minute lunch?', a: `Not as unpaid time under federal rules. 29 CFR 785.19 treats a meal period as non-work time when it is ordinarily ${HW.mealUnpaidMinMinutes} minutes or more and you are fully relieved of duties. A ${HW.restPaidMaxMinutes}-minute break falls in the range that 785.18 counts as hours worked, so deducting it from the card underpays you, unless special conditions make a shorter period a genuine meal.` },
    { q: 'Is a lunch break paid if I have to answer the phone at my desk?', a: `It is paid. The Department of Labor rule in 785.19 says a worker who must stay at the desk or machine and keep doing tasks, even light ones like answering calls or watching a counter, is not relieved of duties. That time is worktime regardless of how long the break lasts, and it must be added back to the hours on the card.` },
    { q: 'How many rest breaks does California require on a 10-hour shift?', a: `${caRests(10)} paid rests of ${ca.restMinutesPer4h} minutes, according to the Labor Commissioner's rule of one rest per four hours worked or major fraction. A 10-hour day is two full blocks of four hours with exactly 2 hours left over, which is not more than half a block. At 10.5 hours the leftover becomes a major fraction and a third rest is owed. No rest is required for a day under ${K.hrs(ca.restNotRequiredUnderHours)} hours.` },
    { q: 'What does a California employer owe when a meal break is skipped?', a: `${ca.premiumHoursMissedBreak} additional hour of pay at the regular rate for each workday the break was not provided, under Labor Code 226.7 as described in the DLSE meal period FAQ. At ${K.usd(rate)} an hour that premium is ${K.usd(premium)} for the day. The meal period can be waived by mutual consent under specific circumstances, so a skipped lunch is not automatically a violation; the FAQ sets out those cases.` },
    { q: 'Does Colorado pay rest breaks on a 12-hour shift?', a: `Yes. COMPS Order #40 requires a paid ${co.restMinutesPer4h}-minute rest for every four hours worked, and its table gives ${co.restTable.find((r) => r[0] >= 12)![1]} rests for a shift of more than 10 and up to 14 hours. The same shift also needs an uninterrupted ${co.mealMinutes}-minute meal once more than ${co.mealAfterHours} consecutive hours are worked during the shift.` },
    { q: 'Are smoke breaks and coffee breaks treated differently on a time card?', a: `No. Federal rules look only at the length and the freedom of the break, not at what you do with it. A coffee, smoke or restroom break of ${HW.restPaidMinMinutes} to ${HW.restPaidMaxMinutes} minutes counts as hours worked under 785.18 and cannot be deducted. Only a bona fide meal of ${HW.mealUnpaidMinMinutes} minutes or more, with no duties, comes off the total.` },
  ],
  body: (h) => `
${h.mini('breakPay')}
<h2>Paid minutes and unpaid minutes on a federal time card</h2>
<p>The Fair Labor Standards Act sets no break schedule. ${h.src('dol_fs22', 'Fact Sheet #22')} is explicit on the point: an employer covered only by federal law may run an eight-hour shift without a single pause. What the federal rules do regulate is the arithmetic once a pause exists. A short stop for coffee, a restroom visit or a smoke is presumed to help the employer, because it keeps the worker efficient, so ${h.src('cfr_785_18', '29 CFR 785.18')} counts rests of roughly ${HW.restPaidMinMinutes} to ${HW.restPaidMaxMinutes} minutes as hours worked. Those minutes stay inside the shift and feed the weekly overtime total.</p>
<p>A meal is different. Under ${h.src('cfr_785_19', '29 CFR 785.19')}, a bona fide meal period is not worktime, but two conditions have to hold together. It is ordinarily ${HW.mealUnpaidMinMinutes} minutes or longer, and the employee is completely relieved from duty for the purpose of eating. A receptionist who eats at the front desk while covering the phones has not had a meal period in the legal sense, however long it lasted. In those cases the lunch is paid time and should not appear as a deduction on the card.</p>
<p>Here is the effect on one shift. Punched in at 7:30 AM and out at 4:00 PM, the span is ${K.time.hm(spanNoMeal.minutes)}. With a genuine half-hour lunch, ${K.hrs(span.minutes / 60)} hours are paid; with two ten-minute coffee breaks and no meal, all ${K.hrs(spanNoMeal.minutes / 60)} hours are paid. At ${K.usd(rate)} an hour, the gap is ${K.usd(((spanNoMeal.minutes - span.minutes) / 60) * rate, 2)} a day, about ${K.usd(((spanNoMeal.minutes - span.minutes) / 60) * rate * 5, 2)} over a five-day week. ${h.a('hours-calculator', 'The hours calculator')} takes the unpaid minutes as an input so you can test either version, and ${h.a('time-clock-rounding', 'the rounding guide')} explains what happens when the punches themselves are rounded.</p>
${h.table(['Break', 'Federal treatment', 'Rule'], [[`${HW.restPaidMinMinutes} to ${HW.restPaidMaxMinutes} min rest`, 'Paid, counts toward overtime', '29 CFR 785.18'], [`${HW.mealUnpaidMinMinutes} min or more, fully off duty`, 'Unpaid, deducted', '29 CFR 785.19'], ['Meal taken while working', 'Paid, whatever the length', '29 CFR 785.19'], ['Between 20 and 30 min', 'Treat as paid unless a real meal', 'Both sections']], 'How a break is counted under federal hours-worked rules')}
<h2>California: a schedule set by the Labor Commissioner</h2>
<p>California turns breaks into an obligation with a price tag. The ${h.src('ca_meal', 'DLSE meal period FAQ')} requires a ${ca.mealMinutes}-minute meal when the workday runs past ${ca.mealAfterHours} hours, and a second one once it passes ${ca.secondMealAfterHours} hours. The first meal can be waived by mutual consent under specific circumstances, and the FAQ lists them; outside those cases the lunch has to happen. The ${h.src('ca_rest', 'rest period FAQ')} adds a paid ${ca.restMinutesPer4h}-minute rest for each four hours worked or major fraction of that, with no rest owed on a day shorter than ${K.hrs(ca.restNotRequiredUnderHours)} hours.</p>
${h.table(['Hours worked in the day', 'Paid rests', 'Meal periods'], [3, 5, 6, 8, 10, 11, 12].map((x) => [K.hrs(x), caRests(x), caMeals(x)]), 'California breaks owed for a few common shift lengths (DLSE rest and meal FAQs)', ['l', 'r', 'r'])}
<p>When a required break does not happen, the employer owes ${ca.premiumHoursMissedBreak} extra hour of pay at the regular rate for that workday. For a cook earning ${K.usd(rate)} who works through lunch on a nine-hour shift, that is ${K.usd(premium)} added to the paycheck. This premium is separate from overtime: the nine hours already include ${K.hrs(K.week([9, 0, 0, 0, 0, 0, 0], 'california', rate).ot)} hour of daily overtime under ${h.a('california-overtime', 'California overtime')}, and the missed-meal hour sits on top of it.</p>
<h2>Colorado: rest periods counted by the table</h2>
<p>Colorado's ${h.src('co_comps40', 'COMPS Order #40')}, effective ${K.day(co.compsEffective)}, requires an uninterrupted ${co.mealMinutes}-minute meal once a shift exceeds ${co.mealAfterHours} consecutive hours. Rest periods of ${co.restMinutesPer4h} minutes are paid and follow a fixed table rather than a formula, which matters for long healthcare and warehouse shifts.</p>
${h.table(['Work hours in the shift', 'Paid rest periods'], co.restTable.map((r, i) => [i === 0 ? `Up to ${r[0]}` : `More than ${co.restTable[i - 1][0]}, up to ${r[0]}`, r[1]]), 'Colorado rest periods by shift length (COMPS Order #40, Rule 5)', ['l', 'r'])}
<p>A 12-hour shift in Colorado therefore carries ${co.restTable.find((r) => r[0] >= 12)![1]} paid rests and one meal. Because the rests are paid, they stay inside the hours on the card and count toward the weekly total. ${h.a('colorado-overtime', 'The Colorado overtime page')} covers the ${co.dailyOtAfter}-hour daily threshold that the same long shift can trigger.</p>
`,
  tool: 'hours',
  related: ['hours-calculator', 'time-clock-rounding', 'california-overtime', 'colorado-overtime', 'timesheet-calculator'],
  sources: ['dol_fs22', 'cfr_785_18', 'cfr_785_19', 'ca_meal', 'ca_rest', 'co_comps40'],
});
