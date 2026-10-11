import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const T = K.time;
const H = K.P.hoursWorked;
const meal = H.mealUnpaidMinMinutes;
const c = (s: string) => T.parseClock(s) as number;
// Night shift 10 PM to 6:30 AM with the unpaid meal.
const night = T.shiftMinutes(c('10:00pm'), c('6:30am'), meal);
// Day shift computed by hand: 8:40 AM to 4:15 PM.
const byHand = T.shiftMinutes(c('8:40am'), c('4:15pm'));
const SHIFTS: Array<[string, string, number]> = [
  ['7:00am', '3:30pm', meal], ['8:00am', '5:00pm', 60], ['9:00am', '5:30pm', meal], ['6:00am', '2:00pm', 0],
  ['11:00am', '7:45pm', meal], ['3:00pm', '11:30pm', meal], ['7:00pm', '7:30am', meal], ['11:00pm', '7:00am', 0],
];

export default definePage({
  id: 'hours-calculator',
  group: 'clock',
  order: 10,
  slug: 'hours-calculator',
  nav: 'Hours calculator',
  card: 'Hours between a start and an end time, across midnight, with the unpaid break taken off.',
  title: 'Hours Calculator 2026: Time Between Two Times, Overnight',
  description: `Hours calculator 2026: the time between a start and an end, overnight shifts included, minus a meal break of ${meal} minutes or more, in h:mm and decimal. Free.`,
  h1: 'Hours between two times',
  intro: 'Type when the shift starts and when it ends, on the 12-hour or 24-hour clock; the calculator counts the hours, even past midnight.',
  resume: `To find the hours between two times, subtract the start from the end and, when the end is earlier on the clock than the start, add 24 hours because the shift ran past midnight. A night shift from 10:00 PM to 6:30 AM lasts ${T.hm(night.gross)}, and with an unpaid meal of ${meal} minutes taken off it leaves ${T.hm(night.minutes)} worked, or ${K.num(T.minutesToDecimal(night.minutes), 2)} decimal hours for payroll. Federal rules decide which breaks may be removed: a bona fide meal period, ordinarily ${meal} minutes or longer with no duties, is not work time under 29 CFR 785.19, while rest breaks of ${H.restPaidMinMinutes} to ${H.restPaidMaxMinutes} minutes count as hours worked under 785.18 and stay on the total. The calculator reads 12-hour times with AM or PM and 24-hour times such as 22:00, shows the result in hours and minutes and in decimal, and never asks you to sign up.`,
  faqs: [
    { q: 'How do I count hours for a shift that starts at night and ends the next morning?', a: `Add 24 hours to the end time before subtracting, or count in two pieces: from the start to midnight, then from midnight to the end. A 10:00 PM to 6:30 AM shift is 2 hours before midnight and ${T.hm(night.gross - 120)} after, ${T.hm(night.gross)} in all. Take off an unpaid meal only if it lasted ${meal} minutes or more and you were fully relieved (29 CFR 785.19).` },
    { q: 'Should I type 12-hour or 24-hour times into the hours calculator?', a: `Either works. Times with AM or PM are read on the 12-hour clock, so 7:15 PM becomes 19:15. A time typed without AM or PM is read on the 24-hour clock: 7:15 is morning and 19:15 is evening. Mixing both on one line is fine. The only trap is 12:00, which is noon as 12:00 PM and midnight as 12:00 AM.` },
    { q: 'Why is my shift total 30 minutes short of what I expected?', a: `Most often the calculator has subtracted a meal break you entered, which is correct only when the meal was at least ${meal} minutes and duty-free. Short rest breaks of ${H.restPaidMinMinutes} to ${H.restPaidMaxMinutes} minutes must stay paid under 29 CFR 785.18, so leave the break field at zero for a coffee break. Check also that AM and PM were not swapped on the end time.` },
    { q: 'Can a single shift be longer than 24 hours in this calculator?', a: `No. With only two clock times there is no way to tell 6 hours from 30 hours, so an end time earlier than the start is always read as the following day. For a stretch covering several dates, such as a 36-hour on-call period or a trip, use the time duration calculator, which asks for a date as well as a time at each end.` },
    { q: 'How do I turn the result of 8:20 into hours for my pay?', a: `Divide the minutes by 60 and add them to the whole hours: 20 ÷ 60 = 0.33, so 8:20 is 8.33 hours. Multiply by your rate for the pay of the day; at $19 an hour that gives about ${K.usd(19 * (8 + 20 / 60), 2)}. The calculator prints the decimal next to the h:mm result, so you do not have to divide by hand.` },
  ],
  body: (h) => `
${h.mini('aOvernight')}
<h2>Common shifts, already counted</h2>
<p>The table below was produced by the same clock arithmetic as the calculator. Each row starts from a start time, an end time and a meal break, and gives the time on the premises, the hours to pay and their decimal form. Where the break column reads 0, the shift has only paid rest breaks, which stay on the total. The two overnight rows show what trips up most people counting by hand: the end time is smaller than the start, yet the shift is a normal length.</p>
${h.table(['Start', 'End', 'Meal break', 'Span', 'Hours worked', 'Decimal'], SHIFTS.map(([a, b, m]) => { const s = h.time.shiftMinutes(c(a), c(b), m); return [h.time.to12h(c(a)), h.time.to12h(c(b)) + (s.overnight ? ' (next day)' : ''), m ? `${m} min` : 'none', h.time.hm(s.gross), h.time.hm(s.minutes), h.num(h.time.minutesToDecimal(s.minutes), 2)]; }), 'Hours between two times for usual US shifts', ['l', 'l', 'r', 'r', 'r', 'r'])}
<p>A twelve-hour night from 7:00 PM to 7:30 AM with a ${meal}-minute meal is a good example of why the span and the paid hours differ. The worker is on site for ${h.time.hm(h.time.shiftMinutes(c('7:00pm'), c('7:30am')).gross)}, but the meal is not work time if it was genuinely free, so ${h.time.hm(h.time.shiftMinutes(c('7:00pm'), c('7:30am'), meal).minutes)} go on the time card. Whether some of those hours are overtime depends on the rest of the week, or on the day itself in California, Alaska, Nevada and Colorado; ${h.a('overtime-calculator', 'the overtime calculator')} takes over from there.</p>
<h2>Counting by hand: borrowing 60 minutes</h2>
<p>Clock times are not decimal numbers, which is why a plain subtraction on a phone calculator gives nonsense. Take a day from 8:40 AM to 4:15 PM. First move the end to the 24-hour clock: 4:15 PM is 16:15. Then subtract the minutes: 15 minus 40 does not go, so borrow one hour from the 16 and add 60 minutes to the 15. The end becomes 15 hours and 75 minutes. Now 75 minus 40 leaves 35 minutes, and 15 minus 8 leaves 7 hours. The answer is ${h.time.hm(byHand.minutes)}, which matches the calculator.</p>
<p>For a night shift, the extra step is adding 24 to the end hour when it is smaller than the start. From 22:00 to 06:30, the end becomes 30:30, and 30:30 minus 22:00 is ${h.time.hm(night.gross)}. Some people prefer splitting at midnight instead, counting the hours left in the evening and then the hours of the morning; both give the same figure. Do the break last, once the span is known, so the borrowing stays simple.</p>
<p>The habit that causes the most mistakes is reading 4:15 PM minus 8:40 AM as 4.15 minus 8.40 in decimals. It returns a negative number, and even after adding twelve it gives 7.75, which looks believable but is ten minutes too long. ${h.a('hours-and-minutes-calculator', 'The hours and minutes converter')} explains where the 0.75 versus 0.58 confusion comes from.</p>
<h2>12-hour or 24-hour times, and which breaks to remove</h2>
<p>The calculator understands 7:15pm, 7:15 PM, 1915 and 19:15, and treats a time typed with no AM or PM as 24-hour time. Hospitals, police departments and many warehouses already schedule in 24-hour form, and ${h.a('military-time-converter', 'the military time converter')} turns any value into the four-digit style those rosters use. On the 12-hour clock, the only ambiguous points are 12:00 AM, which is midnight, and 12:00 PM, which is noon.</p>
<p>For breaks, the federal line is set in the ${h.src('dol_fs22', 'Department of Labor Fact Sheet #22')}: the FLSA itself does not require any break, but when an employer offers short ones, they are paid. Under ${h.src('cfr_785_18', '29 CFR 785.18')} a rest of about ${H.restPaidMinMinutes} to ${H.restPaidMaxMinutes} minutes counts as work, and under ${h.src('cfr_785_19', '29 CFR 785.19')} a meal of ${meal} minutes or more can be unpaid only if the employee is completely relieved. A cashier who eats at the register is still working. Put the meal length in the break field and leave coffee breaks out. ${h.a('meal-and-rest-breaks', 'The meal and rest break guide')} lists the stricter state rules, such as California's meal after ${h.ca.mealAfterHours} hours.</p>
<p>To log a whole week instead of a single shift, ${h.a('home', 'the weekly time card')} on the home page repeats this calculation for seven days and adds the overtime split.</p>
`,
  tool: 'hours',
  related: ['clock-in-clock-out-calculator', 'time-duration-calculator', 'hours-and-minutes-calculator', 'military-time-converter', 'meal-and-rest-breaks'],
  sources: ['cfr_785_18', 'cfr_785_19', 'dol_fs22', 'cfr_785_48'],
});
