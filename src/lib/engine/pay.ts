/** Pay conversions: salary and hourly rate, pay periods, the regular rate with two rates, freelancer rate. */
export type Frequency = 'weekly' | 'biweekly' | 'semimonthly' | 'monthly';
export const PERIODS: Record<Frequency, number> = { weekly: 52, biweekly: 26, semimonthly: 24, monthly: 12 };

/** Annual salary to an hourly rate over the hours actually scheduled (hours a week x 52). */
export const salaryToHourly = (annual: number, hoursPerWeek = 40, weeks = 52) => (hoursPerWeek > 0 && weeks > 0 ? annual / (hoursPerWeek * weeks) : 0);
/** Federal civilian method: annual basic pay divided by 2,087 hours (5 U.S.C. 5504(b), OPM). */
export const salaryToHourlyOpm = (annual: number, divisor = 2087) => annual / divisor;
/** Hourly rate to a yearly figure: rate x hours a week x paid weeks. */
export const hourlyToAnnual = (rate: number, hoursPerWeek = 40, weeks = 52) => rate * hoursPerWeek * weeks;
/** Amount per paycheck for a yearly figure. `periods` overrides the usual count (27 biweekly paydays in some years). */
export const perPaycheck = (annual: number, f: Frequency, periods = PERIODS[f]) => annual / periods;

/**
 * Two or more rates in one workweek (29 CFR 778.115): the regular rate is total straight-time pay divided
 * by all hours; overtime adds half of that rate for each overtime hour, the straight time being already paid.
 */
export function weightedOvertime(jobs: Array<{ hours: number; rate: number }>, threshold = 40) {
  const hours = jobs.reduce((s, j) => s + Math.max(0, j.hours), 0);
  const straight = jobs.reduce((s, j) => s + Math.max(0, j.hours) * Math.max(0, j.rate), 0);
  const regularRate = hours > 0 ? straight / hours : 0;
  const otHours = Math.max(0, hours - threshold);
  const premium = 0.5 * regularRate * otHours;
  return { hours, straight, regularRate, otHours, premium, total: straight + premium };
}

/**
 * Salaried nonexempt worker whose salary covers all hours (Fact Sheet #23 example): regular rate = salary /
 * hours worked, plus half that rate for every hour past 40.
 */
export function salariedHalfTime(weeklySalary: number, hours: number, threshold = 40) {
  const regularRate = hours > 0 ? weeklySalary / hours : 0;
  const otHours = Math.max(0, hours - threshold);
  const extra = 0.5 * regularRate * otHours;
  return { regularRate, otHours, extra, total: weeklySalary + extra };
}

/** Hourly rate a freelancer must bill to reach a yearly income after business costs. */
export function freelanceRate(targetIncome: number, yearlyCosts: number, billableHoursPerWeek: number, weeksOff: number) {
  const weeks = Math.max(0, 52 - weeksOff);
  const billable = billableHoursPerWeek * weeks;
  return { billable, weeks, rate: billable > 0 ? (targetIncome + yearlyCosts) / billable : 0 };
}

/** Exempt salary test (FLSA): the weekly salary must reach the threshold; the duties test is separate. */
export const meetsSalaryLevel = (weeklySalary: number, threshold: number) => weeklySalary >= threshold;
