import { pluralRulesCache } from './cache';
import type { Locale } from './brands';

/**
 * Returns the plural category for a number in a given locale, e.g., 'one', 'few', 'many'.
 */
export function getPluralCategory(
  value: number,
  locale: Locale,
  type: 'cardinal' | 'ordinal' = 'cardinal',
): Intl.LDMLPluralRule {
  const cacheKey = `${locale}::${type}`;

  let pluralRules = pluralRulesCache.get(cacheKey);
  if (!pluralRules) {
    pluralRules = new Intl.PluralRules(locale, { type });
    pluralRulesCache.set(cacheKey, pluralRules);
  }

  return pluralRules.select(value);
}
