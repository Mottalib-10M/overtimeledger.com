/**
 * Weekly time card (one or two workweeks): in, out and unpaid break for each day, punch rounding allowed by
 * 29 CFR 785.48(b), overtime under the federal rule or a daily-overtime state, gross pay, print, share link.
 * First render = build defaults; the shared link is applied after mount (RECETTE §17.5).
 */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import { parseClock, shiftMinutes, to12h } from '../../lib/engine/time';
import { splitWeek, grossPay, type StateRule } from '../../lib/engine/overtime';
import { readParams, num as qn, str, updateURL } from '../../lib/url-state';
import { Result, Rows, Note, Actions, SplitBar, SPLIT_COLORS, usd, num, hmd, type Opt } from './parts';

interface Row { i: string; o: string; b: string }
interface Props { rules: Record<string, StateRule>; options: Opt[]; state?: string; lock?: boolean; weeks?: 1 | 2; methodHref?: string; idPrefix?: string }
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const blank = (n: number, start: number): Row[] => Array.from({ length: n }, (_, k) => {
  const wd = (start + k) % 7;
  return wd === 0 || wd === 6 ? { i: '', o: '', b: '' } : { i: '8:00', o: '17:00', b: '30' };
});
const enc = (rows: Row[]) => rows.map((r) => `${r.i}~${r.o}~${r.b}`).join('_');
const dec = (s: string, n: number, start: number): Row[] => {
  const parts = s.split('_');
  if (parts.length !== n) return blank(n, start);
  return parts.map((p) => { const [i = '', o = '', b = ''] = p.split('~'); return { i, o, b }; });
};

