/**
 * One page = ONE content file (CONTRIBUTING-PAGES.md): `src/content/pages/<id>.ts` (PageDef), with its
 * calculator (`tool`). Routes, menus, footer, sitemap, schemas and internal links read these files alone.
 */
import type { Kit } from './kit';

export interface FAQ { q: string; a: string }

export interface Helpers extends Kit {
  /** Internal link by page id ("overtime-calculator", "method"…). An unknown id fails the page test. */
  a: (id: string, text: string) => string;
  /** Ledger table; numbers are formatted, strings are inserted as HTML. */
  table: (headers: string[], rows: Array<Array<string | number>>, caption?: string, align?: Array<'l' | 'r'>) => string;
  /** Link to a source of params-2026.json (key), with optional text. */
  src: (key: string, text?: string) => string;
  /** Link to any official URL. */
  ext: (url: string, text: string) => string;
  /** Ruled note. */
  box: (title: string, html: string) => string;
  /** Inline mini-simulator: `<!--mini:kind|arg-->`, rendered as an island. */
  mini: (kind: string, arg?: unknown) => string;
}

export type Group = 'clock' | 'overtime' | 'pay' | 'calendar' | 'leave';
export type ToolKind =
  | 'timecard' | 'timesheet' | 'hours' | 'work-hours' | 'time-sum' | 'time-clock' | 'clock-in-out' | 'duration'
  | 'military' | 'hm-decimal' | 'payroll-hours'
  | 'overtime' | 'time-and-a-half' | 'double-time' | 'regular-rate' | 'salaried-ot'
  | 'salary-to-hourly' | 'hourly-to-salary' | 'hourly-rate' | 'biweekly-pay'
  | 'pay-schedule' | 'pay-periods' | 'business-days' | 'working-days' | 'days-between' | 'weeks-between' | 'date-add'
  | 'pto' | 'pto-accrual' | 'ca-sick';
export interface ToolProps { state?: 'federal' | 'california' | 'alaska' | 'nevada' | 'colorado'; lock?: boolean }

export interface PageDef {
  id: string;
  group: Group;
  order: number;
  /** URL segment, lowercase and dashes, no year. */
  slug: string;
  nav: string;
  card: string;
  /** 50 to 60 characters, key term first, 2026 included (RECETTE §11). */
  title: string;
  /** 150 to 160 characters, 2026 included. */
  description: string;
  h1: string;
  intro: string;
  /** ONE paragraph of 120 words or more: the direct answer with the figures (RECETTE §21). */
  resume: string;
  faqs: FAQ[];
  body: (h: Helpers) => string;
  tool: ToolKind;
  toolProps?: ToolProps;
  related: string[];
  /** Keys of params-2026.json > sources. */
  sources: string[];
}
export const definePage = (p: PageDef): PageDef => p;
