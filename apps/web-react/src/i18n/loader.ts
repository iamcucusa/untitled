import type { CatalogLoader, Messages } from '@untitled-ds/i18n-core';

/**
 * Possible shapes of a compiled Lingui catalog ES module.
 * Lingui typically emits `export const messages = {...}`.
 * Some toolchains might bundle it under a `default` export.
 */
type CatalogModule =
  | { messages: Messages }
  | { default: { messages: Messages } }
  | { default: Messages };

/**
 * Runtime type guard to safely extract `messages` from a dynamic import.
 *
 * @param mod - Unknown module result from a dynamic import.
 * @returns The extracted `messages` map if present, otherwise `null`.
 */
function extractMessages(mod: unknown): Messages | null {
  if (mod && typeof mod === 'object') {
    const named = mod as { messages?: unknown };
    if (named.messages && typeof named.messages === 'object') {
      return named.messages as Messages;
    }
    const defWrap = mod as { default?: unknown };
    if (defWrap.default && typeof defWrap.default === 'object') {
      const defObj = defWrap.default as { messages?: unknown };
      if (defObj.messages && typeof defObj.messages === 'object') {
        return defObj.messages as Messages;
      }
      return defWrap.default as Messages;
    }
  }
  return null;
}

/**
 * Create a Vite‑aware catalog loader that dynamically imports compiled Lingui catalogs.
 *
 * Compiled files are expected at:
 *   `{basePath}/{locale}/{namespace}.js`
 *
 * Example:
 *   basePath: "/src/locales"
 *   import path: "/src/locales/en/common.js"
 *
 * The loader:
 * - Uses dynamic `import()` so bundlers can split per locale/namespace.
 * - Never throws at runtime; returns an empty catalog `{}` if the file is missing.
 * - Avoids `any` by narrowing the dynamic module shape via `extractMessages`.
 *
 * @param basePath - Root folder (from the app source root) where compiled catalogs live.
 * @returns A `CatalogLoader` compatible function `(locale, namespace) => Promise<Messages>`.
 */
export function createViteCatalogLoader(basePath = '/src/locales'): CatalogLoader {
  return async (locale: string, namespace: string): Promise<Messages> => {
    const candidates = [
      `${basePath}/${locale}/${namespace}.mjs`,
      `${basePath}/${locale}/${namespace}.js`,
    ];

    for (const modulePath of candidates) {
      try {
        const mod: unknown = await import(/* @vite-ignore */ modulePath);
        const messages = extractMessages(mod);
        if (messages) return messages;
      } catch {
        /**
         * try next candidate
         */
      }
    }

    /**
     * Graceful fallback so UI stays stable if a catalog is missing in dev
     */
    return {};
  };
}
