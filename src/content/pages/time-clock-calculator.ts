import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const T = K.time;
const H = K.P.hoursWorked;
const c = (s: string) => T.parseClock(s) as number;
type Pair = [string, string];
const total = (pairs: Pair[]) => pairs.reduce((t, [a, b]) => t + T.span(c(a), c(b)), 0);
// Split shift of a school bus driver or a restaurant server.
const split: Pair[] = [['6:45am', '9:15am'], ['2:30pm', '6:10pm']];
const splitGap = T.span(c('9:15am'), c('2:30pm'));
// Office day with a clocked-out lunch and a clocked-out coffee break.
const office: Pair[] = [['8:02am', '10:30am'], ['10:45am', '12:31pm'], ['1:04pm', '5:03pm']];
const coffee = T.span(c('10:30am'), c('10:45am'));
const lunch = T.span(c('12:31pm'), c('1:04pm'));
const officeOnClock = total(office);
const officePaid = officeOnClock + (coffee <= H.restPaidMaxMinutes ? coffee : 0);
const treat = (m: number) => m < H.restPaidMinMinutes ? 'Too short to be a break; normally counted as work' : m <= H.restPaidMaxMinutes ? 'Rest break: paid, counts as hours worked (785.18)' : m < H.mealUnpaidMinMinutes ? 'Ordinarily too short for an unpaid meal (785.19)' : 'Can be unpaid if fully relieved of duty (785.19)';

