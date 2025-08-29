
import type { Config } from 'tailwindcss'
import preset from '@ds/presets/tailwind-preset.cjs'

export default {
  presets: [preset],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
} satisfies Config
