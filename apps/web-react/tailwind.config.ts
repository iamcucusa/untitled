import type { Config } from 'tailwindcss';
import preset from '@untitled-ds/presets/tailwind-preset.cjs';

export default {
  presets: [preset],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
} satisfies Config;
