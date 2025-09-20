/** @type {import('@lingui/conf').LinguiConfig} */
export default {
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
   * ESM export: `export const messages = {...}`
   */
  compileNamespace: 'es',
};
