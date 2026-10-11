import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const S = K.ca.sickLeave;
const F = K.F;
const Y = 2026;
const per = S.accrueOneHourPer;
const fullYear = K.pto.accruedPerHours(F.fullTimeHoursYear, per);
const partWeek = 20;
const partYear = K.pto.accruedPerHours(partWeek * 52, per);
const hoursForUse = S.useAtLeastHours * per;
const weeksForUseFull = hoursForUse / F.weeklyOvertimeAfter;
const hoursForCap = S.accrualCapHours * per;
const weeksForCapFull = hoursForCap / F.weeklyOvertimeAfter;
const dayH = F.fullTimeHoursYear / 52 / 5;
const longShift = 10;
const capFull = K.pto.projectBalance({ start: 0, perPeriod: K.pto.accruedPerHours(F.weeklyOvertimeAfter * 2, per), periods: 52, cap: S.accrualCapHours });
const usedFive = K.pto.projectBalance({ start: 0, perPeriod: K.pto.accruedPerHours(F.weeklyOvertimeAfter * 2, per), periods: 26, usedPerPeriod: S.useAtLeastHours / 26, cap: S.accrualCapHours });
const caMin = K.ca.minimumWage;
const chkH = 1040;
const chkUsed = 16;

export default definePage({
  id: 'california-sick-leave',
  group: 'leave',
  order: 30,
  slug: 'california-sick-leave',
  nav: 'California sick leave',
  card: 'California paid sick leave: hours earned per hours worked, the yearly use minimum and the balance cap.',
  title: `California Sick Leave ${Y}: 1 Hour per ${per}, ${S.useAtLeastHours} Hours of Use`,
  description: `California sick leave in ${Y}: 1 hour per ${per} hours worked, at least ${S.useAtLeastHours} hours or ${S.useAtLeastDays} days usable each year, and a balance cap of no less than ${S.accrualCapHours} hours or ${S.accrualCapDays} days.`,
  h1: 'California paid sick leave',
  intro: 'Enter the hours you have worked and see the sick leave you have earned under California’s accrual rate.',
  resume: `California employees earn at least 1 hour of paid sick leave for every ${per} hours worked, under the rules published by the Labor Commissioner (DLSE). A full-time year of ${K.num(F.fullTimeHoursYear)} hours therefore earns ${K.num(fullYear, 2)} hours, and a ${partWeek}-hour-a-week job earns ${K.num(partYear, 2)}. The employer may limit how much is used each year, but not below ${S.useAtLeastHours} hours or ${S.useAtLeastDays} days. It may also stop accrual once the balance reaches a cap, which cannot be set lower than ${S.accrualCapHours} hours or ${S.accrualCapDays} days. Instead of accrual, an employer can front-load the leave, giving the full yearly amount up front. At the accrual rate, a full-time worker needs ${K.num(hoursForUse)} hours on the job, about ${K.num(weeksForUseFull)} weeks, to earn the ${S.useAtLeastHours} usable hours, and ${K.num(weeksForCapFull)} weeks without using any to reach an ${S.accrualCapHours}-hour cap. The calculator turns your hours worked into hours earned.`,
  faqs: [
    { q: 'How many sick hours do I earn per hour worked in California?', a: `One hour of paid sick leave for every ${per} hours worked, which is ${K.num(1 / per, 4)} hour per hour, or ${60 / per} minutes for each hour on the job. A shift of ${dayH} hours adds ${K.num(dayH / per, 2)} hours to the balance, a ${F.weeklyOvertimeAfter}-hour week ${K.num(F.weeklyOvertimeAfter / per, 2)} hours. These are floors: an employer is free to grant sick leave faster than that.` },
    { q: 'Can my California employer cap my sick leave balance?', a: `Yes, within limits. The employer can stop accrual once the balance reaches a cap, but the cap cannot be lower than ${S.accrualCapHours} hours or ${S.accrualCapDays} days. A full-time worker who uses no sick time reaches ${S.accrualCapHours} hours after about ${K.num(weeksForCapFull)} weeks. Accrual starts again once some hours are used and the balance drops below the cap.` },
    { q: `How much sick leave can I use in a year in California?`, a: `At least ${S.useAtLeastHours} hours or ${S.useAtLeastDays} days, if you have earned them; the employer may set a higher limit but not a lower one. For someone on ${longShift}-hour shifts, ${S.useAtLeastDays} days is ${S.useAtLeastDays * longShift} hours while the hour measure stays at ${S.useAtLeastHours}, so check the DLSE page for how the two measures apply to your schedule.` },
    { q: 'What does front-loading sick leave mean in California?', a: `It means the employer gives the leave in one block at the start of the year instead of letting it build up hour by hour. The block must cover at least the yearly use minimum of ${S.useAtLeastHours} hours or ${S.useAtLeastDays} days. It spares payroll from tracking accrual on every paycheck, and employees can use the hours from day one.` },
  ],
  body: (h) => `
${h.mini('sickCa')}
<h2>Accrual, use and cap: three different numbers</h2>
<p>California's paid sick leave has three figures that people mix up, all set out on the ${h.src('ca_sick_leave', 'Labor Commissioner’s paid sick leave page')}. The first is the accrual rate: at least 1 hour for every ${per} hours worked. The second is the use limit: how many hours an employer may let you take in a year, which cannot be less than ${S.useAtLeastHours} hours or ${S.useAtLeastDays} days. The third is the accrual cap: the balance at which an employer may stop adding hours, which cannot be less than ${S.accrualCapHours} hours or ${S.accrualCapDays} days.</p>
<p>The cap is twice the use limit, so a balance can sit above what you are allowed to take in one year. A worker who reaches ${S.accrualCapHours} hours and uses ${S.useAtLeastHours} of them still has ${S.accrualCapHours - S.useAtLeastHours} hours banked, and accrual resumes as soon as the balance is under the cap.</p>
${h.table(['Schedule', 'Hours worked a year', 'Sick hours earned', `Weeks to earn ${S.useAtLeastHours} h`], [
    [`Full time, ${F.weeklyOvertimeAfter} h a week`, K.num(F.fullTimeHoursYear), K.num(fullYear, 2), K.num(Math.ceil(hoursForUse / F.weeklyOvertimeAfter))],
    ['30 h a week', K.num(30 * 52), K.num(K.pto.accruedPerHours(30 * 52, per), 2), K.num(Math.ceil(hoursForUse / 30))],
    [`${partWeek} h a week`, K.num(partWeek * 52), K.num(partYear, 2), K.num(Math.ceil(hoursForUse / partWeek))],
    ['12 h a week', K.num(12 * 52), K.num(K.pto.accruedPerHours(12 * 52, per), 2), K.num(Math.ceil(hoursForUse / 12))],
  ], `Paid sick leave earned at 1 hour per ${per} hours worked, 52 weeks`, ['l', 'r', 'r', 'r'])}
<p>Part-time workers earn at the same rate per hour, so they simply take longer. At ${partWeek} hours a week it takes ${K.num(Math.ceil(hoursForUse / partWeek))} weeks to earn ${S.useAtLeastHours} hours, longer than a year. At the ${Y} state minimum wage of ${K.usd(caMin, 2)}, ${S.useAtLeastHours} hours of leave represent ${K.usd(S.useAtLeastHours * caMin, 2)} of pay.</p>
<p>To check the balance on a pay stub by hand, take the hours worked since accrual started, divide by ${per}, and subtract the sick hours already taken. A worker with ${K.num(chkH)} hours on the clock has earned ${K.num(K.pto.accruedPerHours(chkH, per), 2)} hours; after ${chkUsed} hours of use, ${K.num(K.pto.accruedPerHours(chkH, per) - chkUsed, 2)} remain, unless the employer front-loads or grants more.</p>
${h.mini('dSickCap')}
<h2>Front-loading instead of accruing</h2>
<p>An employer does not have to run an accrual system. It can front-load: put the full amount, at least ${S.useAtLeastHours} hours or ${S.useAtLeastDays} days, into the balance at the start of each year. Employees gain because the hours are usable at once, without waiting ${K.num(Math.ceil(weeksForUseFull))} weeks of full-time work. Employers gain because payroll does not have to add a fraction of an hour every period. Under accrual, by contrast, a full-time employee paid biweekly earns ${K.num(K.pto.accruedPerHours(F.weeklyOvertimeAfter * 2, per), 2)} hours per paycheck and, using nothing, reaches the ${S.accrualCapHours}-hour cap in pay period ${capFull.capAt}. One who takes the ${S.useAtLeastHours} hours spread over the year ends it with ${K.num(usedFive.balance, 2)} hours.</p>
<h3>How this fits with vacation and other leave</h3>
<p>Sick leave is a legal minimum in California, while vacation rules come from the employer's policy. Some employers combine both into one PTO bank, which works as long as the bank gives at least what the sick leave rules require. ${h.a('pto-accrual-calculator', 'The PTO accrual calculator')} projects a balance per pay period, ${h.a('pto-calculator', 'the PTO calculator')} checks whether a balance covers planned time off, and ${h.a('california-overtime', 'the California overtime page')} covers the state's daily overtime rules for the hours that earn the leave. Two related official references are the ${h.src('ca_min_wage', 'state minimum wage FAQ')} and the ${h.src('ca_overtime', 'DLSE overtime FAQ')}.</p>
`,
  tool: 'ca-sick',
  related: ['pto-accrual-calculator', 'pto-calculator', 'california-overtime', 'meal-and-rest-breaks', 'working-days-calculator'],
  sources: ['ca_sick_leave', 'ca_min_wage', 'ca_overtime', 'dol_state_table'],
});
