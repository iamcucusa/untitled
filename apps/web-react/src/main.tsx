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
      {dark ? 'Dark ✓' : 'Light ✓'}
    </button>
  );
}

function App() {
  return (
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

      {/* Card uses semantic tokens (card/bg/fg/border) */}
      <section className="card p-4 shadow-sm">
        <p>
          This React app consumes the shared tokens, styles, and Tailwind preset. Colors come from
          <code className="mx-1 rounded border px-1">:root</code> semantic tokens, not hard-coded
          Tailwind color utilities.
        </p>
        <p className="mt-3">
          <a href="#" className="link">
            Token-driven link
          </a>
        </p>
        <div className="mt-4">
          <input className="input" placeholder="Focus me to see :focus-visible ring" />
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
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
