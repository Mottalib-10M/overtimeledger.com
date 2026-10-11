/** One day with up to three in/out pairs (split shift, unpaid lunch clocked out), with punch rounding. */
import { useEffect, useMemo, useState } from 'react';
import SelectField from '../ui/SelectField';
import NumberField from '../ui/NumberField';
import { parseClock, shiftMinutes, to12h } from '../../lib/engine/time';
import { readParams, num as qn, str, updateURL } from '../../lib/url-state';
import { Shell, Result, Rows, Note, Actions, TimeInput, usd, num, hmd } from './parts';

const DEF = [['7:58', '12:02'], ['12:31', '16:34'], ['', '']];
export default function PunchCalc({ methodHref = '/en/method/', idPrefix = 'pc' }: { methodHref?: string; idPrefix?: string }) {
  const [pairs, setPairs] = useState<string[][]>(DEF);
  const [round, setRound] = useState('0'); const [rate, setRate] = useState(0);
  useEffect(() => { const u = readParams(window.location.search); const d = u.get('d'); if (d) { const x = d.split('_').map((q) => q.split('~')); if (x.length === 3) setPairs(x.map((y) => [y[0] ?? '', y[1] ?? ''])); } setRound(str(u, 'rd', '0')); setRate(qn(u, 'r', 0)); }, []);
  useEffect(() => { updateURL({ d: pairs.map((x) => x.join('~')).join('_'), rd: round, r: rate || undefined }); }, [pairs, round, rate]);
  const set = (i: number, j: number) => (v: string) => setPairs((ps) => ps.map((x, k) => (k === i ? (j === 0 ? [v, x[1]] : [x[0], v]) : x)));
  const res = useMemo(() => pairs.map(([a, b]) => { const ia = parseClock(a), ib = parseClock(b); return { ...shiftMinutes(ia, ib, 0, +round), ia, ib, bad: (a.trim() !== '' && ia === null) || (b.trim() !== '' && ib === null) }; }), [pairs, round]);
  const total = res.reduce((s, r) => s + r.minutes, 0);
  const gaps = res.slice(1).map((r, i) => (res[i].outR != null && r.inR != null && r.minutes > 0 && res[i].minutes > 0 ? r.inR - res[i].outR! : null));
  const p = idPrefix;
  return (
    <Shell left={<>
      <form className="grid gap-x-5 gap-y-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
        {pairs.map((x, i) => [
          <TimeInput key={`a${i}`} id={`${p}-a${i}`} label={`In #${i + 1}`} value={x[0]} onChange={set(i, 0)} placeholder={i === 2 ? 'optional' : '8:00'} invalid={x[0].trim() !== '' && res[i].ia === null} />,
          <TimeInput key={`b${i}`} id={`${p}-b${i}`} label={`Out #${i + 1}`} value={x[1]} onChange={set(i, 1)} placeholder={i === 2 ? 'optional' : '12:00'} invalid={x[1].trim() !== '' && res[i].ib === null} />,
        ])}
        <SelectField id={`${p}-rd`} label="Round each punch to" value={round} onChange={setRound} options={[{ value: '0', label: 'Exact minute' }, { value: '5', label: 'Nearest 5 minutes' }, { value: '6', label: 'Nearest tenth (6 min)' }, { value: '15', label: 'Nearest quarter hour' }]} />
        <NumberField id={`${p}-r`} label="Hourly rate (optional)" value={rate} onChange={setRate} unit="$/h" max={1000} decimals={2} />
      </form>
      </>}>
      <Result label="Time on the clock today" figure={hmd(total)} sub={<>{num(total / 60, 2)} decimal hours</>}>
        <Rows rows={[
          ...res.map((r, i) => [`Pair ${i + 1}`, r.minutes > 0 ? `${to12h(r.inR!)} to ${to12h(r.outR!)} = ${hmd(r.minutes)}` : '·'] as [string, string]),
          ...gaps.map((g, i) => [`Off the clock between pair ${i + 1} and ${i + 2}`, g === null ? '·' : `${g < 0 ? g + 1440 : g} min`] as [string, string]),
          ...(rate > 0 ? [['Pay for the day', usd((total / 60) * rate, 2), true] as [string, string, boolean]] : []),
        ]} />
        <Note methodHref={methodHref}>Clocked-out time is unpaid only when you are fully relieved of duty for a bona fide meal period, ordinarily 30 minutes or more (29 CFR 785.19); breaks of 5 to 20 minutes count as hours worked.</Note>
        <Actions />
      </Result>
    </Shell>
  );
}
