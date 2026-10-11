/**
 * Engine tests. Reference cases come from the official texts named in params-2026.json:
 * DOL Fact Sheet #23 (salaried example), DLSE overtime FAQ (daily, 12-hour and seventh-day rules),
 * COMPS Order #40 Rule 4.1.2, the DOL state table for Nevada, OPM's 2026 holiday list and 2,087-hour divisor.
 */
import { describe, it, expect } from 'vitest';
import P from '../src/data/params-2026.json';
import { parseClock, span, roundTo, shiftMinutes, hm, minutesToDecimal, to12h, to24h, toMilitary, sumDurations, splitSeconds } from '../src/lib/engine/time';
import { splitWeek, grossPay, dailyRuleApplies, type StateRule } from '../src/lib/engine/overtime';
import { salaryToHourly, salaryToHourlyOpm, hourlyToAnnual, perPaycheck, weightedOvertime, salariedHalfTime, freelanceRate } from '../src/lib/engine/pay';
import { federalHolidays, businessDaysBetween, addBusinessDays, workingDaysByMonth, paydays, weekdayCount, daysBetween, observedSet } from '../src/lib/engine/calendar';
import { accruedPerHours, accrualPerPeriod, projectBalance } from '../src/lib/engine/pto';

const S = P.states as unknown as Record<string, StateRule>;

describe('parseClock', () => {
  it.each([
    ['8', 480], ['855', 535], ['0855', 535], ['8:55', 535], ['8.55', 535], ['8:55am', 535], ['8:55 PM', 1255], ['8:55p', 1255],
    ['1345', 825], ['13:45', 825], ['12:00 am', 0], ['12:30pm', 750], ['noon', 720], ['midnight', 0], ['24:00', 1440], ['1345 hours', 825], ['0000', 0],
  ])('%s → %i', (s, m) => expect(parseClock(s)).toBe(m));
  it.each(['', 'abc', '25:00', '8:75', '13pm', '0am', '12345'])('rejects %s', (s) => expect(parseClock(s)).toBeNull());
});

describe('shifts and rounding (29 CFR 785.48)', () => {
  it('overnight shift', () => { expect(span(22 * 60, 6 * 60)).toBe(480); expect(span(480, 480)).toBe(0); });
  it('quarter hour: 7 minutes down, 8 up', () => { expect(roundTo(8 * 60 + 7, 15)).toBe(480); expect(roundTo(8 * 60 + 8, 15)).toBe(495); });
  it('tenth of an hour and 5 minutes', () => { expect(roundTo(8 * 60 + 2, 6)).toBe(480); expect(roundTo(8 * 60 + 4, 6)).toBe(486); expect(roundTo(8 * 60 + 3, 5)).toBe(485); });
  it('shift with unpaid lunch', () => { const s = shiftMinutes(parseClock('8:03'), parseClock('17:08'), 30, 15); expect(s.inR).toBe(480); expect(s.outR).toBe(17 * 60 + 15); expect(s.minutes).toBe(525); });
  it('formats', () => { expect(hm(465)).toBe('7:45'); expect(minutesToDecimal(50)).toBe(0.83); expect(to12h(825)).toBe('1:45 PM'); expect(to12h(0)).toBe('12:00 AM'); expect(to24h(65)).toBe('01:05'); expect(toMilitary(1305)).toBe('2145'); });
  it('duration sums', () => { const t = sumDurations([{ h: 7, m: 45 }, { h: 8, m: 30 }, { h: 1, m: 15, sign: -1 }]); expect(splitSeconds(t)).toMatchObject({ h: 15, m: 0, s: 0, decimal: 15 }); });
});

