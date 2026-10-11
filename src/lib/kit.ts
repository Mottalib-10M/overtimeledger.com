/**
 * Writing kit: every figure a page writes comes from here (params and engine), never typed by hand
 * (RECETTE §17.4 point 7). Server side only.
 */
import { usd, num, pct, day, month, listOf, hrs, weekdayName } from './fmt';
import { P, RULES, rule, RULE_KEYS } from './data';
import * as T from './engine/time';
import * as O from './engine/overtime';
import * as Pay from './engine/pay';
import * as C from './engine/calendar';
import * as L from './engine/pto';

export const KIT = {
  usd, num, pct, day, month, listOf, hrs, weekdayName,
  P,
  F: P.federal,
  rules: RULES,
  rule,
  ruleKeys: RULE_KEYS,
  ca: P.states.california,
  ak: P.states.alaska,
  nv: P.states.nevada,
  co: P.states.colorado,
  /** Nevada: hourly rate under which daily overtime applies (1.5 x the state minimum wage). */
  nvDailyLimit: P.states.nevada.dailyOtOnlyBelowMultipleOfMinimum * P.states.nevada.minimumWage,
  /** California exempt salary (2 x minimum wage x 2,080 hours). */
  caExemptAnnual: P.states.california.exemptSalaryMultiple * P.states.california.minimumWage * P.federal.fullTimeHoursYear,
  holidays2026: C.federalHolidays(2026),
  time: T,
  ot: O,
  pay: Pay,
  cal: C,
  pto: L,
  /** Split of one week of daily hours under a rule key, with gross pay at a rate. */
  week: (hours: number[], key: keyof typeof RULES, rate = 20) => { const s = O.splitWeek(hours, rule(key as never), rate); return { ...s, pay: O.grossPay(s, rate) }; },
};
export type Kit = typeof KIT;
