/**
 * Babel Configuration for I18n Demo Application
 * 
 * This configuration enables LinguiJS message extraction and macro transformation
 * for the demo application. The plugin order is critical for proper functionality.
 * 
 * @fileoverview Babel configuration for internationalization support
 * @author Frontend Engineering Team
 * @version 1.0.0
 */

module.exports = {
  /**
   * Babel plugins configuration
   * Order is important: extract-messages must come before macros
   */
  plugins: [
    /**
     * LinguiJS message extraction plugin
     * Extracts translatable strings from source code
     */
    '@lingui/babel-plugin-extract-messages',
    
    /**
     * Babel macros plugin for LinguiJS
     * Transforms LinguiJS macros at build time
     */
    ['macros', {
      lingui: {
        corePackage: '@lingui/core'
      }
    }]
  ],

  /**
   * Babel presets configuration
   * Enables TypeScript and React support
   */
  presets: [
    /**
     * TypeScript preset with JSX support
     */
    ['@babel/preset-typescript', { 
      allExtensions: true, 
      isTSX: true 
    }],
    
    /**
     * React preset with automatic runtime
     */
    ['@babel/preset-react', { 
      runtime: 'automatic' 
    }],
  ],
};
