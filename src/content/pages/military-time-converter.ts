import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const T = K.time;
const p = (s: string) => T.parseClock(s) as number;
const night = T.shiftMinutes(p('1900'), p('0730'), 0, 0);
const nightMeal = T.shiftMinutes(p('1900'), p('0730'), K.P.hoursWorked.mealUnpaidMinMinutes, 0);
const EX = ['0000', '0030', '0600', '0745', '1200', '1230', '1305', '1545', '1800', '2015', '2359'];
const SPOKEN: Array<[string, string]> = [['0600', 'zero six hundred'], ['0745', 'zero seven forty-five'], ['1200', 'twelve hundred'], ['1430', 'fourteen thirty'], ['1900', 'nineteen hundred'], ['2005', 'twenty zero five'], ['0015', 'zero zero fifteen']];

export default definePage({
  id: 'military-time-converter',
  group: 'clock',
  order: 110,
  slug: 'military-time-converter',
  nav: 'Military time converter',
  card: 'Four-digit military times turned into AM and PM and back, with the midnight cases and shift lengths.',
  title: 'Military Time Converter 2026: 24-Hour to 12-Hour Clock',
  description: `Military time converter for 2026: ${T.toMilitary(p('5:45pm'))} is ${T.to12h(p('1745'))}, ${T.toMilitary(p('12:30am'))} is ${T.to12h(p('0030'))}. Rules for midnight, how to say the times aloud and how to read an overnight shift card.`,
  h1: 'Military time converter',
  intro: 'Type a time either way, 1745 or 5:45 PM, and get the other clock instantly.',
  resume: `To convert military time to standard time, keep the four digits as they are up to 1259, then subtract 1200 from anything from 1300 onward and add PM: ${'1745'} becomes ${T.to12h(p('1745'))}, ${'2130'} becomes ${T.to12h(p('2130'))}. Times from 0100 to 1159 are morning hours, so ${'0830'} is ${T.to12h(p('0830'))}. Two cases trip people up. The hour after midnight is written 00, so ${'0015'} is ${T.to12h(p('0015'))}, and the hour after noon is 12, so ${'1215'} is ${T.to12h(p('1215'))}. Going the other way, add 1200 to any PM hour except 12 PM, and turn 12 AM into 00: ${'9:20 PM'} is ${T.toMilitary(p('9:20pm'))} and ${'12:40 AM'} is ${T.toMilitary(p('12:40am'))}. Midnight itself is 0000 at the start of a day and sometimes 2400 at its end, which is why a schedule can read 1600 to 2400. Military time never uses a colon or AM and PM, and the last two digits are always minutes, not decimals. A night shift from 1900 to 0730 is ${T.hm(night.minutes)} long, or ${T.hm(nightMeal.minutes)} once a half-hour unpaid meal is taken.`,
  faqs: [
    { q: 'Is midnight 0000 or 2400 in military time?', a: `Both are used, with different meanings. 0000 marks the start of a day and is the form most time clocks print. 2400 marks the end of the same day, so a shift written 1600 to 2400 ends exactly at midnight and the next one starts at 0000. 2401 does not exist: one minute after midnight is 0001, or ${T.to12h(p('0001'))} on the 12-hour clock.` },
    { q: 'How do you say 1430 out loud in military time?', a: `Say the two pairs of digits: "fourteen thirty." Whole hours take "hundred," so 1400 is "fourteen hundred," and a leading zero is spoken as "zero," so 0730 is "zero seven thirty." Some speakers add "hours" at the end, as in "fourteen thirty hours." The minutes stay minutes: 1430 is ${T.to12h(p('1430'))}, never fourteen and a third hours.` },
    { q: 'Why does my time card show 1752 instead of 5:52 PM?', a: `Many time clocks record punches on the 24-hour clock so that AM and PM can never be confused on a long or overnight shift. 1752 is ${T.to12h(p('1752'))}. Subtract 12 from the hour for any punch at 1300 or later to read it in standard time, or type the punches into the converter above, which also measures the shift between two of them.` },
    { q: 'How do I calculate hours worked from 2200 to 0630?', a: `Count to midnight, then add the morning. From 2200 to 2400 is 2 hours, and from 0000 to 0630 is 6 hours 30 minutes, so the shift lasts ${T.hm(T.span(p('2200'), p('0630')))}, which is ${K.num(T.minutesToDecimal(T.span(p('2200'), p('0630'))), 2)} hours in decimal form for payroll. Subtract any unpaid meal break of ${K.P.hoursWorked.mealUnpaidMinMinutes} minutes or more before you total the week.` },
    { q: 'Do hospitals and dispatch centers use military time?', a: `Most do. Nursing notes, medication records and 911 dispatch logs rely on 24-hour times because a dose given at 0800 and one at 2000 cannot be mixed up. Shift handovers are usually written that way too, often at 0700 and 1900 for 12-hour rotations. The converter shows both forms side by side when you need to translate a record for a patient or a payroll report.` },
  ],
  body: (h) => `
${h.mini('cMilitaryShift')}
<h2>The two conversion rules</h2>
<p>Military time counts the hours of the day from 00 to 23, followed by two digits of minutes. Converting is a matter of deciding whether the hour is past noon. From 0000 to 1159 the time is AM, with one adjustment: the 00 hour is the 12 o'clock hour after midnight, so 0045 reads ${T.to12h(p('0045'))}. From 1200 to 2359 the time is PM, and you subtract 12 from any hour above 12. That is the whole method. ${'1200'} is noon, ${'1300'} is ${T.to12h(p('1300'))}, ${'2359'} is ${T.to12h(p('2359'))}.</p>
<p>The reverse direction mirrors it. For an AM time, write the hour with a leading zero and replace 12 with 00: ${'6:05 AM'} becomes ${T.toMilitary(p('6:05am'))}, ${'12:10 AM'} becomes ${T.toMilitary(p('12:10am'))}. For a PM time, add 12 to the hour unless it is already 12: ${'3:15 PM'} becomes ${T.toMilitary(p('3:15pm'))}, ${'12:50 PM'} stays ${T.toMilitary(p('12:50pm'))}. Leading zeros are not optional. ${'0700'} is unambiguous; "700" can be misread, which is why forms and logbooks insist on four digits.</p>
${h.table(['Military', '12-hour clock', 'Part of the day'], EX.map((x) => [x, T.to12h(p(x)), p(x) < 360 ? 'Night, after midnight' : p(x) < 720 ? 'Morning' : p(x) < 1080 ? 'Afternoon' : 'Evening']), 'Military times that come up most on schedules and time cards', ['l', 'l', 'l'])}
<p>${h.a('military-time-chart', 'The full military time chart')} lists every hour and quarter hour if you prefer to look a time up rather than work it out.</p>
<h2>Speaking military time</h2>
<p>Spoken military time follows a few conventions that make it hard to mishear over a radio or a noisy ward. Pairs of digits are read as numbers, whole hours end in "hundred," and a leading zero is pronounced "zero" (some people say "oh"). The word "hours" is sometimes added after the time, mostly in formal settings. Nobody says "fourteen thirty PM": the AM and PM labels belong to the other system.</p>
${h.table(['Written', 'Spoken'], SPOKEN, 'Common ways to say military times aloud', ['l', 'l'])}
<h2>Military time on time cards and night shifts</h2>
<p>Employers that run around the clock often set their time clocks to 24-hour mode, because it removes the most common punch error: an out-punch read as 7:30 AM when it was 7:30 PM. It also makes overnight shifts easy to spot. If the out time is a smaller number than the in time, the shift crossed midnight. A nurse who clocks in at 1900 and out at 0730 has worked ${T.hm(night.minutes)}; the arithmetic is the time to midnight plus the time after it. Under ${h.src('cfr_785_19', '29 CFR 785.19')}, a bona fide meal of ${K.P.hoursWorked.mealUnpaidMinMinutes} minutes or more with no duties comes off, which leaves ${T.hm(nightMeal.minutes)} paid, while short rests stay paid under ${h.src('cfr_785_18', '785.18')}.</p>
<p>Dispatch centers, police departments and transit agencies log calls the same way, sometimes with seconds added (14:30:15). Payroll, on the other hand, works in decimal hours, so the minutes of a military punch still have to be divided by 60 before they are multiplied by a rate. Rounding the punches themselves is a separate step governed by ${h.src('cfr_785_48', '29 CFR 785.48')}. ${h.a('hours-calculator', 'The hours calculator')} accepts military times directly, and ${h.a('minutes-to-decimal-hours', 'the minutes to decimal page')} covers the payroll conversion.</p>
`,
  tool: 'military',
  related: ['military-time-chart', 'hours-calculator', 'minutes-to-decimal-hours', 'time-clock-calculator', 'clock-in-clock-out-calculator'],
  sources: ['cfr_785_19', 'cfr_785_18', 'cfr_785_48', 'dol_fs22'],
});
