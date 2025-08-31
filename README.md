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

To use with Angular/Vue, point Tailwind to `@untitled-ds/tokens/dist/tailwind/preset.cjs` and put
imports first in the app’s Tailwind entry CSS:

- @import '@untitled-ds/tokens/dist/css/variables.css';
- @import '@untitled-ds/styles/src/base.css';
- @import '@untitled-ds/styles/src/components.css';
- @import '@untitled-ds/styles/src/utilities.css';

- @tailwind base;
- @tailwind components;
- @tailwind utilities;

## Accessibility (measured)

- **Targets:** WCAG 2.1 AA; Lighthouse **≥ 98** (Accessibility); axe **0 serious/critical**.
- **Reduced motion:** honors `prefers-reduced-motion` (motion tokens collapse to 0ms; global clamp).
- **Dialogs:** focus trap, ESC to close, restore focus, `aria-modal`.
- **Forms:** labels, hints/errors wired with `aria-describedby`, `aria-invalid`, error summary for large forms.
- **Routing (planned):** focus main on navigation, update title, announce page change via live region.

**Run locally**
```bash
 pnpm run a11y:lh   # Lighthouse report → lhci-report/
 pnpm run a11y:axe  # axe-core via Playwright
 pnpm run a11y:rm   # reduced-motion spec (transitions -> 0ms)
