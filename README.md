
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

To use with Angular/Vue, point their Tailwind config to `@untitled-ds/presets/tailwind-preset.cjs`
and import `@untitled-ds/styles/src/theme.css` in the global styles.
