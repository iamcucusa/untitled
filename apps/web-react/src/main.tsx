import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
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

function App() {
  return (
    <>
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

          {/* Overlay demo (backdrop uses --overlay token; works in light/dark) */}
          <OverlayDemo />
        </main>
      </div>
    </>
  );
}

function OverlayDemo() {
  const [open, setOpen] = useState(false);
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">Overlay</h2>
      <button className="btn btn-outline" onClick={() => setOpen(true)}>
        Open overlay
      </button>
      {open && (
        <div className="overlay" onClick={() => setOpen(false)}>
          <div
            className="card w-[min(100%,28rem)] max-w-md rounded-xl p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-2 text-lg font-semibold">Token Overlay</h3>
            <p className="text-sm">
              Backdrop uses <code>--overlay</code>. Click outside to close. Toggle Dark to see it
              adapt.
            </p>
            <div className="mt-4 flex justify-end">
              <button className="btn" onClick={() => setOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
