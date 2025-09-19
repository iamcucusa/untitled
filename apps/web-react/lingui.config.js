/** @type {import('@lingui/conf').LinguiConfig} */
const { formatter } = require('@lingui/format-po');

module.exports = {
  locales: ['en', 'es'],
  sourceLocale: 'en',
  /**
   * Use {name} captured from include globs.
   * - Any t()/Trans in src/routes/{name}/** → {name}.po
   * - Any t()/Trans in src/i18n/{name}/** → {name}.po
   * Example: src/routes/pricing/PricingPage.tsx → pricing.po
   *          src/i18n/common/strings.ts → common.po
   */
  catalogs: [
    {
      path: 'src/locales/{locale}/{name}',
      include: ['src/routes/{name}/**/*.{ts,tsx}', 'src/i18n/{name}/**/*.{ts,tsx}'],
    },
  ],
  /**
   *  Keep semantic IDs instead of hashing
   */
  format: formatter({
    explicitIdAsDefault: true,
    origins: false,
    lineNumbers: false,
  }),
  /**
   *  ESM output (the loader supports .js/.mjs)
   */
  compileNamespace: 'es',
};
