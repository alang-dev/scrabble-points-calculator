import { test, expect } from '@playwright/test';

test.describe('Tiles Input and Scoring', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display 10 tile input fields', async ({ page }) => {
    // Check that there are exactly 10 input tiles
    const tiles = page.locator('[data-testid*="tile-"], input[type="text"]').filter({ hasText: '' });
    await expect(tiles).toHaveCount(10);
  });

  test('should allow letter input in tiles', async ({ page }) => {
    // Find the first tile input
    const firstTile = page.locator('input').first();
    
    // Type a letter
    await firstTile.fill('A');
    await expect(firstTile).toHaveValue('A');
    
    // Type another letter in second tile
    const secondTile = page.locator('input').nth(1);
    await secondTile.fill('B');
    await expect(secondTile).toHaveValue('B');
  });

  test('should auto-focus to next tile after input', async ({ page }) => {
    // Type in first tile
    const firstTile = page.locator('input').first();
    await firstTile.fill('A');
    
    // Check if focus moved to second tile (this is implementation dependent)
    const secondTile = page.locator('input').nth(1);
    await expect(secondTile).toBeFocused();
  });

  test('should calculate score for simple words', async ({ page }) => {
    // Input a simple word like "CAB" (C=3, A=1, B=3 = 7 points)
    const tiles = page.locator('input');
    await tiles.nth(0).fill('C');
    await tiles.nth(1).fill('A');
    await tiles.nth(2).fill('B');
    
    // Check that score is displayed
    const scoreDisplay = page.locator('text=/Score:|Points:/');
    await expect(scoreDisplay).toBeVisible();
    
    // Look for score value (might be in different formats)
    await expect(page.locator('text=/7/')).toBeVisible();
  });

  test('should calculate score for high-value letters', async ({ page }) => {
    // Input "QUIZ" (Q=10, U=1, I=1, Z=10 = 22 points)
    const tiles = page.locator('input');
    await tiles.nth(0).fill('Q');
    await tiles.nth(1).fill('U');
    await tiles.nth(2).fill('I');
    await tiles.nth(3).fill('Z');
    
    // Check for calculated score
    await expect(page.locator('text=/22/')).toBeVisible();
  });

  test('should handle empty tiles correctly', async ({ page }) => {
    // Fill some tiles and leave others empty
    const tiles = page.locator('input');
    await tiles.nth(0).fill('H');
    await tiles.nth(1).fill('I');
    // Leave tiles 2-9 empty
    
    // Should calculate score only for filled tiles (H=4, I=1 = 5 points)
    await expect(page.locator('text=/5/')).toBeVisible();
  });

  test('should reject invalid characters', async ({ page }) => {
    const firstTile = page.locator('input').first();
    
    // Try to input numbers
    await firstTile.fill('1');
    await expect(firstTile).toHaveValue('');
    
    // Try to input special characters
    await firstTile.fill('@');
    await expect(firstTile).toHaveValue('');
    
    // Try to input lowercase (should convert to uppercase or be valid)
    await firstTile.fill('a');
    await expect(firstTile).toHaveValue(/^[A]?$/); // Either empty or uppercase A
  });

  test('should have a reset button that clears all tiles', async ({ page }) => {
    // Fill multiple tiles
    const tiles = page.locator('input');
    await tiles.nth(0).fill('T');
    await tiles.nth(1).fill('E');
    await tiles.nth(2).fill('S');
    await tiles.nth(3).fill('T');
    
    // Click reset button
    const resetButton = page.locator('button').filter({ hasText: /reset/i });
    await expect(resetButton).toBeVisible();
    await resetButton.click();
    
    // Verify all tiles are cleared
    for (let i = 0; i < 4; i++) {
      await expect(tiles.nth(i)).toHaveValue('');
    }
    
    // Verify score is reset
    await expect(page.locator('text=/0/')).toBeVisible();
  });

  test('should have a save score button', async ({ page }) => {
    // Fill some tiles
    const tiles = page.locator('input');
    await tiles.nth(0).fill('W');
    await tiles.nth(1).fill('I');
    await tiles.nth(2).fill('N');
    
    // Check that save button exists and is clickable
    const saveButton = page.locator('button').filter({ hasText: /save/i });
    await expect(saveButton).toBeVisible();
    await expect(saveButton).toBeEnabled();
  });

  test('should show real-time score updates', async ({ page }) => {
    const tiles = page.locator('input');
    
    // Start with empty - score should be 0
    await expect(page.locator('text=/0/')).toBeVisible();
    
    // Add first letter
    await tiles.nth(0).fill('A');
    await expect(page.locator('text=/1/')).toBeVisible();
    
    // Add second letter
    await tiles.nth(1).fill('B');
    await expect(page.locator('text=/4/')).toBeVisible(); // A(1) + B(3) = 4
    
    // Add high-value letter
    await tiles.nth(2).fill('Z');
    await expect(page.locator('text=/14/')).toBeVisible(); // A(1) + B(3) + Z(10) = 14
  });

  test('should handle maximum word length (10 letters)', async ({ page }) => {
    const tiles = page.locator('input');
    const letters = ['S', 'C', 'R', 'A', 'B', 'B', 'L', 'I', 'N', 'G']; // 10 letters
    
    // Fill all 10 tiles
    for (let i = 0; i < 10; i++) {
      await tiles.nth(i).fill(letters[i]);
    }
    
    // Verify all tiles are filled
    for (let i = 0; i < 10; i++) {
      await expect(tiles.nth(i)).toHaveValue(letters[i]);
    }
    
    // Score should be calculated (S=1,C=3,R=1,A=1,B=3,B=3,L=1,I=1,N=1,G=2 = 17)
    await expect(page.locator('text=/17/')).toBeVisible();
  });

  test('should maintain focus within tile inputs', async ({ page }) => {
    const firstTile = page.locator('input').first();
    const lastTile = page.locator('input').nth(9);
    
    // Click on first tile
    await firstTile.click();
    await expect(firstTile).toBeFocused();
    
    // Click on last tile  
    await lastTile.click();
    await expect(lastTile).toBeFocused();
  });
});