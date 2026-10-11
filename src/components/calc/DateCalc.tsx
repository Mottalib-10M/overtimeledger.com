/** Calendar family: biweekly schedule, pay periods per year, business days, working days by month,
 *  days and weeks between dates, adding days. Federal holidays computed by the engine (OPM rule). */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import { paydays, businessDaysBetween, workingDaysByMonth, daysBetween, addDays, addBusinessDays, isValidISO, federalHolidays, type PayFrequency } from '../../lib/engine/calendar';
import { readParams, num as qn, str, updateURL } from '../../lib/url-state';
import { Card, Result, Rows, Note, Actions, DateInput, num } from './parts';

declare const __BUILD_DAY__: string;
type Mode = 'pay-schedule' | 'pay-periods' | 'business-days' | 'working-days' | 'days-between' | 'weeks-between' | 'date-add';
const fmt = (iso: string) => (isValidISO(iso) ? new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }) : '·');
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const YEARS = [{ value: '2026', label: '2026' }, { value: '2027', label: '2027' }];
export default function DateCalc({ mode = 'business-days', methodHref = '/en/method/', idPrefix = 'dt' }: { mode?: Mode; methodHref?: string; idPrefix?: string }) {
  const [a, setA] = useState(mode === 'pay-schedule' ? '2026-01-09' : '2026-01-01');
  const [b, setB] = useState('2026-12-31');
  const [hol, setHol] = useState('1'); const [year, setYear] = useState('2026'); const [freq, setFreq] = useState<PayFrequency>('biweekly');
  const [n, setN] = useState(10); const [unit, setUnit] = useState('business'); const [adj, setAdj] = useState('1');
  useEffect(() => {
    const u = readParams(window.location.search); const today = new Date().toISOString().slice(0, 10);
    if (mode === 'pay-schedule') setA(str(u, 'a', '2026-01-09'));
    else if (mode === 'date-add') setA(str(u, 'a', today));
    else { setA(str(u, 'a', mode === 'days-between' || mode === 'weeks-between' ? today : '2026-01-01')); }
    setB(str(u, 'b', '2026-12-31')); setHol(str(u, 'h', '1')); setYear(str(u, 'y', '2026') === '2027' ? '2027' : '2026');
    const f = str(u, 'f', 'biweekly'); if (['weekly', 'biweekly', 'semimonthly', 'monthly'].includes(f)) setFreq(f as PayFrequency);
    setN(qn(u, 'n', 10)); setUnit(str(u, 'un', 'business')); setAdj(str(u, 'adj', '1'));
  }, []);
  useEffect(() => { updateURL({ a, b, h: hol, y: year, f: mode === 'pay-periods' ? freq : undefined, n: mode === 'date-add' ? n : undefined, un: mode === 'date-add' ? unit : undefined, adj: mode === 'pay-schedule' ? adj : undefined }); }, [a, b, hol, year, freq, n, unit, adj]);
  const p = idPrefix; const Y = +year; const H = hol === '1';
  const holSel = <SelectField id={`${p}-h`} label="Federal holidays" value={hol} onChange={setHol} options={[{ value: '1', label: 'Skip the 11 federal holidays' }, { value: '0', label: 'Count them as work days' }]} help="Observed dates, as OPM sets them" />;
  const yearSel = <SelectField id={`${p}-y`} label="Year" value={year} onChange={setYear} options={YEARS} />;
  const schedule = useMemo(() => paydays(Y, 'biweekly', a, adj === '1'), [Y, a, adj]);
  const months = useMemo(() => workingDaysByMonth(Y, H), [Y, H]);
  if (mode === 'pay-schedule') {
    return (
      <Card form={<>
        <DateInput id={`${p}-a`} label="Any payday you know" value={a} onChange={setA} help="Your last or next payday" />
        {yearSel}
        <SelectField id={`${p}-adj`} label="Payday on a weekend or holiday" value={adj} onChange={setAdj} options={[{ value: '1', label: 'Paid the business day before' }, { value: '0', label: 'Keep the calendar date' }]} />
      </>}>
        <Result label={`Biweekly paydays in ${year}`} figure={String(schedule.length)} sub={<>first {fmt(schedule[0] ?? '')}, last {fmt(schedule[schedule.length - 1] ?? '')}</>}>
          <div className="mt-4 overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-navy-300 text-left text-xs uppercase tracking-wide text-navy-600"><th scope="col" className="py-1.5 pr-2">#</th><th scope="col" className="py-1.5 pr-2">Payday</th><th scope="col" className="py-1.5">Month</th></tr></thead>
            <tbody className="divide-y divide-navy-200">{schedule.map((d, i) => <tr key={d}><td className="tabular-nums py-1 pr-2 text-navy-600">{i + 1}</td><td className="py-1 pr-2 text-navy-900">{fmt(d)}</td><td className="py-1 text-navy-700">{MONTHS[+d.slice(5, 7) - 1]}{schedule.filter((x) => x.slice(0, 7) === d.slice(0, 7)).length === 3 && schedule.filter((x) => x.slice(0, 7) === d.slice(0, 7))[0] === d ? ' (three-paycheck month)' : ''}</td></tr>)}</tbody></table></div>
          <Note methodHref={methodHref}>Every 14 days from the payday you entered. A year holds 27 biweekly paydays when the first one falls on January 1 or 2 in the right weekday pattern.</Note>
          <Actions />
        </Result>
      </Card>
    );
  }
  if (mode === 'pay-periods') {
    const list = paydays(Y, freq, freq === 'weekly' || freq === 'biweekly' ? `${year}-01-02` : undefined, true);
    const counts = (['weekly', 'biweekly', 'semimonthly', 'monthly'] as PayFrequency[]).map((f) => [f, paydays(Y, f, `${year}-01-02`, false).length] as const);
    return (
      <Card form={<>{yearSel}<SelectField id={`${p}-f`} label="Pay frequency" value={freq} onChange={(v) => setFreq(v as PayFrequency)} options={[{ value: 'weekly', label: 'Weekly (Fridays)' }, { value: 'biweekly', label: 'Biweekly (Fridays)' }, { value: 'semimonthly', label: 'Semimonthly (15th and last day)' }, { value: 'monthly', label: 'Monthly (last day)' }]} /></>}>
        <Result label={`Pay periods in ${year}, ${freq}`} figure={String(list.length)} sub={<>{fmt(list[0] ?? '')} to {fmt(list[list.length - 1] ?? '')}</>}>
          <Rows rows={counts.map(([f, c]) => [`${f[0].toUpperCase()}${f.slice(1)} paydays in ${year}`, String(c)] as [string, string])} />
          <Note methodHref={methodHref}>Weekly and biweekly counts depend on the weekday and the first payday; the line above assumes Friday paydays starting January 2.</Note>
          <Actions />
        </Result>
      </Card>
    );
  }
  if (mode === 'working-days') {
    const tot = months.reduce((s, m) => s + m.business, 0); const wd = months.reduce((s, m) => s + m.weekdays, 0);
    return (
      <Card form={<>{yearSel}{holSel}</>}>
        <Result label={`Working days in ${year}`} figure={String(tot)} sub={<>{wd} weekdays{H ? `, ${wd - tot} federal holidays off` : ''} · {num(tot * 8)} hours at 8 a day</>}>
          <div className="mt-4 overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-navy-300 text-left text-xs uppercase tracking-wide text-navy-600"><th scope="col" className="py-1.5">Month</th><th scope="col" className="py-1.5 text-right">Work days</th><th scope="col" className="py-1.5 text-right">Holidays</th><th scope="col" className="py-1.5 text-right">Hours (8/day)</th></tr></thead>
            <tbody className="divide-y divide-navy-200">{months.map((m) => <tr key={m.month}><td className="py-1 text-navy-900">{MONTHS[m.month - 1]}</td><td className="tabular-nums py-1 text-right">{m.business}</td><td className="tabular-nums py-1 text-right">{m.holidays}</td><td className="tabular-nums py-1 text-right">{m.business * 8}</td></tr>)}</tbody></table></div>
          <Note methodHref={methodHref}>Monday to Friday minus the observed federal holidays. Private employers choose their own holidays; state holidays are not removed.</Note>
          <Actions />
        </Result>
      </Card>
    );
  }
  if (mode === 'date-add') {
    const ok = isValidISO(a); const res = ok ? (unit === 'business' ? addBusinessDays(a, n, H) : unit === 'weeks' ? addDays(a, n * 7) : addDays(a, n)) : '';
    return (
      <Card form={<>
        <DateInput id={`${p}-a`} label="Start date" value={a} onChange={setA} />
        <NumberField id={`${p}-n`} label="How many" value={n} onChange={setN} unit="" max={100000} />
        <SelectField id={`${p}-un`} label="Of what" value={unit} onChange={setUnit} options={[{ value: 'business', label: 'Business days' }, { value: 'days', label: 'Calendar days' }, { value: 'weeks', label: 'Weeks' }]} />
        {holSel}
      </>}>
        <Result label="Resulting date" figure={fmt(res)} sub={<>{num(n)} {unit === 'business' ? 'business days' : unit} after {fmt(a)}</>}>
          <Rows rows={[['Calendar days between', ok ? num(daysBetween(a, res)) : '·'], ['Federal holidays in that span', ok ? String(federalHolidays(+res.slice(0, 4)).concat(federalHolidays(+a.slice(0, 4))).filter((x, i, arr) => arr.findIndex((y) => y.observed === x.observed) === i && x.observed > a && x.observed <= res).length) : '·']]} />
          <Note methodHref={methodHref}>The start date is not counted; the first business day is the next one.</Note>
          <Actions />
        </Result>
      </Card>
    );
  }
  const ok = isValidISO(a) && isValidISO(b);
  const bd = ok ? businessDaysBetween(a, b, H) : { business: 0, weekend: 0, holidays: 0, calendar: 0 };
  const diff = ok ? daysBetween(a, b) : 0;
  const label = mode === 'business-days' ? 'Business days' : mode === 'weeks-between' ? 'Weeks between the dates' : 'Days between the dates';
  const fig = mode === 'business-days' ? String(bd.business) : mode === 'weeks-between' ? `${Math.floor(Math.abs(diff) / 7)} wk ${Math.abs(diff) % 7} d` : num(Math.abs(diff));
  return (
    <Card form={<>
      <DateInput id={`${p}-a`} label="From" value={a} onChange={setA} />
      <DateInput id={`${p}-b`} label="To" value={b} onChange={setB} />
      {mode === 'business-days' && holSel}
    </>}>
      <Result label={label} figure={fig} sub={<>{fmt(a)} to {fmt(b)}</>}>
        <Rows rows={[['Calendar days (end minus start)', num(Math.abs(diff))], ['Counting both dates', num(bd.calendar)], ['Weeks (decimal)', num(Math.abs(diff) / 7, 2)], ['Business days, both dates included', num(bd.business)], ['Weekend days', num(bd.weekend)], ['Federal holidays on weekdays', num(bd.holidays)]]} />
        <Note methodHref={methodHref}>“Days between” is the difference of the two dates; counting both the first and last day adds one.</Note>
        <Actions />
      </Result>
    </Card>
  );
}
