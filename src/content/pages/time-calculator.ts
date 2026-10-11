import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const T = K.time;
const F = K.F;
const fmt = (sec: number) => { const s = T.splitSeconds(sec); return `${s.neg ? '-' : ''}${s.h}:${String(s.m).padStart(2, '0')}:${String(s.s).padStart(2, '0')}`; };
const fmtHm = (sec: number) => { const s = T.splitSeconds(sec); return `${s.neg ? '-' : ''}${s.h}:${String(s.m).padStart(2, '0')}`; };
// A week of five shifts written as h:mm.
const WEEK: Array<[string, number, number]> = [['Monday', 7, 48], ['Tuesday', 8, 12], ['Wednesday', 6, 55], ['Thursday', 9, 5], ['Friday', 7, 37]];
const weekSec = T.sumDurations(WEEK.map(([, hh, mm]) => ({ h: hh, m: mm })));
const toGo = T.sumDurations([{ h: F.weeklyOvertimeAfter, m: 0 }, { h: 0, m: 0, s: weekSec, sign: -1 }]);
// Adding with seconds: two recordings.
const a1 = { h: 1, m: 12, s: 45 }, a2 = { h: 0, m: 48, s: 30 };
const addSec = T.sumDurations([a1, a2]);
// Subtraction that goes below zero.
const neg = T.sumDurations([{ h: 3, m: 20 }, { h: 4, m: 5, sign: -1 }]);

