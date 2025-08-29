
/* Style Dictionary config (optional).
 * You can run `pnpm -C packages/tokens build` to (re)generate files from src/tokens.json.
 */
const StyleDictionary = require('style-dictionary');

module.exports = {
  source: ['src/tokens.json'],
  platforms: {
    css: {
      transforms: ['attribute/cti','name/cti/kebab','color/css'],
      buildPath: 'dist/css/',
      files: [{
        destination: 'variables.css',
        format: 'css/variables',
        options: { selector: ':root' }
      }]
    },
    // A basic Tailwind preset dump (you can enhance this later).
    tailwind: {
      buildPath: 'dist/tailwind/',
      files: [{
        destination: 'preset.cjs',
        format: function({ dictionary }) {
          const color = dictionary.properties.color || {};
          const radius = dictionary.properties.radius || {};
          const shadow = dictionary.properties.shadow || {};
          return `module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'var(--color-primary-50)',
          600: 'var(--color-primary-600)',
          700: 'var(--color-primary-700)'
        },
        gray: {
          25: 'var(--color-gray-25)',
          500: 'var(--color-gray-500)',
          900: 'var(--color-gray-900)'
        },
        success: { 500: 'var(--color-success-500)' },
        error: { 500: 'var(--color-error-500)' },
        warning: { 500: 'var(--color-warning-500)' }
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)'
      },
      boxShadow: {
        sm: 'var(--shadow-sm)'
      }
    }
  }
}`;
        }
      }]
    }
  }
};
