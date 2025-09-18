import { I18n, asCurrencyCode, asLocaleCode } from '@untitled-ds/i18n-core';
import { createViteCatalogLoader } from './loader';

/**
 * Factory for the application I18n instance.
 * The instance is shared via React context by I18nProvider.
 */
export function createAppI18n(): I18n {
  const loader = createViteCatalogLoader('/src/locales');
  return new I18n({
    supportedLocales: ['en', 'es'],
    defaultLocale: asLocaleCode('en'),
    defaultCurrency: asCurrencyCode('EUR'),
    loader,
  });
}
