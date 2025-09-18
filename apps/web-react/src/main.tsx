import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { createPortal } from 'react-dom';
import './tailwind.css';

import {
  asCurrency,
  asLocale,
  formatCurrency,
  formatDate,
  formatRelativeTime,
} from '@untitled-ds/intl-core';
import { createAppI18n } from './i18n/i18n';
import { I18nProvider } from '@untitled-ds/i18n-react';

const i18n = createAppI18n();

const negotiatedLocale = asLocale(navigator.language || 'en');
const defaultCurrency = asCurrency('EUR');

export function IntlSmoke() {
  const formattedPrice = formatCurrency(1299.95, negotiatedLocale, defaultCurrency);
  const formattedToday = formatDate(new Date(), negotiatedLocale, { dateStyle: 'long' });
  const threeDaysAgo = formatRelativeTime(-3, 'day', negotiatedLocale);

  return (
    <div style={{ padding: 16 }}>
      <div>
        <strong>Price:</strong> {formattedPrice}
      </div>
      <div>
        <strong>Today:</strong> {formattedToday}
      </div>
      <div>
        <strong>Relative:</strong> {threeDaysAgo}
      </div>
    </div>
  );
}

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
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);
  const dialogRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
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

    // capture current trigger for cleanup (fixes ref warning)
    const trigger = triggerRef.current;

    return () => {
      document.body.style.overflow = prevOverflow;
      if (prevAriaHidden == null) rootEl?.removeAttribute('aria-hidden');
      else rootEl?.setAttribute('aria-hidden', prevAriaHidden);
      document.removeEventListener('keydown', onKeyDown);
      trigger?.focus();
    };
  }, [open]);

  // keyboard-accessible backdrop: Enter/Space closes, click only when target===currentTarget
  const onBackdropKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setOpen(false);
    }
  };
  const onBackdropMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) setOpen(false);
  };

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
          <div
            className="overlay"
            role="button"
            tabIndex={0}
            aria-label="Close dialog (click background or press Escape/Enter)"
            onKeyDown={onBackdropKey}
            onMouseDown={onBackdropMouseDown}
          >
            <div
              id="demo-dialog"
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="dialog-title"
              aria-describedby="dialog-desc"
              className="card w-[min(100%,28rem)] max-w-md rounded-xl p-6 shadow-lg"
            >
              <h3 id="dialog-title" className="mb-2 text-lg font-semibold">
                Token Overlay
              </h3>
              <p id="dialog-desc" className="text-sm">
                Backdrop uses <code>--overlay</code>. Press Esc or Enter on the backdrop to close.
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

