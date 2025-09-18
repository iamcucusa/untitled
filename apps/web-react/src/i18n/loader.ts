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
    const withNamed = mod as { messages?: unknown };
    if (withNamed.messages && typeof withNamed.messages === 'object') {
      return withNamed.messages as Messages;
    }
    const withDefault = mod as { default?: unknown };
    if (withDefault.default && typeof withDefault.default === 'object') {
      const def = withDefault.default as { messages?: unknown };
      if (def.messages && typeof def.messages === 'object') {
        return def.messages as Messages;
      }
      return withDefault.default as Messages;
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
    try {
      const modulePath = `${basePath}/${locale}/${namespace}.js`;
      /**
       * Vite will treat this as a source path import (no URL prefix needed).
       * `@vite-ignore` keeps the path dynamic for per-locale/namespace code splitting.
       */
      const mod: unknown = await import(/* @vite-ignore */ modulePath);
      const msgs = extractMessages(mod);
      return msgs ?? {};
    } catch {
      /**
       * Graceful fallback: return an empty catalog so the UI keeps working
       * even if a locale/namespace was not compiled yet during development.
       */
      return {};
    }
  };
}
