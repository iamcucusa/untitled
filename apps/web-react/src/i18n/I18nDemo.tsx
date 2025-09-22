import React from 'react';
import { useI18n } from '@untitled-ds/i18n-react';
import { asLocaleCode, asCurrencyCode, FormattingContext } from '@untitled-ds/i18n-core';

/**
 * Comprehensive I18n Demo Component
 *
 * Demonstrates internationalization capabilities including:
 * - Dynamic locale switching between English and Spanish
 * - Namespace-based message loading (common and pricing)
 * - Real-time text updates when locale changes
 * - Asynchronous message loading with loading states
 * - Framework-agnostic formatting using FormattingContext
 * - Responsive design with full-width layout
 *
 * This component showcases the migration strategy for existing React apps:
 * 1. Keep existing React patterns (useI18n, useState, useEffect)
 * 2. Replace framework-specific formatting with FormattingContext
 * 3. Maintain full functionality while gaining framework-agnostic benefits
 *
 * @returns {JSX.Element} The rendered I18n demo component
 */
export function I18nDemo(): JSX.Element {
  const i18n = useI18n();
  const [locale, setLocale] = React.useState(i18n.locale);
  const [currency, setCurrency] = React.useState(i18n.currency);
  const [currentSection, setCurrentSection] = React.useState<'common' | 'pricing'>('common');
  const [ready, setReady] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  /**
   * MIGRATION STEP 1: Replace individual formatting functions with FormattingContext
   *
   * Before: Multiple individual formatting functions
   * After: Single FormattingContext that handles all formatting
   */
  const formattingContext = React.useMemo(() => {
    return new FormattingContext(locale, currency);
  }, [locale, currency]);

  /**
   * Load messages when locale or section changes
   * This remains unchanged - React-specific patterns are still valid
   */
  React.useEffect(() => {
    let isMounted = true;
    setReady(false);
    setLoading(true);

    const loadMessages = async (): Promise<void> => {
      try {
        await i18n.setLocale(locale, currentSection);
        if (isMounted) {
          setReady(true);
          setLoading(false);
        }
      } catch {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadMessages();

    return () => {
      isMounted = false;
    };
  }, [i18n, locale, currentSection]);

  /**
   * MIGRATION STEP 2: Keep React-specific state management
   * These patterns are still valid and don't need to change
   */
  const handleLocaleToggle = async (): Promise<void> => {
    const nextLocale = locale.startsWith('en') ? asLocaleCode('es') : asLocaleCode('en');
    const nextCurrency = nextLocale.startsWith('es')
      ? asCurrencyCode('EUR')
      : asCurrencyCode('USD');

    setLoading(true);
    setReady(false);
    setLocale(nextLocale);
    setCurrency(nextCurrency);
    i18n.setCurrency(nextCurrency);
  };

  const handleCurrencyChange = (newCurrency: string): void => {
    const currencyCode = asCurrencyCode(newCurrency);
    setCurrency(currencyCode);
    i18n.setCurrency(currencyCode);
  };

  const handleSectionChange = (section: 'common' | 'pricing'): void => {
    setLoading(true);
    setReady(false);
    setCurrentSection(section);
  };

  /**
   * MIGRATION STEP 3: Replace utility functions with FormattingContext methods
   *
   * Before: Individual functions like formatCurrencyAmount, formatNumberValue
   * After: formattingContext.formatCurrency, formattingContext.formatNumber
   */
  const getLocaleDisplayName = (locale: string): string => {
    return locale.startsWith('en') ? 'English' : 'Español';
  };

  const getLocaleFlag = (locale: string): string => {
    return locale.startsWith('en') ? '🇺🇸' : '🇪🇸';
  };

  /**
   * Get translated plural category for a number
   * @param value - The number to get plural category for
   * @returns Translated plural category string
   */
  const getTranslatedPluralCategory = (value: number): string => {
    const category = formattingContext.getPluralCategory(value);
    // Map category to literal strings to avoid ESLint indirection error
    switch (category) {
      case 'zero':
        return i18n.t('zero', undefined, 'common');
      case 'one':
        return i18n.t('one', undefined, 'common');
      case 'two':
        return i18n.t('two', undefined, 'common');
      case 'few':
        return i18n.t('few', undefined, 'common');
      case 'many':
        return i18n.t('many', undefined, 'common');
      case 'other':
      default:
        return i18n.t('other', undefined, 'common');
    }
  };

  if (!ready) {
    return (
      <div className="w-full space-y-6 p-6">
        <div className="text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">I18n Demo</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {loading ? 'Loading...' : 'Initializing...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 p-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
          {ready ? i18n.t('Welcome to our application', undefined, currentSection) : 'I18n Demo'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {ready ? i18n.t('Loading...', undefined, currentSection) : 'Loading...'}
        </p>
      </div>

      {/* Controls */}
      <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Locale Toggle */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Language:</span>
            <button
              onClick={handleLocaleToggle}
              disabled={loading}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="text-lg">{getLocaleFlag(locale)}</span>
              <span>{getLocaleDisplayName(locale)}</span>
              {loading && <span className="animate-spin">⟳</span>}
            </button>
          </div>

          {/* Section Toggle */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Section:</span>
            <div className="flex rounded-lg bg-gray-100 p-1 dark:bg-gray-700">
              <button
                onClick={() => handleSectionChange('common')}
                className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  currentSection === 'common'
                    ? 'bg-white text-blue-600 shadow-sm dark:bg-gray-600 dark:text-blue-400'
                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
                }`}
              >
                {i18n.t('Common', undefined, 'common')}
              </button>
              <button
                onClick={() => handleSectionChange('pricing')}
                className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  currentSection === 'pricing'
                    ? 'bg-white text-blue-600 shadow-sm dark:bg-gray-600 dark:text-blue-400'
                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
                }`}
              >
                {i18n.t('Pricing', undefined, 'pricing')}
              </button>
            </div>
          </div>

          {/* Currency Selection */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Currency:</span>
            <select
              value={currency}
              onChange={(e) => handleCurrencyChange(e.target.value)}
              disabled={loading}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="JPY">JPY (¥)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content Display */}
      {ready && (
        <div className="space-y-6">
          {/* Common Section */}
          {currentSection === 'common' && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Currency Formatting Demo - MIGRATED */}
              <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                  {i18n.t('Currency Formatting', undefined, 'common')}
                </h3>
                <div className="space-y-3 text-gray-700 dark:text-gray-300">
                  <div className="flex items-center justify-between">
                    <span>{i18n.t('Small amount:', undefined, 'common')}</span>
                    <span className="font-mono font-semibold">
                      {formattingContext.formatCurrency(12.99)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{i18n.t('Medium amount:', undefined, 'common')}</span>
                    <span className="font-mono font-semibold">
                      {formattingContext.formatCurrency(129.95)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{i18n.t('Large amount:', undefined, 'common')}</span>
                    <span className="font-mono font-semibold">
                      {formattingContext.formatCurrency(1299.99)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{i18n.t('Very large amount:', undefined, 'common')}</span>
                    <span className="font-mono font-semibold">
                      {formattingContext.formatCurrency(12999.99)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Number Formatting Demo - MIGRATED */}
              <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                  {i18n.t('Number Formatting', undefined, 'common')}
                </h3>
                <div className="space-y-3 text-gray-700 dark:text-gray-300">
                  <div className="flex items-center justify-between">
                    <span>{i18n.t('Decimal:', undefined, 'common')}</span>
                    <span className="font-mono font-semibold">
                      {formattingContext.formatNumber(1234567.89)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{i18n.t('Percent:', undefined, 'common')}</span>
                    <span className="font-mono font-semibold">
                      {formattingContext.formatNumber(0.75, { style: 'percent' })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{i18n.t('Large number:', undefined, 'common')}</span>
                    <span className="font-mono font-semibold">
                      {formattingContext.formatNumber(1234567890)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Date Formatting Demo - MIGRATED */}
              <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                  {i18n.t('Date Formatting', undefined, 'common')}
                </h3>
                <div className="space-y-3 text-gray-700 dark:text-gray-300">
                  <div className="flex items-center justify-between">
                    <span>{i18n.t('Short date:', undefined, 'common')}</span>
                    <span className="font-mono font-semibold">
                      {formattingContext.formatDate(new Date(), { dateStyle: 'short' })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{i18n.t('Long date:', undefined, 'common')}</span>
                    <span className="font-mono font-semibold">
                      {formattingContext.formatDate(new Date(), { dateStyle: 'long' })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{i18n.t('Date & time:', undefined, 'common')}</span>
                    <span className="font-mono font-semibold">
                      {formattingContext.formatDate(new Date(), {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Relative Time Demo - MIGRATED */}
              <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                  {i18n.t('Relative Time', undefined, 'common')}
                </h3>
                <div className="space-y-3 text-gray-700 dark:text-gray-300">
                  <div className="flex items-center justify-between">
                    <span>{i18n.t('3 days ago:', undefined, 'common')}</span>
                    <span className="font-mono font-semibold">
                      {formattingContext.formatRelativeTime(-3, 'day')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{i18n.t('2 hours ago:', undefined, 'common')}</span>
                    <span className="font-mono font-semibold">
                      {formattingContext.formatRelativeTime(-2, 'hour')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{i18n.t('In 5 minutes:', undefined, 'common')}</span>
                    <span className="font-mono font-semibold">
                      {formattingContext.formatRelativeTime(5, 'minute')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Plural Categories Demo - MIGRATED */}
              <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                  {i18n.t('Plural Categories', undefined, 'common')}
                </h3>
                <div className="space-y-3 text-gray-700 dark:text-gray-300">
                  <div className="flex items-center justify-between">
                    <span>{i18n.t('0 items:', undefined, 'common')}</span>
                    <span className="font-mono font-semibold">
                      {getTranslatedPluralCategory(0)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{i18n.t('1 item:', undefined, 'common')}</span>
                    <span className="font-mono font-semibold">
                      {getTranslatedPluralCategory(1)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{i18n.t('2 items:', undefined, 'common')}</span>
                    <span className="font-mono font-semibold">
                      {getTranslatedPluralCategory(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{i18n.t('5 items:', undefined, 'common')}</span>
                    <span className="font-mono font-semibold">
                      {getTranslatedPluralCategory(5)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Fallback Behavior Demo - MIGRATED */}
              <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                  {i18n.t('Fallback Behavior', undefined, 'common')}
                </h3>
                <div className="space-y-3 text-gray-700 dark:text-gray-300">
                  <div className="flex items-center justify-between">
                    <span>{i18n.t('Existing translation:', undefined, 'common')}</span>
                    <span className="font-mono font-semibold">
                      {i18n.t('Hello', undefined, 'common')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{i18n.t('Missing translation:', undefined, 'common')}</span>
                    <span className="font-mono font-semibold">
                      {i18n.t('ThisKeyDoesNotExist', undefined, 'common')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{i18n.t('Wrong namespace:', undefined, 'common')}</span>
                    <span className="font-mono font-semibold">
                      {i18n.t('Hello', undefined, 'pricing')}
                    </span>
                  </div>
                </div>
                <div className="mt-4 rounded-lg border border-yellow-200 bg-yellow-50 p-3 dark:border-yellow-800 dark:bg-yellow-900/20">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    <strong>{i18n.t('Note:', undefined, 'common')}</strong>{' '}
                    {i18n.t('Missing translations show the key as fallback', undefined, 'common')}
                  </p>
                </div>
              </div>

              {/* Current Context Info */}
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700">
                <p className="text-sm text-gray-800 dark:text-gray-200">
                  <strong>{i18n.t('Current settings:', undefined, 'common')}</strong> {locale}{' '}
                  {i18n.t('locale', undefined, 'common')}, {currency}{' '}
                  {i18n.t('currency', undefined, 'common')}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {i18n.t(
                    'This component uses FormattingContext for framework-agnostic formatting',
                    undefined,
                    'common',
                  )}
                </p>
              </div>
            </div>
          )}

          {/* Pricing Section */}
          {currentSection === 'pricing' && (
            <div className="space-y-6">
              <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                  {i18n.t('Pricing', undefined, 'pricing')}
                </h2>
                <p className="mb-4 text-gray-600 dark:text-gray-400">
                  {i18n.t('Choose your plan', undefined, 'pricing')}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {/* Basic Plan - MIGRATED */}
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md dark:border-gray-600 dark:bg-gray-800">
                  <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                    {i18n.t('Basic Plan', undefined, 'pricing')}
                  </h3>
                  <div className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                    {formattingContext.formatCurrency(9)}{' '}
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {i18n.t('per month', undefined, 'pricing')}
                    </span>
                  </div>
                  <ul className="mb-4 space-y-2 text-gray-700 dark:text-gray-300">
                    <li className="text-sm">
                      ✓ {i18n.t('Unlimited projects', undefined, 'pricing')}
                    </li>
                    <li className="text-sm">✓ {i18n.t('Basic analytics', undefined, 'pricing')}</li>
                  </ul>
                  <button className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700">
                    {i18n.t('Get Started', undefined, 'pricing')}
                  </button>
                </div>

                {/* Pro Plan - MIGRATED */}
                <div className="relative rounded-lg border-2 border-blue-500 bg-white p-6 shadow-md dark:bg-gray-800">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 transform">
                    <span className="rounded-full bg-blue-500 px-3 py-1 text-xs text-white">
                      {i18n.t('Most popular', undefined, 'pricing')}
                    </span>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                    {i18n.t('Pro Plan', undefined, 'pricing')}
                  </h3>
                  <div className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                    {formattingContext.formatCurrency(29)}{' '}
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {i18n.t('per month', undefined, 'pricing')}
                    </span>
                  </div>
                  <ul className="mb-4 space-y-2 text-gray-700 dark:text-gray-300">
                    <li className="text-sm">
                      ✓ {i18n.t('Unlimited projects', undefined, 'pricing')}
                    </li>
                    <li className="text-sm">
                      ✓ {i18n.t('Advanced analytics', undefined, 'pricing')}
                    </li>
                    <li className="text-sm">
                      ✓ {i18n.t('Priority support', undefined, 'pricing')}
                    </li>
                  </ul>
                  <button className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700">
                    {i18n.t('Get Started', undefined, 'pricing')}
                  </button>
                </div>

                {/* Enterprise Plan - MIGRATED */}
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md dark:border-gray-600 dark:bg-gray-800">
                  <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                    {i18n.t('Enterprise Plan', undefined, 'pricing')}
                  </h3>
                  <div className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                    {formattingContext.formatCurrency(99)}{' '}
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {i18n.t('per month', undefined, 'pricing')}
                    </span>
                  </div>
                  <ul className="mb-4 space-y-2 text-gray-700 dark:text-gray-300">
                    <li className="text-sm">
                      ✓ {i18n.t('Unlimited projects', undefined, 'pricing')}
                    </li>
                    <li className="text-sm">
                      ✓ {i18n.t('Advanced analytics', undefined, 'pricing')}
                    </li>
                    <li className="text-sm">
                      ✓ {i18n.t('Priority support', undefined, 'pricing')}
                    </li>
                    <li className="text-sm">
                      ✓ {i18n.t('Custom integrations', undefined, 'pricing')}
                    </li>
                  </ul>
                  <button className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700">
                    {i18n.t('Contact', undefined, 'pricing')}
                  </button>
                </div>
              </div>

              <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
                <p className="text-sm text-green-800 dark:text-green-200">
                  <strong>{i18n.t('Free trial', undefined, 'pricing')}</strong> -{' '}
                  {i18n.t('30-day money back guarantee', undefined, 'pricing')}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
