import { useI18n } from '@untitled-ds/i18n-react';

/**
 * Pricing demo component showcasing internationalized pricing content.
 *
 * Features:
 * - Uses i18n for pricing title and call-to-action text
 * - Demonstrates namespace-based translation loading
 * - Accessible button and heading structure
 *
 * @returns {JSX.Element} A pricing section with internationalized content
 */
export function PricingDemo(): JSX.Element {
  const i18n = useI18n();
  return (
    <section className="card space-y-2 p-4">
      <h2 className="text-lg font-semibold">{i18n.t('pricing.title', undefined, 'pricing')}</h2>
      <button className="btn">{i18n.t('pricing.cta', undefined, 'pricing')}</button>
    </section>
  );
}
