import React from 'react';
import { t } from '@lingui/macro';
import { useI18n } from '@untitled-ds/i18n-react';
import { asLocaleCode } from '@untitled-ds/i18n-core';

/**
 * Macro-based smoke:
 * - Sources extraction via `t` macro.
 * - Loads the 'common' namespace.
 */
export function MacroSmoke(): JSX.Element {
  const i18n = useI18n();
  const [locale, setLocale] = React.useState(i18n.locale);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    let alive = true;
    setReady(false);
    (async () => {
      await i18n.setLocale(locale, 'common');
      if (alive) setReady(true);
    })();
    return () => {
      alive = false;
    };
  }, [i18n, locale]);

  /**
   * `t` marks this string for extraction into the 'common' namespace.
   * With the Vite plugin, Lingui will detect it in `extract`.
   */
  const helloId = t('common.hello');

  return (
    <div className="card space-y-2 p-4">
      <div>
        <strong>Locale:</strong> {locale}
      </div>
      <div>
        <strong>
          <code>t("common.hello")</code>:
        </strong>{' '}
        {ready ? i18n.t(helloId, undefined, 'common') : '…'}
      </div>
      <button
        className="btn btn-outline mt-2"
        onClick={() => setLocale(locale.startsWith('en') ? asLocaleCode('es') : asLocaleCode('en'))}
      >
        Toggle locale
      </button>
    </div>
  );
}
