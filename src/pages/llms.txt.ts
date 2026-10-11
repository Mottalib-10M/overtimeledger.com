/** llms.txt (RECETTE §21), generated at build from the page registry: always in sync with the site. */
import { PAGES } from '../lib/pages';
import { SITE_URL, LAST_UPDATED, SITE_NAMES } from '../data/site-config';
import { route } from '../i18n/routes';
import { GROUPS } from '../i18n/nav';
export function GET() {
  const lines = [
    `# ${SITE_NAMES.en}`,
    '',
    `> Free U.S. time card, hours and pay calculators. The weekly time card subtracts unpaid breaks, rounds punches to 5, 6 or 15 minutes (29 CFR 785.48) and splits regular, overtime and double-time hours under the federal FLSA rule (40 hours a week) or the daily rules of California (Labor Code 510: 8 and 12 hours, seventh day), Alaska (8 hours a day), Nevada (8 hours a day below 1.5 times the $12.00 minimum wage) and Colorado (COMPS Order #40: 12 hours a day). Also: hours between times, military time, decimal hours, salary to hourly (2,080 and OPM 2,087 hours), biweekly pay schedule and pay periods for 2026, working and business days with the 11 OPM federal holidays, PTO and California sick leave accrual. Calculations run in the browser. Estimates of hours and gross pay, not legal advice. Published by Radif Partners. Last updated ${LAST_UPDATED}.`,
    '',
    `- [Time card calculator](${SITE_URL}${route('home', 'en')}): weekly time card with breaks, rounding, state overtime and gross pay`,
    '',
    ...GROUPS.flatMap((g) => [`## ${g.label}`, ...PAGES.filter((p) => p.group === g.id).map((p) => `- [${p.nav}](${SITE_URL}${route(p.id, 'en')}): ${p.card}`), '']),
    '## About',
    `- [How the hours are counted](${SITE_URL}${route('method', 'en')})`,
    `- [About](${SITE_URL}${route('about', 'en')})`,
  ];
  return new Response(lines.join('\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
