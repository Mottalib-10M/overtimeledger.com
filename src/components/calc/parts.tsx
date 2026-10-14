/** Shared pieces of the calculators: card, result box, ledger rows, actions, time input. */
import { useEffect, useRef, useState, type ReactNode } from 'react';
import SelectField from '../ui/SelectField';
import { formatMoney, formatNumber } from '../../lib/format';

export const usd = (n: number, d = 0) => formatMoney(Number.isFinite(n) ? n : 0, d);
export const num = (n: number, d = 0) => formatNumber(Number.isFinite(n) ? n : 0, d);
export interface Opt { value: string; label: string }

/**
 * Frame of every calculator (RECETTE §5, rule of 2026-10-11: the calculator is seen without scrolling).
 * From 1024 px: the fields on the left, the result beside them on the right, both in the first screen.
 */
export function Shell({ left, children }: { left: ReactNode; children: ReactNode }) {
  return (
    <div className="rechner rounded-xl border border-navy-200 bg-white p-4 sm:p-6 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:items-start lg:gap-x-8">
      <div className="min-w-0">{left}</div>
      <div className="min-w-0 lg:sticky lg:top-20">{children}</div>
    </div>
  );
}

export function Card({ children, form }: { children: ReactNode; form: ReactNode }) {
  return (
    <Shell left={<form className="grid content-start gap-x-5 gap-y-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>{form}</form>}>{children}</Shell>
  );
}

export function StatePick({ id, value, onChange, states, lock, label = 'State', help }: { id: string; value: string; onChange: (v: string) => void; states: Opt[]; lock?: boolean; label?: string; help?: string }) {
  const name = states.find((s) => s.value === value)?.label ?? value;
  if (lock) return (
    <div className="grid grid-rows-subgrid row-span-3 content-start gap-y-0">
      <span className="mb-1 block text-sm font-medium text-navy-700">{label}</span>
      <p className="flex h-12 items-center rounded-lg border border-navy-200 bg-navy-50 px-4 font-semibold text-navy-900">{name}</p>
      {help && <span className="mt-1 text-xs text-navy-500">{help}</span>}
    </div>
  );
  return <SelectField id={id} label={label} value={value} onChange={onChange} options={states} help={help} />;
}

export function Result({ label, figure, sub, children }: { label: string; figure: string; sub?: ReactNode; children?: ReactNode }) {
  // On a phone the result can sit below a long form: while the calculator is on screen and its result
  // is not, a bar pinned to the bottom repeats the key figure (RECETTE §5, rule of 2026-10-11).
  const ref = useRef<HTMLDivElement>(null);
  const [bar, setBar] = useState(false);
  useEffect(() => {
    const box = ref.current; const calc = box?.closest('.rechner');
    if (!box || !calc || typeof IntersectionObserver === 'undefined') return;
    let calcIn = false, boxIn = false;
    const upd = () => setBar(calcIn && !boxIn && window.innerWidth < 1024);
    const io = new IntersectionObserver((es) => { for (const e of es) { if (e.target === box) boxIn = e.isIntersecting; else calcIn = e.isIntersecting; } upd(); });
    io.observe(box); io.observe(calc);
    window.addEventListener('resize', upd);
    return () => { io.disconnect(); window.removeEventListener('resize', upd); };
  }, []);
  return (
    <div ref={ref} data-resultat aria-live="polite" className="mt-6 rounded-xl bg-accent-50 p-4 sm:p-5 lg:mt-0">
      <p className="text-sm font-medium text-navy-700">{label}</p>
      <p className="tabular-nums mt-1 text-4xl font-bold text-navy-900">{figure}</p>
      {sub && <p className="ledger-range mt-1 text-sm">{sub}</p>}
      {children}
      {bar && (
        <div aria-hidden="true" onClick={() => ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })} className="fixed inset-x-0 bottom-0 z-40 flex cursor-pointer items-baseline justify-between gap-3 border-t border-navy-200 bg-white px-4 py-3 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] lg:hidden">
          <span className="truncate text-sm font-medium text-navy-700">{label}</span>
          <span className="tabular-nums shrink-0 text-2xl font-bold text-navy-900">{figure}</span>
        </div>
      )}
    </div>
  );
}

