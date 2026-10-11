/** Duration between two date-times (across midnight, days or months). Dates: build day first, today after mount. */
import { useEffect, useState } from 'react';
import { parseClock, to12h } from '../../lib/engine/time';
import { daysBetween, isValidISO } from '../../lib/engine/calendar';
import { readParams, str, updateURL } from '../../lib/url-state';
import { Card, Result, Rows, Note, Actions, TimeInput, DateInput, num } from './parts';

declare const __BUILD_DAY__: string;
export default function DurationCalc({ methodHref = '/en/method/', idPrefix = 'du' }: { methodHref?: string; idPrefix?: string }) {
  const [d1, setD1] = useState(__BUILD_DAY__); const [t1, setT1] = useState('22:00');
  const [d2, setD2] = useState(__BUILD_DAY__); const [t2, setT2] = useState('6:30');
  const [next, setNext] = useState(true);
  useEffect(() => { const u = readParams(window.location.search); const today = new Date().toISOString().slice(0, 10); const a = str(u, 'd1', today); const b = str(u, 'd2', ''); setD1(a); setT1(str(u, 't1', '22:00')); setT2(str(u, 't2', '6:30')); if (b) { setD2(b); setNext(false); } else setD2(a); }, []);
  useEffect(() => { updateURL({ d1, t1, d2: next ? undefined : d2, t2 }); }, [d1, t1, d2, t2, next]);
  const a = parseClock(t1), b = parseClock(t2);
  const ok = isValidISO(d1) && isValidISO(d2) && a !== null && b !== null;
  let mins = ok ? daysBetween(d1, d2) * 1440 + (b! - a!) : 0;
  if (ok && next && mins <= 0) mins += 1440;
  const neg = mins < 0; const m = Math.abs(mins);
  const p = idPrefix;
  return (
    <Card form={<>
      <DateInput id={`${p}-d1`} label="Start date" value={d1} onChange={(v) => { setD1(v); if (next) setD2(v); }} />
      <TimeInput id={`${p}-t1`} label="Start time" value={t1} onChange={setT1} invalid={t1.trim() !== '' && a === null} />
      <DateInput id={`${p}-d2`} label="End date" value={d2} onChange={(v) => { setD2(v); setNext(false); }} help={next ? 'Same day, or the next morning if the end time is earlier' : ''} />
      <TimeInput id={`${p}-t2`} label="End time" value={t2} onChange={setT2} invalid={t2.trim() !== '' && b === null} />
    </>}>
      <Result label="Elapsed time" figure={`${neg ? '−' : ''}${Math.floor(m / 60)} h ${m % 60} min`} sub={<>{Math.floor(m / 1440)} days, {Math.floor((m % 1440) / 60)} hours and {m % 60} minutes</>}>
        <Rows rows={[['From', ok ? `${d1}, ${to12h(a!)}` : '·'], ['To', ok ? `${next && daysBetween(d1, d2) === 0 && b! <= a! ? 'next day' : d2}, ${to12h(b!)}` : '·'], ['Decimal hours', `${neg ? '−' : ''}${num(m / 60, 2)} h`], ['Total minutes', num(mins)]]} />
        <Note methodHref={methodHref}>Clock time only: a daylight saving change during the period adds or removes one real hour that this count does not see.</Note>
        <Actions />
      </Result>
    </Card>
  );
}
