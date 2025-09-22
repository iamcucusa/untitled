import type { LocaleCode, CurrencyCode } from './types';

// Note: These imports would be available when @untitled-ds/intl-core is installed
// For now, we'll use direct Intl APIs to demonstrate framework-agnostic approach

/**
 * Framework-agnostic formatting utilities for i18n.
 *
 * These functions can be used in any framework (React, Angular, Vue, Web Components)
 * without framework-specific dependencies.
 */

/**
 * Formats a currency amount using the current locale and currency
 * @param amount - The amount to format
 * @param locale - The locale code
 * @param currency - The currency code
 * @param options - Optional formatting options
 * @returns Formatted currency string
 */
export function formatCurrencyAmount(
  amount: number,
  locale: LocaleCode,
  currency: CurrencyCode,
  options?: Intl.NumberFormatOptions,
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    ...options,
  }).format(amount);
}

/**
 * Formats a number using the current locale
 * @param value - The number to format
 * @param locale - The locale code
 * @param options - Number formatting options
 * @returns Formatted number string
 */
export function formatNumberValue(
  value: number,
  locale: LocaleCode,
  options?: Intl.NumberFormatOptions,
): string {
  return new Intl.NumberFormat(locale, options).format(value);
}

/**
 * Formats a date using the current locale
 * @param date - The date to format
 * @param locale - The locale code
 * @param options - Date formatting options
 * @returns Formatted date string
 */
export function formatDateValue(
  date: Date,
  locale: LocaleCode,
  options?: Intl.DateTimeFormatOptions,
): string {
  return new Intl.DateTimeFormat(locale, options).format(date);
}

/**
 * Formats relative time using the current locale
 * @param value - The time value
 * @param unit - The time unit
 * @param locale - The locale code
 * @param options - Relative time formatting options
 * @returns Formatted relative time string
 */
export function formatRelativeTimeValue(
  value: number,
  unit: Intl.RelativeTimeFormatUnit,
  locale: LocaleCode,
  options?: Intl.RelativeTimeFormatOptions,
): string {
  return new Intl.RelativeTimeFormat(locale, options).format(value, unit);
}

/**
 * Gets plural category for a number using the current locale
 * @param value - The number to get plural category for
 * @param locale - The locale code
 * @param type - The plural type (cardinal or ordinal)
 * @returns Plural category string
 */
export function getPluralCategoryValue(
  value: number,
  locale: LocaleCode,
  type: 'cardinal' | 'ordinal' = 'cardinal',
): string {
  // Note: This is a simplified implementation
  // In a real implementation, you'd use a proper plural rules library
  const rules = new Intl.PluralRules(locale, { type });
  return rules.select(value);
}

/**
 * Creates a formatting context with locale and currency
 * This can be used to create framework-specific adapters
 */
export class FormattingContext {
  constructor(
    public readonly locale: LocaleCode,
    public readonly currency: CurrencyCode,
  ) {}

  /**
   * Format currency with current context
   */
  formatCurrency(amount: number, options?: Intl.NumberFormatOptions): string {
    return formatCurrencyAmount(amount, this.locale, this.currency, options);
  }

  /**
   * Format number with current context
   */
  formatNumber(value: number, options?: Intl.NumberFormatOptions): string {
    return formatNumberValue(value, this.locale, options);
  }

  /**
   * Format date with current context
   */
  formatDate(date: Date, options?: Intl.DateTimeFormatOptions): string {
    return formatDateValue(date, this.locale, options);
  }

  /**
   * Format relative time with current context
   */
  formatRelativeTime(
    value: number,
    unit: Intl.RelativeTimeFormatUnit,
    options?: Intl.RelativeTimeFormatOptions,
  ): string {
    return formatRelativeTimeValue(value, unit, this.locale, options);
  }

  /**
   * Get plural category with current context
   */
  getPluralCategory(value: number, type: 'cardinal' | 'ordinal' = 'cardinal'): string {
    return getPluralCategoryValue(value, this.locale, type);
  }
}
