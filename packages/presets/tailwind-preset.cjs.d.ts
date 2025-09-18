// Type the Tailwind preset as a Partial<Config> to be flexible.
import type { Config } from 'tailwindcss';

declare const preset: Partial<Config>;
export = preset; // matches the CommonJS export of tailwind-preset.cjs
