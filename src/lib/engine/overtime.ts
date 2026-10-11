/**
 * Splits the hours of one workweek into regular, overtime (1.5x) and double time (2x) under the federal
 * rule or the rule of a state that adds daily overtime (params-2026.json > states).
 *
 * Method (DLSE overtime FAQ, COMPS Order #40 Rule 4.1.2, FLSA Fact Sheet #23):
 *  1. daily: hours past the daily threshold are overtime, past the double-time threshold double time;
 *     California's seventh consecutive day: first 8 hours at 1.5x, the rest at 2x;
 *  2. weekly: straight-time hours beyond 40 in the workweek become overtime, counted in day order.
 *  An hour is paid once: weekly overtime only converts hours that are still straight time, which is
 *  the "whichever is greater" result Colorado's Rule 4.1.2 asks for.
 * Days are given in workweek order (day 1 = first day of the employer's fixed workweek).
 */
export interface StateRule {
  name: string; short: string;
  dailyOtAfter: number | null; dailyDtAfter: number | null;
  seventhDay: boolean; seventhDayOtUpTo?: number;
  weeklyOtAfter: number;
  minimumWage?: number; dailyOtOnlyBelowMultipleOfMinimum?: number;
}
export interface DaySplit { hours: number; reg: number; ot: number; dt: number }
export interface WeekSplit { days: DaySplit[]; reg: number; ot: number; dt: number; total: number; dailyApplied: boolean; seventhDayApplied: boolean; note: string }

const r4 = (x: number) => Math.round(x * 10000) / 10000;

/** Is the daily rule switched on for this worker? Nevada: only below 1.5 x the state minimum wage. */
export function dailyRuleApplies(rule: StateRule, hourlyRate: number): boolean {
  if (rule.dailyOtAfter == null) return false;
  if (rule.dailyOtOnlyBelowMultipleOfMinimum && rule.minimumWage) return hourlyRate < rule.dailyOtOnlyBelowMultipleOfMinimum * rule.minimumWage;
  return true;
}

export function splitWeek(hours: number[], rule: StateRule, hourlyRate = 0): WeekSplit {
  const daily = dailyRuleApplies(rule, hourlyRate);
  const workedAll7 = rule.seventhDay && hours.length >= 7 && hours.slice(0, 7).every((h) => h > 0);
  const days: DaySplit[] = hours.map((raw, i) => {
    const h = Math.max(0, raw);
    if (workedAll7 && i === 6) {
      const upTo = rule.seventhDayOtUpTo ?? 8;
      return { hours: h, reg: 0, ot: Math.min(h, upTo), dt: Math.max(0, h - upTo) };
    }
    if (!daily) return { hours: h, reg: h, ot: 0, dt: 0 };
    const dtAfter = rule.dailyDtAfter ?? Infinity;
    const dt = Math.max(0, h - dtAfter);
    const ot = Math.max(0, Math.min(h, dtAfter) - (rule.dailyOtAfter as number));
    return { hours: h, reg: h - ot - dt, ot, dt };
  });
  // Weekly threshold on straight time, in day order.
  let straight = 0;
  for (const d of days) {
    const room = Math.max(0, rule.weeklyOtAfter - straight);
    if (d.reg > room) { const extra = d.reg - room; d.reg = room; d.ot += extra; }
    straight += d.reg;
  }
  for (const d of days) { d.reg = r4(d.reg); d.ot = r4(d.ot); d.dt = r4(d.dt); }
  const sum = (k: 'reg' | 'ot' | 'dt' | 'hours') => r4(days.reduce((s, d) => s + d[k], 0));
  const note = rule.dailyOtAfter == null ? `Overtime after ${rule.weeklyOtAfter} hours in the workweek (FLSA).`
    : !daily ? `${rule.name}: daily overtime does not apply at this hourly rate, so only the ${rule.weeklyOtAfter}-hour weekly rule is used.`
    : `${rule.name}: overtime after ${rule.dailyOtAfter} hours a day${rule.dailyDtAfter ? `, double time after ${rule.dailyDtAfter}` : ''}${rule.seventhDay ? ', seventh consecutive day rule' : ''} and after ${rule.weeklyOtAfter} hours a week.`;
  return { days, reg: sum('reg'), ot: sum('ot'), dt: sum('dt'), total: sum('hours'), dailyApplied: daily, seventhDayApplied: workedAll7, note };
}

/** Gross pay for a split at one hourly rate. */
export function grossPay(s: { reg: number; ot: number; dt: number }, rate: number, otMult = 1.5, dtMult = 2) {
  const reg = s.reg * rate, ot = s.ot * rate * otMult, dt = s.dt * rate * dtMult;
  return { reg, ot, dt, total: reg + ot + dt };
}
