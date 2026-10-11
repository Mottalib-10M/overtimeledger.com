import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const T = K.time;
const [I5, I6, I15] = K.P.hoursWorked.roundingIncrements;
const LUNCH = K.P.hoursWorked.mealUnpaidMinMinutes;
const RATE = 20;
const punches: Array<[string, string, string]> = [['Mon', '7:53', '16:08'], ['Tue', '8:06', '16:02'], ['Wed', '7:58', '16:11'], ['Thu', '8:09', '16:04'], ['Fri', '7:52', '15:57']];
const day = (inT: string, outT: string, inc: number) => T.shiftMinutes(T.parseClock(inT), T.parseClock(outT), LUNCH, inc).minutes;
/** Rounding that always goes against the worker: in-punch up, out-punch down (shown as the unlawful pattern). */
const oneWay = (inT: string, outT: string) => {
  const a = T.parseClock(inT) as number, b = T.parseClock(outT) as number;
  return Math.floor(b / I15) * I15 - Math.ceil(a / I15) * I15 - LUNCH;
};
const week = punches.map(([d, i, o]) => ({ d, i, o, actual: day(i, o, 0), q: day(i, o, I15), t: day(i, o, I6), f: day(i, o, I5), one: oneWay(i, o) }));
const sum = (k: 'actual' | 'q' | 't' | 'f' | 'one') => week.reduce((s, r) => s + r[k], 0);
const tot = { actual: sum('actual'), q: sum('q'), t: sum('t'), f: sum('f'), one: sum('one') };
const sgn = (m: number) => `${m > 0 ? '+' : ''}${m} min`;
const lossYear = ((tot.actual - tot.one) / 60) * RATE * 50;

