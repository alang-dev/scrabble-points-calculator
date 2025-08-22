import { test, expect } from '@playwright/test';

test.describe('Frontend App', () => {
  test('should display "Scrabble Points Calculator" title', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Scrabble Points Calculator');
  });
});
