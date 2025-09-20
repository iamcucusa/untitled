/**
 * LinguiJS Configuration for I18n Demo Application
 *
 * This configuration defines how LinguiJS extracts, compiles, and manages
 * translations for the demo application. It supports English and Spanish
 * locales with namespace-based message organization.
 *
 * @fileoverview LinguiJS configuration for internationalization
 * @author Frontend Engineering Team
 * @version 1.0.0
 */

/** @type {import('@lingui/conf').LinguiConfig} */
import { formatter } from '@lingui/format-po';

export default {
  /**
   * Supported locales for the application
   * English (en) is the source locale, Spanish (es) is the target locale
   */
  locales: ['en', 'es'],
  sourceLocale: 'en',

  /**
   * Message catalogs configuration
   * Each catalog represents a namespace with its own translation files
   */
  catalogs: [
    {
      path: 'src/locales/{locale}/common',
      include: ['src/i18n/**/*'],
    },
    {
      path: 'src/locales/{locale}/pricing',
      include: ['src/routes/pricing/**/*'],
    },
  ],

  /**
   * Message formatting configuration
   * Uses explicit IDs for better maintainability and debugging
   */
  format: formatter({
    explicitIdAsDefault: true,
    origins: false,
    lineNumbers: false,
  }),

  /**
   * Compilation settings
   * Generates ES modules for better tree-shaking and performance
   */
  compileNamespace: 'es',

  /**
   * Fallback locale configuration
   * Ensures English is used when translations are missing
   */
  fallbackLocales: {
    default: 'en',
  },
};
