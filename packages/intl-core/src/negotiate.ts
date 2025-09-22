/**
 * Negotiates the best supported locale.
 * Strategy: exact match → base language match → fallback.
 */
export function negotiateLocale<SupportedLocales extends readonly string[]>(
  requestedLocales: readonly string[],
  supportedLocales: SupportedLocales,
  fallbackLocale: SupportedLocales[number],
): SupportedLocales[number] {
  /** Step 1: Look for exact locale matches (e.g., 'es-ES' === 'es-ES') */
  for (const requested of requestedLocales) {
    if ((supportedLocales as readonly string[]).includes(requested)) {
      return requested as SupportedLocales[number];
    }
  }

  /** Step 2: Look for base language matches (e.g., 'es-MX' → 'es') */
  const baseOf = (tag: string) => tag.toLowerCase().split('-')[0];
  const requestedBaseLanguages = requestedLocales.map(baseOf);

  for (const supported of supportedLocales) {
    if (requestedBaseLanguages.includes(baseOf(supported))) {
      return supported as SupportedLocales[number];
    }
  }

  /** Step 3: Return fallback locale if no matches found */
  return fallbackLocale;
}
