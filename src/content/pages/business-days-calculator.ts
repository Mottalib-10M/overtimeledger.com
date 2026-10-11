import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const C = K.cal;
const Y = 2026;
const indep = K.holidays2026.find((x) => x.name === 'Independence Day')!;
const thanks = K.holidays2026.find((x) => x.name === 'Thanksgiving Day')!;
const colum = K.holidays2026.find((x) => x.name === 'Columbus Day')!;
const xmas = K.holidays2026.find((x) => x.name === 'Christmas Day')!;
/** Two working weeks around the observed Independence Day. */
const a1 = `${Y}-06-29`;
const a2 = `${Y}-07-10`;
const july = C.businessDaysBetween(a1, a2);
const julyNoHol = C.businessDaysBetween(a1, a2, false);
/** Ten business days from a Friday before Columbus Day. */
const d0 = `${Y}-10-09`;
const dl = C.addBusinessDays(d0, 10);
const dlNoHol = C.addBusinessDays(d0, 10, false);
/** Thanksgiving week. */
const tw1 = C.addBusinessDays(thanks.observed, -3);
const tw2 = C.addBusinessDays(thanks.observed, 1, false);
const tWeek = C.businessDaysBetween(tw1, tw2);
/** Five business days back from New Year's Eve. */
const nye = `${Y}-12-31`;
const back5 = C.addBusinessDays(nye, -5);
const yr = C.businessDaysBetween(`${Y}-01-01`, nye);
const h27 = C.federalHolidays(Y + 1);
const sat27 = h27.filter((x) => C.weekday(x.date) === 6).length;
const sun27 = h27.filter((x) => C.weekday(x.date) === 0).length;
const skipped = (from: string, to: string) => C.businessDaysBetween(C.addDays(from, 1), to).holidays;
const skippedBack = (from: string, to: string) => C.businessDaysBetween(from, C.addDays(to, -1)).holidays;
const words = ['no', 'one', 'two', 'three', 'four', 'five'];

