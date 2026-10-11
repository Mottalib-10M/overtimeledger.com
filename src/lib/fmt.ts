/** Formatters with no dependency on routes or data (safe from page files, minis and calculators). */
import { formatMoney, formatNumber } from './format';
/** $1,234 (no cents by default, RECETTE §4.1). Official rates with cents: usd(x, 2). */
export const usd = (n: number, d = 0) => formatMoney(n, d);
export const num = (n: number, d = 0) => formatNumber(n, d);
/** A share as a percentage: 0.375 → "37.5%". */
export const pct = (share: number, d = 1) => `${formatNumber(share * 100, d)}%`;
/** "August 7, 2026" from an ISO date. */
export const day = (iso: string) => new Date(`${iso.slice(0, 10)}T00:00:00Z`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
/** "Fri, Jan 2" from an ISO date. */
export const shortDay = (iso: string) => new Date(`${iso.slice(0, 10)}T00:00:00Z`).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' });
/** "August 2026" from "2026-08". */
export const month = (ym: string) => new Date(`${ym.slice(0, 7)}-01T00:00:00Z`).toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });
/** "A, B and C". */
export const listOf = (xs: string[]) => (xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`);
/** Hours with up to two useful decimals: 7.5 → "7.5", 8 → "8", 7.833 → "7.83". */
export const hrs = (h: number) => formatNumber(Math.round(h * 100) / 100, Number.isInteger(Math.round(h * 100) / 100) ? 0 : Math.round(h * 100) % 10 === 0 ? 1 : 2);
const WD = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const weekdayName = (i: number) => WD[((i % 7) + 7) % 7];
