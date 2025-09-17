export type Locale = string & { readonly __brand: 'Locale' };
export type CurrencyCode = string & { readonly __brand: 'CurrencyCode' };

export function asLocale(value: string): Locale {
  /**
   * Optionally validate BCP‑47; keep lightweight for now
   */
  return value as Locale;
}
export function asCurrency(value: string): CurrencyCode {
  /**
   * Optionally validate ISO 4217; keep lightweight for now
   */
  return value as CurrencyCode;
}
