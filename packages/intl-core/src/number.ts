import { numberFormatCache, makeCacheKey } from './cache';
import type { Locale } from './brands';

type DecimalOptions = {
  style?: 'decimal';
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
};

type PercentOptions = {
  style: 'percent';
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
};

type UnitOptions = {
  style: 'unit';
  unit: Intl.NumberFormatUnit;
  unitDisplay?: 'short' | 'long' | 'narrow';
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
};

export type NumberFormatOptions = DecimalOptions | PercentOptions | UnitOptions;

/**
 * Formats a number using Intl.NumberFormat with memoization.
 */
export function formatNumber(
  value: number,
  locale: Locale,
  options: NumberFormatOptions = {},
): string {
  const numberFormatOptions: Intl.NumberFormatOptions = options;
  const cacheKey = makeCacheKey(locale, numberFormatOptions);

  let numberFormatter = numberFormatCache.get(cacheKey);
  if (!numberFormatter) {
    numberFormatter = new Intl.NumberFormat(locale, numberFormatOptions);
    numberFormatCache.set(cacheKey, numberFormatter);
  }

  return numberFormatter.format(value);
}
