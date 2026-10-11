/** Add and subtract durations in hours, minutes and seconds. */
import { useEffect, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import { sumDurations, splitSeconds } from '../../lib/engine/time';
import { readParams, str, updateURL } from '../../lib/url-state';
import { Shell, Result, Rows, Note, Actions, num } from './parts';

type L = { h: number; m: number; s: number; sign: 1 | -1 };
const DEF: L[] = [{ h: 7, m: 45, s: 0, sign: 1 }, { h: 8, m: 20, s: 0, sign: 1 }, { h: 0, m: 30, s: 0, sign: -1 }, { h: 0, m: 0, s: 0, sign: 1 }];
export default function TimeSumCalc({ methodHref = '/en/method/', idPrefix = 'ts' }: { methodHref?: string; idPrefix?: string }) {
  const [lines, setLines] = useState<L[]>(DEF);
  useEffect(() => { const d = str(readParams(window.location.search), 'd', ''); if (d) { const x = d.split('_').map((q) => { const [sg, h, m, s] = q.split('~').map(Number); return { sign: (sg < 0 ? -1 : 1) as 1 | -1, h: h || 0, m: m || 0, s: s || 0 }; }); if (x.length === 4) setLines(x); } }, []);
  useEffect(() => { updateURL({ d: lines.map((l) => `${l.sign}~${l.h}~${l.m}~${l.s}`).join('_') }); }, [lines]);
  const set = (i: number, k: keyof L) => (v: number | string) => setLines((ls) => ls.map((l, j) => (j === i ? { ...l, [k]: k === 'sign' ? (Number(v) < 0 ? -1 : 1) : Number(v) } : l)));
  const t = splitSeconds(sumDurations(lines));
  const p = idPrefix;
  return (
    <Shell left={<>
      <form onSubmit={(e) => e.preventDefault()}>
        {lines.map((l, i) => (
          <div key={i} className="mb-3 grid grid-cols-2 gap-x-3 gap-y-2 sm:grid-cols-4">
            <SelectField id={`${p}-g${i}`} label={`Line ${i + 1}`} value={String(l.sign)} onChange={set(i, 'sign')} options={[{ value: '1', label: 'Add +' }, { value: '-1', label: 'Subtract −' }]} />
            <NumberField id={`${p}-h${i}`} label="Hours" value={l.h} onChange={set(i, 'h')} unit="h" max={100000} />
            <NumberField id={`${p}-m${i}`} label="Minutes" value={l.m} onChange={set(i, 'm')} unit="min" max={100000} />
            <NumberField id={`${p}-s${i}`} label="Seconds" value={l.s} onChange={set(i, 's')} unit="s" max={100000} />
          </div>
        ))}
      </form>
      </>}>
      <Result label="Total" figure={`${t.neg ? '−' : ''}${t.h}:${String(t.m).padStart(2, '0')}:${String(t.s).padStart(2, '0')}`} sub={<>{t.neg ? '−' : ''}{t.h} h {t.m} min {t.s} s</>}>
        <Rows rows={[['Decimal hours', `${num(t.decimal, 4)} h`], ['Total minutes', `${num(t.decimal * 60, 2)} min`], ['Total seconds', num(t.decimal * 3600)]]} />
        <Note methodHref={methodHref}>Minutes and seconds above 59 carry over: 90 minutes count as 1:30:00.</Note>
        <Actions />
      </Result>
    </Shell>
  );
}
