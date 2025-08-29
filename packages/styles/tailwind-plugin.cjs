
/** Optional Tailwind plugin for custom utilities */
module.exports = function({ addUtilities }){
  addUtilities({
    '.focus-ring': {
      outline: '2px solid var(--color-primary-600)',
      outlineOffset: '2px'
    }
  });
};
