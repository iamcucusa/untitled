
const tokensPreset = require('@untitled-ds/tokens/dist/tailwind/preset.cjs');

module.exports = {
  darkMode: 'class',
  theme: tokensPreset.theme,
  plugins: [
    require('@untitled-ds/styles/tailwind-plugin.cjs')
  ]
};
