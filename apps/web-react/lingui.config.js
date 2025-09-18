/** @type {import('@lingui/conf').LinguiConfig} */
module.exports = {
  locales: ['en', 'es'],
  sourceLocale: 'en',
  /**
   * Compile per-namespace to ESM so the browser can import them.
   * Files will live under: src/locales/{locale}/{name}.js
   */
  catalogs: [
    {
      path: 'src/locales/{locale}/{name}',
      include: ['src'],
    },
  ],
  format: 'po',
  compileNamespace: 'es',
};
