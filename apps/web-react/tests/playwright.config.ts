import { defineConfig } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

/** Create ESM-safe __dirname equivalent for Node.js compatibility */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  testDir: __dirname, // keep tests in this folder
  webServer: {
    command: 'pnpm exec vite preview --port 4173 --strictPort', // run from app dir
    port: 4173,
    reuseExistingServer: !process.env.CI,
    cwd: path.resolve(__dirname, '..'), // <-- apps/web-react
  },
  use: { headless: true },
});
