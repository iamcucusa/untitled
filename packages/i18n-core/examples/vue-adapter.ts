/**
 * Example Vue adapter implementation
 * This would be in a separate @untitled-ds/i18n-vue package
 */

import { ref, computed, type Ref, type ComputedRef } from 'vue';
import type { I18n, LocaleCode, CurrencyCode } from '@untitled-ds/i18n-core';
import { FormattingContext, BaseI18nAdapter } from '../adapters';

/**
 * Vue composition function for i18n
 */
export function useI18n(i18n: I18n) {
  const adapter = new VueI18nAdapter(i18n);

  return {
    // Reactive state
    locale: adapter.getLocaleRef(),
    currency: adapter.getCurrencyRef(),
    formattingContext: adapter.getFormattingContextComputed(),

    // Methods
    setLocale: (locale: LocaleCode, namespace?: string) => i18n.setLocale(locale, namespace),
    setCurrency: (currency: CurrencyCode) => i18n.setCurrency(currency),
    t: (id: string, values?: Record<string, unknown>, namespace?: string) =>
      i18n.t(id, values, namespace),

    // Adapter for advanced usage
    adapter,
  };
}

/**
 * Vue-specific adapter implementation
 */
class VueI18nAdapter extends BaseI18nAdapter {
  private readonly localeRef: Ref<LocaleCode>;
  private readonly currencyRef: Ref<CurrencyCode>;

  constructor(i18n: I18n) {
    super(i18n);

    // Create reactive refs
    this.localeRef = ref(i18n.locale);
    this.currencyRef = ref(i18n.currency);

    // Subscribe to changes and update refs
    this.i18n.onChange((state) => {
      this.localeRef.value = state.locale;
      this.currencyRef.value = state.currency;
    });
  }

  /**
   * Get locale as a Vue ref
   */
  getLocaleRef(): Ref<LocaleCode> {
    return this.localeRef;
  }

  /**
   * Get currency as a Vue ref
   */
  getCurrencyRef(): Ref<CurrencyCode> {
    return this.currencyRef;
  }

  /**
   * Get formatting context as a Vue computed
   */
  getFormattingContextComputed(): ComputedRef<FormattingContext> {
    return computed(() => new FormattingContext(this.localeRef.value, this.currencyRef.value));
  }
}

/**
 * Vue plugin for i18n
 */
export function createI18nPlugin(i18n: I18n) {
  return {
    install(app: any) {
      app.provide('i18n', i18n);
      app.config.globalProperties.$i18n = i18n;
    },
  };
}

/**
 * Vue component example
 */
export const VueI18nDemo = {
  setup() {
    const { locale, currency, formattingContext, setLocale, setCurrency, t } = useI18n(i18n);

    const handleLocaleToggle = () => {
      const nextLocale = locale.value.startsWith('en') ? 'es' : 'en';
      setLocale(nextLocale);
    };

    const handleCurrencyChange = (newCurrency: string) => {
      setCurrency(newCurrency);
    };

    return {
      locale,
      currency,
      formattingContext,
      handleLocaleToggle,
      handleCurrencyChange,
      t,
    };
  },

  template: `
    <div class="i18n-demo">
      <h1>Vue I18n Demo</h1>
      
      <div class="controls">
        <button @click="handleLocaleToggle">
          {{ locale.startsWith('en') ? '🇺🇸 English' : '🇪🇸 Español' }}
        </button>
        
        <select :value="currency" @change="handleCurrencyChange($event.target.value)">
          <option value="USD">USD ($)</option>
          <option value="EUR">EUR (€)</option>
          <option value="GBP">GBP (£)</option>
        </select>
      </div>
      
      <div class="formatting">
        <h3>Currency Formatting</h3>
        <p>Small amount: {{ formattingContext.formatCurrency(12.99) }}</p>
        <p>Large amount: {{ formattingContext.formatCurrency(1299.99) }}</p>
        
        <h3>Number Formatting</h3>
        <p>Decimal: {{ formattingContext.formatNumber(1234567.89) }}</p>
        <p>Percent: {{ formattingContext.formatNumber(0.75, { style: 'percent' }) }}</p>
        
        <h3>Date Formatting</h3>
        <p>Short: {{ formattingContext.formatDate(new Date(), { dateStyle: 'short' }) }}</p>
        <p>Long: {{ formattingContext.formatDate(new Date(), { dateStyle: 'long' }) }}</p>
      </div>
    </div>
  `,
};
