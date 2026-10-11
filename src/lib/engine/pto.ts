/** Paid time off: accrual per hour worked or per pay period, balance with a cap, value at a rate. */
/** Hours accrued for hours worked at "1 hour per N hours" (California paid sick leave: N = 30). */
export const accruedPerHours = (hoursWorked: number, perHours: number) => (perHours > 0 ? hoursWorked / perHours : 0);
/** Hours accrued each pay period when a policy grants a yearly number of hours. */
export const accrualPerPeriod = (yearlyHours: number, periodsPerYear: number) => (periodsPerYear > 0 ? yearlyHours / periodsPerYear : 0);
/** Days of leave expressed in hours of a normal day (10 days x 8 h = 80 h). */
export const daysToHours = (days: number, hoursPerDay = 8) => days * hoursPerDay;

/**
 * Balance after a number of pay periods: starting balance + accrual each period - hours used, never above
 * the cap (accrual stops at the cap and resumes when hours are used). Returns the balance and the first
 * period in which the cap was reached (or null).
 */
export function projectBalance(opts: { start: number; perPeriod: number; periods: number; usedPerPeriod?: number; cap?: number | null }) {
  const cap = opts.cap && opts.cap > 0 ? opts.cap : Infinity;
  let bal = Math.min(Math.max(0, opts.start), cap); let capAt: number | null = bal >= cap ? 0 : null; let lost = 0;
  for (let i = 1; i <= Math.max(0, Math.floor(opts.periods)); i++) {
    const before = bal + opts.perPeriod;
    if (before > cap) { lost += before - cap; bal = cap; if (capAt === null) capAt = i; } else bal = before;
    bal = Math.max(0, bal - (opts.usedPerPeriod ?? 0));
  }
  return { balance: bal, capAt, notAccrued: lost };
}
/** Cash value of hours at an hourly rate. */
export const ptoValue = (hours: number, rate: number) => hours * rate;
