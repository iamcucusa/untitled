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
 * If the import fails, an empty catalog is returned to keep the app stable.
 *
 * @param locale - The target locale (e.g. 'en', 'es')
 * @param _ - Reserved namespace argument for future catalog splitting
 * @returns Parsed messages object for Lingui activation
 *
 */
export const defaultCatalogLoader: CatalogLoader = async (
  locale: string,
  _: Namespace,
): Promise<Messages> => {
  try {
    /**
     *  Vite/ESM build: the compiled file should export `messages` as a named export.
     */
    const mod = await import(/* @vite-ignore */ `../locales/${locale}/messages.js`);
    /**
     * Support both named and default exports just in case.
     */
    const exported =
      (mod as any).messages ?? (mod as any).default?.messages ?? (mod as any).default ?? {};
    return exported as Messages;
  } catch {
    /**
     * Graceful fallback while catalogs are being added or during dev.
     */
    return {};
  }
};