describe('overtime splits', () => {
  const week = (...h: number[]) => h;
  it('FLSA: 45 hours over five days = 40 + 5 overtime, no daily rule', () => {
    const r = splitWeek(week(9, 9, 9, 9, 9, 0, 0), S.federal);
    expect(r).toMatchObject({ reg: 40, ot: 5, dt: 0, total: 45 });
  });
  it('FLSA: a 14-hour day alone is not overtime', () => { expect(splitWeek(week(14, 0, 0, 0, 0, 0, 0), S.federal).ot).toBe(0); });
  it('California: 10-hour day = 8 + 2; 13-hour day = 8 + 4 + 1 double time', () => {
    expect(splitWeek(week(10, 0, 0, 0, 0, 0, 0), S.california).days[0]).toMatchObject({ reg: 8, ot: 2, dt: 0 });
    expect(splitWeek(week(13, 0, 0, 0, 0, 0, 0), S.california).days[0]).toMatchObject({ reg: 8, ot: 4, dt: 1 });
  });
  it('California: daily overtime hours do not count again toward 40', () => {
    const r = splitWeek(week(10, 10, 10, 10, 0, 0, 0), S.california); // 40 h, 8 OT daily
    expect(r).toMatchObject({ reg: 32, ot: 8, dt: 0 });
  });
  it('California: seventh consecutive day, first 8 at 1.5x and the rest at 2x', () => {
    const r = splitWeek(week(8, 8, 8, 8, 8, 4, 10), S.california);
    expect(r.seventhDayApplied).toBe(true);
    expect(r.days[6]).toMatchObject({ reg: 0, ot: 8, dt: 2 });
    expect(r.days[5]).toMatchObject({ reg: 0, ot: 4 }); // 40 straight hours reached on day 5
    expect(r).toMatchObject({ reg: 40, ot: 12, dt: 2, total: 54 });
  });
  it('California: six days do not trigger the seventh-day rule', () => {
    expect(splitWeek(week(8, 8, 8, 8, 8, 8, 0), S.california)).toMatchObject({ reg: 40, ot: 8, dt: 0, seventhDayApplied: false });
  });
  it('Alaska: overtime after 8 a day and 40 a week, no double time', () => {
    expect(splitWeek(week(12, 0, 0, 0, 0, 0, 0), S.alaska).days[0]).toMatchObject({ reg: 8, ot: 4, dt: 0 });
  });
  it('Nevada: daily rule only below 1.5 x $12.00 = $18.00', () => {
    expect(dailyRuleApplies(S.nevada, 17.99)).toBe(true);
    expect(dailyRuleApplies(S.nevada, 18)).toBe(false);
    expect(splitWeek(week(10, 0, 0, 0, 0, 0, 0), S.nevada, 15).ot).toBe(2);
    expect(splitWeek(week(10, 0, 0, 0, 0, 0, 0), S.nevada, 25).ot).toBe(0);
  });
  it('Colorado: whichever is greater, 12 a day or 40 a week (Rule 4.1.2)', () => {
    expect(splitWeek(week(13, 0, 0, 0, 0, 0, 0), S.colorado).ot).toBe(1);
    expect(splitWeek(week(10, 10, 10, 10, 10, 0, 0), S.colorado)).toMatchObject({ reg: 40, ot: 10 });
    expect(splitWeek(week(14, 14, 14, 0, 0, 0, 0), S.colorado)).toMatchObject({ reg: 36, ot: 6 });
  });
  it('gross pay', () => { expect(grossPay({ reg: 40, ot: 5, dt: 1 }, 20).total).toBe(800 + 150 + 40); });
});

