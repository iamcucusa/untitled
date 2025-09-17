# @untitled-ds/intl-core

Lightweight, memoized wrappers around the native [`Intl`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl) APIs for formatting numbers, currencies, dates, relative time, and plural categories; plus safe locale negotiation.

## ✨ Features

- ✅ Built on browser-native Intl APIs — no polyfills or runtime parsers.
- 🔁 Memoized formatters — avoids formatter re-creation on every call.
- 🌍 Locale negotiation — exact + base language fallback.
- 💸 Currency & number formatting — with precise types.
- 🕓 Date & relative time support — works across locales.
- 🔣 Plural rule categories — for ICU-style message logic.
- 💡 TypeScript-first — branded types for `Locale`, `CurrencyCode`.

## 🔧 Usage

```ts
import {
  formatCurrency,
  formatNumber,
  formatDate,
  formatRelativeTime,
  getPluralCategory,
  asLocale,
  asCurrency,
  negotiateLocale
} from '@untitled-ds/intl-core';

const locale = asLocale('es-ES');
const currency = asCurrency('EUR');

formatCurrency(1299.95, locale, currency);         // → "1.299,95 €"
formatNumber(0.65, locale, { style: 'percent' });  // → "65 %"
formatDate(new Date(), locale, { dateStyle: 'long' });
formatRelativeTime(-3, 'day', locale);             // → "hace 3 días"
getPluralCategory(1, locale);                      // → "one"
```

## 🧠 Best practices

- 🔁 Designed for dist-only consumption: always import from the compiled output (dist/).
- ⚙️ Built with "target": "ES2022" and "module": "ES2022" for modern bundlers.
- 📦 Works in React, Angular, Vue, Web Components — no framework bindings included (see adapters).

##  📁 Package structure

- brands.ts → Branded types: Locale, CurrencyCode 
- cache.ts → Memoization store 
- number.ts → formatNumber, formatCurrency 
- date.ts, relative.ts → formatDate, formatRelativeTime 
- plural.ts → getPluralCategory 
- negotiate.ts → negotiateLocale(...)

##  📦 Build

```bash
pnpm -C packages/intl-core build
```
