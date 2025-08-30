const fs = require('fs');
const path = require('path');

const outCssDir = path.join(__dirname, 'dist/css');
const outTwDir = path.join(__dirname, 'dist/tailwind');
fs.mkdirSync(outCssDir, { recursive: true });
fs.mkdirSync(outTwDir, { recursive: true });

/** Concatenate token sources into variables.css (no transforms, minimal complexity) */
const sources = [
  'src/palette.css',
  'src/shadows.css',
  'src/blurs.css',
  'src/typography.css',
  'src/semantic.css',
];

const css = sources.map((f) => fs.readFileSync(path.join(__dirname, f), 'utf8')).join('\n\n');
fs.writeFileSync(path.join(outCssDir, 'variables.css'), css);

/** Tailwind preset mapping -> major token sets (colors/shadows/radius/font) */
const preset = `module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gray: { 25:'var(--color-gray-25)',50:'var(--color-gray-50)',100:'var(--color-gray-100)',200:'var(--color-gray-200)',300:'var(--color-gray-300)',400:'var(--color-gray-400)',500:'var(--color-gray-500)',600:'var(--color-gray-600)',700:'var(--color-gray-700)',800:'var(--color-gray-800)',900:'var(--color-gray-900)' },
        primary: { 25:'var(--color-primary-25)',50:'var(--color-primary-50)',100:'var(--color-primary-100)',200:'var(--color-primary-200)',300:'var(--color-primary-300)',400:'var(--color-primary-400)',500:'var(--color-primary-500)',600:'var(--color-primary-600)',700:'var(--color-primary-700)',800:'var(--color-primary-800)',900:'var(--color-primary-900)' },
        error: { 25:'var(--color-error-25)',50:'var(--color-error-50)',100:'var(--color-error-100)',200:'var(--color-error-200)',300:'var(--color-error-300)',400:'var(--color-error-400)',500:'var(--color-error-500)',600:'var(--color-error-600)',700:'var(--color-error-700)',800:'var(--color-error-800)',900:'var(--color-error-900)' },
        warning: { 25:'var(--color-warning-25)',50:'var(--color-warning-50)',100:'var(--color-warning-100)',200:'var(--color-warning-200)',300:'var(--color-warning-300)',400:'var(--color-warning-400)',500:'var(--color-warning-500)',600:'var(--color-warning-600)',700:'var(--color-warning-700)',800:'var(--color-warning-800)',900:'var(--color-warning-900)' },
        success: { 25:'var(--color-success-25)',50:'var(--color-success-50)',100:'var(--color-success-100)',200:'var(--color-success-200)',300:'var(--color-success-300)',400:'var(--color-success-400)',500:'var(--color-success-500)',600:'var(--color-success-600)',700:'var(--color-success-700)',800:'var(--color-success-800)',900:'var(--color-success-900)' },
        blue: { 25:'var(--color-blue-25)',50:'var(--color-blue-50)',100:'var(--color-blue-100)',200:'var(--color-blue-200)',300:'var(--color-blue-300)',400:'var(--color-blue-400)',500:'var(--color-blue-500)',600:'var(--color-blue-600)',700:'var(--color-blue-700)',800:'var(--color-blue-800)',900:'var(--color-blue-900)' },
        'blue-light': { 25:'var(--color-blue-light-25)',50:'var(--color-blue-light-50)',100:'var(--color-blue-light-100)',200:'var(--color-blue-light-200)',300:'var(--color-blue-light-300)',400:'var(--color-blue-light-400)',500:'var(--color-blue-light-500)',600:'var(--color-blue-light-600)',700:'var(--color-blue-light-700)',800:'var(--color-blue-light-800)',900:'var(--color-blue-light-900)' },
        'blue-gray': { 25:'var(--color-blue-gray-25)',50:'var(--color-blue-gray-50)',100:'var(--color-blue-gray-100)',200:'var(--color-blue-gray-200)',300:'var(--color-blue-gray-300)',400:'var(--color-blue-gray-400)',500:'var(--color-blue-gray-500)',600:'var(--color-blue-gray-600)',700:'var(--color-blue-gray-700)',800:'var(--color-blue-gray-800)',900:'var(--color-blue-gray-900)' },
        indigo: { 25:'var(--color-indigo-25)',50:'var(--color-indigo-50)',100:'var(--color-indigo-100)',200:'var(--color-indigo-200)',300:'var(--color-indigo-300)',400:'var(--color-indigo-400)',500:'var(--color-indigo-500)',600:'var(--color-indigo-600)',700:'var(--color-indigo-700)',800:'var(--color-indigo-800)',900:'var(--color-indigo-900)' },
        purple: { 25:'var(--color-purple-25)',50:'var(--color-purple-50)',100:'var(--color-purple-100)',200:'var(--color-purple-200)',300:'var(--color-purple-300)',400:'var(--color-purple-400)',500:'var(--color-purple-500)',600:'var(--color-purple-600)',700:'var(--color-purple-700)',800:'var(--color-purple-800)',900:'var(--color-purple-900)' },
        pink: { 25:'var(--color-pink-25)',50:'var(--color-pink-50)',100:'var(--color-pink-100)',200:'var(--color-pink-200)',300:'var(--color-pink-300)',400:'var(--color-pink-400)',500:'var(--color-pink-500)',600:'var(--color-pink-600)',700:'var(--color-pink-700)',800:'var(--color-pink-800)',900:'var(--color-pink-900)' },
        rose: { 25:'var(--color-rose-25)',50:'var(--color-rose-50)',100:'var(--color-rose-100)',200:'var(--color-rose-200)',300:'var(--color-rose-300)',400:'var(--color-rose-400)',500:'var(--color-rose-500)',600:'var(--color-rose-600)',700:'var(--color-rose-700)',800:'var(--color-rose-800)',900:'var(--color-rose-900)' },
        orange: { 25:'var(--color-orange-25)',50:'var(--color-orange-50)',100:'var(--color-orange-100)',200:'var(--color-orange-200)',300:'var(--color-orange-300)',400:'var(--color-orange-400)',500:'var(--color-orange-500)',600:'var(--color-orange-600)',700:'var(--color-orange-700)',800:'var(--color-orange-800)',900:'var(--color-orange-900)' }
      },
      borderRadius: { sm:'var(--radius-sm)', md:'var(--radius-md)', lg:'var(--radius-lg)' },
      boxShadow: { xs:'var(--shadow-xs)', sm:'var(--shadow-sm)', md:'var(--shadow-md)', lg:'var(--shadow-lg)', xl:'var(--shadow-xl)', '2xl':'var(--shadow-2xl)', '3xl':'var(--shadow-3xl)' },
      fontFamily: { sans: ['var(--font-family)','system-ui','sans-serif'] },
      fontSize: {
        'display-2xl':['var(--fs-display-2xl)',{lineHeight:'var(--lh-display-2xl)'}],
        'display-xl':['var(--fs-display-xl)',{lineHeight:'var(--lh-display-xl)'}],
        'display-lg':['var(--fs-display-lg)',{lineHeight:'var(--lh-display-lg)'}],
        'display-md':['var(--fs-display-md)',{lineHeight:'var(--lh-display-md)'}],
        'display-sm':['var(--fs-display-sm)',{lineHeight:'var(--lh-display-sm)'}],
        'display-xs':['var(--fs-display-xs)',{lineHeight:'var(--lh-display-xs)'}],
        xl:['var(--fs-text-xl)',{lineHeight:'var(--lh-text-xl)'}],
        lg:['var(--fs-text-lg)',{lineHeight:'var(--lh-text-lg)'}],
        base:['var(--fs-text-md)',{lineHeight:'var(--lh-text-md)'}],
        sm:['var(--fs-text-sm)',{lineHeight:'var(--lh-text-sm)'}],
        xs:['var(--fs-text-xs)',{lineHeight:'var(--lh-text-xs)'}]
      }
    }
  }
}`;
fs.writeFileSync(path.join(outTwDir, 'preset.cjs'), preset);

console.log('Built tokens → dist/css/variables.css & dist/tailwind/preset.cjs');
