/** 12-hour ↔ 24-hour (military) time, with the decimal hour used on time cards. */
import { useEffect, useState } from 'react';
import { parseClock, to12h, to24h, toMilitary } from '../../lib/engine/time';
import { readParams, str, updateURL } from '../../lib/url-state';
import { Card, Result, Rows, Note, Actions, TimeInput, num } from './parts';

const say = (m: number) => { const s = toMilitary(m); const h = s.slice(0, 2), mm = s.slice(2); const n = (x: string) => (x[0] === '0' ? `zero ${+x[1]}` : String(+x)); return mm === '00' ? `${n(h)} hundred hours` : `${n(h)} ${mm[0] === '0' ? `zero ${+mm[1]}` : +mm} hours`; };
export default function MilitaryCalc({ methodHref = '/en/method/', idPrefix = 'mt' }: { methodHref?: string; idPrefix?: string }) {
  const [t, setT] = useState('1:45 PM');
  useEffect(() => { setT(str(readParams(window.location.search), 't', '1:45 PM')); }, []);
  useEffect(() => { updateURL({ t }); }, [t]);
  const m = parseClock(t);
  const p = idPrefix;
  return (
    <Card form={<>
      <TimeInput id={`${p}-t`} label="Time to convert (12-hour or 24-hour)" value={t} onChange={setT} placeholder="1:45 PM or 1345" invalid={t.trim() !== '' && m === null} />
    </>}>
      <Result label="Military time" figure={m === null ? '·' : toMilitary(m)} sub={m === null ? 'Type a time such as 7:30 pm, 1930 or 19:30' : <>{to12h(m)} · {to24h(m)}</>}>
        <Rows rows={[['12-hour clock', m === null ? '·' : to12h(m)], ['24-hour clock', m === null ? '·' : to24h(m)], ['Spoken', m === null ? '·' : say(m)], ['Decimal hour of the day', m === null ? '·' : num(m / 60, 2)]]} />
        <Note methodHref={methodHref}>Without AM or PM, a time is read on the 24-hour clock: 0730 is morning, 1930 is evening. Midnight is 0000 at the start of a day.</Note>
        <Actions />
      </Result>
    </Card>
  );
}
