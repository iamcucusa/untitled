import type { I18n } from './i18n';
import type { LocaleCode, CurrencyCode } from './types';
import { FormattingContext } from './formatting';

/**
 * Framework-agnostic adapter interface for i18n functionality.
 *
 * This allows different frameworks to implement their own subscription
 * and state management patterns while using the same core i18n logic.
 */
export interface I18nAdapter {
  /**
   * Get the current i18n instance
   */
  getI18n(): I18n;

  /**
   * Get the current locale
   */
  getLocale(): LocaleCode;

  /**
   * Get the current currency
   */
  getCurrency(): CurrencyCode;

  /**
   * Subscribe to i18n changes
   * @param callback - Function to call when locale/currency changes
   * @returns Unsubscribe function
   */
  subscribe(callback: (state: { locale: LocaleCode; currency: CurrencyCode }) => void): () => void;

  /**
   * Get a formatting context for the current state
   */
  getFormattingContext(): FormattingContext;
}

/**
 * Base adapter implementation that can be extended by framework-specific adapters
 */
export class BaseI18nAdapter implements I18nAdapter {
  constructor(protected readonly i18n: I18n) {}

  getI18n(): I18n {
    return this.i18n;
  }

  getLocale(): LocaleCode {
    return this.i18n.locale;
  }

  getCurrency(): CurrencyCode {
    return this.i18n.currency;
  }

  subscribe(callback: (state: { locale: LocaleCode; currency: CurrencyCode }) => void): () => void {
    return this.i18n.onChange(callback);
  }

  getFormattingContext(): FormattingContext {
    return new FormattingContext(this.i18n.locale, this.i18n.currency);
  }
}

/**
 * Angular-specific adapter using RxJS observables
 * This would be implemented in a separate @untitled-ds/i18n-angular package
 */
export interface AngularI18nAdapter extends I18nAdapter {
  /**
   * Get locale as an observable
   * Note: RxJS types would be available in the Angular package
   */
  getLocale$(): any; // Observable<LocaleCode>

  /**
   * Get currency as an observable
   */
  getCurrency$(): any; // Observable<CurrencyCode>

  /**
   * Get formatting context as an observable
   */
  getFormattingContext$(): any; // Observable<FormattingContext>
}

/**
 * Vue-specific adapter using Vue's reactivity system
 * This would be implemented in a separate @untitled-ds/i18n-vue package
 */
export interface VueI18nAdapter extends I18nAdapter {
  /**
   * Get locale as a Vue ref
   * Note: Vue types would be available in the Vue package
   */
  getLocaleRef(): any; // Ref<LocaleCode>

  /**
   * Get currency as a Vue ref
   */
  getCurrencyRef(): any; // Ref<CurrencyCode>

  /**
   * Get formatting context as a Vue computed
   */
  getFormattingContextComputed(): any; // ComputedRef<FormattingContext>
}

/**
 * Web Components adapter using custom events
 * This would be implemented in a separate @untitled-ds/i18n-wc package
 */
export interface WebComponentsI18nAdapter extends I18nAdapter {
  /**
   * Dispatch custom event when locale changes
   */
  dispatchLocaleChange(locale: LocaleCode): void;

  /**
   * Dispatch custom event when currency changes
   */
  dispatchCurrencyChange(currency: CurrencyCode): void;

  /**
   * Add event listener for i18n changes
   */
  addEventListener(
    type: 'localechange' | 'currencychange' | 'i18nchange',
    listener: EventListener,
  ): void;

  /**
   * Remove event listener for i18n changes
   */
  removeEventListener(
    type: 'localechange' | 'currencychange' | 'i18nchange',
    listener: EventListener,
  ): void;
}
