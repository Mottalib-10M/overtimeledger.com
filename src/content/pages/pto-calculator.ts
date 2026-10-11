import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const yearly = K.pto.daysToHours(15);
const perCheck = K.pto.accrualPerPeriod(yearly, 26);
const checks = K.cal.paydays(2026, 'biweekly', '2026-01-02').filter((d) => d > '2026-10-11' && d < '2026-12-21');
const start = 40;
const atTrip = K.pto.projectBalance({ start, perPeriod: perCheck, periods: checks.length }).balance;
const trip = K.cal.businessDaysBetween('2026-12-21', '2027-01-01');
const tripHours = K.pto.daysToHours(trip.business);
const thanks = K.cal.businessDaysBetween('2026-11-23', '2026-11-27');
const rate = 28;
const bal = 72;
const capped = K.pto.projectBalance({ start: 150, perPeriod: perCheck, periods: 26, cap: 160 });

export default definePage({
  id: 'pto-calculator',
  group: 'leave',
  order: 10,
  slug: 'pto-calculator',
  nav: 'PTO calculator',
  card: 'Your paid time off balance on the day you leave, the hours a trip really uses and what the balance is worth in dollars.',
  title: 'PTO Calculator 2026: Plan a Trip and Value Your Balance',
  description: `PTO calculator 2026: project your balance to the day you leave, count only workdays off (${trip.business} for the two weeks of Christmas) and see what ${K.num(bal)} hours are worth.`,
  h1: 'PTO calculator: balance, trip and value',
  intro: 'Enter your balance, what each paycheck adds and the dates of your time off; the calculator shows what is left and what it is worth.',
  resume: `A PTO balance answers two questions: will it cover the time off you are planning, and what is it worth in pay. For the first, project the balance forward to the day you leave, then subtract only the workdays you will miss. Someone with ${start} hours banked in mid-October who earns ${K.hrs(perCheck)} hours every biweekly paycheck (15 days a year) receives ${checks.length} more checks before December 21, so the balance reaches ${K.hrs(atTrip)} hours. Two weeks away from December 21, 2026 to January 1, 2027 cover ${trip.calendar} calendar days but only ${trip.business} workdays, because Christmas and New Year's Day are federal holidays most employers pay anyway, and that trip uses ${K.hrs(tripHours)} hours, leaving ${K.hrs(atTrip - tripHours)}. For the second, multiply hours by your hourly rate: ${K.num(bal)} hours at ${K.usd(rate)} are worth ${K.usd(K.pto.ptoValue(bal, rate))} of pay. Federal wage law has no paid vacation requirement, so the rules that decide accrual, caps, carryover and payout come from your employer's policy and, in some states, state law.`,
  faqs: [
    { q: 'How many PTO hours do I need for a week off with a holiday in it?', a: `Count the workdays you will miss, then subtract paid holidays. Thanksgiving week of 2026 has ${thanks.business + thanks.holidays} weekdays, one of them the Thanksgiving holiday, so a full week off uses ${thanks.business} days, or ${K.hrs(K.pto.daysToHours(thanks.business))} hours at 8 hours a day. Many employers also give the Friday after Thanksgiving, which would bring it down to 24 hours; check your holiday calendar.` },
    { q: 'Is my employer required by federal law to give paid vacation?', a: `No. Federal wage law has no paid vacation requirement: vacation, like holiday pay, is a matter of agreement between employer and employee. Whether you accrue time off, how much, and what happens to it when you leave are set by the company policy or a contract. Some states add rules, such as paid sick leave in California at 1 hour for every ${K.ca.sickLeave.accrueOneHourPer} hours worked.` },
    { q: 'How much is my PTO balance worth in dollars?', a: `Multiply the hours by your current hourly rate. ${K.num(bal)} hours at ${K.usd(rate)} an hour come to ${K.usd(K.pto.ptoValue(bal, rate))} before taxes; a salaried employee can use the salary divided by ${K.num(K.F.fullTimeHoursYear)} as the rate. That figure is what the time is worth when you take it, and also what a payout would be if your employer's policy or state law pays unused vacation at separation.` },
    { q: 'What happens to PTO accrual when I hit the balance cap?', a: `Accrual stops until you use some time, so hours you would have earned are simply not added. With a cap of 160 hours and ${K.hrs(perCheck)} hours a paycheck, a balance that starts the year at 150 reaches the cap on paycheck ${capped.capAt} and forgoes ${K.hrs(capped.notAccrued)} hours by year end if no time is taken. Booking a trip before the cap is reached keeps those hours.` },
  ],
  body: (h) => `
${h.mini('cTripHours')}
<h2>Projecting the balance to the day you leave</h2>
<p>The balance printed on today's pay stub is not the one you will have on departure day. Every paycheck between now and then adds hours, so the useful number is the projection. With 15 days a year, which is ${K.hrs(yearly)} hours at 8 hours a day, a biweekly employee gains ${K.hrs(perCheck)} hours a check. In 2026 a Friday biweekly schedule pays on ${K.listOf(checks.map((d) => K.day(d)))} before December 21, which is ${checks.length} checks and ${K.hrs(perCheck * checks.length)} more hours. A balance of ${start} hours in mid-October therefore becomes ${K.hrs(atTrip)} hours by the time the trip starts.</p>
<p>Two refinements matter. Some policies credit the hours on the paycheck date, others at the end of the pay period, which can shift a trip planned right after payday by one check. And hours used for a sick day or a long weekend before the trip come off the projection, so add them to the hours you plan to take in the calculator above.</p>
<h2>A trip uses workdays, not calendar days</h2>
<p>People often overestimate what a vacation costs in PTO. Weekends do not use any, and neither do paid holidays. The two weeks from December 21, 2026 to January 1, 2027 span ${trip.calendar} calendar days: ${trip.weekend} are weekend days, ${trip.holidays} are federal holidays on the ${h.src('opm_holidays', 'OPM calendar')} (Christmas on a Friday and New Year's Day on the following Friday), and only ${trip.business} are workdays. At 8 hours a day the trip takes ${K.hrs(tripHours)} hours, not 80. Private employers choose their own holidays, so check the company calendar; ${h.a('federal-holidays', 'the 2026 federal holiday list')} is a good starting point, and ${h.a('business-days-calculator', 'the business days calculator')} counts the workdays between any two dates.</p>
${h.table(['Time off', 'Calendar days', 'Workdays used', 'PTO hours at 8 a day'], [['Dec 21, 2026 to Jan 1, 2027', trip.calendar, trip.business, K.hrs(tripHours)], ['Thanksgiving week, Nov 23 to 27', thanks.calendar, thanks.business, K.hrs(K.pto.daysToHours(thanks.business))], ['A plain week in March, Mon to Fri', 5, K.cal.businessDaysBetween('2026-03-09', '2026-03-13').business, K.hrs(K.pto.daysToHours(K.cal.businessDaysBetween('2026-03-09', '2026-03-13').business))]], 'PTO used by three trips in 2026, with federal holidays treated as paid days off', ['l', 'r', 'r', 'r'])}
<h2>What the balance is worth</h2>
<p>PTO is pay you have already earned in time rather than money, so its value is hours times the rate you will be paid when you use it. ${K.num(bal)} hours at ${K.usd(rate)} are ${K.usd(K.pto.ptoValue(bal, rate))}. If you get a raise before taking the time, the same hours are worth more, which is one reason some people hold a balance until after a review. A cap works against that: once the balance hits it, new hours stop accruing, and they are lost rather than banked.</p>
<p>Federal wage law sets no paid vacation requirement, and ${h.src('dol_fs23', 'Fact Sheet #23')} confirms that work on a holiday or a weekend carries no federal premium as such. The result is that payout of unused time at separation depends on the policy and the state. California's separate paid sick leave, explained on ${h.a('california-sick-leave', 'the California sick leave page')} and in the ${h.src('ca_sick_leave', 'Labor Commissioner guidance')}, is a statutory minimum rather than a vacation plan. To see how a yearly allowance turns into hours per paycheck, use ${h.a('pto-accrual-calculator', 'the PTO accrual calculator')}.</p>
`,
  tool: 'pto',
  related: ['pto-accrual-calculator', 'california-sick-leave', 'federal-holidays', 'business-days-calculator', 'working-days-calculator'],
  sources: ['opm_holidays', 'dol_fs23', 'ca_sick_leave', 'dol_fs22'],
});