export default definePage({
  id: 'time-clock-rounding',
  group: 'overtime',
  order: 110,
  slug: 'time-clock-rounding',
  nav: 'Time clock rounding',
  card: `Punches rounded to ${I5}, ${I6} or ${I15} minutes, the federal test of neutrality and a week audited minute by minute.`,
  title: `Time Clock Rounding 2026: ${I5}, ${I6} and ${I15}-Minute Rules Tested`,
  description: `Time clock rounding in 2026: 29 CFR 785.48 allows the nearest ${I5} minutes, tenth or quarter hour if it averages out. A real week audited, one-way loss included.`,
  h1: 'Time clock rounding: the rule and a week put to the test',
  intro: 'Type your punches and choose an increment; the calculator shows actual and rounded time side by side so you can see who gains.',
  resume: `Rounding punches is legal under federal rules when it is neutral. 29 CFR 785.48(b) accepts recording time to the nearest ${I5} minutes, tenth of an hour (${I6} minutes) or quarter hour (${I15} minutes), provided the practice averages out so that employees are paid for all the time they actually work over a period. Rounding that consistently favors the employer fails that test. Section 785.48(a) adds a separate point: minutes between an early punch and the start of work, or between the end of work and a late punch, may be disregarded when the employee is not working in that time. Our sample week of five shifts with a ${LUNCH}-minute unpaid lunch shows the scale: actual time is ${T.hm(tot.actual)}, quarter-hour rounding to the nearest mark gives ${T.hm(tot.q)}, a difference of ${sgn(tot.q - tot.actual)}. Rounding the same punches always against the worker gives ${T.hm(tot.one)}, or ${sgn(tot.one - tot.actual)} in one week and about ${K.usd(lossYear)} a year at ${K.usd(RATE)} an hour.`,
  faqs: [
    { q: 'Is the 7-minute rule the same as quarter-hour rounding?', a: `Yes, it is the same arithmetic. Rounding to the nearest ${I15} minutes sends a punch seven minutes past the hour back to the hour, and a punch eight minutes past forward to the next quarter, which is ${T.roundTo(8, I15)} minutes. The "7-minute rule" is a nickname for that midpoint. 29 CFR 785.48(b) accepts it only if, over time, it does not shortchange the employee.` },
    { q: 'I stay after my shift to chat and punch out late: is that time owed?', a: `Not if you did no work in those minutes. 29 CFR 785.48(a) says early or late clock punches may be disregarded when an employee voluntarily arrives before the shift or stays after it and does not work in that time. If you were closing a register, answering a customer or finishing a report, the minutes are hours worked and must be paid, rounding or not.` },
    { q: 'How do I check whether rounding shorted me over a month?', a: `Keep your own log of the real punches for four or five weeks, then compare actual minutes with the paid minutes each week. A neutral system shows small gains and small losses that roughly cancel; in our sample week quarter-hour rounding gives ${sgn(tot.q - tot.actual)}. A system that loses minutes nearly every week, such as rounding in-punches up and out-punches down, gives ${sgn(tot.one - tot.actual)} here, and that pattern fails the federal test.` },
    { q: 'Does tenth-of-an-hour rounding lose less pay than quarter-hour?', a: `On a single punch, it can move the time by at most ${Math.floor(I6 / 2)} minutes, against ${Math.floor(I15 / 2)} for quarter-hour rounding, so each error is smaller. Over a week the result depends on where punches fall. In our sample week the tenth gives ${sgn(tot.t - tot.actual)} and the quarter ${sgn(tot.q - tot.actual)}, and the nearest ${I5} minutes gives ${sgn(tot.f - tot.actual)}. All three are lawful when neutral.` },
  ],
  body: (h) => `
${h.mini('rounding')}
<h2>What 785.48 allows and what it refuses</h2>
<p>The ${h.src('cfr_785_48', 'regulation on time clocks')} has two parts that are often blended. Paragraph (a) deals with the gap between a punch and actual work. Workers often arrive a few minutes early or leave a few minutes late, and the clock records it. If no work is done in those minutes, the employer may disregard them and pay from the scheduled start. If work is done, even setting up a station, the minutes count. The question is what you were doing, not where the punch sits.</p>
<p>Paragraph (b) deals with rounding itself. Recording to the nearest ${I5} minutes, tenth of an hour or quarter hour is a practice the regulation describes and accepts, and it will be presumed to be fine as long as it averages out so that employees are fully paid for the time they actually worked. Two features follow from that wording. Rounding must go to the <em>nearest</em> mark, up or down, not always in one direction. And it is judged over a period of time, so a single week in which the employer gains a few minutes proves nothing alone. The ${h.src('dol_fs22', 'Fact Sheet on hours worked')} sets out the general principle behind both paragraphs: the employer must pay for all time the employee is required or permitted to work.</p>
<h2>A week audited punch by punch</h2>
<p>The table follows one worker for five days with a scheduled 8 to 4 shift, a ${LUNCH}-minute unpaid lunch and punches that drift by a few minutes, which is how real clocks look. Each column applies a different increment through the site's rounding engine; the last applies rounding that always favors the employer, the pattern the regulation rules out.</p>
${h.table(['Day', 'In', 'Out', 'Actual', `Nearest ${I15}`, `Nearest ${I6}`, `Nearest ${I5}`, 'One-way'], [
  ...week.map((r) => [r.d, h.time.to12h(h.time.parseClock(r.i) as number), h.time.to12h(h.time.parseClock(r.o) as number), h.time.hm(r.actual), sgn(r.q - r.actual), sgn(r.t - r.actual), sgn(r.f - r.actual), sgn(r.one - r.actual)]),
  ['<strong>Week</strong>', '', '', `<strong>${h.time.hm(tot.actual)}</strong>`, sgn(tot.q - tot.actual), sgn(tot.t - tot.actual), sgn(tot.f - tot.actual), sgn(tot.one - tot.actual)],
], `Paid minutes gained (+) or lost (-) against actual time, ${LUNCH}-minute lunch deducted, computed by the site engine`, ['l', 'r', 'r', 'r', 'r', 'r', 'r', 'r'])}
<p>Read the nearest-mark columns first. Some days give a few minutes to the worker, others take a few back, and the week ends close to zero: ${sgn(tot.q - tot.actual)} for the quarter hour, ${sgn(tot.t - tot.actual)} for the tenth, ${sgn(tot.f - tot.actual)} for five minutes. That spread, small and two-sided, is what neutral rounding looks like on paper. Over several months it should hover around zero rather than drift steadily in one direction.</p>
<p>The last column is different. Rounding each arrival up to the next quarter and each departure down to the previous one costs the worker on almost every punch, ${sgn(tot.one - tot.actual)} in this single week. At ${h.usd(RATE)} an hour over fifty working weeks, that comes to about ${h.usd(lossYear)} a year, money owed for time actually worked. In a long week, those minutes also come off the overtime line, where each one is worth half again as much.</p>
<h2>Auditing your own punches</h2>
<p>Write down the real punch times for a month, either from a phone note or from the time clock's own report if your employer shares it. Enter them in ${h.a('clock-in-clock-out-calculator', 'the clock in and clock out calculator')} once with no rounding and once with your employer's increment, and compare the weekly totals. A difference that changes sign from week to week is the regulation working as written. A difference that is negative almost every week is worth raising with payroll. ${h.a('payroll-hours-calculator', 'The payroll hours calculator')} converts the result to decimal hours for the pay stub, and ${h.a('timesheet-calculator', 'the two-week timesheet')} shows whether the lost minutes fell in an overtime week.</p>
`,
  tool: 'clock-in-out',
  related: ['clock-in-clock-out-calculator', 'payroll-hours-calculator', 'timesheet-calculator', 'minutes-to-decimal-hours', 'meal-and-rest-breaks'],
  sources: ['cfr_785_48', 'dol_fs22', 'cfr_785_19', 'dol_fs23'],
});
