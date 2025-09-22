/**
 * Example Web Components adapter implementation
 * This would be in a separate @untitled-ds/i18n-wc package
 */

import type { I18n, LocaleCode, CurrencyCode } from '@untitled-ds/i18n-core';
import { FormattingContext, BaseI18nAdapter } from '../adapters';

/**
 * Web Components adapter implementation
 */
export class WebComponentsI18nAdapter extends BaseI18nAdapter {
  private readonly eventTarget = new EventTarget();

  constructor(i18n: I18n) {
    super(i18n);

    // Subscribe to i18n changes and dispatch custom events
    this.i18n.onChange((state) => {
      this.dispatchLocaleChange(state.locale);
      this.dispatchCurrencyChange(state.currency);
      this.dispatchI18nChange(state);
    });
  }

  /**
   * Dispatch custom event when locale changes
   */
  dispatchLocaleChange(locale: LocaleCode): void {
    const event = new CustomEvent('localechange', {
      detail: { locale },
    });
    this.eventTarget.dispatchEvent(event);
  }

  /**
   * Dispatch custom event when currency changes
   */
  dispatchCurrencyChange(currency: CurrencyCode): void {
    const event = new CustomEvent('currencychange', {
      detail: { currency },
    });
    this.eventTarget.dispatchEvent(event);
  }

  /**
   * Dispatch custom event for any i18n change
   */
  dispatchI18nChange(state: { locale: LocaleCode; currency: CurrencyCode }): void {
    const event = new CustomEvent('i18nchange', {
      detail: state,
    });
    this.eventTarget.dispatchEvent(event);
  }

  /**
   * Add event listener for i18n changes
   */
  addEventListener(
    type: 'localechange' | 'currencychange' | 'i18nchange',
    listener: EventListener,
  ): void {
    this.eventTarget.addEventListener(type, listener);
  }

  /**
   * Remove event listener for i18n changes
   */
  removeEventListener(
    type: 'localechange' | 'currencychange' | 'i18nchange',
    listener: EventListener,
  ): void {
    this.eventTarget.removeEventListener(type, listener);
  }
}

/**
 * Web Component example with i18n support
 */
export class I18nDemoComponent extends HTMLElement {
  private adapter: WebComponentsI18nAdapter;
  private formattingContext: FormattingContext;
  private localeChangeListener: EventListener;
  private currencyChangeListener: EventListener;

  constructor() {
    super();

    // Initialize adapter (would be injected in real app)
    this.adapter = new WebComponentsI18nAdapter(i18n);
    this.formattingContext = this.adapter.getFormattingContext();

    // Set up event listeners
    this.localeChangeListener = (event: any) => {
      this.formattingContext = new FormattingContext(
        event.detail.locale,
        this.formattingContext.currency,
      );
      this.render();
    };

    this.currencyChangeListener = (event: any) => {
      this.formattingContext = new FormattingContext(
        this.formattingContext.locale,
        event.detail.currency,
      );
      this.render();
    };

    this.adapter.addEventListener('localechange', this.localeChangeListener);
    this.adapter.addEventListener('currencychange', this.currencyChangeListener);
  }

  connectedCallback() {
    this.render();
  }

  disconnectedCallback() {
    this.adapter.removeEventListener('localechange', this.localeChangeListener);
    this.adapter.removeEventListener('currencychange', this.currencyChangeListener);
  }

  private render() {
    const locale = this.formattingContext.locale;
    const currency = this.formattingContext.currency;

    this.innerHTML = `
      <div class="i18n-demo">
        <h1>Web Components I18n Demo</h1>
        
        <div class="controls">
          <button id="locale-toggle">
            ${locale.startsWith('en') ? '🇺🇸 English' : '🇪🇸 Español'}
          </button>
          
          <select id="currency-select" value="${currency}">
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
          </select>
        </div>
        
        <div class="formatting">
          <h3>Currency Formatting</h3>
          <p>Small amount: ${this.formattingContext.formatCurrency(12.99)}</p>
          <p>Large amount: ${this.formattingContext.formatCurrency(1299.99)}</p>
          
          <h3>Number Formatting</h3>
          <p>Decimal: ${this.formattingContext.formatNumber(1234567.89)}</p>
          <p>Percent: ${this.formattingContext.formatNumber(0.75, { style: 'percent' })}</p>
          
          <h3>Date Formatting</h3>
          <p>Short: ${this.formattingContext.formatDate(new Date(), { dateStyle: 'short' })}</p>
          <p>Long: ${this.formattingContext.formatDate(new Date(), { dateStyle: 'long' })}</p>
        </div>
      </div>
    `;

    // Add event listeners to the rendered elements
    this.querySelector('#locale-toggle')?.addEventListener('click', () => {
      const nextLocale = locale.startsWith('en') ? 'es' : 'en';
      this.adapter.getI18n().setLocale(nextLocale);
    });

    this.querySelector('#currency-select')?.addEventListener('change', (event: any) => {
      this.adapter.getI18n().setCurrency(event.target.value);
    });
  }
}

// Register the custom element
customElements.define('i18n-demo', I18nDemoComponent);

/**
 * Usage in HTML:
 * <i18n-demo></i18n-demo>
 */
