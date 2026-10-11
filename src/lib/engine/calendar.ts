/**
 * Calendar arithmetic in UTC on ISO dates (YYYY-MM-DD): federal holidays computed from the rules of
 * 5 U.S.C. 6103 with the OPM weekend rule (Saturday holiday observed Friday, Sunday holiday observed
 * Monday), business days, paydays for every pay frequency.
 */
export type ISO = string;
const D = 86400000;
export const toDate = (iso: ISO) => new Date(`${iso.slice(0, 10)}T00:00:00Z`);
export const toISO = (d: Date) => d.toISOString().slice(0, 10);
export const addDays = (iso: ISO, n: number) => toISO(new Date(toDate(iso).getTime() + n * D));
/** 0 = Sunday … 6 = Saturday. */
export const weekday = (iso: ISO) => toDate(iso).getUTCDay();
export const isWeekend = (iso: ISO) => { const w = weekday(iso); return w === 0 || w === 6; };
/** Calendar days from a to b (b - a), negative when b is earlier. */
export const daysBetween = (a: ISO, b: ISO) => Math.round((toDate(b).getTime() - toDate(a).getTime()) / D);
export const isValidISO = (s: string) => /^\d{4}-\d{2}-\d{2}$/.test(s) && !isNaN(toDate(s).getTime()) && toISO(toDate(s)) === s;
const lastDay = (y: number, m: number) => new Date(Date.UTC(y, m, 0)).getUTCDate(); // m: 1-12
const nthWeekday = (y: number, m: number, wd: number, n: number): ISO => {
  const first = new Date(Date.UTC(y, m - 1, 1)).getUTCDay();
  const day = 1 + ((wd - first + 7) % 7) + (n - 1) * 7;
  return toISO(new Date(Date.UTC(y, m - 1, day)));
};
const lastWeekday = (y: number, m: number, wd: number): ISO => {
  const ld = lastDay(y, m); const w = new Date(Date.UTC(y, m - 1, ld)).getUTCDay();
  return toISO(new Date(Date.UTC(y, m - 1, ld - ((w - wd + 7) % 7))));
};
const iso = (y: number, m: number, d: number) => toISO(new Date(Date.UTC(y, m - 1, d)));

export interface Holiday { name: string; date: ISO; observed: ISO }
/** The eleven federal holidays of a year, with the day off observed by federal employees. */
export function federalHolidays(year: number): Holiday[] {
  const fixed = (name: string, m: number, d: number): Holiday => {
    const date = iso(year, m, d); const w = weekday(date);
    return { name, date, observed: w === 6 ? addDays(date, -1) : w === 0 ? addDays(date, 1) : date };
  };
  const moving = (name: string, date: ISO): Holiday => ({ name, date, observed: date });
  return [
    fixed("New Year's Day", 1, 1),
    moving('Birthday of Martin Luther King, Jr.', nthWeekday(year, 1, 1, 3)),
    moving("Washington's Birthday", nthWeekday(year, 2, 1, 3)),
    moving('Memorial Day', lastWeekday(year, 5, 1)),
    fixed('Juneteenth National Independence Day', 6, 19),
    fixed('Independence Day', 7, 4),
    moving('Labor Day', nthWeekday(year, 9, 1, 1)),
    moving('Columbus Day', nthWeekday(year, 10, 1, 2)),
    fixed('Veterans Day', 11, 11),
    moving('Thanksgiving Day', nthWeekday(year, 11, 4, 4)),
    fixed('Christmas Day', 12, 25),
  ];
}
const holidayCache = new Map<number, Set<ISO>>();
/** Observed federal holiday dates falling in a calendar year (Jan 1 of next year observed Dec 31 included). */
export function observedSet(year: number): Set<ISO> {
  if (!holidayCache.has(year)) {
    const all = [year - 1, year, year + 1].flatMap((y) => federalHolidays(y).map((h) => h.observed)).filter((d) => d.startsWith(String(year)));
    holidayCache.set(year, new Set(all));
  }
  return holidayCache.get(year)!;
}
export const isFederalHoliday = (d: ISO) => observedSet(+d.slice(0, 4)).has(d);
export const isBusinessDay = (d: ISO, holidays = true) => !isWeekend(d) && !(holidays && isFederalHoliday(d));

