import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('home has no serious+ a11y violations', async ({ page }) => {
  await page.goto('http://localhost:4173/');
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
  const seriousOrWorse = results.violations.filter((v) =>
    ['serious', 'critical'].includes(v.impact || ''),
  );
  expect(seriousOrWorse, JSON.stringify(seriousOrWorse, null, 2)).toEqual([]);
});
