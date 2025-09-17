import { numberFormatCache, makeCacheKey } from './cache';
import type { Locale, CurrencyCode } from './brands';

export type CurrencyFormatOptions = {
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  currencyDisplay?: 'symbol' | 'code' | 'name';
  currencySign?: 'standard' | 'accounting';
};

/**
 * Formats a monetary value for a given locale/currency using Intl.NumberFormat with memoization.
 */
export function formatCurrency(
  amount: number,
  locale: Locale,
  currency: CurrencyCode,
  options: CurrencyFormatOptions = {},
): string {
  const numberFormatOptions: Intl.NumberFormatOptions = {
    style: 'currency',
    currency,
    ...options,
  };

  const cacheKey = makeCacheKey(locale, numberFormatOptions);

  let currencyFormatter = numberFormatCache.get(cacheKey);
  if (!currencyFormatter) {
    currencyFormatter = new Intl.NumberFormat(locale, numberFormatOptions);
    numberFormatCache.set(cacheKey, currencyFormatter);
  }

  return currencyFormatter.format(amount);
}
