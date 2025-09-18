import type { CatalogLoader, Messages, Namespace } from './types';

/**
 * Default loader for Lingui message catalogs compiled to JS.
 *
 * Expects a single compiled file per locale at:
 *   `locales/{locale}/messages.js`
 *
 * 📦 Example:
 *   locales/en/messages.js  →  exports { messages }
 *
 * This implementation ignores the `namespace` parameter
 * because catalogs are not yet split by namespace (e.g. 'common', 'pricing').
 * The `_` prefix signals an intentional unused param.
 *
 * You can later extend this to:
 *   `locales/{locale}/{namespace}.js`
 *
 * @param locale - The target locale (e.g. 'en', 'es')
 * @param _ - Reserved namespace argument for future catalog splitting
 * @returns Parsed messages object for Lingui activation
 */
export const defaultCatalogLoader: CatalogLoader = async (
  locale: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _: Namespace,
): Promise<Messages> => {
  /**
   * For Step 2, we keep a single "messages" file per locale.
   *  Lingui compile generates .js files exporting "messages".
   */
  const catalog = await import(/* @vite-ignore */ `../locales/${locale}/messages.js`);
  return catalog.messages as Messages;
};
