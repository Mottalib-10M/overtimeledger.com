import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const T = K.time;
const [five, tenth, quarter] = K.P.hoursWorked.roundingIncrements;
/** Minute ranges (0 to 60) that round to each step of an increment, using the engine's rounding. */
const bands = (inc: number) => {
  const out: Array<{ to: number; from: number; last: number }> = [];
  for (let m = 0; m <= 60; m++) {
    const r = T.roundTo(m, inc);
    const b = out.find((x) => x.to === r);
    if (b) b.last = m; else out.push({ to: r, from: m, last: m });
  }
  return out;
};
const ex = T.minutesToDecimal(37);

export default definePage({
  id: 'minutes-to-decimal-hours',
  group: 'clock',
  order: 100,
  slug: 'minutes-to-decimal-hours',
  nav: 'Minutes to decimal hours',
  card: 'Every minute from 1 to 60 as a decimal of an hour, plus the tenth-of-an-hour and quarter-hour charts.',
  title: 'Minutes to Decimal Hours 2026: Chart From 1 to 60 Minutes',
  description: `Minutes to decimal hours 2026: a full chart from 1 to 60 minutes, plus the tenth-of-an-hour (${tenth} minute) and quarter-hour tables. 37 minutes = ${K.num(ex, 2)} hours.`,
  h1: 'Minutes to decimal hours chart',
  intro: 'Look up any number of minutes in the chart, or use the converter for a full time in hours and minutes.',
  resume: `To convert minutes to decimal hours, divide the minutes by 60: 15 minutes is 0.25 hours, 30 minutes is 0.5, 45 minutes is 0.75, and 37 minutes is ${K.num(ex, 2)} once rounded to two places. The chart below lists every value from 1 to 60 minutes, computed and rounded to hundredths the way payroll records them, so a time card total such as 7 hours 37 minutes can be entered as 7${K.num(ex, 2).slice(1)} without a calculator. Each minute is worth about 0.0167 hours, and every ${tenth} minutes make exactly one tenth of an hour, which is why many time clocks round to ${tenth}-minute steps. Federal regulations accept rounding punches to the nearest ${five} minutes, tenth of an hour or quarter hour if it evens out over time (29 CFR 785.48(b)); the second and third charts show which minutes land on each tenth and each quarter, so you can see where your own punches fall.`,
  faqs: [
    { q: 'What is 37 minutes in decimal hours?', a: `Divide 37 by 60, which gives 0.6167, and round to two places: ${K.num(ex, 2)} hours. Added to whole hours, 7 hours 37 minutes becomes 7${K.num(ex, 2).slice(1)}. On a tenth-of-an-hour system, 37 minutes falls in the band that rounds to 0.6, and on a quarter-hour system it rounds to 0.5, because it is 7 minutes past the half hour.` },
    { q: 'Which minutes round to 0.1 hour on a tenth-of-an-hour time clock?', a: `With rounding to the nearest ${tenth} minutes, minutes 3 through 8 are recorded as 0.1 hour, 9 through 14 as 0.2, and so on, each band six minutes wide. Minutes 0 to 2 go to the whole hour and 57 to 60 round up to the next one. The regulation accepts this if, over time, it does not shortchange the worker.` },
    { q: 'Why does 20 minutes show as 0.33 and not 0.3?', a: `Because 20 divided by 60 is one third, 0.3333 with the threes repeating, and two decimal places keep 0.33. Writing 0.3 would mean 18 minutes. Payroll uses two places for that reason; on a whole week of ten-minute and twenty-minute fractions, cutting to one place would lose a noticeable number of minutes.` },
    { q: 'Is there a quick way to convert minutes to decimal hours in my head?', a: `Count in blocks of ${tenth} minutes, each worth 0.1 hour, and add 0.0167 for every leftover minute. For 40 minutes: six blocks make 0.6, the 4 minutes left add about 0.07, total 0.67. The anchors 15, 30 and 45 minutes, equal to 0.25, 0.5 and 0.75, cover most quick checks on a time card.` },
  ],
  body: (h) => `
${h.mini('aDecimalToClock')}
<h2>Every minute from 1 to 60</h2>
<p>Read the chart in columns: find the minutes, and the figure next to it is the share of an hour, rounded to the hundredth. Values that are exact, such as 6, 12, 15, 30 and 45 minutes, need no rounding at all. Others repeat forever as decimals, and the chart keeps two places, which is what pay stubs and payroll software print.</p>
${h.table(['Min', 'Hours', 'Min', 'Hours', 'Min', 'Hours', 'Min', 'Hours'], Array.from({ length: 15 }, (_, r) => [0, 15, 30, 45].flatMap((off) => { const m = r + 1 + off; return [String(m), h.num(h.time.minutesToDecimal(m), 2)]; })), 'Minutes to decimal hours, 1 to 60, rounded to two places', ['r', 'r', 'r', 'r', 'r', 'r', 'r', 'r'])}
<p>A pattern helps when the chart is not at hand. The decimals climb by one sixtieth of an hour for each minute, a little under two hundredths, so the second decimal place jumps irregularly: 0.02, 0.03, 0.05, 0.07, 0.08, 0.10. Every three minutes add exactly 0.05, and every six add exactly 0.1. Starting from the nearest multiple of three and adjusting by a minute or two gets you within a hundredth of the right answer.</p>
<h2>The tenth-of-an-hour chart</h2>
<p>Time clocks in many workplaces record hours to the tenth, because a tenth of an hour is a clean ${tenth} minutes and a single decimal place is easy to add. Under that system each punch moves to the nearest ${tenth}-minute mark. The table shows which minutes past the hour land on each tenth when the clock rounds to the nearest step, as the ${h.src('cfr_785_48', 'federal rounding regulation')} describes.</p>
${h.table(['Minutes past the hour', 'Recorded as', 'Decimal'], bands(tenth).map((b) => [b.from === b.last ? String(b.from) : `${b.from} to ${b.last}`, b.to === 60 ? 'next hour' : `:${String(b.to).padStart(2, '0')}`, h.num(b.to / 60, 1)]), 'Tenth-of-an-hour rounding: minutes grouped by the tenth they round to', ['l', 'r', 'r'])}
<p>The bands are six minutes wide, except at the edges of the hour, so the most a single punch can move is three minutes. That limit is the attraction of tenths over quarters. A worker who clocks in at 8:03 is recorded at 8:06 and loses three minutes, but one who clocks in at 8:02 is recorded at 8:00 and gains two; across many punches the effect should wash out.</p>
<h2>The quarter-hour chart</h2>
<p>Quarter hours are coarser. Each band is fifteen minutes wide and centered on the quarter, so a punch can move up to seven minutes either way. That is a large swing on a single day, and the regulation tolerates it only because gains and losses are supposed to balance over a period of time. If the punches of a team cluster on one side of the boundary, for instance because everyone clocks in a few minutes early as a habit, the balance is lost.</p>
${h.table(['Minutes past the hour', 'Recorded as', 'Decimal'], bands(quarter).map((b) => [`${b.from} to ${b.last}`, b.to === 60 ? 'next hour' : `:${String(b.to).padStart(2, '0')}`, h.num(b.to / 60, 2)]), 'Quarter-hour rounding: minutes grouped by the quarter they round to', ['l', 'r', 'r'])}
<p>A few practical uses follow from these charts. To check a pay stub that shows hours to two decimals, look up the minutes of each day in the first chart and compare. To understand why a time card shows 7.9 when you worked 7 hours 52 minutes, find 52 in the tenth table. And to see what quarter-hour rounding did to a punch, ${h.a('clock-in-clock-out-calculator', 'the clock in clock out calculator')} shows it minute by minute. For whole times rather than single minutes, ${h.a('hours-and-minutes-calculator', 'the hours and minutes converter')} works in both directions, and ${h.a('payroll-hours-calculator', 'the payroll hours calculator')} converts a full week. The ${h.src('dol_fs22', 'hours-worked fact sheet')} remains the reference for which minutes count as work in the first place.</p>
`,
  tool: 'hm-decimal',
  related: ['hours-and-minutes-calculator', 'payroll-hours-calculator', 'clock-in-clock-out-calculator', 'time-clock-rounding'],
  sources: ['cfr_785_48', 'dol_fs22', 'dol_fs23'],
});
