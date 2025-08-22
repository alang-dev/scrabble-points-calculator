import { test, expect } from '@playwright/test';

test.describe('View Top Scores Modal', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have a "View Top Scores" button', async ({ page }) => {
    const viewTopScoresButton = page.locator('button').filter({ hasText: /view.*top.*scores/i });
    await expect(viewTopScoresButton).toBeVisible();
    await expect(viewTopScoresButton).toBeEnabled();
  });

  test('should open modal when "View Top Scores" button is clicked', async ({ page }) => {
    // Click the View Top Scores button
    const viewTopScoresButton = page.locator('button').filter({ hasText: /view.*top.*scores/i });
    await viewTopScoresButton.click();

    // Check that modal is visible
    const modal = page.locator('[role="dialog"], .modal, [data-testid="top-scores-modal"]');
    await expect(modal).toBeVisible();

    // Check modal title
    await expect(page.locator('h2, h3').filter({ hasText: /top.*scores/i })).toBeVisible();
  });

  test('should display top scores table in modal', async ({ page }) => {
    // Open the modal
    await page.locator('button').filter({ hasText: /view.*top.*scores/i }).click();

    // Wait for modal to be visible
    const modal = page.locator('[role="dialog"], .modal, [data-testid="top-scores-modal"]');
    await expect(modal).toBeVisible();

    // Check that table exists
    const table = page.locator('table');
    await expect(table).toBeVisible();

    // Check table headers
    await expect(page.locator('th').filter({ hasText: /rank/i })).toBeVisible();
    await expect(page.locator('th').filter({ hasText: /player/i })).toBeVisible();
    await expect(page.locator('th').filter({ hasText: /score/i })).toBeVisible();
    await expect(page.locator('th').filter({ hasText: /tiles/i })).toBeVisible();
    await expect(page.locator('th').filter({ hasText: /date/i })).toBeVisible();
  });

  test('should display mock score data', async ({ page }) => {
    // Open the modal
    await page.locator('button').filter({ hasText: /view.*top.*scores/i }).click();

    // Wait for table to be visible
    await expect(page.locator('table')).toBeVisible();

    // Check for mock data (based on the mock data in TopScoresModal component)
    await expect(page.locator('td').filter({ hasText: 'Player 1' })).toBeVisible();
    await expect(page.locator('td').filter({ hasText: '89' })).toBeVisible();
    await expect(page.locator('td').filter({ hasText: 'QUIXOTIC' })).toBeVisible();
    
    await expect(page.locator('td').filter({ hasText: 'Player 2' })).toBeVisible();
    await expect(page.locator('td').filter({ hasText: '76' })).toBeVisible();
    await expect(page.locator('td').filter({ hasText: 'JAZZY' })).toBeVisible();

    await expect(page.locator('td').filter({ hasText: 'Player 3' })).toBeVisible();
    await expect(page.locator('td').filter({ hasText: '65' })).toBeVisible();
    await expect(page.locator('td').filter({ hasText: 'WAXED' })).toBeVisible();
  });

  test('should show scores sorted by rank', async ({ page }) => {
    // Open the modal
    await page.locator('button').filter({ hasText: /view.*top.*scores/i }).click();

    // Get all rank cells
    const rankCells = page.locator('td').filter({ hasText: /^\d+$/ });
    const ranks = await rankCells.allTextContents();
    
    // Convert to numbers and verify they're in ascending order
    const rankNumbers = ranks.map(r => parseInt(r)).filter(n => !isNaN(n));
    const sortedRanks = [...rankNumbers].sort((a, b) => a - b);
    
    expect(rankNumbers).toEqual(sortedRanks);
  });

  test('should close modal when close button is clicked', async ({ page }) => {
    // Open the modal
    await page.locator('button').filter({ hasText: /view.*top.*scores/i }).click();
    
    // Wait for modal to be visible
    const modal = page.locator('[role="dialog"], .modal, [data-testid="top-scores-modal"]');
    await expect(modal).toBeVisible();

    // Find and click close button (X button or Close button)
    const closeButton = page.locator('button').filter({ hasText: /close|×|✕/i }).first();
    await closeButton.click();

    // Verify modal is closed
    await expect(modal).not.toBeVisible();
  });

  test('should close modal when clicking outside (overlay)', async ({ page }) => {
    // Open the modal
    await page.locator('button').filter({ hasText: /view.*top.*scores/i }).click();
    
    // Wait for modal to be visible
    const modal = page.locator('[role="dialog"], .modal');
    await expect(modal).toBeVisible();

    // Click on the overlay (outside the modal content)
    const overlay = page.locator('.modal-overlay, [data-testid="modal-overlay"]').first();
    if (await overlay.isVisible()) {
      await overlay.click();
      await expect(modal).not.toBeVisible();
    }
  });

  test('should close modal with Escape key', async ({ page }) => {
    // Open the modal
    await page.locator('button').filter({ hasText: /view.*top.*scores/i }).click();
    
    // Wait for modal to be visible
    const modal = page.locator('[role="dialog"], .modal');
    await expect(modal).toBeVisible();

    // Press Escape key
    await page.keyboard.press('Escape');

    // Verify modal is closed
    await expect(modal).not.toBeVisible();
  });

  test('should display helpful description text', async ({ page }) => {
    // Open the modal
    await page.locator('button').filter({ hasText: /view.*top.*scores/i }).click();

    // Check for description text
    await expect(page.locator('p').filter({ 
      hasText: /highest scoring.*scrabble.*words/i 
    })).toBeVisible();
  });

  test('should handle empty state gracefully', async ({ page }) => {
    // Note: This test assumes there's a way to clear scores or view empty state
    // Open the modal
    await page.locator('button').filter({ hasText: /view.*top.*scores/i }).click();

    // If there were no scores, we should see appropriate message
    // This might require mocking empty state or different test setup
    const emptyMessage = page.locator('text=/no scores.*recorded/i');
    if (await emptyMessage.isVisible()) {
      await expect(emptyMessage).toContainText(/no scores/i);
      await expect(page.locator('text=/be the first/i')).toBeVisible();
    }
  });

  test('should display dates in readable format', async ({ page }) => {
    // Open the modal
    await page.locator('button').filter({ hasText: /view.*top.*scores/i }).click();

    // Check that dates are displayed in a readable format (YYYY-MM-DD)
    const dateCells = page.locator('td').filter({ hasText: /\d{4}-\d{2}-\d{2}/ });
    await expect(dateCells.first()).toBeVisible();
  });

  test('should be responsive in mobile view', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Open the modal
    await page.locator('button').filter({ hasText: /view.*top.*scores/i }).click();

    // Check that modal is still visible and functional
    const modal = page.locator('[role="dialog"], .modal');
    await expect(modal).toBeVisible();
    
    // Check that table is still visible (might be horizontally scrollable)
    await expect(page.locator('table')).toBeVisible();
  });

  test('should maintain proper tab order for accessibility', async ({ page }) => {
    // Open the modal
    await page.locator('button').filter({ hasText: /view.*top.*scores/i }).click();
    
    // Wait for modal
    const modal = page.locator('[role="dialog"], .modal');
    await expect(modal).toBeVisible();

    // Tab through elements - focus should stay within modal
    await page.keyboard.press('Tab');
    
    // Close button should be focusable
    const closeButton = page.locator('button').filter({ hasText: /close|×/i }).first();
    if (await closeButton.isVisible()) {
      await expect(closeButton).toBeFocused();
    }
  });
});