
const fs = require('fs');
const path = require('path');

// 1) Ensure dist folders
const cssDir = path.join(__dirname, 'dist/css');
const twDir = path.join(__dirname, 'dist/tailwind');
fs.mkdirSync(cssDir, { recursive: true });
fs.mkdirSync(twDir, { recursive: true });

// 2) For simplicity now, write a minimal variables.css by hand.
// Replace or augment later with Style Dictionary if desired.
const variables = `:root{
  --color-gray-25:#fcfcfd;
  --color-gray-500:#667085;
  --color-gray-900:#101828;
  --color-primary-50:#f9f5ff;
  --color-primary-600:#7f56d9;
  --color-primary-700:#6941c6;
  --color-success-500:#12b76a;
  --color-error-500:#f04438;
  --color-warning-500:#f79009;
  --radius-sm:6px;
  --radius-md:8px;
  --radius-lg:12px;
  --shadow-sm:0 1px 2px rgba(16,24,40,.05);
}`;
fs.writeFileSync(path.join(cssDir, 'variables.css'), variables);

// 3) Minimal Tailwind preset
const preset = `module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: { 50:'var(--color-primary-50)', 600:'var(--color-primary-600)', 700:'var(--color-primary-700)'},
        gray: { 25:'var(--color-gray-25)', 500:'var(--color-gray-500)', 900:'var(--color-gray-900)'},
        success: { 500:'var(--color-success-500)' },
        error: { 500:'var(--color-error-500)' },
        warning: { 500:'var(--color-warning-500)' }
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
fs.writeFileSync(path.join(twDir, 'preset.cjs'), preset);

console.log('Tokens built → dist/css/variables.css & dist/tailwind/preset.cjs');
