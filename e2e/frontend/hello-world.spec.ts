import { test, expect } from '@playwright/test';

test.describe('Hello World', () => {
  test('should display "Hello World" message from the backend', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Hello World');
  });
});
