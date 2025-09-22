import { I18n, asCurrencyCode, asLocaleCode } from '@untitled-ds/i18n-core';
import { createViteCatalogLoader } from './loader';

/**
 * Factory for the application I18n instance.
 * The instance is shared via React context by I18nProvider.
 */
export function createAppI18n(): I18n {
  /** Use Vite's base URL to ensure correct paths in production deployments */
  const basePath = `${import.meta.env.BASE_URL}src/locales`;
  const loader = createViteCatalogLoader(basePath);
  return new I18n({
    supportedLocales: ['en', 'es'],
    defaultLocale: asLocaleCode('en'),
    defaultCurrency: asCurrencyCode('EUR'),
    loader,
  });
}
