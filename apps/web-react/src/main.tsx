import React from 'react';
import { createRoot } from 'react-dom/client';
import './tailwind.css';

function App() {
  return (
    <div className="space-y-6 p-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Design System • React</h1>
        <div className="flex items-center gap-2">
          <button className="btn">Primary</button>
          <button className="btn-outline">Outline</button>
          <span className="badge">Beta</span>
        </div>
      </header>
      <section className="rounded-lg border bg-white p-4 shadow-sm">
        <p className="text-gray-700">
          This React app consumes the shared tokens, styles and Tailwind preset.
        </p>
      </section>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
