/** Server-side access to params-2026.json. Calculators receive the few figures they need as props. */
import P from '../data/params-2026.json';
import type { StateRule } from './engine/overtime';

export { P };
export type RuleKey = 'federal' | 'california' | 'alaska' | 'nevada' | 'colorado';
export const RULE_KEYS: RuleKey[] = ['federal', 'california', 'alaska', 'nevada', 'colorado'];
export const RULES = P.states as unknown as Record<RuleKey, StateRule & Record<string, unknown>>;
export const rule = (k: RuleKey) => RULES[k];
export const RULE_OPTIONS = RULE_KEYS.map((k) => ({ value: k, label: k === 'federal' ? 'Any other state (federal FLSA rule)' : `${RULES[k].name} (daily overtime)` }));
