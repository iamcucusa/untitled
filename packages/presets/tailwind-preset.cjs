
const tokensPreset = require('@ds/tokens/dist/tailwind/preset.cjs');

module.exports = {
  darkMode: 'class',
  theme: tokensPreset.theme,
  plugins: [
    require('@ds/styles/tailwind-plugin.cjs')
  ]
};
