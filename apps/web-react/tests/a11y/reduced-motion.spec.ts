import { test, expect } from '@playwright/test';

test.describe('reduced motion', () => {
  test('DS transitions collapse under prefers-reduced-motion: reduce', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('http://localhost:4173/');

    const dur = await page.$eval('button.btn', (el) => getComputedStyle(el).transitionDuration);

    // Some engines return "0s", "0ms", or scientific notation (e.g., "1e-05s")
    const toMs = (d: string) => {
      d = d.trim();
      if (d.endsWith('ms')) return parseFloat(d);
      if (d.endsWith('s')) return parseFloat(d) * 1000;
      const n = Number(d);
      return Number.isFinite(n) ? n * 1000 : NaN;
    };

    const thresholdMs = 0.1; // treat <= 0.1ms as effectively zero
    const allCollapsed = dur
      .split(',')
      .map(toMs)
      .every((ms) => Number.isFinite(ms) && ms <= thresholdMs);

    expect(allCollapsed, `Expected near-zero durations under PRM, got "${dur}"`).toBe(true);
  });
});
