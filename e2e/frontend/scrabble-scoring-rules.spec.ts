import { test, expect } from '@playwright/test';

test.describe('Scrabble Scoring Rules', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display scoring rules table', async ({ page }) => {
    // Check that the scoring rules section exists
    await expect(page.locator('h3').filter({ hasText: 'Scrabble Scoring Rules' })).toBeVisible();
    
    // Verify the table structure
    const table = page.locator('table').first();
    await expect(table).toBeVisible();
    
    // Check table headers
    await expect(page.locator('th').filter({ hasText: 'Points' })).toBeVisible();
    await expect(page.locator('th').filter({ hasText: 'Letters' })).toBeVisible();
  });

  test('should display correct point values for letters', async ({ page }) => {
    // Test 1-point letters
    const onePointRow = page.locator('tr').filter({ hasText: /^1/ });
    await expect(onePointRow).toContainText('A, E, I, L, N, O, R, S, T, U');

    // Test 2-point letters  
    const twoPointRow = page.locator('tr').filter({ hasText: /^2/ });
    await expect(twoPointRow).toContainText('D, G');

    // Test 3-point letters
    const threePointRow = page.locator('tr').filter({ hasText: /^3/ });
    await expect(threePointRow).toContainText('B, C, M, P');

    // Test 4-point letters
    const fourPointRow = page.locator('tr').filter({ hasText: /^4/ });
    await expect(fourPointRow).toContainText('F, H, V, W, Y');

    // Test 5-point letters
    const fivePointRow = page.locator('tr').filter({ hasText: /^5/ });
    await expect(fivePointRow).toContainText('K');

    // Test 8-point letters
    const eightPointRow = page.locator('tr').filter({ hasText: /^8/ });
    await expect(eightPointRow).toContainText('J, X');

    // Test 10-point letters
    const tenPointRow = page.locator('tr').filter({ hasText: /^10/ });
    await expect(tenPointRow).toContainText('Q, Z');
  });

  test('should display points in ascending order', async ({ page }) => {
    const pointCells = page.locator('td').filter({ hasText: /^\d+$/ });
    const pointValues = await pointCells.allTextContents();
    
    // Convert to numbers and check if sorted
    const numbers = pointValues.map(val => parseInt(val)).filter(num => !isNaN(num));
    const sortedNumbers = [...numbers].sort((a, b) => a - b);
    
    expect(numbers).toEqual(sortedNumbers);
  });

  test('should display helpful description text', async ({ page }) => {
    await expect(page.locator('p').filter({ 
      hasText: 'Each letter has a point value. Calculate your word\'s total by adding up all letter values.' 
    })).toBeVisible();
  });

  test('should have proper table styling', async ({ page }) => {
    const table = page.locator('table').first();
    
    // Check that table has proper structure
    await expect(table.locator('thead')).toBeVisible();
    await expect(table.locator('tbody')).toBeVisible();
    
    // Check that rows are properly formatted
    const rows = table.locator('tbody tr');
    const rowCount = await rows.count();
    expect(rowCount).toBeGreaterThan(5); // Should have multiple point categories
  });

  test('should be responsive on different screen sizes', async ({ page }) => {
    // Test desktop view
    await page.setViewportSize({ width: 1200, height: 800 });
    await expect(page.locator('h3').filter({ hasText: 'Scrabble Scoring Rules' })).toBeVisible();
    
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('h3').filter({ hasText: 'Scrabble Scoring Rules' })).toBeVisible();
    await expect(page.locator('table').first()).toBeVisible();
  });
});