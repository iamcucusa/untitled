import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { createPortal } from 'react-dom';
import './tailwind.css';

function DarkModeToggle() {
  const [dark, setDark] = useState<boolean>(() =>
    document.documentElement.classList.contains('dark'),
  );

  // Load saved preference
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') setDark(true);
  }, []);

  // Apply preference
  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  return (
    <button
      className="btn btn-outline"
      onClick={() => setDark((d) => !d)}
      aria-pressed={dark}
      title="Toggle dark mode"
    >
      {dark ? 'Dark ✓' : 'Light'}
    </button>
  );
}

function OverlayDemo() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  // When open: lock scroll, hide app from AT, focus first item, trap focus, restore focus on close
  useEffect(() => {
    if (!open) return;

    const rootEl = document.getElementById('root');
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const prevAriaHidden = rootEl?.getAttribute('aria-hidden');
    rootEl?.setAttribute('aria-hidden', 'true');

    // focus first focusable (Close button)
    const first = dialogRef.current?.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    first?.focus();

    // ESC and focus trap
    const onKeyDown = (e: KeyboardEvent) => {
      if (!dialogRef.current) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        setOpen(false);
        return;
      }
      if (e.key !== 'Tab') return;

      const nodes = dialogRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      const focusables = Array.from(nodes).filter(
        (el) => !el.hasAttribute('disabled') && el.getAttribute('aria-hidden') !== 'true',
      );
      if (focusables.length === 0) return;

      const firstEl = focusables[0];
      const lastEl = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (e.shiftKey && active === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && active === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);

    // cleanup: restore scroll & aria-hidden; return focus to trigger
    return () => {
      document.body.style.overflow = prevOverflow;
      if (prevAriaHidden == null) rootEl?.removeAttribute('aria-hidden');
      else rootEl?.setAttribute('aria-hidden', prevAriaHidden);
      document.removeEventListener('keydown', onKeyDown);
      triggerRef.current?.focus();
    };
  }, [open]);

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">Overlay</h2>
      <button
        ref={triggerRef}
        className="btn btn-outline"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="demo-dialog"
      >
        Open overlay
      </button>

      {open &&
        createPortal(
          <div className="overlay" onClick={() => setOpen(false)}>
            <div
              id="demo-dialog"
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="dialog-title"
              aria-describedby="dialog-desc"
              className="card w-[min(100%,28rem)] max-w-md rounded-xl p-6 shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 id="dialog-title" className="mb-2 text-lg font-semibold">
                Token Overlay
              </h3>
              <p id="dialog-desc" className="text-sm">
                Backdrop uses <code>--overlay</code>. Click outside or press Esc to close. Toggle
                Dark to see it adapt.
              </p>
              <div className="mt-4 flex justify-end">
                <button className="btn" onClick={() => setOpen(false)} data-close>
                  Close
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </section>
  );
}

function App() {
  return (
    <>
      {/* Skip link first so keyboard users can jump straight to content */}
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <div className="space-y-8 p-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Design System • React</h1>
          <div className="flex items-center gap-2">
            <DarkModeToggle />
            <button className="btn">Primary</button>
            <button className="btn btn-outline">Outline</button>
            <span className="badge">Beta</span>
          </div>
        </header>

        <main id="main" tabIndex={-1} className="space-y-8">
          {/* Card uses semantic tokens (card/bg/fg/border) */}
          <section className="card p-4 shadow-sm">
            <p>
              This React app consumes the shared tokens, styles, and Tailwind preset. Colors come
              from
              <code className="mx-1 rounded border px-1">:root</code> semantic tokens, not
              hard-coded Tailwind color utilities.
            </p>
            <p className="mt-3">
              <a href="#" className="link">
                Token-driven link
              </a>{' '}
              • Try <kbd>Tab</kbd> below to see the focus ring.
            </p>
            <div className="mt-4">
              <input
                className="input"
                placeholder="Focus me to see the token-based :focus-visible outline"
              />
            </div>
          </section>

          {/* Shadows mapped via Tailwind preset → token variables */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Shadows</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="card shadow-xs p-4">shadow-xs</div>
              <div className="card p-4 shadow-sm">shadow-sm</div>
              <div className="card p-4 shadow-md">shadow-md</div>
              <div className="card p-4 shadow-lg">shadow-lg</div>
              <div className="card p-4 shadow-xl">shadow-xl</div>
              <div className="card p-4 shadow-2xl">shadow-2xl</div>
            </div>
          </section>

          {/* Radii showcase (token-mapped rounded-* via Tailwind preset) */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Radii</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
              <div className="card rounded-sm p-4 text-sm">rounded-sm</div>
              <div className="card rounded-md p-4 text-sm">rounded-md</div>
              <div className="card rounded-lg p-4 text-sm">rounded-lg</div>
              <div className="card rounded-xl p-4 text-sm">rounded-xl</div>
              <div className="card rounded-2xl p-4 text-sm">rounded-2xl</div>
            </div>
          </section>

          {/* Overlay demo (accessible: focus trap, ESC, restore focus) */}
          <OverlayDemo />
        </main>
      </div>
    </>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
