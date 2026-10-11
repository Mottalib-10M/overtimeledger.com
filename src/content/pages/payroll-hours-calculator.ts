import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const T = K.time;
const F = K.F;
const [, tenth, quarter] = K.P.hoursWorked.roundingIncrements;
const rate = 22;
// The default week of the calculator, as daily totals in hours and minutes.
const DAYS: Array<[string, number]> = [['Monday', 8 * 60 + 15], ['Tuesday', 7 * 60 + 50], ['Wednesday', 8 * 60 + 5], ['Thursday', 9 * 60 + 20], ['Friday', 6 * 60 + 40]];
const sumBy = (f: (m: number) => number) => DAYS.reduce((t, [, m]) => t + f(m), 0);
const exactH = sumBy((m) => m / 60);
const hundH = sumBy((m) => T.minutesToDecimal(m));
const tenthH = sumBy((m) => T.roundTo(m, tenth) / 60);
const quartH = sumBy((m) => T.roundTo(m, quarter) / 60);
// A worker who always stays two minutes past eight hours: rounding never goes his way.
const steady = 8 * 60 + 2;
const steadyExactWeek = (steady * 5) / 60;
const steadyRoundedWeek = (T.roundTo(steady, tenth) * 5) / 60;

export default definePage({
  id: 'payroll-hours-calculator',
  group: 'clock',
  order: 90,
  slug: 'payroll-hours-calculator',
  nav: 'Payroll hours calculator',
  card: 'A week of daily totals in hours and minutes turned into the decimal hours payroll enters, in hundredths, tenths or quarters.',
  title: 'Payroll Hours Calculator 2026: Decimal Hours for Payroll',
  description: `Payroll hours calculator 2026: turn a week of h:mm daily totals into decimal hours in hundredths, tenths (${tenth} min) or quarters (${quarter} min), with the gap in minutes.`,
  h1: 'Payroll hours from daily totals',
  intro: 'Enter each day as hours and minutes, choose how payroll writes the hours, and get the decimal total and the minutes rounding added or removed.',
  resume: `Payroll enters hours as decimals, so each daily total in hours and minutes has to be divided by 60 and written in the precision the payroll system uses: hundredths of an hour, tenths (${tenth}-minute steps) or quarters (${quarter}-minute steps). A week of 8:15, 7:50, 8:05, 9:20 and 6:40 is exactly ${K.num(exactH, 4)} hours. In hundredths it becomes ${K.num(hundH, 2)}, in tenths ${K.num(tenthH, 2)} and in quarters ${K.num(quartH, 2)}, so the three conventions differ by ${K.num(Math.abs(quartH - tenthH) * 60, 0)} minutes on the same week, ${K.usd(Math.abs(quartH - tenthH) * rate, 2)} at ${K.usd(rate)} an hour. Rounding to the nearest ${K.P.hoursWorked.roundingIncrements[0]} minutes, tenth or quarter is accepted by federal rules only if it averages out and does not, over time, fail to pay for the time actually worked (29 CFR 785.48(b)). Hundredths avoid the question, being accurate to well under a minute. The calculator shows each day in the chosen format, the weekly total, the difference from the exact time and the straight-time pay.`,
  faqs: [
    { q: 'Should payroll hours be entered in hundredths or tenths?', a: `Hundredths if the system allows it: two decimal places capture every minute to within about half a minute, and no rounding policy is needed. Tenths move each figure by up to 3 minutes and quarters by up to 7. Federal rules accept those increments only if, over a period of time, they do not leave work unpaid (29 CFR 785.48(b)), so a lopsided pattern is a red flag.` },
    { q: 'How do I enter 7 hours 50 minutes in payroll?', a: `Divide the 50 minutes by 60 to get 0.833, then write it in your system's precision: 7.83 in hundredths, 7.8 in tenths, and 7.75 in quarters. The quarter-hour figure is 5 minutes short of the real time and the tenth is 2 minutes short; on another day the rounding goes the other way, which is the balance the regulation expects.` },
    { q: 'Can daily rounding hide overtime at the end of the week?', a: `It can. Someone who works 8:02 every day has an exact week of ${K.num(steadyExactWeek, 2)} hours, but tenth-of-an-hour rounding writes each day as 8.0 and the week as ${K.hrs(steadyRoundedWeek)}, so the ${K.num((steadyExactWeek - F.weeklyOvertimeAfter) * 60, 0)} minutes past ${F.weeklyOvertimeAfter} disappear. Because the rounding always goes the same way, it does not average out.` },
    { q: 'Why is my decimal total on the pay stub slightly different from adding my days?', a: `Payroll may round each day before adding, or add the exact minutes and round only the total. The first method can drift by a few hundredths over a week; the second is more precise. A difference of 0.01 or 0.02 hours is just arithmetic. Anything bigger is worth checking against your daily times with this calculator.` },
  ],
  body: (h) => `
${h.mini('aIncrements')}
<h2>One week in the three payroll formats</h2>
<p>The table takes the five daily totals from the summary and writes them the way three common payroll setups would. Hundredths are the exact minutes divided by 60, kept to two decimals. Tenths snap each day to the nearest ${tenth} minutes and quarters to the nearest ${quarter}, the increments the ${h.src('cfr_785_48', 'federal rounding regulation')} names.</p>
${h.table(['Day', 'h:mm', 'Hundredths', `Tenths (${tenth} min)`, `Quarters (${quarter} min)`], [
  ...DAYS.map(([d, m]) => [d, h.time.hm(m), h.num(h.time.minutesToDecimal(m), 2), h.num(h.time.roundTo(m, tenth) / 60, 1), h.num(h.time.roundTo(m, quarter) / 60, 2)]),
  ['<strong>Week</strong>', h.time.hm(DAYS.reduce((t, [, m]) => t + m, 0)), h.num(hundH, 2), h.num(tenthH, 1), h.num(quartH, 2)],
  ['Difference from exact', '', `${h.num((hundH - exactH) * 60, 1)} min`, `${h.num((tenthH - exactH) * 60, 0)} min`, `${h.num((quartH - exactH) * 60, 0)} min`],
], 'Daily totals converted to decimal hours under three payroll conventions', ['l', 'r', 'r', 'r', 'r'])}
<p>On this particular week, tenths land ${h.num((tenthH - exactH) * 60, 0)} minutes above the exact figure and quarters ${h.num((exactH - quartH) * 60, 0)} minutes below it, which happens to erase the ${h.num((exactH - h.F.weeklyOvertimeAfter) * 60, 0)} minutes worked past ${h.F.weeklyOvertimeAfter} hours. Change the minutes and the order flips. That is the logic behind accepting rounding at all: the small gains and losses are supposed to cancel over many days and many workers. The regulation does not promise that any given week comes out even, and it does not allow a method that leans one way week after week.</p>
<h2>When rounding stops averaging out</h2>
<p>Take a production worker who reliably finishes two minutes after the eighth hour because the line takes that long to shut down. Each day is 8:02. Tenth-of-an-hour rounding turns it into 8.0 every single time. The week is ${h.num(steadyExactWeek, 2)} hours on the clock but ${h.hrs(steadyRoundedWeek)} on the payroll, and the minutes beyond ${h.F.weeklyOvertimeAfter} that should have been paid at ${h.num(h.F.overtimeMultiplier, 1)} times the rate vanish. Nobody chose to underpay; the pattern of the work and the rounding rule combined to do it.</p>
<p>The fix is simple. Either use hundredths, which record 8:02 as 8.03, or look at the totals over a quarter: if rounded hours are consistently below the exact ones, the method is not neutral for that group of workers. The ${h.src('dol_fs22', 'hours-worked rules')} make all time on duty compensable, and rounding is only a convenience on top of that rule, not an exception to it.</p>
<h2>Round each day, or only the week?</h2>
<p>Two payroll habits produce slightly different totals from the same time cards. Some systems convert and round every day, then add the rounded days; others add the exact minutes of the whole week and convert once. The second method carries no accumulated drift: the week above is ${h.time.hm(DAYS.reduce((t, [, m]) => t + m, 0))} on the clock, which becomes ${h.num(exactH, 2)} hours in one step. Rounding seven separate days, by contrast, can add or remove a few minutes even in hundredths, and a lot more in quarters.</p>
<p>If you key hours into a payroll service by hand, ask which method it expects and stick to it for every employee. Mixing them from one pay period to the next makes comparisons with past stubs meaningless and makes it hard to check that the rounding really balances over time, the one condition the regulation attaches to it.</p>
<h2>From the decimal total to the paycheck</h2>
<p>Once the hours are in decimal form, payroll multiplies them by the regular rate and splits off anything past ${h.F.weeklyOvertimeAfter} in the workweek as overtime under the ${h.src('dol_fs23', 'FLSA')}. At ${h.usd(rate)} an hour, the hundredths total above pays ${h.usd(hundH * rate, 2)} at straight time. The calculator shows that figure when you enter a rate; for overtime, ${h.a('overtime-calculator', 'the overtime calculator')} takes the same daily totals and applies the federal or state rule. If you have clock times instead of daily totals, start with ${h.a('timesheet-calculator', 'the two-week timesheet')} or ${h.a('time-clock-calculator', 'the time clock calculator')}, and see ${h.a('hours-and-minutes-calculator', 'the hours and minutes converter')} for single values.</p>
`,
  tool: 'payroll-hours',
  related: ['hours-and-minutes-calculator', 'time-clock-rounding', 'timesheet-calculator', 'minutes-to-decimal-hours', 'overtime-calculator'],
  sources: ['cfr_785_48', 'dol_fs22', 'dol_fs23'],
});