export default definePage({
  id: 'time-calculator',
  group: 'clock',
  order: 30,
  slug: 'time-calculator',
  nav: 'Time calculator',
  card: 'Add and subtract hours, minutes and seconds, with the carry over 60 done for you.',
  title: 'Time Calculator 2026: Add and Subtract Hours and Minutes',
  description: `Time calculator 2026: add or subtract hours, minutes and seconds, carry over 60, see negative results, and total a week of shifts against ${F.weeklyOvertimeAfter} hours. Free.`,
  h1: 'Add and subtract hours, minutes and seconds',
  intro: 'List durations as hours, minutes and seconds, mark any to subtract, and read the total in h:mm:ss and in decimal hours.',
  resume: `Adding times works like adding money with 60 cents to the dollar: total the seconds, carry every full 60 into the minutes, then total the minutes and carry every full 60 into the hours. Five shifts of 7:48, 8:12, 6:55, 9:05 and 7:37 add up to ${fmtHm(weekSec)}, which is ${K.num(T.splitSeconds(weekSec).decimal, 2)} hours in decimal form and leaves ${fmtHm(toGo)} before the ${F.weeklyOvertimeAfter}-hour federal overtime line. Subtraction is the same in reverse, borrowing 60 when the minutes run short, and a result can be negative: 3:20 minus 4:05 is ${fmtHm(neg)}, meaning the second duration was longer by 45 minutes. A recording of 1:12:45 plus one of 0:48:30 makes ${fmt(addSec)}. The calculator takes four lines, each added or subtracted, and gives the result in hours, minutes and seconds and as decimal hours ready for a timesheet or an invoice.`,
  faqs: [
    { q: 'How do I add hours and minutes together without getting a wrong total?', a: `Add the minutes column first. If it reaches 60 or more, take out each full 60 and add 1 to the hours column. For 7:48 plus 8:12, the minutes give 60, which is exactly one hour and zero minutes, so the result is 16:00, not 15:60. Typing 7.48 + 8.12 into a phone calculator returns 15.6, which is meaningless as a time.` },
    { q: 'What does a negative result mean in the time calculator?', a: `It means the durations you subtracted are longer than the ones you added. Starting from 3:20 and taking away 4:05 leaves ${fmtHm(neg)}, a shortfall of 45 minutes. In timekeeping this is common when you compare hours worked with a target, such as ${F.weeklyOvertimeAfter} hours: a negative gap says how many hours are still to go, a positive one how many are over.` },
    { q: 'Can I add times that include seconds, like lap or call durations?', a: `Yes. Each line takes hours, minutes and seconds. The seconds are carried into minutes at 60, then minutes into hours, so 1:12:45 plus 0:48:30 gives ${fmt(addSec)}. Payroll rarely needs seconds, but call centers, video editors and athletes do, and the decimal result at the bottom is rounded to two places for anyone who has to bill it by the hour.` },
    { q: 'How many hours did I work this week if my days were 7:48, 8:12, 6:55, 9:05 and 7:37?', a: `${fmtHm(weekSec)} in total, or ${K.num(T.splitSeconds(weekSec).decimal, 2)} decimal hours. The minutes alone add up to ${WEEK.reduce((t, [, , mm]) => t + mm, 0)}, which carries ${Math.floor(WEEK.reduce((t, [, , mm]) => t + mm, 0) / 60)} hours and leaves ${WEEK.reduce((t, [, , mm]) => t + mm, 0) % 60} minutes. Under the federal rule there is no overtime in that week, since it stays under ${F.weeklyOvertimeAfter} hours (Fact Sheet #23).` },
    { q: 'Is 90 minutes the same as 1.30 hours?', a: `No, and that mix-up costs real money on time sheets. Ninety minutes is 1 hour and 30 minutes, written 1:30, which is 1.5 hours in decimal. The figure 1.30 in decimal would be only 1 hour and 18 minutes. Keep a colon for hours and minutes and a point for decimal hours, and convert before multiplying by an hourly rate.` },
  ],
  body: (h) => `
${h.mini('aTimeAdd')}
<h2>Totaling a week of shifts, column by column</h2>
<p>Most people who open a time calculator are adding up their own week from a schedule app or a paper card. The table shows the five days from the summary with a running total kept in hours and minutes, so you can see the carry happen. Every time the minutes column passes 60, one hour moves to the left and the remainder stays.</p>
${h.table(['Day', 'Shift', 'Running total', 'Decimal so far'], WEEK.map(([d, hh, mm], i) => { const run = h.time.sumDurations(WEEK.slice(0, i + 1).map(([, x, y]) => ({ h: x, m: y }))); return [d, `${hh}:${String(mm).padStart(2, '0')}`, fmtHm(run), h.num(h.time.splitSeconds(run).decimal, 2)]; }), 'Running total of a five-day week in hours and minutes', ['l', 'r', 'r', 'r'])}
<p>The week ends at ${fmtHm(weekSec)}. Comparing it with the ${h.F.weeklyOvertimeAfter}-hour threshold of the ${h.src('dol_fs23', 'Fair Labor Standards Act')} means subtracting, and the answer here is ${fmtHm(toGo)} still available at straight time. Had Thursday been a double shift, the same subtraction would have come out positive and that surplus would be the overtime. The weekly card on ${h.a('home', 'the home page')} does this comparison automatically and also handles the four states that count overtime by the day.</p>
<p>When your shifts come from a phone app, check how it shows them. Some apps write 7h 48m, others 7.8, and a few round each day to the quarter hour before totaling. Mixing an app's decimal days with your own h:mm notes is the fastest way to end up with a total that is off by an hour or more.</p>
<h2>Carrying and borrowing 60, and why the decimal key misleads</h2>
<p>A pocket calculator works in base ten, while minutes and seconds roll over at 60. Adding 0:45 and 0:30 on it gives 0.75, which happens to look like a time but is actually one hour and fifteen minutes once you carry properly. The safe method is to keep hours, minutes and seconds in three separate columns, add each one, and only then pass the overflow from right to left. For subtraction, when a column on the right is too small, take one unit from its left neighbor and add 60.</p>
<p>The other route is to convert everything to a single unit first. Turn each line into minutes, or into seconds when they matter, add or subtract the plain whole numbers, and convert back at the end by dividing by 60. This is what the calculator does internally, and it never makes a carrying mistake. ${h.a('hours-and-minutes-calculator', 'The hours and minutes converter')} shows the decimal side of that conversion, and ${h.a('minutes-to-decimal-hours', 'the minutes to decimal chart')} lists all sixty values.</p>
<h2>Negative totals and what they tell you</h2>
<p>A time cannot be negative, but a difference between two durations can. When the calculator prints a minus sign, the subtracted lines outweighed the added ones. Freelancers use this to track a block of prepaid hours: start with the block, subtract each session, and a negative balance shows hours worked beyond what the client bought. Employees use it the other way, to see how far a week stands from a target before a shift is added.</p>
<p>A negative balance does not make anything owed or forfeit by itself. Overtime pay depends on the hours actually worked in each workweek, and federal rules do not let an employer offset a long week with a short one; ${h.a('timesheet-calculator', 'the two-week timesheet')} explains that limit. The calculator only reports the arithmetic, leaving the pay rules to the pages built for them.</p>
`,
  tool: 'time-sum',
  related: ['hours-calculator', 'hours-and-minutes-calculator', 'timesheet-calculator', 'minutes-to-decimal-hours', 'time-duration-calculator'],
  sources: ['dol_fs23', 'usc_207', 'dol_fs22'],
});
