import { definePage } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const ca = K.ca;
const F = K.F;
/** Double-time multiplier as the engine applies it. */
const DT = K.ot.grossPay({ reg: 0, ot: 0, dt: 1 }, 1).total;
const long = K.week([8, 8, 14, 8, 8, 0, 0], 'california', 24);
const longFed = K.week([8, 8, 14, 8, 8, 0, 0], 'federal', 24);
const seven = K.week([8, 8, 8, 8, 8, 4, 10], 'california', 22);
const short7 = K.week([5, 5, 5, 5, 5, 5, 9], 'california', 22);
const stack = K.week([13, 13, 13, 0, 0, 0, 0], 'california', 26);

export default definePage({
  id: 'double-time-calculator',
  group: 'overtime',
  order: 30,
  slug: 'double-time-calculator',
  nav: 'Double time',
  card: 'Hours paid at twice the regular rate: California’s long days and seventh day, or your contract.',
  title: 'Double Time Calculator 2026: California 2x Overtime Rules',
  description: `Double time in 2026: twice the regular rate after ${ca.dailyDtAfter} hours in a day and after ${ca.seventhDayOtUpTo} hours on a seventh straight workday in California. Weekly examples, by the hour.`,
  h1: 'Double time pay: when the rate doubles and what it adds',
  intro: 'Enter the hours paid at twice the rate and your regular rate, or a week of days, to see the double time line of the paycheck.',
  resume: `Double time is pay at twice the regular rate, and among the four states with daily overtime only California requires it by statute. Under Labor Code 510, as the state Labor Commissioner explains it, every hour past ${ca.dailyDtAfter} in a single workday is paid at double the rate, and so is every hour past ${ca.seventhDayOtUpTo} on the seventh consecutive day of work in the workweek. Alaska, Nevada and Colorado stop at time and a half, and federal law never requires more than ${K.num(F.overtimeMultiplier, 1)} times the regular rate. Outside California, double time exists only when a union contract, an employment agreement or a company policy promises it, often for holidays or call-backs. At ${K.usd(24)} an hour, a California week with one fourteen-hour day holds ${K.hrs(long.dt)} double-time hours worth ${K.usd(long.pay.dt, 2)}, and the week pays ${K.usd(long.pay.total, 2)} gross against ${K.usd(longFed.pay.total, 2)} for the same hours under the FLSA alone.`,
  faqs: [
    { q: 'At what point does overtime turn into double time in California?', a: `Two triggers exist. The first is the length of the day: hours past ${ca.dailyDtAfter} in one workday are paid at twice the regular rate, the hours between ${ca.dailyOtAfter} and ${ca.dailyDtAfter} staying at time and a half. The second is the seventh consecutive day of work in the workweek, where hours past ${ca.seventhDayOtUpTo} are doubled. A long week with normal days never reaches double time on its own.` },
    { q: 'Does working on a holiday mean double pay?', a: `Not by law. Fact Sheet #23 says the FLSA does not require premium pay for holidays, and California does not single out holidays either. Double pay or holiday premium comes from a union agreement, a written policy or an offer letter. Without one, a holiday shift is paid at the normal rate and counts toward daily and weekly overtime like any other day.` },
    { q: 'Is double time calculated on my base wage or on the regular rate?', a: `On the regular rate, the same base used for time and a half. It takes in nondiscretionary bonuses, commissions and shift differentials earned in the workweek, as Fact Sheet #23 describes the regular rate. A worker on ${K.usd(22)} plus a ${K.usd(1)} night differential for every hour has a double-time rate of ${K.usd(23 * DT, 2)}, not ${K.usd(22 * DT, 2)}, for each hour past ${ca.dailyDtAfter} in a day.` },
    { q: 'Do double time hours also count toward the 40-hour weekly total?', a: `They are not counted twice. California pays an hour once, at the highest rate that applies. Hours already paid at double time or at time and a half because of the daily rule are left aside, and only the straight-time hours are added to reach ${ca.weeklyOtAfter}. That is why a week with ${K.hrs(stack.total)} hours in three thirteen-hour days holds ${K.hrs(stack.ot)} overtime hours and ${K.hrs(stack.dt)} at double time.` },
    { q: 'Can my employer require a seventh day in a row without double time?', a: `The employer can schedule it, but the hours must be paid under the seventh-day rule when all seven days of the workweek are worked: the first ${ca.seventhDayOtUpTo} hours at time and a half and the rest at double time. With six five-hour days and a nine-hour Sunday at ${K.usd(22)}, that seventh day holds ${K.hrs(short7.days[6].dt)} double-time hour even though the week totals only ${K.hrs(short7.total)}.` },
  ],
  body: (h) => `
${h.mini('bSeventhDay')}
<h2>The two California triggers, worked through</h2>
<p>The ${h.src('ca_overtime', 'Labor Commissioner’s overtime FAQ')} reads Labor Code 510 in plain terms. A nonexempt employee earns time and a half for hours past ${h.ca.dailyOtAfter} in a workday, double time for hours past ${h.ca.dailyDtAfter} in that same workday, time and a half for the first ${h.ca.seventhDayOtUpTo} hours on the seventh consecutive day of work in a workweek, and double time beyond that.</p>
<p>The fourteen-hour Wednesday is the simplest case. At ${h.usd(24)} an hour in a week of ${h.hrs(long.total)} hours, Wednesday splits into ${h.hrs(long.days[2].reg)} straight hours, ${h.hrs(long.days[2].ot)} at time and a half and ${h.hrs(long.days[2].dt)} at double time. The other days stay at ${h.hrs(h.ca.dailyOtAfter)} hours, so straight time reaches exactly ${h.ca.weeklyOtAfter} and nothing more turns into weekly overtime. Total pay comes to ${h.usd(long.pay.total, 2)}. In Texas or Ohio, the same ${h.hrs(longFed.total)} hours give ${h.hrs(longFed.ot)} overtime hours and no double time, for ${h.usd(longFed.pay.total, 2)}: the gap of ${h.usd(long.pay.total - longFed.pay.total, 2)} is exactly what the long day is worth under California law.</p>
${h.table(['Week at the stated rate', 'Total hours', 'Straight', 'At 1.5x', 'At 2x', 'Gross pay'], [
  [`One 14-hour day, ${h.usd(24)}/h (CA)`, h.hrs(long.total), h.hrs(long.reg), h.hrs(long.ot), h.hrs(long.dt), h.usd(long.pay.total, 2)],
  [`Same week, FLSA only`, h.hrs(longFed.total), h.hrs(longFed.reg), h.hrs(longFed.ot), h.hrs(longFed.dt), h.usd(longFed.pay.total, 2)],
  [`Seven days, 10 h on day 7, ${h.usd(22)}/h (CA)`, h.hrs(seven.total), h.hrs(seven.reg), h.hrs(seven.ot), h.hrs(seven.dt), h.usd(seven.pay.total, 2)],
  [`Six 5-hour days and a 9-hour day 7 (CA)`, h.hrs(short7.total), h.hrs(short7.reg), h.hrs(short7.ot), h.hrs(short7.dt), h.usd(short7.pay.total, 2)],
  [`Three 13-hour days, ${h.usd(26)}/h (CA)`, h.hrs(stack.total), h.hrs(stack.reg), h.hrs(stack.ot), h.hrs(stack.dt), h.usd(stack.pay.total, 2)],
], 'Weeks split by the site engine under Labor Code 510 as read by the DLSE', ['l', 'r', 'r', 'r', 'r', 'r'])}
<p>The seventh-day rows show the second trigger. In the full ${h.hrs(seven.total)}-hour week, the ten-hour seventh day gives ${h.hrs(seven.days[6].ot)} hours at time and a half and ${h.hrs(seven.days[6].dt)} at double time, while the four-hour Saturday falls past the weekly line. In the short week of six five-hour days, the weekly threshold is never reached, yet the nine-hour Sunday still produces double time because all seven days were worked. A single day off anywhere in the workweek resets the count: the employer's fixed workweek decides which seven days are looked at, not a rolling calendar.</p>
<h2>Double time outside California: contracts and policies</h2>
<p>Alaska and Nevada add daily overtime at ${h.hrs(h.ak.dailyOtAfter)} hours and Colorado at ${h.hrs(h.co.dailyOtAfter)}, but all three pay those hours at time and a half, never twice the rate. The federal rule in ${h.src('usc_207', '29 U.S.C. 207')} sets the same ceiling of obligation: ${h.num(F.overtimeMultiplier, 1)} times the regular rate after ${F.weeklyOvertimeAfter} hours, and ${h.src('dol_fs23', 'Fact Sheet #23')} adds that no premium is owed for weekends or holidays as such.</p>
<p>Double time elsewhere is a promise, not a statute. Collective bargaining agreements in construction, utilities, transit and hospitals often pay twice the rate for Sundays, holidays, call-backs after a shift or hours past a set daily figure. Some employers write it into a policy to staff a holiday. When that happens, the contract defines the trigger, the rate and the hours it covers. Keep the agreement next to the time card; the calculator above accepts any number of double-time hours, whatever their origin.</p>
<p>For the full split of a week under each state's rule, ${h.a('overtime-calculator', 'the overtime calculator')} runs the daily and weekly steps; ${h.a('california-overtime', 'the California overtime guide')} adds the meal and minimum wage rules that go with them, and ${h.a('time-and-a-half-calculator', 'the time and a half calculator')} gives the rate one step below.</p>
`,
  tool: 'double-time',
  related: ['california-overtime', 'time-and-a-half-calculator', 'overtime-calculator', 'daily-overtime-states', 'regular-rate-of-pay'],
  sources: ['ca_overtime', 'usc_207', 'dol_fs23', 'dol_state_table'],
});
