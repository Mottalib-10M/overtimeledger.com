/** Salary and hourly conversions, the freelancer's rate, and pay per biweekly check. */
import { useEffect, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import { salaryToHourly, salaryToHourlyOpm, hourlyToAnnual, freelanceRate, PERIODS } from '../../lib/engine/pay';
import { readParams, num as qn, str, updateURL } from '../../lib/url-state';
import { Card, Result, Rows, Note, Actions, usd, num } from './parts';

type Mode = 'salary-to-hourly' | 'hourly-to-salary' | 'hourly-rate' | 'biweekly-pay';
const D: Record<Mode, [number, number, number, number]> = { 'salary-to-hourly': [60000, 40, 52, 0], 'hourly-to-salary': [22, 40, 52, 0], 'hourly-rate': [70000, 9000, 25, 6], 'biweekly-pay': [25, 80, 0, 26] };
export default function PayCalc({ mode = 'salary-to-hourly', divisor = 2087, threshold = 684, methodHref = '/en/method/', idPrefix = 'py' }: { mode?: Mode; divisor?: number; threshold?: number; methodHref?: string; idPrefix?: string }) {
  const d = D[mode];
  const [a, setA] = useState(d[0]); const [b, setB] = useState(d[1]); const [c, setC] = useState(d[2]); const [e, setE] = useState(d[3]);
  const [periods, setPeriods] = useState('26');
  useEffect(() => { const u = readParams(window.location.search); setA(qn(u, 'a', d[0])); setB(qn(u, 'b', d[1])); setC(qn(u, 'c', d[2])); setE(qn(u, 'e', d[3])); setPeriods(str(u, 'n', '26') === '27' ? '27' : '26'); }, []);
  useEffect(() => { updateURL({ a, b, c, e, n: mode === 'biweekly-pay' ? periods : undefined }); }, [a, b, c, e, periods]);
  const p = idPrefix;
  if (mode === 'salary-to-hourly') {
    const h = salaryToHourly(a, b, c);
    return (
      <Card form={<>
        <NumberField id={`${p}-a`} label="Annual salary" value={a} onChange={setA} unit="$" max={10000000} />
        <NumberField id={`${p}-b`} label="Hours per week" value={b} onChange={setB} unit="h" max={168} decimals={1} />
        <NumberField id={`${p}-c`} label="Paid weeks per year" value={c} onChange={setC} unit="wk" max={53} />
      </>}>
        <Result label="Hourly rate" figure={usd(h, 2)} sub={<>{num(b * c)} paid hours a year</>}>
          <Rows rows={[['Federal method (÷ 2,087 hours)', usd(salaryToHourlyOpm(a, divisor), 2)], ['Weekly', usd(a / 52, 2)], ['Biweekly (26 checks)', usd(a / PERIODS.biweekly, 2)], ['Semimonthly (24 checks)', usd(a / PERIODS.semimonthly, 2)], ['Monthly', usd(a / 12, 2)], ['Weekly salary vs exempt level ' + usd(threshold), a / 52 >= threshold ? 'at or above' : 'below']]} />
          <Note methodHref={methodHref}>Federal agencies divide annual basic pay by 2,087 hours (5 U.S.C. 5504(b)). Being paid a salary does not by itself make a job exempt from overtime.</Note>
          <Actions />
        </Result>
      </Card>
    );
  }
  if (mode === 'hourly-to-salary') {
    const y = hourlyToAnnual(a, b, c);
    return (
      <Card form={<>
        <NumberField id={`${p}-a`} label="Hourly rate" value={a} onChange={setA} unit="$/h" max={10000} decimals={2} />
        <NumberField id={`${p}-b`} label="Hours per week" value={b} onChange={setB} unit="h" max={168} decimals={1} />
        <NumberField id={`${p}-c`} label="Paid weeks per year" value={c} onChange={setC} unit="wk" max={53} help="52 with paid vacation; 50 with two unpaid weeks" />
      </>}>
        <Result label="Yearly pay at straight time" figure={usd(y)} sub={<>{num(b * c)} hours × {usd(a, 2)}</>}>
          <Rows rows={[['Monthly (yearly ÷ 12)', usd(y / 12)], ['Biweekly check', usd(y / 26)], ['Weekly', usd(a * b, 2)], ['Daily (5-day week)', usd((a * b) / 5, 2)], ...(b > 40 ? [['Overtime premium owed past 40 h, per year', usd(a * 0.5 * (b - 40) * c)] as [string, string]] : [])]} />
          <Note methodHref={methodHref}>Gross pay before taxes. Hours past 40 a week are paid at 1.5x under the FLSA, so a 45-hour week earns more than 45 × the rate.</Note>
          <Actions />
        </Result>
      </Card>
    );
  }
  if (mode === 'hourly-rate') {
    const f = freelanceRate(a, b, c, e);
    return (
      <Card form={<>
        <NumberField id={`${p}-a`} label="Income you want before tax" value={a} onChange={setA} unit="$/yr" max={10000000} />
        <NumberField id={`${p}-b`} label="Business costs per year" value={b} onChange={setB} unit="$/yr" max={10000000} help="Software, insurance, equipment, health cover" />
        <NumberField id={`${p}-c`} label="Billable hours per week" value={c} onChange={setC} unit="h" max={100} decimals={1} />
        <NumberField id={`${p}-e`} label="Weeks off per year" value={e} onChange={setE} unit="wk" max={52} help="Vacation, holidays, sick days, slow weeks" />
      </>}>
        <Result label="Hourly rate to charge" figure={usd(f.rate, 2)} sub={<>{num(f.billable)} billable hours over {f.weeks} weeks</>}>
          <Rows rows={[['Revenue needed', usd(a + b)], ['Day rate (8 billable hours)', usd(f.rate * 8)], ['Same income as an employee at', `${usd(a / 2080, 2)}/h over 2,080 h`]]} />
          <Note methodHref={methodHref}>Self-employed people also pay both halves of Social Security and Medicare; put an estimate of that tax in the income figure if you want it covered.</Note>
          <Actions />
        </Result>
      </Card>
    );
  }
  const gross = a * b; const n = +periods;
  return (
    <Card form={<>
      <NumberField id={`${p}-a`} label="Hourly rate" value={a} onChange={setA} unit="$/h" max={10000} decimals={2} />
      <NumberField id={`${p}-b`} label="Hours in the two weeks" value={b} onChange={setB} unit="h" max={336} decimals={2} help="Regular hours; overtime is counted week by week" />
      <NumberField id={`${p}-c`} label="Overtime hours in the two weeks" value={c} onChange={setC} unit="h" max={200} decimals={2} />
      <SelectField id={`${p}-n`} label="Paychecks this year" value={periods} onChange={setPeriods} options={[{ value: '26', label: '26 biweekly paydays' }, { value: '27', label: '27 biweekly paydays' }]} />
    </>}>
      <Result label="Gross biweekly paycheck" figure={usd(gross + c * a * 1.5, 2)} sub={<>before taxes and deductions</>}>
        <Rows rows={[['Regular pay', usd(gross, 2)], ['Overtime at 1.5x', usd(c * a * 1.5, 2)], [`Year at this check × ${n}`, usd((gross + c * a * 1.5) * n)], ['Monthly average', usd(((gross + c * a * 1.5) * n) / 12)]]} />
        <Note methodHref={methodHref}>Overtime is owed per workweek: 50 hours then 30 hours is 10 overtime hours, not zero, even though the two weeks total 80.</Note>
        <Actions />
      </Result>
    </Card>
  );
}
