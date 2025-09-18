/** @type {import('@lingui/conf').LinguiConfig} */
module.exports = {
  locales: ['en', 'es'],
  sourceLocale: 'en',
  catalogs: [
    {
      path: 'locales/{locale}/messages',
      include: ['src'],
    },
  ],
  format: 'po',
  /**
   * keep runtime small; compile to minimal JS
   */
  compileNamespace: 'cjs',
};
