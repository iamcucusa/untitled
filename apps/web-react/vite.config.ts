import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { lingui } from '@lingui/vite-plugin';

/**
 * Vite configuration for the React application
 * Supports GitHub Pages deployment with proper base path handling
 */
export default defineConfig(({ mode }) => {
  // Get base path from environment variable (set by GitHub Actions)
  const base = process.env.VITE_BASE || '/';

  return {
    base,
    plugins: [
      lingui(),
      react({
        babel: { plugins: ['macros'] },
      }),
    ],
    build: {
      // Ensure consistent asset naming for GitHub Pages
      rollupOptions: {
        output: {
          assetFileNames: 'assets/[name]-[hash][extname]',
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js',
        },
      },
    },
  };
});