describe('pay conversions', () => {
  it('Fact Sheet #23: $405 for 45 hours → $9.00 regular rate, $22.50 extra', () => {
    const r = salariedHalfTime(405, 45); expect(r.regularRate).toBe(9); expect(r.extra).toBe(22.5);
  });
  it('two rates (29 CFR 778.115): weighted average', () => {
    const r = weightedOvertime([{ hours: 30, rate: 20 }, { hours: 15, rate: 14 }]);
    expect(r.regularRate).toBeCloseTo(18, 6); expect(r.otHours).toBe(5); expect(r.premium).toBeCloseTo(45, 6); expect(r.total).toBeCloseTo(855, 6);
  });
  it('salary and hourly', () => {
    expect(salaryToHourly(52000)).toBe(25); expect(salaryToHourlyOpm(52000, P.federal.opmHourlyDivisor)).toBeCloseTo(24.916, 3);
    expect(hourlyToAnnual(20)).toBe(41600); expect(perPaycheck(52000, 'biweekly')).toBe(2000); expect(perPaycheck(52000, 'biweekly', 27)).toBeCloseTo(1925.93, 2);
    expect(P.federal.exemptSalaryWeekly * 52).toBe(P.federal.exemptSalaryAnnual);
    expect(freelanceRate(60000, 6000, 25, 6).rate).toBeCloseTo(66000 / 1150, 6);
  });
  it('OPM divisor is the 28-year average', () => { expect(Math.round((2096 * 4 + 2088 * 17 + 2080 * 7) / 28)).toBe(P.federal.opmHourlyDivisor); });
  it('California exempt salary 2026 = 2 x $16.90 x 2,080 = $70,304', () => { const c = P.states.california; expect(Math.round(c.exemptSalaryMultiple * c.minimumWage * P.federal.fullTimeHoursYear)).toBe(70304); });
});

describe('calendar', () => {
  it('computed 2026 federal holidays match the OPM list', () => {
    expect(federalHolidays(2026).map((h) => [h.name, h.date, h.observed])).toEqual(P.holidays2026.list.map((h) => [h.name, h.date, h.observed]));
  });
  it('a Saturday New Year (2028... 2022) is observed on Dec 31 of the year before', () => {
    expect(observedSet(2021).has('2021-12-31')).toBe(true);
    expect(observedSet(2022).has('2022-01-01')).toBe(false);
  });
  it('2026 has 261 weekdays and 250 working days', () => {
    const m = workingDaysByMonth(2026);
    expect(m.reduce((s, x) => s + x.weekdays, 0)).toBe(261);
    expect(m.reduce((s, x) => s + x.business, 0)).toBe(250);
    expect(m[0]).toMatchObject({ business: 20, holidays: 2 });
  });
  it('business days and adding business days', () => {
    expect(businessDaysBetween('2026-07-01', '2026-07-10')).toMatchObject({ business: 7, holidays: 1, weekend: 2, calendar: 10 });
    expect(addBusinessDays('2026-12-23', 2)).toBe('2026-12-28');
    expect(addBusinessDays('2026-12-28', -2)).toBe('2026-12-23');
    expect(daysBetween('2026-01-01', '2026-12-31')).toBe(364);
  });
  it('biweekly 2026: Friday from Jan 2 gives 26 paydays; Thursday from Jan 1 gives 27 unadjusted', () => {
    expect(paydays(2026, 'biweekly', '2026-01-02', false).length).toBe(26);
    expect(paydays(2026, 'biweekly', '2026-01-01', false).length).toBe(27);
    expect(paydays(2026, 'biweekly', '2025-12-26', true)).toContain('2026-12-24'); // Dec 25 holiday moves back
  });
  it('2026 has 53 Thursdays', () => { expect(weekdayCount(2026, 4)).toBe(53); expect(weekdayCount(2026, 5)).toBe(52); });
  it('semimonthly and monthly counts', () => { expect(paydays(2026, 'semimonthly').length).toBe(24); expect(paydays(2026, 'monthly').length).toBe(12); expect(paydays(2026, 'semimonthly')).toContain('2026-02-13'); });
});

describe('PTO', () => {
  it('California 1 hour per 30', () => { expect(accruedPerHours(1560, P.states.california.sickLeave.accrueOneHourPer)).toBe(52); });
  it('per period and cap', () => {
    expect(accrualPerPeriod(80, 26)).toBeCloseTo(3.0769, 4);
    const r = projectBalance({ start: 70, perPeriod: 4, periods: 5, cap: 80 });
    expect(r.balance).toBe(80); expect(r.capAt).toBe(3); expect(r.notAccrued).toBe(10);
  });
});
