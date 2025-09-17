import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const repoName = process.env.GITHUB_REPOSITORY?.split('/')?.[1] ?? '';
const isCI = process.env.CI === 'true';
const ciBase = repoName ? `/${repoName}/` : '/';

const baseFromEnv = process.env.VITE_BASE;

export default defineConfig({
  base: baseFromEnv ?? (isCI ? ciBase : '/'),
  plugins: [react()],
});