function FormDemo() {
  const [submitted, setSubmitted] = React.useState(false);
  const [errors, setErrors] = React.useState<{ email?: string; name?: string }>({});

  function validate(form: HTMLFormElement) {
    const next: { email?: string; name?: string } = {};
    const name = form.name as unknown as HTMLInputElement;
    const email = form.email as unknown as HTMLInputElement;

    if (!name.value.trim()) next.name = 'Name is required.';
    if (!email.validity.valid) {
      if (email.validity.valueMissing) next.email = 'Email is required.';
      else if (email.validity.typeMismatch) next.email = 'Please enter a valid email address.';
    }
    setErrors(next);

    // Reflect validity on the controls for styling + AT
    name.setAttribute('aria-invalid', String(Boolean(next.name)));
    email.setAttribute('aria-invalid', String(Boolean(next.email)));

    // Wire aria-describedby to hint + (optional) error id
    name.setAttribute(
      'aria-describedby',
      ['name-hint', next.name ? 'name-error' : ''].filter(Boolean).join(' '),
    );
    email.setAttribute(
      'aria-describedby',
      ['email-hint', next.email ? 'email-error' : ''].filter(Boolean).join(' '),
    );

    return Object.keys(next).length === 0;
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const ok = validate(form);
    setSubmitted(true);
    if (ok) {
      alert('Form submitted ✔');
      form.reset();

      const nameEl = form.elements.namedItem('name') as HTMLInputElement | null;
      const emailEl = form.elements.namedItem('email') as HTMLInputElement | null;
      nameEl?.setAttribute('aria-invalid', 'false');
      emailEl?.setAttribute('aria-invalid', 'false');

      setErrors({});
      setSubmitted(false);
    }
  }

  function onBlur(e: React.FocusEvent<HTMLFormElement>) {
    // validate the whole form on blur of a field (simple, but effective)
    validate(e.currentTarget);
  }

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold">Form (labels, hints, errors)</h2>

      <form noValidate className="max-w-md space-y-4" onSubmit={onSubmit} onBlur={onBlur}>
        {/* Name */}
        <div className="field">
          <label htmlFor="name" className="field-label">
            Name{' '}
            <span className="required-indicator" aria-hidden="true">
              *
            </span>
          </label>
          <input
            id="name"
            name="name"
            className="input"
            placeholder="Ada Lovelace"
            required
            aria-describedby="name-hint"
            aria-invalid="false"
          />
          <p id="name-hint" className="field-hint">
            Please enter your full name.
          </p>
          {errors.name && (
            <p id="name-error" className="field-error" role="alert">
              {errors.name}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="field">
          <label htmlFor="email" className="field-label">
            Email{' '}
            <span className="required-indicator" aria-hidden="true">
              *
            </span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="input"
            placeholder="ada@example.com"
            required
            aria-describedby="email-hint"
            aria-invalid="false"
          />
          <p id="email-hint" className="field-hint">
            We’ll never share your email.
          </p>
          {errors.email && (
            <p id="email-error" className="field-error" role="alert">
              {errors.email}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button className="btn" type="submit">
            Submit
          </button>
          {submitted && Object.keys(errors).length === 0 && (
            <span className="badge badge--success" aria-live="polite">
              Looks good
            </span>
          )}
        </div>
      </form>
    </section>
  );
}

function FormChoicesDemo() {
  const [errors, setErrors] = React.useState<{ contact?: string; interests?: string }>({});

  function validate(form: HTMLFormElement) {
    const next: { contact?: string; interests?: string } = {};

    // Radios (required: one selected)
    const contactValue = (form.elements.namedItem('contact') as RadioNodeList).value;
    if (!contactValue) next.contact = 'Choose at least one contact method.';

    // Checkboxes (at least one)
    const interestsChecked = form.querySelectorAll<HTMLInputElement>(
      'input[name="interests"]:checked',
    );
    if (interestsChecked.length === 0) next.interests = 'Select at least one interest.';

    // Reflect validity visually & for AT
    const contactFs = form.querySelector<HTMLFieldSetElement>('#contact-group');
    const interestsFs = form.querySelector<HTMLFieldSetElement>('#interests-group');

    contactFs?.setAttribute('data-invalid', String(Boolean(next.contact)));
    interestsFs?.setAttribute('data-invalid', String(Boolean(next.interests)));

    contactFs?.setAttribute(
      'aria-describedby',
      ['contact-hint', next.contact ? 'contact-error' : ''].filter(Boolean).join(' '),
    );
    interestsFs?.setAttribute(
      'aria-describedby',
      ['interests-hint', next.interests ? 'interests-error' : ''].filter(Boolean).join(' '),
    );

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (validate(form)) {
      alert('Choices submitted ✔'); // replace with real action later
      form.reset();
      // clear invalid states
      form
        .querySelectorAll('fieldset[data-invalid="true"]')
        .forEach((fs) => fs.setAttribute('data-invalid', 'false'));
      setErrors({});
    }
  }

  function onChange(e: React.FormEvent<HTMLFormElement>) {
    // live-validate as user interacts
    validate(e.currentTarget);
  }

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold">Choices (radios + checkboxes)</h2>

      <form noValidate className="max-w-md space-y-5" onSubmit={onSubmit} onChange={onChange}>
        {/* Radio group */}
        <fieldset id="contact-group" className="fieldset" aria-describedby="contact-hint">
          <legend className="legend">
            Preferred contact method{' '}
            <span className="required-indicator" aria-hidden="true">
              *
            </span>
          </legend>

          <div className="option">
            <input id="contact-email" type="radio" name="contact" value="email" required />
            <label htmlFor="contact-email">Email</label>
          </div>
          <div className="option">
            <input id="contact-phone" type="radio" name="contact" value="phone" />
            <label htmlFor="contact-phone">Phone</label>
          </div>
          <div className="option">
            <input id="contact-sms" type="radio" name="contact" value="sms" />
            <label htmlFor="contact-sms">SMS</label>
          </div>

          <p id="contact-hint" className="field-hint">
            We’ll use this to follow up.
          </p>
          {errors.contact && (
            <p id="contact-error" className="field-error" role="alert">
              {errors.contact}
            </p>
          )}
        </fieldset>

        {/* Checkbox group */}
        <fieldset id="interests-group" className="fieldset" aria-describedby="interests-hint">
          <legend className="legend">
            Topics of interest{' '}
            <span className="required-indicator" aria-hidden="true">
              *
            </span>
          </legend>

          <div className="option">
            <input id="int-design" type="checkbox" name="interests" value="design" />
            <label htmlFor="int-design">Design systems</label>
          </div>
          <div className="option">
            <input id="int-accessibility" type="checkbox" name="interests" value="a11y" />
            <label htmlFor="int-accessibility">Accessibility</label>
          </div>
          <div className="option">
            <input id="int-graphQL" type="checkbox" name="interests" value="graphql" />
            <label htmlFor="int-graphQL">GraphQL</label>
          </div>

          <p id="interests-hint" className="field-hint">
            Pick one or more.
          </p>
          {errors.interests && (
            <p id="interests-error" className="field-error" role="alert">
              {errors.interests}
            </p>
          )}
        </fieldset>

        <button className="btn" type="submit">
          Submit choices
        </button>
      </form>
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
              <button type="button" className="link">
                Token-styled button
              </button>{' '}
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

          {/* Forms & Errors (accessible wiring) */}
          <FormDemo />
          {/* Radio + Checkbox groups (fieldset/legend) */}
          <FormChoicesDemo />
          {/* Overlay demo (accessible: focus trap, ESC, restore focus) */}
          <OverlayDemo />
          <IntlSmoke />
        </main>
      </div>
    </>
  );
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <I18nProvider i18n={i18n}>
      <App />
    </I18nProvider>
  </React.StrictMode>,
);
