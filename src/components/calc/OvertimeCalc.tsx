/** Overtime family: a week of daily hours under a state rule; time and a half; double time; two rates
 *  (29 CFR 778.115); salaried nonexempt half-time (Fact Sheet #23). */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import { splitWeek, grossPay, type StateRule } from '../../lib/engine/overtime';
import { weightedOvertime, salariedHalfTime } from '../../lib/engine/pay';
import { readParams, num as qn, str, updateURL } from '../../lib/url-state';
import { Shell, Card, Result, Rows, Note, Actions, SplitBar, SPLIT_COLORS, usd, num, type Opt } from './parts';

type Mode = 'overtime' | 'time-and-a-half' | 'double-time' | 'regular-rate' | 'salaried-ot';
interface Props { mode?: Mode; rules: Record<string, StateRule>; options: Opt[]; state?: string; lock?: boolean; methodHref?: string; idPrefix?: string }
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DEFH: Record<string, number[]> = { federal: [9, 9, 9, 9, 9, 0, 0], california: [10, 10, 8, 12.5, 8, 0, 0], alaska: [10, 10, 8, 8, 8, 0, 0], nevada: [10, 10, 8, 8, 8, 0, 0], colorado: [13, 12, 8, 8, 8, 0, 0] };
export default function OvertimeCalc({ mode = 'overtime', rules, options, state = 'federal', lock = false, methodHref = '/en/method/', idPrefix = 'ot' }: Props) {
  const [st, setSt] = useState(state);
  const [hours, setHours] = useState<number[]>(DEFH[state] ?? DEFH.federal);
  const [rate, setRate] = useState(mode === 'regular-rate' ? 20 : 18);
  const [x, setX] = useState(mode === 'double-time' ? 2 : mode === 'salaried-ot' ? 900 : 5);
  const [y, setY] = useState(mode === 'salaried-ot' ? 48 : 30);
  const [r2, setR2] = useState(14); const [h2, setH2] = useState(15);
  useEffect(() => { const u = readParams(window.location.search); if (!lock && rules[str(u, 's', state)]) setSt(str(u, 's', state)); setRate(qn(u, 'r', mode === 'regular-rate' ? 20 : 18)); setX(qn(u, 'x', mode === 'double-time' ? 2 : mode === 'salaried-ot' ? 900 : 5)); setY(qn(u, 'y', mode === 'salaried-ot' ? 48 : 30)); setR2(qn(u, 'r2', 14)); setH2(qn(u, 'h2', 15)); const d = u.get('d'); if (d) { const v = d.split('_').map(Number); if (v.length === 7 && v.every((n) => Number.isFinite(n))) setHours(v); } }, []);
  useEffect(() => { updateURL(mode === 'overtime' ? { s: lock ? undefined : st, r: rate, d: hours.join('_') } : { r: rate, x, y, r2: mode === 'regular-rate' ? r2 : undefined, h2: mode === 'regular-rate' ? h2 : undefined }); }, [st, rate, hours, x, y, r2, h2]);
  const split = useMemo(() => splitWeek(hours, rules[st], rate), [hours, st, rate, rules]);
  const p = idPrefix;
  if (mode === 'overtime') {
    const pay = grossPay(split, rate);
    return (
      <Shell left={<>
        <form className="grid content-start gap-x-5 gap-y-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
          {lock
            ? <div className="grid grid-rows-subgrid row-span-3 content-start gap-y-0"><span className="mb-1 block text-sm font-medium text-navy-700">Overtime rule</span><p className="flex h-12 items-center rounded-lg border border-navy-200 bg-navy-50 px-4 font-semibold text-navy-900">{rules[st].name}</p><span className="mt-1 text-xs text-navy-500">Fixed on this page</span></div>
            : <SelectField id={`${p}-st`} label="State where you work" value={st} onChange={setSt} options={options} />}
          <NumberField id={`${p}-r`} label="Regular hourly rate" value={rate} onChange={setRate} unit="$/h" max={1000} decimals={2} />
        </form>
        <form className="mt-4 grid content-start grid-cols-4 gap-x-3 gap-y-3 sm:grid-cols-7" onSubmit={(e) => e.preventDefault()}>
          {hours.map((hh, i) => <NumberField key={i} id={`${p}-d${i}`} label={DAYS[i]} value={hh} onChange={(v) => setHours((a) => a.map((q, j) => (j === i ? v : q)))} unit="h" max={24} decimals={2} />)}
        </form>
        </>}>
        <Result label="Overtime pay this week" figure={usd(pay.ot + pay.dt, 2)} sub={<>{num(split.ot, 2)} h at 1.5x{split.dt > 0 ? `, ${num(split.dt, 2)} h at 2x` : ''} · gross {usd(pay.total, 2)}</>}>
          <SplitBar parts={[{ label: 'Regular', value: split.reg, color: SPLIT_COLORS.reg }, { label: 'Overtime', value: split.ot, color: SPLIT_COLORS.ot }, { label: 'Double time', value: split.dt, color: SPLIT_COLORS.dt }]} />
          <Rows rows={[['Total hours', `${num(split.total, 2)} h`], ['Regular hours', `${num(split.reg, 2)} h × ${usd(rate, 2)}`], ['Overtime hours', `${num(split.ot, 2)} h × ${usd(rate * 1.5, 2)}`], ...(split.dt > 0 || rules[st].dailyDtAfter ? [['Double-time hours', `${num(split.dt, 2)} h × ${usd(rate * 2, 2)}`] as [string, string]] : []), ['Gross pay before taxes', usd(pay.total, 2), true]]} />
          <Note methodHref={methodHref}>{split.note}{split.seventhDayApplied ? ' Seventh consecutive day: first 8 hours at 1.5x, the rest at 2x.' : ''} Days are in workweek order.</Note>
          <Actions />
        </Result>
      </Shell>
    );
  }
  if (mode === 'time-and-a-half' || mode === 'double-time') {
    const mult = mode === 'double-time' ? 2 : 1.5;
    return (
      <Card form={<>
        <NumberField id={`${p}-r`} label="Regular hourly rate" value={rate} onChange={setRate} unit="$/h" max={1000} decimals={2} />
        <NumberField id={`${p}-x`} label={mode === 'double-time' ? 'Hours at double time' : 'Overtime hours'} value={x} onChange={setX} unit="h" max={200} decimals={2} />
        <NumberField id={`${p}-y`} label="Regular hours in the same period" value={y} onChange={setY} unit="h" max={200} decimals={2} />
      </>}>
        <Result label={mode === 'double-time' ? 'Double-time rate' : 'Time-and-a-half rate'} figure={usd(rate * mult, 2)} sub={<>per hour, {mult}x of {usd(rate, 2)}</>}>
          <Rows rows={[[`Premium part of each hour`, usd(rate * (mult - 1), 2)], [`Pay for ${num(x, 2)} h at ${mult}x`, usd(rate * mult * x, 2)], [`Pay for ${num(y, 2)} regular hours`, usd(rate * y, 2)], ['Total gross pay', usd(rate * (y + mult * x), 2), true]]} />
          <Note methodHref={methodHref}>The multiplier applies to the regular rate, which includes nondiscretionary bonuses and shift differentials (Fact Sheet #23).</Note>
          <Actions />
        </Result>
      </Card>
    );
  }
  if (mode === 'regular-rate') {
    const w = weightedOvertime([{ hours: y, rate }, { hours: h2, rate: r2 }]);
    return (
      <Card form={<>
        <NumberField id={`${p}-y`} label="Hours at job A" value={y} onChange={setY} unit="h" max={168} decimals={2} />
        <NumberField id={`${p}-r`} label="Rate at job A" value={rate} onChange={setRate} unit="$/h" max={1000} decimals={2} />
        <NumberField id={`${p}-h2`} label="Hours at job B" value={h2} onChange={setH2} unit="h" max={168} decimals={2} />
        <NumberField id={`${p}-r2`} label="Rate at job B" value={r2} onChange={setR2} unit="$/h" max={1000} decimals={2} />
      </>}>
        <Result label="Regular rate for the week" figure={usd(w.regularRate, 2)} sub={<>weighted average of {num(w.hours, 2)} hours</>}>
          <Rows rows={[['Straight-time pay, all hours', usd(w.straight, 2)], ['Overtime hours (past 40)', `${num(w.otHours, 2)} h`], ['Overtime premium (half the regular rate)', usd(w.premium, 2)], ['Total pay for the week', usd(w.total, 2), true]]} />
          <Note methodHref={methodHref}>29 CFR 778.115: total straight-time earnings divided by all hours worked; each overtime hour adds half of that rate.</Note>
          <Actions />
        </Result>
      </Card>
    );
  }
  const s = salariedHalfTime(x, y);
  return (
    <Card form={<>
      <NumberField id={`${p}-x`} label="Weekly salary" value={x} onChange={setX} unit="$" max={100000} decimals={2} />
      <NumberField id={`${p}-y`} label="Hours worked this week" value={y} onChange={setY} unit="h" max={168} decimals={2} />
    </>}>
      <Result label="Overtime owed on top of the salary" figure={usd(s.extra, 2)} sub={<>regular rate {usd(s.regularRate, 2)} an hour this week</>}>
        <Rows rows={[['Regular rate (salary ÷ hours)', usd(s.regularRate, 2)], ['Overtime hours', `${num(s.otHours, 2)} h`], ['Half-time premium per overtime hour', usd(s.regularRate / 2, 2)], ['Total pay for the week', usd(s.total, 2), true]]} />
        <Note methodHref={methodHref}>For a nonexempt employee whose salary covers all hours worked (Fact Sheet #23). A salary meant for 40 hours only is converted at 40 instead.</Note>
        <Actions />
      </Result>
    </Card>
  );
}
