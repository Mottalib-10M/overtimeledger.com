import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const T = K.time;
const H = K.P.hoursWorked;
const meal = H.mealUnpaidMinMinutes;
const [r5, r6, q] = H.roundingIncrements;
const c = (s: string) => T.parseClock(s) as number;
const shift = T.shiftMinutes(c('7:53'), c('16:38'), meal, q);
const exact = T.shiftMinutes(c('7:53'), c('16:38'), meal, 0);
// Clock-in punches around 8:00, minute by minute.
const PUNCHES = Array.from({ length: 17 }, (_, i) => c('7:52') + i);
// A week of punches that never round in the worker's favor: in just before 8:00, out just after 4:30.
const lopsided = [['7:54', '16:37'], ['7:56', '16:36'], ['7:53', '16:34'], ['7:57', '16:35'], ['7:55', '16:37']] as const;
const lopsidedExact = lopsided.reduce((t, [a, b]) => t + T.span(c(a), c(b)), 0);
const lopsidedRounded = lopsided.reduce((t, [a, b]) => t + T.shiftMinutes(c(a), c(b), 0, q).minutes, 0);

export default definePage({
  id: 'clock-in-clock-out-calculator',
  group: 'clock',
  order: 50,
  slug: 'clock-in-clock-out-calculator',
  nav: 'Clock in clock out calculator',
  card: 'One shift from clock-in to clock-out, with each punch rounded to the quarter hour and the minutes gained or lost.',
  title: 'Clock In Clock Out Calculator 2026: Quarter-Hour Rounding',
  description: `Clock in clock out calculator 2026: one shift with each punch rounded to ${q}, ${r6} or ${r5} minutes, the 7 to 8 minute boundary shown, and the minutes gained or lost.`,
  h1: 'Clock in, clock out, and how the punch is rounded',
  intro: 'Type your clock-in and clock-out, your unpaid meal and the rounding your employer uses; see how each punch moves and what it does to the shift.',
  resume: `With quarter-hour rounding, a punch moves to the nearest :00, :15, :30 or :45: up to 7 minutes past a quarter rounds back, and 8 minutes or more rounds forward. Clocking in at 7:53 AM counts as 8:00, and clocking out at 4:38 PM counts as 4:45, so a shift with a ${meal}-minute unpaid meal is paid as ${T.hm(shift.minutes)} instead of the ${T.hm(exact.minutes)} actually on the clock. Federal rules allow rounding to the nearest ${r5} minutes, tenth of an hour (${r6} minutes) or quarter hour only if it averages out so that, over time, employees are paid for all the time they actually work (29 CFR 785.48(b)). A separate rule covers early arrivals: workers who voluntarily clock in before their start time and do no work may have those minutes disregarded under 785.48(a). The calculator shows both punches as typed and as counted, the exact minutes, and the difference rounding makes.`,
  faqs: [
    { q: 'If I clock in at 8:07, does quarter-hour rounding count me at 8:00?', a: `Yes. Seven minutes past the quarter is the last minute that rounds back, so 8:07 is recorded as 8:00 and 8:08 as 8:15. The same boundary applies to clocking out: 4:37 PM becomes 4:30 and 4:38 PM becomes 4:45. Under 29 CFR 785.48(b) this is lawful only if, over time, the rounding favors neither side.` },
    { q: 'Do I get paid if I clock in 10 minutes early but just sit in the break room?', a: `Not necessarily. Under 29 CFR 785.48(a), employees who voluntarily come in before their regular starting time and do no work need not be paid for that period, and the early punch may be disregarded. If you start setting up, answer messages or take instructions during those minutes, it becomes work time and must be counted.` },
    { q: 'My employer rounds clock-ins forward but clock-outs back. Is that allowed?', a: `Rounding that always moves in the employer's direction does not average out, which is the condition 29 CFR 785.48(b) attaches to rounding to ${r5}, ${r6} or ${q} minutes. Over a year it means unpaid work. Keep your own record of real punches for a few weeks and compare the totals with what you were paid.` },
    { q: 'How many minutes can quarter-hour rounding add or remove on a single punch?', a: `At most 7 minutes either way. A punch between 1 and 7 minutes past a quarter loses up to 7 minutes; one between 8 and 14 minutes past gains up to 7. With two punches a shift the daily swing can reach 14 minutes in either direction, which is why the rule asks that gains and losses balance over time rather than on each day.` },
    { q: 'Should I pick tenth-of-an-hour or quarter-hour rounding in the calculator?', a: `Pick whatever your employer's time system uses; your handbook or pay stub usually says. Tenth-of-an-hour rounding moves each punch by at most 3 minutes and writes the result directly as one decimal place, while quarter hours move it by up to 7. Leave the setting on exact minutes to see the time you actually spent on the clock.` },
  ],
  body: (h) => `
${h.mini('rounding')}
<h2>The punch, minute by minute</h2>
<p>The table follows a clock-in from 7:52 to 8:08 and shows where each minute lands under the three increments the Department of Labor names. The quarter-hour column is the one that surprises people: a single minute, from 7:52 to 7:53 or from 8:07 to 8:08, moves the recorded time by a full quarter. Tenths behave the same way on a smaller scale, switching at the third minute, and five-minute rounding switches at the third minute too.</p>
${h.table(['Punch', `Nearest ${q} min`, 'Gained or lost', `Nearest tenth (${r6} min)`, `Nearest ${r5} min`], PUNCHES.map((m) => { const qq = h.time.roundTo(m, q); return [h.time.to12h(m), h.time.to12h(qq), `${qq - m > 0 ? '+' : ''}${qq - m} min`, h.time.to12h(h.time.roundTo(m, r6)), h.time.to12h(h.time.roundTo(m, r5))]; }), 'Where a clock-in punch is recorded under each rounding increment', ['l', 'r', 'r', 'r', 'r'])}
<p>For a clock-in, rounding forward means fewer paid minutes; for a clock-out, rounding back does. A worker who punches in at 7:53 and out at 4:38 gets the benefit at both ends, which is why the summary example gains minutes. Someone punching in at 8:07 and out at 4:37 would lose seven minutes twice. Neither day is a violation on its own. The question the regulation asks is whether, across many punches and many employees, the system pays for the time worked.</p>
<h2>Rounding that does not average out</h2>
<p>The ${h.src('cfr_785_48', 'rounding regulation')} accepts the practice because over the long run small gains and losses cancel. That only happens when punches fall on both sides of the boundary. Suppose a warehouse where people punch in a few minutes before 8:00 and go straight to the dock, then finish the last pallet and punch out a few minutes after 4:30. Each clock-in rounds forward to 8:00 and each clock-out rounds back to 4:30, so the week below never once rounds in the worker's favor.</p>
${h.table(['Day', 'In', 'Out', 'Exact', 'Rounded to the quarter'], lopsided.map(([a, b], i) => [h.weekdayName(i + 1), h.time.to12h(c(a)), h.time.to12h(c(b)), h.time.hm(h.time.span(c(a), c(b))), h.time.hm(h.time.shiftMinutes(c(a), c(b), 0, q).minutes)]), 'A week where every punch rounds against the employee', ['l', 'r', 'r', 'r', 'r'])}
<p>The exact week is ${h.time.hm(lopsidedExact)}; the rounded week is ${h.time.hm(lopsidedRounded)}. That is ${lopsidedExact - lopsidedRounded} minutes lost in five days, every week, and it is the pattern regulators look for. The employer could defend ignoring the early clock-ins only if nobody did anything before the start of the shift, under ${h.src('cfr_785_48', '785.48(a)')}; here the crew was already loading trucks, and the minutes after 4:30 were plainly worked too.</p>
<h2>Early clock-ins and late clock-outs</h2>
<p>Paragraph (a) of the same regulation deals with the gap between the time clock and the work. People who come in early by choice, to have coffee or to beat traffic, and who do nothing for the employer until the shift begins, do not have to be paid for that waiting, and their early punch can be disregarded. The same goes for staying after the end to chat. The regulation adds that minor differences between clock records and hours worked are expected, but major ones should be discouraged because they cast doubt on the records.</p>
<p>The exception stops the moment work starts. Booting a computer, putting on required gear at the site, reading the day's assignments or taking a call all count. ${h.src('dol_fs22', 'Fact Sheet #22')} describes work that is suffered or permitted as work time, even if nobody asked for it. If your early minutes look like work, enter the real punch rather than the rounded one. For a day with lunch punches or a split shift, ${h.a('time-clock-calculator', 'the time clock calculator')} handles several pairs, and ${h.a('time-clock-rounding', 'the rounding guide')} covers the rules in more depth, including how payroll treats a whole pay period.</p>
`,
  tool: 'clock-in-out',
  related: ['time-clock-rounding', 'time-clock-calculator', 'hours-calculator', 'payroll-hours-calculator', 'timesheet-calculator'],
  sources: ['cfr_785_48', 'dol_fs22', 'cfr_785_19'],
});
