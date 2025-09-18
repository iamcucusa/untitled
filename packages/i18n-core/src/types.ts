export type LocaleCode = string & { readonly __brand: 'LocaleCode' };
export type CurrencyCode = string & { readonly __brand: 'CurrencyCode' };

export function asLocaleCode(value: string): LocaleCode {
  return value as LocaleCode;
}
export function asCurrencyCode(value: string): CurrencyCode {
  return value as CurrencyCode;
}

export type Messages = Record<string, string>;
export type Namespace = string;

export type CatalogLoader = (locale: string, namespace: Namespace) => Promise<Messages>;