export default definePage({
  id: 'time-clock-calculator',
  group: 'clock',
  order: 40,
  slug: 'time-clock-calculator',
  nav: 'Time clock calculator',
  card: 'Several punches in one day: every in and out pair added, gaps measured and checked against the break rules.',
  title: 'Time Clock Calculator 2026: Multiple Punches in One Day',
  description: `Time clock calculator 2026: add every in and out punch of a day, measure the gaps, and see why breaks of up to ${H.restPaidMaxMinutes} minutes stay paid under federal rules. Free.`,
  h1: 'Time clock calculator for several punches a day',
  intro: 'Enter up to three clock-in and clock-out pairs of the day in order; the calculator adds them and shows every gap between them.',
  resume: `A time clock day with several punches is totaled pair by pair: each clock-in is matched with the next clock-out, the lengths are added, and the time between pairs is left out only when it is genuinely off duty. A split shift punched 6:45 AM to 9:15 AM and 2:30 PM to 6:10 PM gives ${T.hm(total(split))} on the clock, with a gap of ${T.hm(splitGap)} that is not work time. Short gaps are different. Federal regulations treat rest breaks of about ${H.restPaidMinMinutes} to ${H.restPaidMaxMinutes} minutes as hours worked (29 CFR 785.18), even when the employee punched out, so a ${coffee}-minute coffee break has to be paid back onto the day. A meal can come off the clock when it lasts ordinarily ${H.mealUnpaidMinMinutes} minutes or more and the worker is completely relieved (785.19). On the office day used below, the punches show ${T.hm(officeOnClock)} but ${T.hm(officePaid)} are payable once the short break is restored.`,
  faqs: [
    { q: 'My employer makes us clock out for a 15-minute break. Is that legal?', a: `Clocking out is a recordkeeping choice, but the pay rule does not change: a rest period of ${H.restPaidMinMinutes} to ${H.restPaidMaxMinutes} minutes counts as hours worked under 29 CFR 785.18 and has to be paid. If the punches show a 15-minute gap, you should add it back so the daily total matches what the federal rule requires. A few states also mandate the break itself.` },
    { q: 'How do I total a split shift with a long gap in the middle?', a: `Treat it as two separate pairs and add them. Morning 6:45 to 9:15 is 2:30; afternoon 2:30 PM to 6:10 PM is 3:40; together ${T.hm(total(split))}. The ${T.hm(splitGap)} in between is free time when you can leave and use it for yourself, so it stays unpaid. Overtime is still measured on the whole workweek, not on each half.` },
    { q: 'What happens if I forget to punch out for lunch?', a: `The record shows one long pair instead of two, so the time clock pays the meal as work. If you really took a duty-free meal of ${H.mealUnpaidMinMinutes} minutes or more, tell your supervisor so the record can be corrected with your agreement. If you ate at your desk and answered calls, the time is work under 785.19 and should stay on the card.` },
    { q: 'Does a 25-minute lunch have to be paid?', a: `Federal regulations say a bona fide meal period is ordinarily ${H.mealUnpaidMinMinutes} minutes or more, and a shorter one may qualify only under special conditions (29 CFR 785.19). A 25-minute break therefore sits in a gray zone; many employers simply pay it. Rest periods up to about ${H.restPaidMaxMinutes} minutes are always paid. States such as California and Colorado have their own meal rules on top.` },
    { q: 'Can the gap between two punches be negative on a time clock report?', a: `Only when the punches were entered out of order or one pair crossed midnight. The calculator reads an out time earlier than its in time as the next day, which is right for a night shift but wrong for a typo. If a pair shows close to 24 hours, check the AM and PM on that line before trusting the daily total.` },
  ],
  body: (h) => `
${h.mini('aSplitShift')}
<h2>An office day with three punch pairs</h2>
<p>Here is a real-looking card from a clerk whose system asks for a punch at every break. The three pairs add up to ${h.time.hm(officeOnClock)} on the clock. The first gap, ${coffee} minutes in mid-morning, is a coffee break, and the ${h.src('cfr_785_18', 'federal rest period rule')} says such breaks are counted as hours worked, whatever the time clock recorded. The second gap, ${lunch} minutes at noon, is long enough to be an unpaid meal if nothing was asked of the clerk during it.</p>
${h.table(['Segment', 'From', 'To', 'Length', 'Status'], [
  ['On the clock', '8:02 AM', '10:30 AM', h.time.hm(h.time.span(c('8:02am'), c('10:30am'))), 'Worked'],
  ['Gap', '10:30 AM', '10:45 AM', h.time.hm(coffee), treat(coffee)],
  ['On the clock', '10:45 AM', '12:31 PM', h.time.hm(h.time.span(c('10:45am'), c('12:31pm'))), 'Worked'],
  ['Gap', '12:31 PM', '1:04 PM', h.time.hm(lunch), treat(lunch)],
  ['On the clock', '1:04 PM', '5:03 PM', h.time.hm(h.time.span(c('1:04pm'), c('5:03pm'))), 'Worked'],
  ['<strong>Payable day</strong>', '', '', `<strong>${h.time.hm(officePaid)}</strong>`, `${h.num(h.time.minutesToDecimal(officePaid), 2)} decimal hours`],
], 'Punches of one day, with each gap classified under 29 CFR 785.18 and 785.19', ['l', 'l', 'l', 'r', 'l'])}
<p>The difference between ${h.time.hm(officeOnClock)} and ${h.time.hm(officePaid)} looks small. Over 250 working days it is more than sixty hours a year, which is why wage claims so often begin with short punched-out breaks. The calculator prints each gap in minutes under the pairs, so a short one that should have stayed paid is easy to spot and add back.</p>
<h2>When time off the clock still counts</h2>
<p>A punch record is evidence, not the rule itself. The ${h.src('dol_fs22', 'Department of Labor Fact Sheet #22')} explains that hours worked include all time an employee is required to be on duty or at the workplace, and time the employer allows the employee to work. The FLSA does not oblige an employer to give breaks, but it fixes how the breaks that are given must be counted.</p>
<p>Three kinds of gap appear on a multi-punch card. A short rest, roughly ${H.restPaidMinMinutes} to ${H.restPaidMaxMinutes} minutes, is paid whatever the clock says, because it serves the employer by keeping people productive. A meal, ordinarily ${H.mealUnpaidMinMinutes} minutes or more under ${h.src('cfr_785_19', '29 CFR 785.19')}, can be unpaid when the employee is completely relieved; a receptionist covering the phone while eating is still working. And a long split, such as the hours between a bus driver's morning and afternoon runs, is simply time the worker is free to use as he or she wishes.</p>
${h.table(['Gap between punches', 'Federal treatment'], [5, 10, 15, H.restPaidMaxMinutes, 25, H.mealUnpaidMinMinutes, 45, 60].map((m) => [`${m} min`, treat(m)]), 'How the length of a gap is treated under federal rules', ['r', 'l'])}
<p>States can be stricter. California requires a ${h.ca.mealMinutes}-minute meal after ${h.ca.mealAfterHours} hours of work and a paid ${h.ca.restMinutesPer4h}-minute rest per four hours, and Colorado has comparable rules in its COMPS Order. ${h.a('meal-and-rest-breaks', 'The meal and rest break guide')} sets them side by side.</p>
<h2>Checking a report from the time clock</h2>
<p>Most systems print a list of punches with a daily total. Read it in pairs, oldest first, and confirm that every in has a matching out. A missing punch makes the system either drop the pair or join two pairs into one long stretch that includes the meal. Then look at the gaps: anything shorter than ${H.mealUnpaidMinMinutes} minutes that was deducted deserves a question.</p>
<p>Some clocks also round each punch. Rounding to five minutes, a tenth or a quarter hour is allowed when it averages out over time (${h.src('cfr_785_48', '29 CFR 785.48')}); with four punches a day, small roundings stack up, so ${h.a('time-clock-rounding', 'the rounding guide')} is worth reading if your totals often land a few minutes low. For a single in and out with rounding shown minute by minute, use ${h.a('clock-in-clock-out-calculator', 'the clock in clock out calculator')}.</p>
`,
  tool: 'time-clock',
  related: ['clock-in-clock-out-calculator', 'meal-and-rest-breaks', 'time-clock-rounding', 'hours-calculator', 'timesheet-calculator'],
  sources: ['cfr_785_18', 'cfr_785_19', 'dol_fs22', 'cfr_785_48', 'ca_meal'],
});
