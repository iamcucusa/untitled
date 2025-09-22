/**
 * Example Angular adapter implementation
 * This would be in a separate @untitled-ds/i18n-angular package
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import type { I18n, LocaleCode, CurrencyCode } from '@untitled-ds/i18n-core';
import { FormattingContext, BaseI18nAdapter } from '../adapters';

@Injectable({
  providedIn: 'root',
})
export class AngularI18nAdapter extends BaseI18nAdapter {
  private readonly stateSubject = new BehaviorSubject<{
    locale: LocaleCode;
    currency: CurrencyCode;
  }>({
    locale: this.i18n.locale,
    currency: this.i18n.currency,
  });

  constructor(i18n: I18n) {
    super(i18n);

    // Subscribe to i18n changes and update the subject
    this.i18n.onChange((state) => {
      this.stateSubject.next(state);
    });
  }

  /**
   * Get locale as an observable
   */
  getLocale$(): Observable<LocaleCode> {
    return this.stateSubject.pipe(map((state) => state.locale));
  }

  /**
   * Get currency as an observable
   */
  getCurrency$(): Observable<CurrencyCode> {
    return this.stateSubject.pipe(map((state) => state.currency));
  }

  /**
   * Get formatting context as an observable
   */
  getFormattingContext$(): Observable<FormattingContext> {
    return this.stateSubject.pipe(
      map((state) => new FormattingContext(state.locale, state.currency)),
    );
  }
}

/**
 * Angular service that provides i18n functionality
 */
@Injectable({
  providedIn: 'root',
})
export class I18nService {
  constructor(private adapter: AngularI18nAdapter) {}

  /**
   * Get current locale
   */
  getLocale(): LocaleCode {
    return this.adapter.getLocale();
  }

  /**
   * Get current currency
   */
  getCurrency(): CurrencyCode {
    return this.adapter.getCurrency();
  }

  /**
   * Get locale observable
   */
  getLocale$(): Observable<LocaleCode> {
    return this.adapter.getLocale$();
  }

  /**
   * Get currency observable
   */
  getCurrency$(): Observable<CurrencyCode> {
    return this.adapter.getCurrency$();
  }

  /**
   * Get formatting context observable
   */
  getFormattingContext$(): Observable<FormattingContext> {
    return this.adapter.getFormattingContext$();
  }

  /**
   * Set locale
   */
  async setLocale(locale: LocaleCode, namespace?: string): Promise<void> {
    return this.adapter.getI18n().setLocale(locale, namespace);
  }

  /**
   * Set currency
   */
  setCurrency(currency: CurrencyCode): void {
    this.adapter.getI18n().setCurrency(currency);
  }

  /**
   * Translate a message
   */
  t(id: string, values?: Record<string, unknown>, namespace?: string): string {
    return this.adapter.getI18n().t(id, values, namespace);
  }
}
