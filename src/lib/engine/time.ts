/**
 * Clock arithmetic: parse what people type on a time card, measure a shift (overnight included),
 * round punches the way 29 CFR 785.48(b) allows, and convert between h:mm, decimal hours, 12-hour
 * and 24-hour ("military") time. Pure functions, minutes as integers.
 */
export const DAY = 1440;

/**
 * Minutes after midnight for a typed clock time, or null when it cannot be read.
 * Accepts 8, 855, 0855, 8:55, 8.55, 8:55am, 8:55 p, 1345, 13:45, 24:00, noon, midnight.
 * Without am/pm the time is read on the 24-hour clock (13:45 = 1:45 PM, 8:00 = 8:00 AM).
 */
export function parseClock(input: string): number | null {
  let s = String(input ?? '').trim().toLowerCase().replace(/\s+/g, '').replace(/\.m\.?$/, 'm').replace(/\./g, ':');
  if (!s) return null;
  if (s === 'noon') return 720;
  if (s === 'midnight') return 0;
  let mer: 'am' | 'pm' | null = null;
  const m = s.match(/^(.*?)(am|pm|a|p|h|hrs|hours)$/);
  if (m) { s = m[1]; if (m[2].startsWith('a')) mer = 'am'; else if (m[2].startsWith('p')) mer = 'pm'; }
  let h: number, min: number;
  if (s.includes(':')) {
    const [a, b = '0'] = s.split(':');
    if (!/^\d{1,2}$/.test(a) || !/^\d{1,2}$/.test(b)) return null;
    h = +a; min = +b;
  } else {
    if (!/^\d{1,4}$/.test(s)) return null;
    if (s.length <= 2) { h = +s; min = 0; } else { h = +s.slice(0, s.length - 2); min = +s.slice(-2); }
  }
  if (min > 59) return null;
  if (mer) {
    if (h < 1 || h > 12) return null;
    if (h === 12) h = 0;
    if (mer === 'pm') h += 12;
  } else if (h > 24 || (h === 24 && min > 0)) return null;
  return h * 60 + min;
}

/** Length of a shift in minutes. An end at or before the start is read as the next day (night shift). */
export function span(start: number, end: number): number {
  if (end === start) return 0;
  return end > start ? end - start : end + DAY - start;
}

/** Round a clock time to the nearest increment (5, 6 = tenth of an hour, 15 = quarter hour). */
export function roundTo(minutes: number, increment: number): number {
  if (!increment || increment <= 1) return minutes;
  return Math.round(minutes / increment) * increment;
}

/** One shift: in, out, unpaid minutes, rounding of each punch. Returns paid minutes and the rounded punches. */
export function shiftMinutes(inT: number | null, outT: number | null, unpaidBreak = 0, increment = 0) {
  if (inT === null || outT === null) return { minutes: 0, inR: inT, outR: outT, gross: 0, overnight: false };
  const inR = roundTo(inT, increment);
  const outR = roundTo(outT, increment);
  const gross = span(inR, outR);
  const minutes = Math.max(0, gross - Math.max(0, unpaidBreak));
  return { minutes, inR, outR, gross, overnight: outR <= inR && gross > 0 };
}

/** 465 → "7:45" (hours may exceed 24). */
export function hm(minutes: number): string {
  const m = Math.round(Math.abs(minutes));
  const sign = minutes < 0 ? '-' : '';
  return `${sign}${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`;
}
/** 465 → 7.75 (unrounded); display with two decimals. */
export const decimalHours = (minutes: number) => minutes / 60;
/** Minutes to decimal hours as payroll writes them, rounded to two decimals: 50 min → 0.83. */
export const minutesToDecimal = (minutes: number) => Math.round((minutes / 60) * 100) / 100;
/** Decimal hours to whole minutes: 7.8 → 468. */
export const decimalToMinutes = (hours: number) => Math.round(hours * 60);

/** Clock time (minutes after midnight, any value) on the 12-hour clock: 825 → "1:45 PM". */
export function to12h(minutes: number): string {
  const m = ((Math.round(minutes) % DAY) + DAY) % DAY;
  const h = Math.floor(m / 60); const mm = String(m % 60).padStart(2, '0');
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${mm} ${h < 12 ? 'AM' : 'PM'}`;
}
/** 24-hour clock with a colon: 825 → "13:45". */
export function to24h(minutes: number): string {
  const m = ((Math.round(minutes) % DAY) + DAY) % DAY;
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
}
/** Military style, four digits and no colon: 825 → "1345". Midnight is "0000". */
export const toMilitary = (minutes: number) => to24h(minutes).replace(':', '');

/** Sum of signed durations given as [hours, minutes, seconds]. Returns total seconds. */
export function sumDurations(items: Array<{ h: number; m: number; s?: number; sign?: 1 | -1 }>): number {
  return items.reduce((t, x) => t + (x.sign ?? 1) * (Math.round(x.h * 3600) + Math.round(x.m * 60) + Math.round(x.s ?? 0)), 0);
}
/** Seconds → { h, m, s, decimal }. */
export function splitSeconds(total: number) {
  const neg = total < 0; const t = Math.abs(Math.round(total));
  return { neg, h: Math.floor(t / 3600), m: Math.floor((t % 3600) / 60), s: t % 60, decimal: (neg ? -1 : 1) * t / 3600 };
}
