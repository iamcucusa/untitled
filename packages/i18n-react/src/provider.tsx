import React, { createContext, useContext, useSyncExternalStore } from 'react';
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

  /**
   * Subscribe to external store changes.
   * Wrap the store's change event to call React's listener.
   */
  const subscribe = (listener: () => void) => i18n.onChange(() => listener());

  /**
   * IMPORTANT: getSnapshot MUST return a stable reference when the state
   * hasn't changed. Use a primitive composite key instead of a new object.
   */
  const getSnapshot = () => `${i18n.locale}|${i18n.currency}`;

  // For SSR environments; same shape as getSnapshot
  const getServerSnapshot = getSnapshot;

  // We don't use the returned value directly; it only triggers re-renders.
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

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
