import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const full = K.F.fullTimeHoursYear;
const L = K.pto;
const y15 = L.daysToHours(15);
const per = (yearly: number, n: number) => L.accrualPerPeriod(yearly, n);
const perHour15 = y15 / full;
const DAYS = [5, 10, 12, 15, 18, 20, 25];
const partTime = 25 * 52 * perHour15;
const capRun = L.projectBalance({ start: 100, perPeriod: per(y15, 26), periods: 26, cap: 1.5 * y15 });
const sick = K.ca.sickLeave;

export default definePage({
  id: 'pto-accrual-calculator',
  group: 'leave',
  order: 20,
  slug: 'pto-accrual-calculator',
  nav: 'PTO accrual',
  card: 'Vacation days a year turned into hours per paycheck or per hour worked, with what happens at the cap.',
  title: 'PTO Accrual 2026: Vacation Days to Hours per Paycheck',
  description: `PTO accrual calculator 2026: 15 vacation days are ${K.hrs(y15)} hours, or ${K.hrs(per(y15, 26))} hours each biweekly paycheck and ${K.num(perHour15, 4)} per hour worked. Weekly to monthly tables.`,
  h1: 'PTO accrual calculator',
  intro: 'Turn a yearly vacation allowance into the hours each paycheck should add, and see when a cap stops the balance.',
  resume: `PTO accrual spreads a yearly allowance across the year, so the hours per paycheck equal the yearly hours divided by the number of paychecks. Fifteen vacation days at 8 hours a day are ${K.hrs(y15)} hours a year, which accrue at ${K.hrs(per(y15, 52))} hours a week, ${K.hrs(per(y15, 26))} hours every biweekly paycheck, ${K.hrs(per(y15, 24))} hours twice a month or ${K.hrs(per(y15, 12))} hours a month. Policies that accrue per hour worked divide the same ${K.hrs(y15)} hours by a full-time year of ${K.num(full)} hours, giving ${K.num(perHour15, 4)} hours of PTO for every hour on the clock, about one hour for every ${K.num(1 / perHour15, 1)} worked. That method rewards overtime and scales down for part-time staff: at 25 hours a week the same policy yields ${K.hrs(partTime)} hours a year. Many plans also set a cap, often expressed as a multiple of the yearly allowance, and once the balance reaches it accrual pauses until time is used. Vacation accrual comes from the employer's policy; in California, paid sick leave accrues by statute at 1 hour per ${sick.accrueOneHourPer} hours worked.`,
  faqs: [
    { q: 'How many PTO hours per paycheck is 3 weeks of vacation?', a: `Three weeks is 15 workdays, or ${K.hrs(y15)} hours at 8 hours a day. Divided by the paychecks in a year, that is ${K.hrs(per(y15, 52))} hours on a weekly schedule, ${K.hrs(per(y15, 26))} biweekly, ${K.hrs(per(y15, 24))} semimonthly and ${K.hrs(per(y15, 12))} monthly. Pay stubs usually round to two decimals, so a few hundredths can go missing over a year unless the policy trues up in December.` },
    { q: `What does an accrual rate of ${K.num(perHour15, 4)} hours per hour worked mean?`, a: `It is a yearly allowance of ${K.hrs(L.daysToHours(15))} hours expressed per hour worked: ${K.hrs(y15)} divided by ${K.num(full)} full-time hours gives ${K.num(perHour15, 4)}. A full-time employee therefore earns 15 days a year, and someone working 30 hours a week earns ${K.hrs(30 * 52 * perHour15)} hours. Overtime hours accrue too under this method unless the policy leaves them out.` },
    { q: 'Do I keep earning vacation hours once I reach my PTO cap?', a: `Not under a typical cap. Accrual stops while the balance sits at the cap and restarts after you take time off. With 15 days a year accruing biweekly and a cap of one and a half times the allowance, ${K.hrs(1.5 * y15)} hours, a balance of 100 hours reaches the cap on paycheck ${capRun.capAt} and forgoes ${K.hrs(capRun.notAccrued)} hours over the year if no time is used.` },
    { q: 'Does California sick leave accrue like vacation PTO?', a: `It follows its own statute. California paid sick leave accrues at 1 hour for every ${sick.accrueOneHourPer} hours worked, an employer may limit use to ${sick.useAtLeastHours} hours or ${sick.useAtLeastDays} days a year, and the accrual cap can be no lower than ${sick.accrualCapHours} hours or ${sick.accrualCapDays} days, under Labor Commissioner guidance. Vacation accrual, by contrast, is set by each employer's policy. Check which bank a day off is drawn from on your stub.` },
  ],
  body: (h) => `
${h.mini('cAccrualPerCheck')}
<h2>From days a year to hours on each pay stub</h2>
<p>Offer letters speak in days or weeks; payroll speaks in hours per period. The conversion takes two steps. First turn days into hours with the length of your normal workday, 8 hours in most full-time jobs, 10 for a four-day schedule, 12 for some healthcare rotations. Then divide by the paychecks in a year: 52 weekly, 26 biweekly, 24 semimonthly, 12 monthly. The table does this for the allowances that come up most often, so you can check the accrual line on a stub at a glance.</p>
${h.table(['Days a year', 'Hours a year', 'Weekly', 'Biweekly', 'Semimonthly', 'Monthly', 'Per hour worked'], DAYS.map((d) => { const y = L.daysToHours(d); return [d, K.hrs(y), K.num(per(y, 52), 2), K.num(per(y, 26), 2), K.num(per(y, 24), 2), K.num(per(y, 12), 2), K.num(y / full, 4)]; }), `PTO accrual for an 8-hour workday; per hour worked over ${K.num(full)} hours a year`, ['r', 'r', 'r', 'r', 'r', 'r', 'r'])}
<p>A schedule of 10-hour days changes the first step, not the second. Fifteen days of 10 hours are ${K.hrs(L.daysToHours(15, 10))} hours, which is ${K.hrs(per(L.daysToHours(15, 10), 26))} hours a biweekly paycheck. Some employers keep the hours at 8 per day of allowance even for 10-hour shifts, in which case a "day" off uses more than a day of PTO; the policy wording decides.</p>
<h2>Accrual per hour worked</h2>
<p>Hourly employers often express the rate per hour on the clock rather than per paycheck. The figure is the yearly allowance divided by ${K.num(full)}, the hours of a full-time year. It behaves differently from per-period accrual in three situations. A part-timer at 25 hours a week on a 15-day policy accrues ${K.hrs(partTime)} hours a year instead of ${K.hrs(y15)}. Overtime, the hours past ${K.F.weeklyOvertimeAfter} in a workweek under ${h.src('dol_fs23', 'Fact Sheet #23')}, adds PTO too, unless the policy excludes it. And unpaid leave stops accrual automatically, because no hours are worked. Per-period accrual, in contrast, gives the same hours every check whether the period held 70 hours or 90.</p>
<p>California's paid sick leave is the statutory example of per-hour accrual: 1 hour for every ${sick.accrueOneHourPer} hours worked, with use that can be limited to ${sick.useAtLeastHours} hours or ${sick.useAtLeastDays} days a year and a cap of at least ${sick.accrualCapHours} hours or ${sick.accrualCapDays} days, according to the ${h.src('ca_sick_leave', 'Labor Commissioner')}. ${h.a('california-sick-leave', 'The California sick leave page')} works through that case in detail.</p>
<h2>Caps, carryover and the year-end check</h2>
<p>A cap limits the balance, not the yearly accrual. When the balance reaches it, new hours are not credited until some time is used, so a worker who never takes vacation stops earning it. With ${K.hrs(y15)} hours a year accrued biweekly and a cap of ${K.hrs(1.5 * y15)} hours, a starting balance of 100 hours hits the cap on paycheck ${capRun.capAt}; from then on, ${K.hrs(capRun.notAccrued)} hours that would have been earned during the year are lost if nothing is taken. The PTO calculator above shows the check on which your own balance would stop growing.</p>
<p>Carryover limits are a different rule: they cut the balance at year end to a set number of hours. Both come from the employer's policy, since federal wage law has no paid vacation requirement. Before the year closes, compare the hours on your last stub with the hours the table predicts. Rounding to two decimals on every check can leave you a fraction short, and a missed accrual is easier to fix in December than in March. ${h.a('pto-calculator', 'The PTO calculator')} then plans the balance against a trip, using ${h.src('opm_holidays', 'the 2026 federal holidays')} to count only the workdays you will miss.</p>
`,
  tool: 'pto-accrual',
  related: ['pto-calculator', 'california-sick-leave', 'biweekly-pay-calculator', 'pay-periods'],
  sources: ['ca_sick_leave', 'dol_fs23', 'opm_holidays'],
});
