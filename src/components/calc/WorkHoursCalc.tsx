/** A regular schedule turned into hours per day, week, month and year, and pay at a rate. */
import { useEffect, useState } from 'react';
import NumberField from '../ui/NumberField';
import { parseClock, shiftMinutes } from '../../lib/engine/time';
import { readParams, num as qn, str, updateURL } from '../../lib/url-state';
import { Card, Result, Rows, Note, Actions, TimeInput, usd, num, hmd } from './parts';

export default function WorkHoursCalc({ methodHref = '/en/method/', idPrefix = 'wh' }: { methodHref?: string; idPrefix?: string }) {
  const [a, setA] = useState('9:00'); const [b, setB] = useState('17:30'); const [brk, setBrk] = useState(30);
  const [days, setDays] = useState(5); const [weeks, setWeeks] = useState(52); const [rate, setRate] = useState(0);
  useEffect(() => { const u = readParams(window.location.search); setA(str(u, 'a', '9:00')); setB(str(u, 'b', '17:30')); setBrk(qn(u, 'k', 30)); setDays(qn(u, 'dw', 5)); setWeeks(qn(u, 'wy', 52)); setRate(qn(u, 'r', 0)); }, []);
  useEffect(() => { updateURL({ a, b, k: brk, dw: days, wy: weeks, r: rate || undefined }); }, [a, b, brk, days, weeks, rate]);
  const ia = parseClock(a), ib = parseClock(b);
  const d = shiftMinutes(ia, ib, brk, 0).minutes;
  const wk = d * Math.min(7, days); const yr = wk * Math.min(53, weeks); const mo = yr / 12;
  const p = idPrefix;
  return (
    <Card form={<>
      <TimeInput id={`${p}-a`} label="Usual start" value={a} onChange={setA} invalid={a.trim() !== '' && ia === null} />
      <TimeInput id={`${p}-b`} label="Usual end" value={b} onChange={setB} invalid={b.trim() !== '' && ib === null} />
      <NumberField id={`${p}-k`} label="Unpaid break each day" value={brk} onChange={setBrk} unit="min" max={600} />
      <NumberField id={`${p}-dw`} label="Days worked per week" value={days} onChange={setDays} unit="days" max={7} decimals={1} />
      <NumberField id={`${p}-wy`} label="Paid weeks per year" value={weeks} onChange={setWeeks} unit="wk" max={53} help="52 if vacation is paid" />
      <NumberField id={`${p}-r`} label="Hourly rate (optional)" value={rate} onChange={setRate} unit="$/h" max={1000} decimals={2} />
    </>}>
      <Result label="Hours per week" figure={hmd(wk)} sub={<>{num(wk / 60, 2)} decimal hours, {hmd(d)} a day</>}>
        <Rows rows={[['Hours per day', `${num(d / 60, 2)} h`], ['Hours per week', `${num(wk / 60, 2)} h`], ['Average hours per month', `${num(mo / 60, 1)} h`], ['Hours per year', `${num(yr / 60, 0)} h`],
          ...(rate > 0 ? [['Weekly pay at straight time', usd((wk / 60) * rate, 2)], ['Yearly pay at straight time', usd((yr / 60) * rate), true]] as Array<[string, string] | [string, string, boolean]> : [])]} />
        <Note methodHref={methodHref}>Straight time only: hours past 40 in a workweek earn overtime under the FLSA, and some states add a daily rule.</Note>
        <Actions />
      </Result>
    </Card>
  );
}
