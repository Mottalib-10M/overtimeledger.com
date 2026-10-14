/** Hours and minutes ↔ decimal hours; mode "payroll-hours": a week of h:mm totals to decimal for payroll. */
import { useEffect, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import { readParams, num as qn, str, updateURL } from '../../lib/url-state';
import { Shell, Card, Result, Rows, Note, Actions, usd, num } from './parts';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
export default function DecimalCalc({ mode = 'hm-decimal', methodHref = '/en/method/', idPrefix = 'dc' }: { mode?: 'hm-decimal' | 'payroll-hours'; methodHref?: string; idPrefix?: string }) {
  const [h, setH] = useState(7); const [m, setM] = useState(50); const [dec, setDec] = useState(7.8);
  const [w, setW] = useState<number[][]>([[8, 15], [7, 50], [8, 5], [9, 20], [6, 40], [0, 0], [0, 0]]);
  const [round, setRound] = useState('2'); const [rate, setRate] = useState(0);
  useEffect(() => { const u = readParams(window.location.search); setH(qn(u, 'h', 7)); setM(qn(u, 'm', 50)); setDec(qn(u, 'x', 7.8)); setRound(str(u, 'rd', '2')); setRate(qn(u, 'r', 0)); const d = u.get('d'); if (d) { const x = d.split('_').map((q) => q.split('~').map(Number)); if (x.length === 7) setW(x.map((y) => [y[0] || 0, y[1] || 0])); } }, []);
  useEffect(() => { updateURL(mode === 'payroll-hours' ? { d: w.map((x) => x.join('~')).join('_'), rd: round, r: rate || undefined } : { h, m, x: dec }); }, [h, m, dec, w, round, rate]);
  const p = idPrefix;
  if (mode === 'hm-decimal') {
    const toDec = h + m / 60; const dm = Math.round(dec * 60);
    return (
      <Card form={<>
        <NumberField id={`${p}-h`} label="Hours" value={h} onChange={setH} unit="h" max={100000} />
        <NumberField id={`${p}-m`} label="Minutes" value={m} onChange={setM} unit="min" max={100000} />
        <NumberField id={`${p}-x`} label="Or decimal hours to convert back" value={dec} onChange={setDec} unit="h" max={100000} decimals={2} />
      </>}>
        <Result label={`${h} h ${m} min in decimal hours`} figure={num(toDec, 2)} sub={<>{num(toDec, 4)} exactly · {num(dec, 2)} h = {Math.floor(dm / 60)} h {dm % 60} min</>}>
          <Rows rows={[['Total minutes', num(h * 60 + m)], ['Decimal, two places (payroll)', num(toDec, 2)], [`${num(dec, 2)} decimal hours in h:mm`, `${Math.floor(dm / 60)}:${String(dm % 60).padStart(2, '0')}`]]} />
          <Note methodHref={methodHref}>Decimal hours = hours + minutes ÷ 60. 15 minutes = 0.25, 30 = 0.5, 45 = 0.75.</Note>
          <Actions />
        </Result>
      </Card>
    );
  }
  const r = +round;
  const days = w.map(([a, b]) => { const x = a + b / 60; return r === 25 ? Math.round(x * 4) / 4 : r === 1 ? Math.round(x * 10) / 10 : Math.round(x * 100) / 100; });
  const total = days.reduce((s, x) => s + x, 0);
  const exact = w.reduce((s, [a, b]) => s + a + b / 60, 0);
  const set = (i: number, k: 0 | 1) => (v: number) => setW((x) => x.map((y, j) => (j === i ? (k === 0 ? [v, y[1]] : [y[0], v]) : y)));
  return (
    <Shell left={<>
      <form className="grid content-start grid-cols-2 gap-x-3 gap-y-3 sm:grid-cols-4" onSubmit={(e) => e.preventDefault()}>
        {w.map((x, i) => [
          <NumberField key={`h${i}`} id={`${p}-h${i}`} label={`${DAYS[i]} hours`} value={x[0]} onChange={set(i, 0)} unit="h" max={24} />,
          <NumberField key={`m${i}`} id={`${p}-m${i}`} label={`${DAYS[i]} minutes`} value={x[1]} onChange={set(i, 1)} unit="min" max={59} />,
        ])}
        <SelectField id={`${p}-rd`} label="Payroll writes each day to" value={round} onChange={setRound} options={[{ value: '2', label: 'Hundredths (0.01 h)' }, { value: '1', label: 'Tenths (0.1 h)' }, { value: '25', label: 'Quarters (0.25 h)' }]} className="col-span-2" />
        <NumberField id={`${p}-r`} label="Hourly rate (optional)" value={rate} onChange={setRate} unit="$/h" max={1000} decimals={2} className="col-span-2" />
      </form>
      </>}>
      <Result label="Decimal hours for payroll" figure={num(total, 2)} sub={<>{num(exact, 4)} h exactly · difference {num((total - exact) * 60, 1)} min</>}>
        <Rows rows={[...days.map((x, i) => [DAYS[i], num(x, 2)] as [string, string]), ...(rate > 0 ? [['Straight-time pay', usd(total * rate, 2), true] as [string, string, boolean]] : [])]} />
        <Note methodHref={methodHref}>Rounding a daily total is a payroll convention, not a rule; over time it must not shortchange the worker (29 CFR 785.48).</Note>
        <Actions />
      </Result>
    </Shell>
  );
}