export function Rows({ rows }: { rows: Array<[string, string] | [string, string, boolean]> }) {
  return (
    <table className="mt-4 w-full text-sm"><tbody className="divide-y divide-navy-200">
      {rows.map(([l, v, strong]) => <tr key={l}><td className={`py-1.5 pr-3 ${strong ? 'font-semibold text-navy-900' : 'text-navy-700'}`}>{l}</td><td className={`tabular-nums py-1.5 text-right text-navy-900 ${strong ? 'font-semibold' : ''}`}>{v}</td></tr>)}
    </tbody></table>
  );
}

export function Note({ children, methodHref }: { children: ReactNode; methodHref?: string }) {
  return <p className="mt-3 text-xs text-navy-700">{children}{methodHref && <> <a className="underline" href={methodHref}>How this is calculated</a>.</>}</p>;
}

export function Actions() {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard?.writeText(window.location.href).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500); }); };
  return (
    <div className="mt-3 flex flex-wrap gap-2 text-sm">
      <button type="button" onClick={copy} className="rounded-lg border border-navy-300 bg-white px-3 py-1.5 font-medium text-navy-800 hover:bg-navy-50">{copied ? 'Link copied' : 'Copy share link'}</button>
      <button type="button" onClick={() => window.print()} className="rounded-lg border border-navy-300 bg-white px-3 py-1.5 font-medium text-navy-800 hover:bg-navy-50">Print</button>
    </div>
  );
}

/** Proportional bar of a cost split (materials, labor, the rest). */
export function SplitBar({ parts }: { parts: Array<{ label: string; value: number; color: string }> }) {
  const total = parts.reduce((s, p) => s + p.value, 0);
  if (total <= 0) return null;
  return (
    <div className="mt-4" role="img" aria-label={parts.map((p) => `${p.label} ${Math.round((p.value / total) * 100)} percent`).join(', ')}>
      <div className="flex h-3 overflow-hidden rounded-full">{parts.map((p) => <div key={p.label} style={{ width: `${(p.value / total) * 100}%`, backgroundColor: p.color }} />)}</div>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">{parts.map((p) => <span key={p.label} className="flex items-center gap-1.5 text-xs text-navy-700"><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: p.color }} aria-hidden="true" />{p.label} {Math.round((p.value / total) * 100)}%</span>)}</div>
    </div>
  );
}
export const SPLIT_COLORS = { reg: '#3C3B6E', ot: '#B22234', dt: '#7c2d12' };

/** Hours as h:mm and decimal: 465 min → "7:45 (7.75 h)". */
export const hmd = (minutes: number) => `${Math.floor(Math.round(minutes) / 60)}:${String(Math.round(minutes) % 60).padStart(2, '0')}`;

/**
 * Clock-time field: the typed text is the source of truth and is never rewritten (RECETTE §17.2);
 * the reading of it ("8:55 AM") is shown by the result, not in the field.
 */
export function TimeInput({ id, label, value, onChange, srOnlyLabel = false, placeholder = '8:00', invalid = false }: { id: string; label: string; value: string; onChange: (v: string) => void; srOnlyLabel?: boolean; placeholder?: string; invalid?: boolean }) {
  return (
    <div className={srOnlyLabel ? '' : 'grid grid-rows-subgrid row-span-3 content-start gap-y-0'}>
      <label htmlFor={id} className={srOnlyLabel ? 'sr-only' : 'mb-1 block text-sm font-medium text-navy-700'}>{label}</label>
      <input id={id} type="text" autoComplete="off" spellCheck={false} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} aria-invalid={invalid || undefined}
        className={`tabular-nums h-12 w-full rounded-lg border bg-white px-3 text-lg text-navy-900 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20 ${invalid ? 'border-amber-600' : 'border-navy-300'}`} />
      {!srOnlyLabel && <span className="mt-1 text-xs text-navy-500">{invalid ? 'Not a time: try 8:30, 830 or 2:15pm' : ''}</span>}
    </div>
  );
}
/** Date field (native picker, 48 px). */
export function DateInput({ id, label, value, onChange, help }: { id: string; label: string; value: string; onChange: (v: string) => void; help?: string }) {
  return (
    <div className="grid grid-rows-subgrid row-span-3 content-start gap-y-0">
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-navy-700">{label}</label>
      <input id={id} type="date" value={value} onChange={(e) => onChange(e.target.value)} className="h-12 w-full rounded-lg border border-navy-300 bg-white px-3 text-navy-900 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20" />
      <span className="mt-1 text-xs text-navy-500">{help ?? ''}</span>
    </div>
  );
}
