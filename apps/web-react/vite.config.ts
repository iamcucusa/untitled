import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { lingui } from '@lingui/vite-plugin';

export default defineConfig({
  plugins: [
    lingui(),
    react({
      babel: { plugins: ['macros'] },
    }),
  ],
});
