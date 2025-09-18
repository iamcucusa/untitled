import React, { createContext, useContext, useEffect, useSyncExternalStore } from 'react';
import type { I18n } from '@untitled-ds/i18n-core';

/**
 * React context that stores the shared I18n instance for this subtree.
 */
const I18nContext = createContext<I18n | null>(null);

/**
 * Provider that wires an I18n instance into React.
 *
 * It bridges the I18n change notifications into React renders using
 * the external store subscription pattern, so components update when
 * locale or currency changes.
 */
export function I18nProvider(props: { i18n: I18n; children: React.ReactNode }) {
  const { i18n, children } = props;

  const subscribe = (listener: () => void) => i18n.onChange(() => listener());
  const getSnapshot = () => ({ locale: i18n.locale, currency: i18n.currency });

  useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  /**
   * Placeholder for right‑to‑left handling.
   * A future enhancement can set document direction here based on the locale.
   */
  useEffect(() => {
    /**
     * example later: document.documentElement.dir = isRtl(i18n.locale) ? "rtl" : "ltr";
     */
  }, [i18n.locale]);

  return <I18nContext.Provider value={i18n}>{children}</I18nContext.Provider>;
}

/**
 * Accessor hook for the current I18n instance.
 *
 * @throws Error if used outside of an I18nProvider.
 */
export function useI18n(): I18n {
  const instance = useContext(I18nContext);
  if (!instance) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return instance;
}
