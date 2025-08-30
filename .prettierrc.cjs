/** @type {import("prettier").Config} */
module.exports = {
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  trailingComma: 'all',
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'always',

  // Plugins
  plugins: [
    'prettier-plugin-tailwindcss', // sorts Tailwind classes
    'prettier-plugin-packagejson', // sorts fields in package.json
  ],

  // Recognize common class utility helpers
  tailwindFunctions: ['cn', 'clsx', 'cva'],

  // Keep markdown readable + YAML safe quotes
  overrides: [
    { files: '*.md', options: { proseWrap: 'always' } },
    { files: ['*.yml', '*.yaml'], options: { singleQuote: false } },
  ],
};
