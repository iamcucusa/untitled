# Multi-Framework Readiness Analysis

## Current Architecture Assessment

### ✅ **Framework-Agnostic Core**

The `@untitled-ds/i18n-core` package is already well-designed for multi-framework usage:

- **Zero React Dependencies**: Only depends on `@lingui/core` and TypeScript
- **Generic I18n Class**: Framework-agnostic state management and translation logic
- **Branded Types**: Type-safe locale and currency handling
- **Subscription Pattern**: Generic change notification system

### ✅ **Clean Separation**

- **Core Logic**: `packages/i18n-core/` - Framework-agnostic
- **React Adapter**: `packages/i18n-react/` - React-specific implementation
- **Intl Utilities**: `packages/intl-core/` - Pure JavaScript formatting

## Multi-Framework Implementation Strategy

### 1. **Framework-Agnostic Formatting Utilities**

Created `packages/i18n-core/src/formatting.ts` with:

- Direct `Intl` API usage (no external dependencies)
- `FormattingContext` class for stateful formatting
- Framework-agnostic functions for all formatting needs

```typescript
// Framework-agnostic currency formatting
export function formatCurrencyAmount(
  amount: number,
  locale: LocaleCode,
  currency: CurrencyCode,
  options?: Intl.NumberFormatOptions,
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    ...options,
  }).format(amount);
}

// Stateful formatting context
export class FormattingContext {
  constructor(
    public readonly locale: LocaleCode,
    public readonly currency: CurrencyCode,
  ) {}

  formatCurrency(amount: number, options?: Intl.NumberFormatOptions): string {
    return formatCurrencyAmount(amount, this.locale, this.currency, options);
  }
}
```

### 2. **Framework-Specific Adapters**

Created adapter interfaces for different frameworks:

#### **React Adapter** (Already Implemented)

```typescript
// packages/i18n-react/src/provider.tsx
export function I18nProvider(props: { i18n: I18n; children: React.ReactNode }) {
  const subscribe = (listener: () => void) => i18n.onChange(() => listener());
  const getSnapshot = () => `${i18n.locale}|${i18n.currency}`;
  useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  return <I18nContext.Provider value={i18n}>{children}</I18nContext.Provider>;
}
```

#### **Angular Adapter** (Example Implementation)

```typescript
// packages/i18n-angular/src/adapter.ts
@Injectable({ providedIn: 'root' })
export class AngularI18nAdapter extends BaseI18nAdapter {
  private readonly stateSubject = new BehaviorSubject<{
    locale: LocaleCode;
    currency: CurrencyCode;
  }>({ locale: this.i18n.locale, currency: this.i18n.currency });

  getLocale$(): Observable<LocaleCode> {
    return this.stateSubject.pipe(map((state) => state.locale));
  }
}
```

#### **Vue Adapter** (Example Implementation)

```typescript
// packages/i18n-vue/src/composables.ts
export function useI18n(i18n: I18n) {
  const locale = ref(i18n.locale);
  const currency = ref(i18n.currency);
  const formattingContext = computed(() => new FormattingContext(locale.value, currency.value));

  return { locale, currency, formattingContext /* methods */ };
}
```

#### **Web Components Adapter** (Example Implementation)

```typescript
// packages/i18n-wc/src/adapter.ts
export class WebComponentsI18nAdapter extends BaseI18nAdapter {
  private readonly eventTarget = new EventTarget();

  dispatchLocaleChange(locale: LocaleCode): void {
    const event = new CustomEvent('localechange', { detail: { locale } });
    this.eventTarget.dispatchEvent(event);
  }
}
```

### 3. **Message Extraction Patterns**

#### **Current React-Specific Patterns**

```typescript
// ❌ React-specific (but acceptable for React apps)
const i18n = useI18n();
const translated = i18n.t('Hello', undefined, 'common');
```

#### **Framework-Agnostic Patterns**

```typescript
// ✅ Framework-agnostic (works in any framework)
const i18n = getI18nInstance(); // Injected or provided
const translated = i18n.t('Hello', undefined, 'common');
```

#### **Lingui Extraction Compatibility**

- **React**: Uses `@lingui/macro` for compile-time extraction
- **Angular**: Can use `@lingui/cli` for build-time extraction
- **Vue**: Can use `@lingui/cli` for build-time extraction
- **Web Components**: Can use `@lingui/cli` for build-time extraction

## Implementation Roadmap

### Phase 1: Core Framework-Agnostic Utilities ✅

- [x] Create `FormattingContext` class
- [x] Implement direct `Intl` API usage
- [x] Framework-agnostic formatting functions
- [x] Base adapter interface

### Phase 2: Framework-Specific Packages

- [ ] `@untitled-ds/i18n-angular` - Angular adapter with RxJS
- [ ] `@untitled-ds/i18n-vue` - Vue adapter with Composition API
- [ ] `@untitled-ds/i18n-wc` - Web Components adapter with custom events

### Phase 3: Framework-Specific Extraction

- [ ] Angular: CLI integration for message extraction
- [ ] Vue: CLI integration for message extraction
- [ ] Web Components: CLI integration for message extraction

## Current Demo Refactoring

### **Before (React-Specific)**

```typescript
// React-specific formatting in component
const formatCurrencyAmount = (amount: number): string => {
  return formatCurrency(amount, asLocale(locale), asCurrency(currency));
};
```

### **After (Framework-Agnostic)**

```typescript
// Framework-agnostic formatting context
const formattingContext = React.useMemo(() => {
  return new FormattingContext(locale, currency);
}, [locale, currency]);

// Usage in JSX
<span>{formattingContext.formatCurrency(12.99)}</span>
```

## Benefits of Multi-Framework Approach

### 1. **Code Reusability**

- Core i18n logic shared across all frameworks
- Formatting utilities work identically in all frameworks
- Consistent API across different environments

### 2. **Framework-Specific Optimizations**

- React: Uses `useSyncExternalStore` for optimal re-renders
- Angular: Uses RxJS observables for reactive updates
- Vue: Uses Composition API for reactive state
- Web Components: Uses custom events for decoupled communication

### 3. **Maintenance Efficiency**

- Single source of truth for i18n logic
- Framework-specific adapters are thin wrappers
- Easy to add new frameworks without duplicating core logic

### 4. **Developer Experience**

- Consistent API across frameworks
- Framework-specific optimizations where needed
- Easy migration between frameworks

## Migration Strategy

### **For Existing React Apps**

1. Keep using `@untitled-ds/i18n-react` (no changes needed)
2. Gradually adopt `FormattingContext` for new components
3. Refactor existing components to use framework-agnostic patterns

### **For New Angular Apps**

1. Install `@untitled-ds/i18n-angular`
2. Use Angular adapter with RxJS observables
3. Leverage `FormattingContext` for all formatting needs

### **For New Vue Apps**

1. Install `@untitled-ds/i18n-vue`
2. Use Vue Composition API with reactive refs
3. Leverage `FormattingContext` for all formatting needs

### **For Web Components**

1. Install `@untitled-ds/i18n-wc`
2. Use custom events for state management
3. Leverage `FormattingContext` for all formatting needs

## Conclusion

The current architecture is **already well-positioned** for multi-framework usage:

✅ **Core i18n logic is framework-agnostic** ✅ **React adapter is properly separated** ✅
**Formatting utilities use standard Intl APIs** ✅ **Message extraction patterns are
framework-agnostic**

The main work needed is creating framework-specific adapter packages, which can be done
incrementally without breaking existing React applications.
