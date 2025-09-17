import { relativeTimeFormatCache, makeCacheKey } from './cache';
import type { Locale } from './brands';

/**
 * Formats a value and unit (e.g., -3, 'day') into a localized relative time string.
 * Example: "3 days ago", "hace 3 días".
 */
export function formatRelativeTime(
  value: number,
  unit: Intl.RelativeTimeFormatUnit,
  locale: Locale,
  options?: Intl.RelativeTimeFormatOptions,
): string {
  const relativeTimeOptions = options ?? {};
  const cacheKey = makeCacheKey(locale, relativeTimeOptions);

  let relativeTimeFormatter = relativeTimeFormatCache.get(cacheKey);
  if (!relativeTimeFormatter) {
    relativeTimeFormatter = new Intl.RelativeTimeFormat(locale, relativeTimeOptions);
    relativeTimeFormatCache.set(cacheKey, relativeTimeFormatter);
  }

  return relativeTimeFormatter.format(value, unit);
}
