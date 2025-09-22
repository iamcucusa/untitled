import React from 'react';
import { useI18n } from '@untitled-ds/i18n-react';
import { asLocaleCode, asCurrencyCode } from '@untitled-ds/i18n-core';
import { formatCurrency, asLocale, asCurrency } from '@untitled-ds/intl-core';

/**
 * Comprehensive I18n Demo Component
 *
 * Demonstrates internationalization capabilities including:
 * - Dynamic locale switching between English and Spanish
 * - Namespace-based message loading (common and pricing)
 * - Real-time text updates when locale changes
 * - Asynchronous message loading with loading states
 * - Responsive design with full-width layout
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
   * Loads the required namespace when section or locale changes
   * Handles asynchronous message loading with proper cleanup
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
   * Handles locale toggle between English and Spanish
   * Also switches currency to match locale (EUR for ES, USD for EN)
   */
  const handleLocaleToggle = async (): Promise<void> => {
    const nextLocale = locale.startsWith('en') ? asLocaleCode('es') : asLocaleCode('en');
    const nextCurrency = nextLocale.startsWith('es')
      ? asCurrencyCode('EUR')
      : asCurrencyCode('USD');
    setLocale(nextLocale);
    setCurrency(nextCurrency);
    i18n.setCurrency(nextCurrency);
  };

  /**
   * Handles currency change
   */
  const handleCurrencyChange = (newCurrency: string): void => {
    const currencyCode = asCurrencyCode(newCurrency);
    setCurrency(currencyCode);
    i18n.setCurrency(currencyCode);
  };

  /**
   * Handles section change between common and pricing
   * @param section - The section to switch to
   */
  const handleSectionChange = (section: 'common' | 'pricing'): void => {
    setCurrentSection(section);
  };

  /**
   * Returns the display name for a given locale
   * @param locale - The locale code
   * @returns The human-readable locale name
   */
  const getLocaleDisplayName = (locale: string): string => {
    return locale.startsWith('en') ? 'English' : 'Español';
  };

  /**
   * Formats a currency amount using the current locale and currency
   * @param amount - The amount to format
   * @returns Formatted currency string
   */
  const formatCurrencyAmount = (amount: number): string => {
    return formatCurrency(amount, asLocale(locale), asCurrency(currency));
  };

  /**
   * Returns the flag emoji for a given locale
   * @param locale - The locale code
   * @returns The flag emoji
   */
  const getLocaleFlag = (locale: string): string => {
    return locale.startsWith('en') ? '🇺🇸' : '🇪🇸';
  };

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
                Common
              </button>
              <button
                onClick={() => handleSectionChange('pricing')}
                className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  currentSection === 'pricing'
                    ? 'bg-white text-blue-600 shadow-sm dark:bg-gray-600 dark:text-blue-400'
                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
                }`}
              >
                Pricing
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
              <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                  {i18n.t('Home', undefined, 'common')}
                </h2>
                <div className="space-y-3 text-gray-700 dark:text-gray-300">
                  <p>
                    <strong>{i18n.t('Hello', undefined, 'common')}</strong> -{' '}
                    {i18n.t('Welcome to our application', undefined, 'common')}
                  </p>
                  <p>
                    <strong>{i18n.t('Thank you', undefined, 'common')}</strong> -{' '}
                    {i18n.t('Please', undefined, 'common')}{' '}
                    {i18n.t('Click here', undefined, 'common')}
                  </p>
                </div>
              </div>

              <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                  {i18n.t('Settings', undefined, 'common')}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <button className="rounded-lg border border-gray-200 p-3 text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                    {i18n.t('Create', undefined, 'common')}
                  </button>
                  <button className="rounded-lg border border-gray-200 p-3 text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                    {i18n.t('Edit', undefined, 'common')}
                  </button>
                  <button className="rounded-lg border border-gray-200 p-3 text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                    {i18n.t('Save', undefined, 'common')}
                  </button>
                  <button className="rounded-lg border border-gray-200 p-3 text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                    {i18n.t('Delete', undefined, 'common')}
                  </button>
                </div>
              </div>

              <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                  {i18n.t('Information', undefined, 'common')}
                </h3>
                <div className="space-y-2 text-gray-700 dark:text-gray-300">
                  <p>
                    <strong>{i18n.t('Today', undefined, 'common')}</strong> -{' '}
                    {i18n.t('This week', undefined, 'common')}
                  </p>
                  <p>
                    <strong>{i18n.t('Yesterday', undefined, 'common')}</strong> -{' '}
                    {i18n.t('Last week', undefined, 'common')}
                  </p>
                  <p>
                    <strong>{i18n.t('Tomorrow', undefined, 'common')}</strong> -{' '}
                    {i18n.t('Next week', undefined, 'common')}
                  </p>
                </div>
              </div>

              {/* Currency Formatting Demo */}
              <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                  {i18n.t('Currency Formatting', undefined, 'common')}
                </h3>
                <div className="space-y-3 text-gray-700 dark:text-gray-300">
                  <div className="flex items-center justify-between">
                    <span>{i18n.t('Small amount:', undefined, 'common')}</span>
                    <span className="font-mono font-semibold">{formatCurrencyAmount(12.99)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{i18n.t('Medium amount:', undefined, 'common')}</span>
                    <span className="font-mono font-semibold">{formatCurrencyAmount(129.95)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{i18n.t('Large amount:', undefined, 'common')}</span>
                    <span className="font-mono font-semibold">{formatCurrencyAmount(1299.99)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{i18n.t('Very large amount:', undefined, 'common')}</span>
                    <span className="font-mono font-semibold">
                      {formatCurrencyAmount(12999.99)}
                    </span>
                  </div>
                  <div className="mt-4 rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      <strong>{i18n.t('Current settings:', undefined, 'common')}</strong> {locale}{' '}
                      {i18n.t('locale', undefined, 'common')}, {currency}{' '}
                      {i18n.t('currency', undefined, 'common')}
                    </p>
                  </div>
                </div>
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
                {/* Basic Plan */}
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md dark:border-gray-600 dark:bg-gray-800">
                  <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                    {i18n.t('Basic Plan', undefined, 'pricing')}
                  </h3>
                  <div className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrencyAmount(9)}{' '}
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

                {/* Pro Plan */}
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
                    {formatCurrencyAmount(29)}{' '}
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
                    {i18n.t('Subscribe', undefined, 'pricing')}
                  </button>
                </div>

                {/* Enterprise Plan */}
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md dark:border-gray-600 dark:bg-gray-800">
                  <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                    {i18n.t('Enterprise Plan', undefined, 'pricing')}
                  </h3>
                  <div className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrencyAmount(99)}{' '}
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
                      ✓ {i18n.t('Custom integrations', undefined, 'pricing')}
                    </li>
                    <li className="text-sm">
                      ✓ {i18n.t('Team collaboration', undefined, 'pricing')}
                    </li>
                  </ul>
                  <button className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700">
                    {i18n.t('Contact', undefined, 'common')}
                  </button>
                </div>
              </div>

              <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
                <p className="text-sm text-green-800 dark:text-green-300">
                  <strong>{i18n.t('Free trial', undefined, 'pricing')}</strong> -{' '}
                  {i18n.t('30-day money back guarantee', undefined, 'pricing')}
                </p>
              </div>
            </div>
          )}

          {/* Status Panel */}
          <div className="rounded-lg bg-gray-50 p-6 dark:bg-gray-800">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              {i18n.t('Status', undefined, currentSection)}
            </h3>
            <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <p>
                <strong>{i18n.t('Current Locale:', undefined, currentSection)}</strong> {locale} (
                {getLocaleDisplayName(locale)})
              </p>
              <p>
                <strong>{i18n.t('Current Section:', undefined, currentSection)}</strong>{' '}
                {currentSection}
              </p>
              <p>
                <strong>{i18n.t('Messages Loaded:', undefined, currentSection)}</strong>{' '}
                {ready ? `✅ ${i18n.t('Yes', undefined, currentSection)}` : '⏳ Loading...'}
              </p>
              <p>
                <strong>{i18n.t('Loading State:', undefined, currentSection)}</strong>{' '}
                {loading ? '⏳ Loading...' : `✅ ${i18n.t('Ready', undefined, currentSection)}`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {!ready && (
        <div className="py-12 text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-gray-600 dark:text-gray-400">
            {i18n.t('Loading messages...', undefined, currentSection)}
          </p>
        </div>
      )}
    </div>
  );
}
