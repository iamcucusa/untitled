/** @type {import('@lingui/conf').LinguiConfig} */
const { formatter } = require('@lingui/format-po');

module.exports = {
  locales: ['en', 'es'],
  sourceLocale: 'en',
  /**
   * Extract/compile catalogs per namespace:
   *   src/locales/{locale}/{name}.po  →  {name}.(js|mjs)
   */
  catalogs: [
    {
      path: 'src/locales/{locale}/{name}',
      include: ['src'],
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
   *  ESM output (your loader already supports .js/.mjs)
   */
  compileNamespace: 'es',
};