export default definePage({
  id: 'business-days-calculator',
  group: 'calendar',
  order: 50,
  slug: 'business-days-calculator',
  nav: 'Business days calculator',
  card: 'Business days between two dates, both ends counted, weekends and observed federal holidays skipped.',
  title: `Business Days Calculator ${Y}: Count Between Any Two Dates`,
  description: `Business days calculator ${Y}: business days between two dates, both ends counted, weekends and the ${yr.holidays} observed federal holidays left out, ${K.day(indep.observed)} too.`,
  h1: 'Business days calculator',
  intro: 'Enter a start date and an end date; the calculator counts the business days between them, both dates included.',
  resume: `Business days are Monday to Friday minus the federal holidays on the dates they are observed, and this calculator counts them from the first date to the last, both included. From ${K.day(a1)} to ${K.day(a2)}, two working weeks on the calendar, there are ${july.business} business days, not ${julyNoHol.business}, because ${indep.name} falls on a Saturday in ${Y} and is observed on ${K.weekdayName(C.weekday(indep.observed))}, ${K.day(indep.observed)}. Counting both ends is the right choice for a span of work, such as the days a temp worked on an assignment. For a deadline phrased as "within 10 business days of" a date, the starting day usually does not count, so subtract one from the inclusive total, or use the date calculator, which starts the count on the next business day. Ten business days after ${K.day(d0)} is ${K.day(dl)}, since ${colum.name} on ${K.day(colum.observed)} is skipped. State holidays and company closures are not removed.`,
  faqs: [
    { q: `Is ${K.day(indep.observed)} a business day?`, a: `Not on the federal calendar. ${indep.name} is ${K.day(indep.date)}, a Saturday, and under the OPM rule a Saturday holiday is observed on the Friday before, so ${K.day(indep.observed)} is the day federal offices close. A span from ${K.day(a1)} to ${K.day(a2)} therefore holds ${july.business} business days. Private employers that stay open that Friday can switch holidays off in the calculator.` },
    { q: 'Do business days include the start date and the end date?', a: `In this calculator, yes: both ends are counted, which fits a period of work such as a temporary assignment. Deadlines are different. "Respond within five business days" of a Monday letter normally starts counting on Tuesday. When the start day should not count, take one off the result, or switch to the date calculator, which never counts the start date.` },
    { q: 'Is the day after Thanksgiving a business day?', a: `On the federal calendar it is: only ${thanks.name}, ${K.day(thanks.observed)}, is a federal holiday, and the Friday after is a regular workday for federal offices. The week from ${K.day(tw1)} to ${K.day(tw2)} therefore has ${tWeek.business} business days. Some private employers close that Friday by policy; if yours does, subtract one more day by hand.` },
    { q: 'What date is five business days before the end of the year?', a: `Counting back from ${K.day(nye)}, five business days lands on ${K.day(back5)}. ${xmas.name}, ${K.day(xmas.observed)}, falls in that stretch and is skipped, along with the weekend of December 26 and 27. Counting backwards is how payroll and accounting teams set a cutoff a fixed number of business days before a closing date.` },
    { q: 'Does the business days count include state holidays?', a: `No. It removes only the ${yr.holidays} federal holidays on their observed dates, as published by the Office of Personnel Management. State holidays such as a state's own observance day, or local closures, vary from one state to the next and are not in the count. Subtract them by hand when a deadline is set by a state agency or a state court calendar.` },
  ],
  body: (h) => `
${h.mini('dBizDeadline')}
<h2>Inclusive count or deadline count</h2>
<p>Two questions hide behind the phrase "how many business days". The first is the size of a span: how many working days a contractor billed between two dates, or how many days a job posting stayed open. Both the first and the last day count, and the calculator gives exactly that figure. The second is a deadline: a number of business days measured from an event. There the event day is day zero, and day one is the next business day. The mini calculator above works that way, as does ${h.a('date-calculator', 'the date calculator')}.</p>
<p>The two answers differ by one whenever the start date is itself a business day. From ${K.day(d0)} to ${K.day(dl)} inclusive there are ${C.businessDaysBetween(d0, dl).business} business days, yet ${K.day(dl)} is the tenth business day after ${K.day(d0)}. Read the wording of the rule or contract before choosing.</p>
<p>To check a result by hand, count whole weeks first: each one holds five business days. Then add the weekdays in the leftover days and take out any observed holiday that lands on a weekday. The span from ${K.day(a1)} to ${K.day(a2)} is ${july.calendar} days, one full week plus ${july.calendar - 7} more days of which ${julyNoHol.business - 5} are weekdays, so ${julyNoHol.business} weekdays, minus ${july.holidays} holiday, gives ${july.business}.</p>
${h.table(['Span or deadline', 'Holidays skipped', 'Business days off', 'Result'], [
    [`${K.day(a1)} to ${K.day(a2)}, both included`, july.holidays, july.weekend + july.holidays, `${july.business} business days`],
    [`Same span, holidays counted as work`, 0, julyNoHol.weekend, `${julyNoHol.business} business days`],
    [`${K.day(tw1)} to ${K.day(tw2)}`, tWeek.holidays, tWeek.weekend + tWeek.holidays, `${tWeek.business} business days`],
    [`10 business days after ${K.day(d0)}`, skipped(d0, dl), '', K.day(dl)],
    [`Same, holidays counted as work`, 0, '', K.day(dlNoHol)],
    [`5 business days before ${K.day(nye)}`, skippedBack(back5, nye), '', K.day(back5)],
  ], `Business day examples in ${Y}, computed with the calendar engine of this site`)}
<h2>Observed holidays move the count, not the date on the calendar</h2>
<p>Federal holidays that land on a weekend are observed on a weekday, which is what removes a business day. The ${h.src('opm_holidays', 'Office of Personnel Management')} applies a simple rule: a Saturday holiday is observed on the Friday before, a Sunday holiday on the Monday after. In ${Y} only ${indep.name} is affected, so ${K.day(indep.observed)} drops out of every business day count that crosses it while ${K.day(indep.date)} was never a business day anyway. In ${Y + 1} ${words[sat27]} holidays fall on a Saturday and ${words[sun27]} on a Sunday, so the effect returns ${words[sat27 + sun27]} times; ${h.a('federal-holidays', 'the federal holidays page')} lists those dates.</p>
<p>The calculator also lets you count federal holidays as ordinary workdays. That setting fits a private business that stays open on some of them, and it explains why two tools can disagree by a day or two over the same dates. Over the full year the gap is ${yr.holidays} days: ${yr.business} business days with holidays removed, ${yr.business + yr.holidays} without.</p>
<h3>Business days in payroll and HR</h3>
<p>Business days rarely decide pay itself. The ${h.src('dol_fs23', 'Department of Labor')} measures overtime by hours in a fixed workweek of ${K.F.workweekHours} hours, whatever the calendar says about holidays, and Fact Sheet #23 adds that holidays and weekends do not require overtime as such. Where business days do matter is in the paperwork around pay: the cutoff for submitting time cards, the processing time before a payday, the lead time for a direct deposit change. ${h.a('working-days-calculator', 'The working days page')} gives the month totals for planning, and ${h.a('biweekly-pay-schedule', 'the biweekly pay schedule')} shows how holiday paydays are pulled forward.</p>
`,
  tool: 'business-days',
  related: ['date-calculator', 'working-days-calculator', 'federal-holidays', 'days-between-dates', 'biweekly-pay-schedule'],
  sources: ['opm_holidays', 'dol_fs23', 'usc_207', 'gsa_payroll'],
});
