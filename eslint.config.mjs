/** eslint.config.mjs (flat config for ESLint v9) */
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import { FlatCompat } from '@eslint/eslintrc';
import { fileURLToPath } from 'url';
import path from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

/** ESM-safe __dirname for FlatCompat (to reuse legacy plugin configs) */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({ baseDirectory: __dirname });

export default [
  /** Ignore build/artifact folders */
  {
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '**/test-results/**',
      '**/playwright-report/**',
      '**/blob-report/**',
      'lhci-report/**',
      '**/src/locales/**/*.mjs', /** Generated Lingui files */
    ],
  },

  /** Base JS and TS recommended rules (non type-checked for speed) */
  js.configs.recommended,
  ...tseslint.configs.recommended,

  /** Reuse plugin recommended sets via FlatCompat (React, Hooks, a11y) */
  ...compat.extends(
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
  ),

  /** Project-specific settings for our React/TS app */
  {
    files: ['apps/**/*.ts', 'apps/**/*.tsx'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      'i18n': require('./apps/web-react/eslint-plugin-i18n.cjs'),
    },
    settings: { 
      react: { 
        version: 'detect',
        runtime: 'automatic'
      } 
    },
    rules: {
      /** React 17+ JSX transform (no need to import React) */
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      
      /** Custom i18n indirection detection rules */
      'i18n/no-i18n-indirection': 'error',
    },
  },
];
