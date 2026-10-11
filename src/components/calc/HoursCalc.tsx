/** Hours between two clock times (night shifts included), unpaid break, optional rounding of both punches.
 *  Mode "clock-in-out": shows how each punch moves under quarter-hour rounding, minute by minute. */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import { parseClock, shiftMinutes, span, to12h, to24h } from '../../lib/engine/time';
import { readParams, num as qn, str, updateURL } from '../../lib/url-state';
import { Card, Result, Rows, Note, Actions, TimeInput, usd, num, hmd } from './parts';

interface Props { mode?: 'hours' | 'clock-in-out'; methodHref?: string; idPrefix?: string }
export default function HoursCalc({ mode = 'hours', methodHref = '/en/method/', idPrefix = 'hc' }: Props) {
  const io = mode === 'clock-in-out';
  const [a, setA] = useState(io ? '7:53' : '9:00');
  const [b, setB] = useState(io ? '16:38' : '17:30');
  const [brk, setBrk] = useState(30);
  const [round, setRound] = useState(io ? '15' : '0');
  const [rate, setRate] = useState(0);
  useEffect(() => { const u = readParams(window.location.search); setA(str(u, 'a', io ? '7:53' : '9:00')); setB(str(u, 'b', io ? '16:38' : '17:30')); setBrk(qn(u, 'k', 30)); setRound(str(u, 'rd', io ? '15' : '0')); setRate(qn(u, 'r', 0)); }, []);
  useEffect(() => { updateURL({ a, b, k: brk, rd: round, r: rate || undefined }); }, [a, b, brk, round, rate]);
  const ia = parseClock(a), ib = parseClock(b);
  const r = useMemo(() => shiftMinutes(ia, ib, brk, +round), [ia, ib, brk, round]);
  const exact = ia !== null && ib !== null ? Math.max(0, span(ia, ib) - brk) : 0;
  const diff = r.minutes - exact;
  const p = idPrefix;
  return (
    <Card form={<>
      <TimeInput id={`${p}-a`} label={io ? 'Clock in' : 'Start time'} value={a} onChange={setA} invalid={a.trim() !== '' && ia === null} />
      <TimeInput id={`${p}-b`} label={io ? 'Clock out' : 'End time'} value={b} onChange={setB} invalid={b.trim() !== '' && ib === null} />
      <NumberField id={`${p}-k`} label="Unpaid break" value={brk} onChange={setBrk} unit="min" max={600} help="Meal period of 30 minutes or more (29 CFR 785.19)" />
      <SelectField id={`${p}-rd`} label="Round each punch to" value={round} onChange={setRound} options={[{ value: '0', label: 'Exact minute' }, { value: '5', label: 'Nearest 5 minutes' }, { value: '6', label: 'Nearest tenth (6 min)' }, { value: '15', label: 'Nearest quarter hour' }]} help={io ? '7 minutes round down, 8 round up on the quarter' : 'Leave on exact unless your employer rounds'} />
      <NumberField id={`${p}-r`} label="Hourly rate (optional)" value={rate} onChange={setRate} unit="$/h" max={1000} decimals={2} />
    </>}>
      <Result label={io ? 'Paid time after rounding' : 'Hours worked'} figure={hmd(r.minutes)} sub={<>{num(r.minutes / 60, 2)} decimal hours{r.overnight ? ' · ends the next day' : ''}</>}>
        <Rows rows={[
          [io ? 'Clock in, as punched → counted' : 'Start', ia === null ? '·' : `${to12h(ia)} → ${to12h(r.inR ?? ia)}`],
          [io ? 'Clock out, as punched → counted' : 'End', ib === null ? '·' : `${to12h(ib)} → ${to12h(r.outR ?? ib)}`],
          ['Same times on the 24-hour clock', ia === null || ib === null ? '·' : `${to24h(r.inR ?? ia)} to ${to24h(r.outR ?? ib)}`],
          ['Time at work before the break', hmd(r.gross)],
          ['Exact minutes worked (no rounding)', hmd(exact)],
          ...(+round ? [['Rounding gained or lost', `${diff > 0 ? '+' : ''}${diff} min`] as [string, string]] : []),
          ...(rate > 0 ? [['Pay for this shift', usd((r.minutes / 60) * rate, 2), true] as [string, string, boolean]] : []),
        ]} />
        <Note methodHref={methodHref}>Rounding is accepted only if it averages out over time and does not shortchange the worker (29 CFR 785.48(b)). A shift that ends at or before its start time is counted into the next day.</Note>
        <Actions />
      </Result>
    </Card>
  );
}
