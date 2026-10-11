import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const F = K.F;
const R = K.rules;
const KEYS = ['california', 'alaska', 'nevada', 'colorado'] as const;
const O = K.P.otherDailyRules;
const shifts = [12, 12, 12, 0, 0, 0, 0];
const byState = Object.fromEntries([...KEYS, 'federal' as const].map((k) => [k, K.week(shifts, k, 17)])) as Record<string, ReturnType<typeof K.week>>;
const long = [14, 0, 0, 0, 0, 0, 0];
const day14 = Object.fromEntries([...KEYS, 'federal' as const].map((k) => [k, K.week(long, k, 17)])) as Record<string, ReturnType<typeof K.week>>;
const rank = KEYS.map((k) => ({ k, p: byState[k].pay.total })).sort((a, b) => b.p - a.p);

export default definePage({
  id: 'daily-overtime-states',
  group: 'overtime',
  order: 80,
  slug: 'daily-overtime-states',
  nav: 'Daily overtime states',
  card: 'Which states pay overtime by the day, at what hour, and for whom: the four rules side by side.',
  title: 'Daily Overtime States 2026: CA, AK, NV and CO Compared',
  description: `Daily overtime states in 2026: California, Alaska and Nevada after ${R.california.dailyOtAfter} hours, Colorado after ${R.colorado.dailyOtAfter}. Conditions, double time and a ${K.hrs(36)}-hour week, compared by state.`,
  h1: 'Which states pay overtime by the day',
  intro: 'Pick a state in the calculator and enter a week: the same hours are split under that state’s daily rule or under the federal weekly one.',
  resume: `Four states require overtime by the day: California, Alaska, Nevada and Colorado. California, Alaska and Nevada start time and a half after ${R.california.dailyOtAfter} hours in a day, and Colorado after ${R.colorado.dailyOtAfter} hours in a workday or ${K.co.consecutiveOtAfter} consecutive hours. The rules are not equal. Only California adds double time, after ${R.california.dailyDtAfter} hours and on the seventh consecutive day; Alaska limits its daily rule to employers with ${K.ak.employersFrom} or more employees; Nevada applies it only to workers paid under ${K.usd(K.nvDailyLimit, 2)} an hour. Every other state follows the federal rule of overtime after ${F.weeklyOvertimeAfter} hours in the workweek, with a few variations listed by the Department of Labor, such as Kentucky’s seventh-day provision and Minnesota’s ${O.minnesota.replace(/\D+/g, '')}-hour week. Three twelve-hour shifts at ${K.usd(17)} show the spread: ${K.usd(byState.california.pay.total, 2)} in California, ${K.usd(byState.alaska.pay.total, 2)} in Alaska and Nevada, ${K.usd(byState.colorado.pay.total, 2)} in Colorado, the same as the ${K.usd(byState.federal.pay.total, 2)} owed anywhere else.`,
  faqs: [
    { q: 'Which state has the strictest daily overtime law?', a: `California. It is the only one of the four daily-rule states with double time: hours past ${R.california.dailyDtAfter} in a day and past ${K.ca.seventhDayOtUpTo} on the seventh consecutive workday are paid at twice the regular rate. It applies its ${R.california.dailyOtAfter}-hour line to nonexempt employees at any wage, while Alaska exempts small employers and Nevada exempts higher rates. A ${K.hrs(14)}-hour day at ${K.usd(17)} pays ${K.usd(day14.california.pay.total, 2)} there.` },
    { q: 'Does Texas or Florida pay overtime after 8 hours a day?', a: `No. Neither appears among the daily-overtime states in the Department of Labor table, so the federal FLSA rule applies: time and a half only for hours past ${F.weeklyOvertimeAfter} in the workweek. A ${K.hrs(12)}-hour day in a ${K.hrs(36)}-hour week is paid straight. A contract, a union agreement or a handbook can still promise daily overtime; then that document sets the trigger.` },
    { q: 'Is Colorado daily overtime after 8 or 12 hours?', a: `After ${R.colorado.dailyOtAfter}. COMPS Order #${K.co.compsOrder}, in force since ${K.day(K.co.compsEffective)}, pays time and a half past ${R.colorado.dailyOtAfter} hours in a workday or ${K.co.consecutiveOtAfter} consecutive hours, along with past ${R.colorado.weeklyOtAfter} in a week. So a ${K.hrs(10)}-hour day is straight time in Colorado but carries ${K.hrs(10 - R.california.dailyOtAfter)} overtime hours in California, Alaska, and Nevada for workers under the cutoff.` },
    { q: 'What does the Kentucky seventh day rule say?', a: `The Department of Labor's state table summarizes Kentucky's premium pay rule as "${O.kentucky}", meaning weekly overtime past ${F.weeklyOvertimeAfter} hours plus a provision on the seventh day of work. The table lists no daily hour limit for Kentucky, so the length of a single day is not a trigger in that summary. The details of the seventh-day provision come from the state statute, which this site has not modeled.` },
    { q: 'Why do three 12-hour shifts pay the same in Colorado as in Texas?', a: `Because Colorado's daily line sits at ${R.colorado.dailyOtAfter} hours and a shift of exactly ${R.colorado.dailyOtAfter} does not pass it. The week of ${K.hrs(byState.colorado.total)} hours also stays under ${R.colorado.weeklyOtAfter}, so at ${K.usd(17)} both states pay ${K.usd(byState.colorado.pay.total, 2)}. Add one hour to any shift and Colorado pays a premium hour that Texas, with only the federal weekly rule, never owes.` },
  ],
  body: (h) => `
${h.mini('bStateCompare')}
<h2>The four state rules in one table</h2>
<p>The table below is built straight from the parameters the calculator uses, read on the ${h.src('dol_state_table', 'Department of Labor’s table of state premium-pay laws')} and on each state's own text: the ${h.src('ca_overtime', 'California Labor Commissioner')}, the ${h.src('ak_wage_hour', 'Alaska Wage and Hour Act')} and Colorado's ${h.src('co_comps40', 'COMPS Order #' + h.co.compsOrder)}. Nevada's figures come from the federal table alone.</p>
${h.table(['State', 'Daily overtime after', 'Double time', 'Seventh day', 'Weekly', 'Who is covered', 'Minimum wage'], [
  [R.california.name, `${h.hrs(R.california.dailyOtAfter as number)} h`, `past ${h.hrs(R.california.dailyDtAfter as number)} h a day`, `yes, 2x past ${h.hrs(h.ca.seventhDayOtUpTo)} h`, `${R.california.weeklyOtAfter} h`, 'nonexempt employees', h.usd(h.ca.minimumWage, 2)],
  [R.alaska.name, `${h.hrs(R.alaska.dailyOtAfter as number)} h (${h.hrs(h.ak.flexPlanDailyOtAfter)} h on a flex plan)`, 'no', 'no', `${R.alaska.weeklyOtAfter} h`, `employers of ${h.ak.employersFrom}+ employees`, h.usd(h.ak.minimumWage, 2)],
  [R.nevada.name, `${h.hrs(R.nevada.dailyOtAfter as number)} h`, 'no', 'no', `${R.nevada.weeklyOtAfter} h`, `rates under ${h.usd(h.nvDailyLimit, 2)}`, h.usd(h.nv.minimumWage, 2)],
  [R.colorado.name, `${h.hrs(R.colorado.dailyOtAfter as number)} h, or ${h.hrs(h.co.consecutiveOtAfter)} in a row`, 'no', 'no', `${R.colorado.weeklyOtAfter} h`, 'nonexempt employees', h.usd(h.co.minimumWage, 2)],
  ['Other states (FLSA)', 'none', 'no', 'no', `${F.weeklyOvertimeAfter} h`, 'covered nonexempt employees', `${h.usd(F.minimumWage, 2)} federal floor`],
], 'Daily overtime rules for 2026 as used by the calculator', ['l', 'l', 'l', 'l', 'r', 'l', 'r'])}
<p>The columns hide how differently the four rules behave. California's is the widest: every nonexempt worker, every day, two levels of premium, and a seventh-day rule that can create overtime in a week of thirty hours. Alaska's matches California's first level but stops there, and its flexible work hour plan lets a four-day rotation run to ${h.hrs(h.ak.flexPlanDailyOtAfter)} hours before the premium. Nevada's is a wage test before it is an hours test. Colorado's starts later in the day but adds the consecutive-hours trigger, built for shifts that cross the workday boundary.</p>
<p>Which schedules feel the difference? Regular five-day weeks of eight hours never trigger a daily rule anywhere, so office staff rarely notice it. The rules matter for compressed schedules (four tens, three twelves), for split shifts that run long on a busy day, and for part-time workers who pick up one double shift in an otherwise light week. In those cases the state line on the map changes the paycheck more than the hourly wage does, and the payroll software has to be set to the right state for each day worked.</p>
<h2>The same week in each state</h2>
<p>Take three twelve-hour shifts at ${h.usd(17)}, the pattern of many hospital and plant rotations: ${h.hrs(byState.federal.total)} hours in all and well under the weekly line. The calculator splits them as follows.</p>
${h.table(['Rule', 'Straight', 'At 1.5x', 'At 2x', 'Gross pay', 'One 14-hour day'], [...KEYS, 'federal'].map((k) => [k === 'federal' ? 'FLSA only' : R[k as keyof typeof R].name, h.hrs(byState[k].reg), h.hrs(byState[k].ot), h.hrs(byState[k].dt), h.usd(byState[k].pay.total, 2), h.usd(day14[k].pay.total, 2)]), `Three 12-hour shifts at ${h.usd(17)}, and a single 14-hour day, split by the site engine`, ['l', 'r', 'r', 'r', 'r', 'r'])}
<p>California comes first at ${h.usd(rank[0].p, 2)}, because each shift has ${h.hrs(R.california.dailyOtAfter as number)} straight hours and ${h.hrs(12 - (R.california.dailyOtAfter as number))} at time and a half, and none reaches double time. Alaska and Nevada land on the same figure: ${h.usd(17)} is under the Nevada cutoff, so the daily rule is on. Colorado pays nothing extra, since no shift passes ${h.hrs(R.colorado.dailyOtAfter as number)} hours, and matches every FLSA state. A single fourteen-hour day, in the last column, keeps the same order, with California adding double time and Colorado paying two premium hours. The full comparison by state, with your own hours, is in ${h.a('overtime-calculator', 'the overtime calculator')} above and on the pages for ${h.a('california-overtime', 'California')}, ${h.a('alaska-overtime', 'Alaska')}, ${h.a('nevada-overtime', 'Nevada')} and ${h.a('colorado-overtime', 'Colorado')}.</p>
<h2>Seventh-day and other variations in the federal table</h2>
<p>A handful of other jurisdictions appear in the federal table with rules that go beyond a plain ${F.weeklyOvertimeAfter}-hour week, and they are quoted here as the table words them. Kentucky: "${O.kentucky}". Puerto Rico: "${O.puertoRico}". The U.S. Virgin Islands: "${O.virginIslands}". Minnesota: "${O.minnesota}", which is a weekly threshold above the federal one and does not lower federal rights for workers the FLSA covers. This site does not model those rules, because their full conditions sit in local statutes that were not read for this page; the calculator offers the four states whose texts were checked, plus the federal rule. For workers anywhere, the federal floor still applies, as ${h.src('dol_fs23', 'Fact Sheet #23')} sets out.</p>
`,
  tool: 'overtime',
  related: ['california-overtime', 'alaska-overtime', 'nevada-overtime', 'colorado-overtime', 'overtime-calculator', 'double-time-calculator'],
  sources: ['dol_state_table', 'ca_overtime', 'ak_wage_hour', 'co_comps40', 'dol_fs23'],
});