/** Business days from start to end, both included, skipping weekends and (optionally) observed federal holidays. */
export function businessDaysBetween(start: ISO, end: ISO, holidays = true): { business: number; weekend: number; holidays: number; calendar: number } {
  let a = start, b = end; if (daysBetween(a, b) < 0) [a, b] = [b, a];
  let business = 0, weekend = 0, hol = 0; const calendar = daysBetween(a, b) + 1;
  for (let i = 0; i < calendar; i++) {
    const d = addDays(a, i);
    if (isWeekend(d)) weekend++; else if (holidays && isFederalHoliday(d)) hol++; else business++;
  }
  return { business, weekend, holidays: hol, calendar };
}
/** Move n business days from a date (n may be negative). The start date itself is not counted. */
export function addBusinessDays(start: ISO, n: number, holidays = true): ISO {
  let d = start; let left = Math.abs(Math.trunc(n)); const step = n < 0 ? -1 : 1;
  while (left > 0) { d = addDays(d, step); if (isBusinessDay(d, holidays)) left--; }
  return d;
}
/** Working days (Mon–Fri minus observed federal holidays) in each month of a year. */
export function workingDaysByMonth(year: number, holidays = true) {
  return Array.from({ length: 12 }, (_, i) => {
    const m = i + 1; const r = businessDaysBetween(iso(year, m, 1), iso(year, m, lastDay(year, m)), holidays);
    return { month: m, ...r, weekdays: r.business + r.holidays };
  });
}

export type PayFrequency = 'weekly' | 'biweekly' | 'semimonthly' | 'monthly';
/** Business day on or before a date (payroll moves a weekend or holiday payday earlier). */
export function previousBusinessDay(d: ISO, holidays = true): ISO { let x = d; while (!isBusinessDay(x, holidays)) x = addDays(x, -1); return x; }
/**
 * Paydays of a calendar year. Weekly and biweekly: every 7 or 14 days from any known payday (before or
 * inside the year). Semimonthly: the 15th and the last day of each month; monthly: the last day. With
 * `adjust`, a payday that falls on a weekend or federal holiday moves to the previous business day.
 */
export function paydays(year: number, freq: PayFrequency, anchor?: ISO, adjust = true): ISO[] {
  const out: ISO[] = [];
  const Y = String(year);
  const keep = (list: ISO[]) => list.map((d) => (adjust ? previousBusinessDay(d) : d)).filter((d) => d.startsWith(Y));
  if (freq === 'weekly' || freq === 'biweekly') {
    const step = freq === 'weekly' ? 7 : 14;
    const a = anchor && isValidISO(anchor) ? anchor : iso(year, 1, 2);
    const from = iso(year - 1, 12, 20);
    const off = ((daysBetween(a, from) % step) + step) % step;
    let d = addDays(from, (step - off) % step);
    const raw: ISO[] = [];
    while (d <= iso(year + 1, 1, 10)) { raw.push(d); d = addDays(d, step); }
    // A raw payday in early January of the next year can move back into December, and one of early
    // January of this year back into last December: filter after adjusting.
    return keep(raw);
  }
  for (let m = 1; m <= 12; m++) out.push(...(freq === 'semimonthly' ? [iso(year, m, 15), iso(year, m, lastDay(year, m))] : [iso(year, m, lastDay(year, m))]));
  return keep(out);
}
/** Count of a weekday in a year: 2026 has 53 Thursdays and 52 of every other weekday. */
export function weekdayCount(year: number, wd: number) {
  let n = 0; for (let d = iso(year, 1, 1); d.startsWith(String(year)); d = addDays(d, 1)) if (weekday(d) === wd) n++;
  return n;
}
