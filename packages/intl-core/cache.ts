type CacheKey = `${string}::${string}`;

export const numberFormatCache = new Map<CacheKey, Intl.NumberFormat>();
export const dateTimeFormatCache = new Map<CacheKey, Intl.DateTimeFormat>();
export const relativeTimeFormatCache = new Map<CacheKey, Intl.RelativeTimeFormat>();
export const pluralRulesCache = new Map<string, Intl.PluralRules>();

/**
 * Creates a stable cache key from a locale and an options object.
 * NOTE: Options must be JSON-serializable.
 */
export function makeCacheKey(locale: string, options: object): CacheKey {
  return `${locale}::${JSON.stringify(options)}` as CacheKey;
}