export default function TimeCard({ rules, options, state = 'federal', lock = false, weeks = 1, methodHref = '/en/method/', idPrefix = 'tc' }: Props) {
  const n = 7 * weeks;
  const [st, setSt] = useState(state);
  const [rate, setRate] = useState(20);
  const [round, setRound] = useState('0');
  const [start, setStart] = useState('1');
  const [rows, setRows] = useState<Row[]>(() => blank(n, 1));
  useEffect(() => {
    const u = readParams(window.location.search);
    const s0 = str(u, 'ws', '1') === '0' ? '0' : '1';
    if (!lock && rules[str(u, 's', state)]) setSt(str(u, 's', state));
    setRate(qn(u, 'r', 20)); setRound(['0', '5', '6', '15'].includes(str(u, 'rd', '0')) ? str(u, 'rd', '0') : '0'); setStart(s0);
    const d = u.get('d'); if (d) setRows(dec(d, n, +s0));
  }, []);
  useEffect(() => { updateURL({ s: lock ? undefined : st, r: rate, rd: round, ws: start, d: enc(rows) }); }, [st, rate, round, start, rows]);
  const set = (k: number, f: keyof Row) => (v: string) => setRows((rs) => rs.map((r, j) => (j === k ? { ...r, [f]: v } : r)));
  const inc = +round;
  const calc = useMemo(() => {
    const shifts = rows.map((r) => {
      const i = parseClock(r.i), o = parseClock(r.o);
      const b = Math.max(0, parseInt(r.b || '0', 10) || 0);
      const sh = shiftMinutes(i, o, b, inc);
      return { ...sh, badIn: r.i.trim() !== '' && i === null, badOut: r.o.trim() !== '' && o === null, b };
    });
    const rule = rules[st];
    const wk = Array.from({ length: weeks }, (_, w) => splitWeek(shifts.slice(w * 7, w * 7 + 7).map((s) => s.minutes / 60), rule, rate));
    const tot = wk.reduce((a, w) => ({ reg: a.reg + w.reg, ot: a.ot + w.ot, dt: a.dt + w.dt, total: a.total + w.total }), { reg: 0, ot: 0, dt: 0, total: 0 });
    return { shifts, wk, tot, pay: grossPay(tot, rate), rule };
  }, [rows, inc, st, rate, weeks, rules]);
  const p = idPrefix;
  const dayName = (k: number) => DAYS[(+start + k) % 7];
  const minutes = Math.round(calc.tot.total * 60);
  return (
    <div className="rechner rounded-xl border border-navy-200 bg-white p-4 sm:p-6">
      <form className="grid gap-x-5 gap-y-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
        {lock
          ? <div className="grid grid-rows-subgrid row-span-3 content-start gap-y-0"><span className="mb-1 block text-sm font-medium text-navy-700">Overtime rule</span><p className="flex h-12 items-center rounded-lg border border-navy-200 bg-navy-50 px-4 font-semibold text-navy-900">{rules[st].name}</p><span className="mt-1 text-xs text-navy-500">Fixed on this page</span></div>
          : <SelectField id={`${p}-st`} label="State where you work" value={st} onChange={setSt} options={options} help="Sets the daily and weekly overtime thresholds" />}
        <NumberField id={`${p}-rate`} label="Hourly rate" value={rate} onChange={setRate} unit="$/h" max={1000} decimals={2} help="Leave as is to count hours only" />
        <SelectField id={`${p}-rd`} label="Round each punch to" value={round} onChange={setRound} options={[{ value: '0', label: 'Exact minute (no rounding)' }, { value: '5', label: 'Nearest 5 minutes' }, { value: '6', label: 'Nearest tenth of an hour (6 min)' }, { value: '15', label: 'Nearest quarter hour (15 min)' }]} help="29 CFR 785.48 allows 5, 6 or 15 minutes" />
        <SelectField id={`${p}-ws`} label="Workweek starts on" value={start} onChange={setStart} options={[{ value: '1', label: 'Monday' }, { value: '0', label: 'Sunday' }]} help="Your employer’s fixed 7-day workweek" />
      </form>
      <div className="mt-6">
        <div className="grid grid-cols-[3rem_minmax(0,1fr)_minmax(0,1fr)_4.5rem] items-end gap-2 text-xs font-medium text-navy-600 sm:grid-cols-[4rem_minmax(0,1fr)_minmax(0,1fr)_6rem]" aria-hidden="true">
          <span>Day</span><span>Time in</span><span>Time out</span><span>Unpaid break (min)</span>
        </div>
        {rows.map((r, k) => (
          <div key={k} className={`mt-2 grid grid-cols-[3rem_minmax(0,1fr)_minmax(0,1fr)_4.5rem] items-center gap-2 sm:grid-cols-[4rem_minmax(0,1fr)_minmax(0,1fr)_6rem] ${weeks === 2 && k === 7 ? 'border-t border-navy-200 pt-3' : ''}`}>
            <span className="text-sm font-semibold text-navy-800">{dayName(k)}{weeks === 2 && <span className="block text-[11px] font-normal text-navy-500">wk {k < 7 ? 1 : 2}</span>}</span>
            <input aria-label={`${dayName(k)} time in`} id={`${p}-i${k}`} type="text" autoComplete="off" value={r.i} placeholder="—" onChange={(e) => set(k, 'i')(e.target.value)} aria-invalid={calc.shifts[k].badIn || undefined} className={`tabular-nums h-12 w-full min-w-0 rounded-lg border bg-white px-2 text-base text-navy-900 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20 sm:px-3 sm:text-lg ${calc.shifts[k].badIn ? 'border-amber-600' : 'border-navy-300'}`} />
            <input aria-label={`${dayName(k)} time out`} id={`${p}-o${k}`} type="text" autoComplete="off" value={r.o} placeholder="—" onChange={(e) => set(k, 'o')(e.target.value)} aria-invalid={calc.shifts[k].badOut || undefined} className={`tabular-nums h-12 w-full min-w-0 rounded-lg border bg-white px-2 text-base text-navy-900 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20 sm:px-3 sm:text-lg ${calc.shifts[k].badOut ? 'border-amber-600' : 'border-navy-300'}`} />
            <input aria-label={`${dayName(k)} unpaid break in minutes`} id={`${p}-b${k}`} type="text" inputMode="numeric" autoComplete="off" value={r.b} placeholder="0" onChange={(e) => set(k, 'b')(e.target.value.replace(/[^0-9]/g, ''))} className="tabular-nums h-12 w-full min-w-0 rounded-lg border border-navy-300 bg-white px-2 text-right text-base text-navy-900 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20 sm:px-3 sm:text-lg" />
          </div>
        ))}
        <p className="mt-2 text-xs text-navy-600">Type 8, 830, 8:30, 2:15pm or 14:15. An out time earlier than the in time is read as the next morning (night shift). Paid rest breaks of 5 to 20 minutes are not deducted.</p>
      </div>
      <Result label={weeks === 2 ? 'Hours worked in the two weeks' : 'Hours worked this week'} figure={`${hmd(minutes)}`} sub={<>{num(calc.tot.total, 2)} decimal hours{rate > 0 ? <> · gross pay {usd(calc.pay.total, 2)}</> : null}</>}>
        <SplitBar parts={[{ label: 'Regular', value: calc.tot.reg, color: SPLIT_COLORS.reg }, { label: 'Overtime 1.5x', value: calc.tot.ot, color: SPLIT_COLORS.ot }, { label: 'Double time 2x', value: calc.tot.dt, color: SPLIT_COLORS.dt }]} />
        <Rows rows={[
          ['Regular hours', `${num(calc.tot.reg, 2)} h`],
          ['Overtime at 1.5x', `${num(calc.tot.ot, 2)} h`],
          ...(calc.tot.dt > 0 || calc.rule.dailyDtAfter ? [['Double time at 2x', `${num(calc.tot.dt, 2)} h`] as [string, string]] : []),
          ...(rate > 0 ? [['Regular pay', usd(calc.pay.reg, 2)], ['Overtime pay', usd(calc.pay.ot + calc.pay.dt, 2)], ['Gross pay before taxes', usd(calc.pay.total, 2), true]] as Array<[string, string] | [string, string, boolean]> : []),
        ]} />
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[30rem] text-sm">
            <thead><tr className="border-b border-navy-300 text-left text-xs uppercase tracking-wide text-navy-600"><th scope="col" className="py-1.5 pr-2">Day</th><th scope="col" className="py-1.5 pr-2">Counted shift</th><th scope="col" className="py-1.5 pr-2 text-right">Hours</th><th scope="col" className="py-1.5 pr-2 text-right">Reg</th><th scope="col" className="py-1.5 pr-2 text-right">OT</th><th scope="col" className="py-1.5 text-right">DT</th></tr></thead>
            <tbody className="divide-y divide-navy-200">
              {calc.shifts.map((s, k) => { const d = calc.wk[Math.floor(k / 7)].days[k % 7]; return (
                <tr key={k}><td className="py-1.5 pr-2 text-navy-800">{dayName(k)}</td><td className="py-1.5 pr-2 text-navy-700">{s.minutes > 0 && s.inR !== null && s.outR !== null ? `${to12h(s.inR)} to ${to12h(s.outR)}${s.overnight ? ' (+1 day)' : ''}${s.b ? `, ${s.b} min off` : ''}` : '·'}</td><td className="tabular-nums py-1.5 pr-2 text-right text-navy-900">{hmd(s.minutes)}</td><td className="tabular-nums py-1.5 pr-2 text-right">{num(d.reg, 2)}</td><td className="tabular-nums py-1.5 pr-2 text-right">{num(d.ot, 2)}</td><td className="tabular-nums py-1.5 text-right">{num(d.dt, 2)}</td></tr>
              ); })}
            </tbody>
          </table>
        </div>
        <Note methodHref={methodHref}>{calc.wk.map((w) => w.note).filter((x, i, a) => a.indexOf(x) === i).join(' ')}{calc.wk.some((w) => w.seventhDayApplied) ? ' Seven consecutive days worked: the seventh day is paid at overtime rates.' : ''}</Note>
        <Actions />
      </Result>
    </div>
  );
}
