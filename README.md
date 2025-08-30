# Monorepo Design System (Tokens → Tailwind Preset → Multi‑Framework)

This monorepo hosts a cross‑framework design system used by React, Angular, and Vue apps.

**Packages**

- `@untitled-ds/tokens` — source of truth (tokens) → CSS variables + Tailwind preset
- `@untitled-ds/styles` — global CSS layers (base, theme, components)
- `@untitled-ds/presets` — Tailwind preset that maps tokens to Tailwind theme

**Apps**

- `apps/web-react` — Vite + React sample consuming the DS

## Quick start

```bash
pnpm i
pnpm dev   # launches React app
```

To use with Angular/Vue, point Tailwind to `@untitled-ds/tokens/dist/tailwind/preset.cjs`
and put imports first in the app’s Tailwind entry CSS:

- @import '@untitled-ds/tokens/dist/css/variables.css';
- @import '@untitled-ds/styles/src/base.css';
- @import '@untitled-ds/styles/src/components.css';
- @import '@untitled-ds/styles/src/utilities.css';

- @tailwind base;
- @tailwind components;
- @tailwind utilities;
