import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { lingui } from '@lingui/vite-plugin';
import { copyFileSync, mkdirSync, existsSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

/**
 * Vite configuration for the React application
 * Supports GitHub Pages deployment with proper base path handling
 */
export default defineConfig(({ mode }) => {
  /** Get base path from environment variable for deployment configuration */
  const base = process.env.VITE_BASE || '/';

  return {
    base,
    plugins: [
      lingui(),
      react({
        babel: { plugins: ['macros'] },
      }),
      /** Custom plugin to copy compiled Lingui catalogs to distribution */
      {
        name: 'copy-catalogs',
        writeBundle() {
          const srcLocales = join(process.cwd(), 'src/locales');
          const distLocales = join(process.cwd(), 'dist/src/locales');

          if (existsSync(srcLocales)) {
            /** Recursively copy all compiled .mjs catalog files to distribution */
            function copyMjsFiles(srcDir: string, destDir: string) {
              if (!existsSync(destDir)) {
                mkdirSync(destDir, { recursive: true });
              }

              const items = readdirSync(srcDir);
              for (const item of items) {
                const srcPath = join(srcDir, item);
                const destPath = join(destDir, item);

                if (statSync(srcPath).isDirectory()) {
                  copyMjsFiles(srcPath, destPath);
                } else if (item.endsWith('.mjs')) {
                  copyFileSync(srcPath, destPath);
                }
              }
            }

            copyMjsFiles(srcLocales, distLocales);
          }
        },
      },
    ],
    build: {
      /** Configure consistent asset naming for deployment */
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
