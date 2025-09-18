import { i18n as linguiSingleton } from '@lingui/core';
import type { Messages as LinguiMessages } from '@lingui/core';
import type { CatalogLoader, CurrencyCode, LocaleCode, Messages, Namespace } from './types';

/**
 * Framework-agnostic i18n manager built on Lingui.
 *
 * Responsibilities:
 * - Maintain current locale and currency (for interop with intl-core).
 * - Lazily load and activate compiled Lingui catalogs via a pluggable loader.
 * - Provide a simple translation API (`t`) that adapters can wrap.
 * - Notify subscribers when locale/currency changes (React/Angular/Vue/WC hooks can subscribe).
 */
export class I18n {
  private readonly supportedLocales: readonly string[];
  private readonly defaultLocale: LocaleCode;
  private currentLocale: LocaleCode;
  private currentCurrency: CurrencyCode;
  private readonly loader: CatalogLoader;

  /**
   * Subscriptions notified whenever locale or currency changes.
   * NOTE: uses branded types so consumers can keep their state strictly typed.
   */
  private readonly subscribers = new Set<
    (state: { locale: LocaleCode; currency: CurrencyCode }) => void
  >();

  constructor(options: {
    supportedLocales: readonly string[];
    defaultLocale: LocaleCode;
    defaultCurrency: CurrencyCode;
    loader?: CatalogLoader;
    initialLocale?: LocaleCode;
    initialCurrency?: CurrencyCode;
  }) {
    this.supportedLocales = options.supportedLocales;
    this.defaultLocale = options.defaultLocale;
    this.currentLocale = options.initialLocale ?? options.defaultLocale;
    this.currentCurrency = options.initialCurrency ?? options.defaultCurrency;
    this.loader = options.loader ?? (async () => ({}));

    /**
     * Activate Lingui with an empty catalog so t() is safe before first load.
     */
    linguiSingleton.load(this.currentLocale, {} as LinguiMessages);
    linguiSingleton.activate(this.currentLocale);
  }

  get locale(): LocaleCode {
    return this.currentLocale;
  }

  get currency(): CurrencyCode {
    return this.currentCurrency;
  }

  /**
   * Load the catalog for the provided locale (and namespace when applicable),
   * then activate the locale.
   */
  async setLocale(nextLocale: LocaleCode, namespace: Namespace = 'messages'): Promise<void> {
    if (!this.supportedLocales.includes(nextLocale)) {
      nextLocale = this.defaultLocale;
    }

    const messages: Messages = await this.loader(nextLocale, namespace);
    linguiSingleton.load(nextLocale, messages as LinguiMessages);
    linguiSingleton.activate(nextLocale);

    this.currentLocale = nextLocale;
    this.notify();
  }

  setCurrency(nextCurrency: CurrencyCode): void {
    this.currentCurrency = nextCurrency;
    this.notify();
  }

  /**
   * Translate a message by id using Lingui. Supports ICU placeholders.
   */
  t(id: string, values?: Record<string, unknown>, _namespace: Namespace = 'messages'): string {
    void _namespace; // reserved for future namespace routing
    return linguiSingleton._(id, values);
  }

  /**
   * Subscribe to changes with branded types.
   *
   * @returns Unsubscribe function.
   */
  onChange(listener: (state: { locale: LocaleCode; currency: CurrencyCode }) => void): () => void {
    this.subscribers.add(listener);
    return () => this.subscribers.delete(listener);
  }
  private notify(): void {
    const snapshot = { locale: this.currentLocale, currency: this.currentCurrency };
    for (const listener of this.subscribers) {
      listener(snapshot);
    }
  }
}
