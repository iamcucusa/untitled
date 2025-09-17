import { dateTimeFormatCache, makeCacheKey } from './cache';
import type { Locale } from './brands';

export type DateFormatOptions =
  | Intl.DateTimeFormatOptions
  | {
      dateStyle?: 'full' | 'long' | 'medium' | 'short';
      timeStyle?: 'full' | 'long' | 'medium' | 'short';
    };

/**
 * Formats a date/time value using Intl.DateTimeFormat with memoization.
 */
export function formatDate(
  input: Date | number | string,
  locale: Locale,
  options: DateFormatOptions = {},
): string {
  const date = typeof input === 'string' || typeof input === 'number' ? new Date(input) : input;

  const cacheKey = makeCacheKey(locale, options as object);

  let dateTimeFormatter = dateTimeFormatCache.get(cacheKey);
  if (!dateTimeFormatter) {
    dateTimeFormatter = new Intl.DateTimeFormat(locale, options);
    dateTimeFormatCache.set(cacheKey, dateTimeFormatter);
  }

  return dateTimeFormatter.format(date);
}
