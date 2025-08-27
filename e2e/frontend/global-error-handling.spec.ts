import { expect, test } from '@playwright/test';
import { ScrabblePointsCalculatorPage } from '../pages/ScrabblePointsCalculatorPage';

test.describe('Global Error Handling', () => {
  let calculatorPage: ScrabblePointsCalculatorPage;

  test.beforeEach(async ({ page }) => {
    calculatorPage = new ScrabblePointsCalculatorPage(page);
    await calculatorPage.goto();
  });

  test('should display error banner when API request fails', async ({ page }) => {
    // Mock network failure for score computation
    await page.route('**/api/v1/scores/compute', async (route) => {
      await route.abort('failed');
    });

    // Trigger API call by inputting letters
    await calculatorPage.inputLetters('TEST');

    // Wait for debounce + API call attempt
    await calculatorPage.waitForApiCall();

    // Verify error banner appears with correct message
    await calculatorPage.verifyErrorBannerMessage('Network error. Please check your connection.');
  });

  test('should display server error message for 500 response', async ({ page }) => {
    // Mock server error response
    await page.route('**/api/v1/scores/compute', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'Internal server error occurred'
        })
      });
    });

    await calculatorPage.inputLetters('QUIZ');
    await calculatorPage.waitForApiCall();

    await calculatorPage.verifyErrorBannerMessage('Internal server error occurred');
  });

  test('should display validation error message for 400 response', async ({ page }) => {
    // Mock validation error response
    await page.route('**/api/v1/scores/compute', async (route) => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'Invalid letters provided'
        })
      });
    });

    await calculatorPage.inputLetters('ABC');
    await calculatorPage.waitForApiCall();

    await calculatorPage.verifyErrorBannerMessage('Invalid letters provided');
  });

  test('should display generic error for unknown status codes', async ({ page }) => {
    // Mock unknown error status
    await page.route('**/api/v1/scores/compute', async (route) => {
      await route.fulfill({
        status: 418, // I'm a teapot
        contentType: 'application/json',
        body: JSON.stringify({})
      });
    });

    await calculatorPage.inputLetters('WORD');
    await calculatorPage.waitForApiCall();

    await calculatorPage.verifyErrorBannerMessage('Request failed with status 418');
  });

  test('should allow user to dismiss error banner manually', async ({ page }) => {
    // Mock API failure
    await page.route('**/api/v1/scores/compute', async (route) => {
      await route.abort('failed');
    });

    await calculatorPage.inputLetters('TEST');
    await calculatorPage.waitForApiCall();

    await calculatorPage.verifyErrorBannerVisible();
    await calculatorPage.dismissErrorBanner();
    await calculatorPage.verifyErrorBannerNotVisible();
  });

  test('should auto-dismiss error banner after 5 seconds', async ({ page }) => {
    // Install clock before any actions
    await page.clock.install();

    // Mock API failure
    await page.route('**/api/v1/scores/compute', async (route) => {
      await route.abort('failed');
    });

    await calculatorPage.inputLetters('AUTO');
    await calculatorPage.waitForApiCall();

    // Error should be visible initially
    await calculatorPage.verifyErrorBannerVisible();

    // Fast forward time by 5 seconds to trigger auto-dismiss
    await page.clock.fastForward(5000);

    // Error banner should be automatically dismissed
    await calculatorPage.verifyErrorBannerNotVisible();
  });

  test('should display error when save operation fails', async ({ page }) => {
    // Allow compute to succeed but fail save
    await page.route('**/api/v1/scores', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({
            message: 'Failed to save score to database'
          })
        });
      } else {
        await route.continue();
      }
    });

    await calculatorPage.inputLetters('SAVE');
    await calculatorPage.verifySaveButtonEnabled();
    await calculatorPage.clickSave();

    await calculatorPage.verifyErrorBannerMessage('Failed to save score to database');
  });


  test('should handle timeout errors appropriately', async ({ page }) => {
    // Mock network error to simulate timeout
    await page.route('**/api/v1/scores/compute', async (route) => {
      await route.abort('timedout');
    });

    await calculatorPage.inputLetters('SLOW');
    await calculatorPage.waitForApiCall();

    await calculatorPage.verifyErrorBannerMessage('Network error');
  });

  test('should maintain error visibility during page interactions', async ({ page }) => {
    // Mock API failure
    await page.route('**/api/v1/scores/compute', async (route) => {
      await route.abort('failed');
    });

    await calculatorPage.inputLetters('TEST');
    await calculatorPage.waitForApiCall();

    await calculatorPage.verifyErrorBannerVisible();

    // Interact with other elements while error is shown
    await calculatorPage.verifyResetButtonVisible();
    // Just verify that other elements are interactable rather than actually clicking
    await expect(page.locator('div[data-testid="tile-0"]')).toBeVisible();

    // Error should still be visible during interactions
    await calculatorPage.verifyErrorBannerVisible();

    // Only dismissing should hide it
    await calculatorPage.dismissErrorBanner();
    await calculatorPage.verifyErrorBannerNotVisible();
  });
});