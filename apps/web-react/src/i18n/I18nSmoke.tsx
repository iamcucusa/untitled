import React from 'react';
import { useI18n } from '@untitled-ds/i18n-react';
import { asLocaleCode } from '@untitled-ds/i18n-core';

/**
 * Minimal demo:
 * - Loads 'common' namespace on mount.
 * - Toggles locale between English and Spanish.
 */
export function I18nSmoke() {
  const i18n = useI18n();
  const [state, setState] = React.useState(() => ({
    locale: i18n.locale,
    currency: i18n.currency,
  }));

  React.useEffect(() => {
    const unsubscribe = i18n.onChange(setState);
    void i18n.setLocale(i18n.locale, 'common');
    return unsubscribe;
  }, [i18n]);

  return (
    <div style={{ padding: 16, border: '1px solid #e5e7eb', borderRadius: 8 }}>
      <div>
        <strong>Locale:</strong> {state.locale}
      </div>
      <div>
        <strong>Currency:</strong> {state.currency}
      </div>
      <div style={{ marginTop: 8 }}>
        <strong>t("common.hello"):</strong> {i18n.t('common.hello', undefined, 'common')}
      </div>
      <button
        style={{ marginTop: 12 }}
        onClick={() => {
          const next = state.locale.startsWith('en') ? asLocaleCode('es') : asLocaleCode('en');
          void i18n.setLocale(next, 'common');
        }}
      >
        Toggle locale
      </button>
    </div>
  );
}
