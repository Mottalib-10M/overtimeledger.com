/** PTO balance and value; accrual per pay period or per hour worked; California paid sick leave (1 h per 30). */
import { useEffect, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import { accrualPerPeriod, accruedPerHours, projectBalance, ptoValue } from '../../lib/engine/pto';
import { readParams, num as qn, str, updateURL } from '../../lib/url-state';
import { Card, Result, Rows, Note, Actions, usd, num } from './parts';

type Mode = 'pto' | 'pto-accrual' | 'ca-sick';
const PER: Record<string, number> = { weekly: 52, biweekly: 26, semimonthly: 24, monthly: 12 };
interface Props { mode?: Mode; caSick?: { accrueOneHourPer: number; useAtLeastHours: number; accrualCapHours: number }; methodHref?: string; idPrefix?: string }
export default function PtoCalc({ mode = 'pto', caSick = { accrueOneHourPer: 30, useAtLeastHours: 40, accrualCapHours: 80 }, methodHref = '/en/method/', idPrefix = 'pt' }: Props) {
  const D = mode === 'pto' ? [40, 4.62, 12, 16, 25] : mode === 'pto-accrual' ? [15, 8, 0, 120, 0] : [1040, 0, 0, 0, 0];
  const [a, setA] = useState(D[0]); const [b, setB] = useState(D[1]); const [c, setC] = useState(D[2]); const [d, setD] = useState(D[3]); const [e, setE] = useState(D[4]);
  const [freq, setFreq] = useState('biweekly');
  useEffect(() => { const u = readParams(window.location.search); setA(qn(u, 'a', D[0])); setB(qn(u, 'b', D[1])); setC(qn(u, 'c', D[2])); setD(qn(u, 'd', D[3])); setE(qn(u, 'e', D[4])); const f = str(u, 'f', 'biweekly'); if (PER[f]) setFreq(f); }, []);
  useEffect(() => { updateURL({ a, b, c, d, e, f: mode === 'ca-sick' ? undefined : freq }); }, [a, b, c, d, e, freq]);
  const p = idPrefix;
  const freqSel = <SelectField id={`${p}-f`} label="Pay frequency" value={freq} onChange={setFreq} options={[{ value: 'weekly', label: 'Weekly (52)' }, { value: 'biweekly', label: 'Biweekly (26)' }, { value: 'semimonthly', label: 'Semimonthly (24)' }, { value: 'monthly', label: 'Monthly (12)' }]} />;
  if (mode === 'pto') {
    const r = projectBalance({ start: a, perPeriod: b, periods: c, cap: null });
    const after = Math.max(0, r.balance - d);
    return (
      <Card form={<>
        <NumberField id={`${p}-a`} label="PTO balance today" value={a} onChange={setA} unit="h" max={10000} decimals={2} />
        <NumberField id={`${p}-b`} label="Hours earned each paycheck" value={b} onChange={setB} unit="h" max={200} decimals={2} help="Shown on most pay stubs" />
        <NumberField id={`${p}-c`} label="Paychecks until your time off" value={c} onChange={setC} unit="" max={60} />
        <NumberField id={`${p}-d`} label="Hours you plan to take" value={d} onChange={setD} unit="h" max={10000} decimals={2} />
        <NumberField id={`${p}-e`} label="Hourly rate (optional)" value={e} onChange={setE} unit="$/h" max={1000} decimals={2} />
        {freqSel}
      </>}>
        <Result label="Balance on the day you leave" figure={`${num(r.balance, 2)} h`} sub={<>{num(r.balance / 8, 1)} eight-hour days · {num(after, 2)} h left after the trip</>}>
          <Rows rows={[['Earned before the trip', `${num(b * c, 2)} h`], ['Yearly accrual at this rate', `${num(b * PER[freq], 1)} h`], ['Enough for the plan?', r.balance >= d ? 'yes' : `short by ${num(d - r.balance, 2)} h`], ...(e > 0 ? [['Cash value of the balance', usd(ptoValue(r.balance, e), 2), true] as [string, string, boolean]] : [])]} />
          <Note methodHref={methodHref}>No federal law requires paid vacation; the accrual rate, any cap and payout at the end of a job come from your employer’s written policy and your state.</Note>
          <Actions />
        </Result>
      </Card>
    );
  }
  if (mode === 'pto-accrual') {
    const yearly = a * b; const per = accrualPerPeriod(yearly, PER[freq]);
    const r = projectBalance({ start: c, perPeriod: per, periods: PER[freq], cap: d > 0 ? d : null });
    return (
      <Card form={<>
        <NumberField id={`${p}-a`} label="PTO days per year" value={a} onChange={setA} unit="days" max={365} decimals={1} />
        <NumberField id={`${p}-b`} label="Hours in a workday" value={b} onChange={setB} unit="h" max={24} decimals={1} />
        {freqSel}
        <NumberField id={`${p}-c`} label="Balance now" value={c} onChange={setC} unit="h" max={10000} decimals={2} />
        <NumberField id={`${p}-d`} label="Cap on the balance (0 = none)" value={d} onChange={setD} unit="h" max={10000} />
      </>}>
        <Result label="Hours earned each paycheck" figure={`${num(per, 2)} h`} sub={<>{num(yearly, 1)} hours a year · {num(yearly / 2080, 4)} h per hour worked on 2,080 hours</>}>
          <Rows rows={[['Balance after one year', `${num(r.balance, 2)} h`], ['Cap reached at paycheck', r.capAt === null ? 'not reached' : `#${r.capAt}`], ['Hours not earned because of the cap', `${num(r.notAccrued, 2)} h`]]} />
          <Note methodHref={methodHref}>A cap stops accrual until hours are used; it does not take away hours already earned.</Note>
          <Actions />
        </Result>
      </Card>
    );
  }
  const acc = accruedPerHours(a, caSick.accrueOneHourPer); const kept = Math.min(acc + b, caSick.accrualCapHours);
  return (
    <Card form={<>
      <NumberField id={`${p}-a`} label="Hours worked so far" value={a} onChange={setA} unit="h" max={100000} decimals={1} help="Overtime hours count" />
      <NumberField id={`${p}-b`} label="Unused sick hours carried over" value={b} onChange={setB} unit="h" max={1000} decimals={2} />
    </>}>
      <Result label="Sick leave accrued" figure={`${num(acc, 2)} h`} sub={<>1 hour for every {caSick.accrueOneHourPer} hours worked</>}>
        <Rows rows={[['Balance with carryover, before any cap', `${num(acc + b, 2)} h`], [`Balance if the employer caps accrual at ${caSick.accrualCapHours} h`, `${num(kept, 2)} h`], ['Use the employer must allow each year', `at least ${caSick.useAtLeastHours} h or 5 days`], ['Hours of work to earn 40 h', num(40 * caSick.accrueOneHourPer)]]} />
        <Note methodHref={methodHref}>California Labor Commissioner rules since January 1, 2024. Employers may front-load the year instead; local ordinances can give more.</Note>
        <Actions />
      </Result>
    </Card>
  );
}
