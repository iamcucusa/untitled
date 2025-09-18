/** @type {import('@lingui/conf').LinguiConfig} */
const { formatter } = require('@lingui/format-po');

module.exports = {
  locales: ['en', 'es'],
  sourceLocale: 'en',
  catalogs: [
    {
      /**
       *  Pin the basename to "common" for now
       */
      path: 'src/locales/{locale}/common',
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
