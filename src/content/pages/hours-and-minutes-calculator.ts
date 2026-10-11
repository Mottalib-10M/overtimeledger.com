import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const T = K.time;
const rate = 18;
// h:mm values people often misread as decimals.
const MIXUPS: Array<[number, number]> = [[7, 30], [8, 45], [6, 15], [7, 50], [8, 10], [9, 20], [5, 40], [4, 55]];
const wrongLoss = (hh: number, mm: number) => (hh + mm / 60 - (hh + mm / 100)) * rate;
// A week written in h:mm, converted correctly and with the decimal mistake.
const WEEK: Array<[number, number]> = [[7, 30], [8, 45], [7, 50], [8, 15], [6, 40]];
const right = WEEK.reduce((t, [hh, mm]) => t + hh + mm / 60, 0);
const wrong = WEEK.reduce((t, [hh, mm]) => t + hh + mm / 100, 0);
const back = T.decimalToMinutes(7.3);

export default definePage({
  id: 'hours-and-minutes-calculator',
  group: 'clock',
  order: 80,
  slug: 'hours-and-minutes-calculator',
  nav: 'Hours and minutes calculator',
  card: 'Hours and minutes to decimal hours and back, with the 7.30 versus 7:30 trap explained.',
  title: 'Hours and Minutes Calculator 2026: h:mm to Decimal and Back',
  description: `Hours and minutes calculator 2026: convert h:mm to decimal hours and decimal back to minutes. 7:30 is 7.5 hours, while 7.30 hours is only ${T.hm(back)}. Free tool.`,
  h1: 'Hours and minutes to decimal hours, and back',
  intro: 'Enter hours and minutes to get decimal hours, or a decimal figure to get hours and minutes again.',
  resume: `To turn hours and minutes into decimal hours, divide the minutes by 60 and add the result to the whole hours: 7 hours 30 minutes is 7 + 30 ÷ 60 = 7.5 hours, and 8 hours 45 minutes is 8.75. To go back, multiply the decimal part by 60: 7.3 hours is 7 hours and 0.3 × 60 = 18 minutes, written ${T.hm(back)}. The most expensive mistake on time sheets is treating the two notations as one, so that 7:30 gets typed as 7.30. On a week of five shifts written 7:30, 8:45, 7:50, 8:15 and 6:40, the correct total is ${K.num(right, 2)} hours, but reading the minutes as hundredths gives ${K.num(wrong, 2)}, and at ${K.usd(rate)} an hour the worker loses ${K.usd((right - wrong) * rate, 2)} that week. The calculator converts in both directions and shows the exact fraction and the two-decimal figure payroll uses.`,
  faqs: [
    { q: 'Is 7.30 hours the same as 7 hours and 30 minutes?', a: `No. In decimal hours the part after the point is a fraction of an hour, so 7.30 means 7 hours plus 0.30 × 60 = 18 minutes, or ${T.hm(back)}. Seven hours and thirty minutes is 7.5 in decimal. Write h:mm with a colon and decimals with a point, and convert before entering hours into payroll or multiplying by a rate.` },
    { q: 'How do I convert 8 hours and 45 minutes to a decimal?', a: `Divide 45 by 60, which gives 0.75, and add it to 8: the result is 8.75 hours. At ${K.usd(rate)} an hour that shift is worth ${K.usd(8.75 * rate, 2)}. If it were entered as 8.45 by mistake, the pay would drop to ${K.usd(8.45 * rate, 2)}, a loss of ${K.usd(0.3 * rate, 2)} for a single day.` },
    { q: 'How do I change 6.65 decimal hours back into hours and minutes?', a: `Keep the 6 as hours and multiply the 0.65 by 60, which gives 39 minutes, so 6.65 hours is ${T.hm(T.decimalToMinutes(6.65))}. When the multiplication does not land on a whole number, round to the nearest minute: 6.67 hours gives 40.2, which is 6:40. The calculator does this in its second field.` },
    { q: 'Why do my payroll hours not match what my schedule app shows?', a: `Usually because one shows hours and minutes and the other decimal hours. An app might display 37:50 for the week while payroll records ${K.num(37 + 50 / 60, 2)}; both are the same time. If the gap is larger, check whether a daily total such as 7:50 was entered as 7.50, which would make the record 20 minutes short for that day.` },
    { q: 'How many decimal places should I use for hours?', a: `Two decimal places are the payroll standard and are accurate to well under a minute. One decimal place is accurate only to six minutes, which is why tenth-of-an-hour systems round each punch first. A sum of seven daily figures each rounded to two places can drift by a cent or two from the exact total; that is normal and not an error.` },
  ],
  body: (h) => `
${h.mini('decimal')}
<h2>The 7.30 versus 7:30 trap, measured</h2>
<p>A colon separates hours from minutes, which run from 0 to 59. A decimal point separates whole hours from hundredths of an hour, which run from 0 to 99. The two look almost the same on a screen, and when somebody copies a time from a schedule into a spreadsheet, the colon is often replaced by a point without anyone noticing. Every value below was converted both ways by the engine, with the pay difference for one day at ${h.usd(rate)} an hour.</p>
${h.table(['Written', 'Correct decimal', 'Misread as', 'Minutes lost or gained', `Pay gap at ${h.usd(rate)}/h`], MIXUPS.map(([hh, mm]) => { const ok = hh + mm / 60; const bad = hh + mm / 100; return [`${hh}:${String(mm).padStart(2, '0')}`, h.num(ok, 2), h.num(bad, 2), `${Math.round((bad - ok) * 60) > 0 ? '+' : ''}${Math.round((bad - ok) * 60)} min`, h.usd(-wrongLoss(hh, mm), 2)]; }), 'Hours and minutes read as decimals by mistake, one day at a time', ['r', 'r', 'r', 'r', 'r'])}
<p>The error always shortchanges the worker, except at zero minutes, because 100 is larger than 60: any number of minutes divided by 100 is smaller than the same number divided by 60. The loss grows with the minutes, so 8:45 costs much more than 8:10. Over the five-shift week in the summary it reaches ${h.num((right - wrong) * 60, 0)} minutes. A careful payroll clerk catches it; a spreadsheet formula copied down a column does not.</p>
<h2>Converting in both directions by hand</h2>
<p>From hours and minutes to decimal: divide the minutes by 60 and keep two decimals. Fifteen minutes is 0.25, twenty is 0.33, forty is 0.67, fifty is 0.83. A few anchors make mental conversion quick: every six minutes is a tenth of an hour, and every three minutes is five hundredths. For anything else, a full chart is on ${h.a('minutes-to-decimal-hours', 'the minutes to decimal hours page')}.</p>
<p>From decimal back to hours and minutes: keep the whole number as hours, multiply only the fraction by 60, and round to the nearest minute. With 9.85 hours, 0.85 × 60 is 51, so the time is ${h.time.hm(h.time.decimalToMinutes(9.85))}. With 41.2 hours for a week, 0.2 × 60 is 12, so ${h.time.hm(h.time.decimalToMinutes(41.2))}. People often skip this step when they read a pay stub, and then wonder why 38.75 hours does not look like the 38:45 their time card shows. Those are the same time.</p>
<p>When several values have to be converted and added, convert each one first and then add the decimals, or add the hours and minutes in their own notation and convert once at the end. Mixing the two in one sum is how most errors start. ${h.a('time-calculator', 'The time calculator')} adds a list in hours and minutes if you prefer to stay in that notation.</p>
<h2>Where the decimal figure goes next</h2>
<p>Decimal hours are what payroll multiplies by the hourly rate, what overtime is counted on, and what most pay stubs print. Under the ${h.src('dol_fs23', 'federal overtime rule')}, the weekly total is compared with ${h.F.weeklyOvertimeAfter} hours, and a conversion mistake near that threshold can hide overtime entirely: a week of ${h.F.weeklyOvertimeAfter}:45 is ${h.num(h.F.weeklyOvertimeAfter + 0.75, 2)} decimal hours, but typed as ${h.num(h.F.weeklyOvertimeAfter + 0.45, 2)} it shows ${h.num(0.45, 2)} overtime hours instead of ${h.num(0.75, 2)}. The ${h.src('cfr_785_48', 'rounding regulation')} allows employers to round punches to set increments, but a notation mistake is not rounding and does not average out. ${h.a('payroll-hours-calculator', 'The payroll hours calculator')} converts a whole week of daily totals at once, and ${h.a('hours-calculator', 'the hours calculator')} gives the decimal directly from start and end times.</p>
`,
  tool: 'hm-decimal',
  related: ['minutes-to-decimal-hours', 'payroll-hours-calculator', 'time-calculator', 'hours-calculator'],
  sources: ['dol_fs23', 'cfr_785_48', 'dol_fs22'],
});
