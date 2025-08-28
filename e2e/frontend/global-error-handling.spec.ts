import { expect, test } from '@playwright/test'
import { ScrabblePointsCalculatorPage } from '../pages/ScrabblePointsCalculatorPage'

test.describe('Global Error Handling', () => {
  let calculatorPage: ScrabblePointsCalculatorPage

  test.beforeEach(async ({ page }) => {
    calculatorPage = new ScrabblePointsCalculatorPage(page)
    await calculatorPage.goto()
  })

  test('should display error banner when API request fails', async ({ page }) => {
    await page.route('**/api/v1/scores/compute', async route => {
      await route.abort('failed')
    })

    await calculatorPage.inputLetters('TEST')

    await calculatorPage.waitForApiCall()

    await calculatorPage.verifyErrorBannerMessage('Network error. Please check your connection.')
  })

  test('should display server error message for 500 response', async ({ page }) => {
    await page.route('**/api/v1/scores/compute', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'Internal server error occurred',
        }),
      })
    })

    await calculatorPage.inputLetters('QUIZ')
    await calculatorPage.waitForApiCall()

    await calculatorPage.verifyErrorBannerMessage('Internal server error occurred')
  })

  test('should display validation error message for 400 response', async ({ page }) => {
    await page.route('**/api/v1/scores/compute', async route => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'Invalid letters provided',
        }),
      })
    })

    await calculatorPage.inputLetters('ABC')
    await calculatorPage.waitForApiCall()

    await calculatorPage.verifyErrorBannerMessage('Invalid letters provided')
  })

  test('should display generic error for unknown status codes', async ({ page }) => {
    await page.route('**/api/v1/scores/compute', async route => {
      await route.fulfill({
        status: 418, // I'm a teapot
        contentType: 'application/json',
        body: JSON.stringify({}),
      })
    })

    await calculatorPage.inputLetters('WORD')
    await calculatorPage.waitForApiCall()

    await calculatorPage.verifyErrorBannerMessage('Request failed with status 418')
  })

  test('should allow user to dismiss error banner manually', async ({ page }) => {
    await page.route('**/api/v1/scores/compute', async route => {
      await route.abort('failed')
    })

    await calculatorPage.inputLetters('TEST')
    await calculatorPage.waitForApiCall()

    await calculatorPage.verifyErrorBannerVisible()
    await calculatorPage.dismissErrorBanner()
    await calculatorPage.verifyErrorBannerNotVisible()
  })

  test('should auto-dismiss error banner after 5 seconds', async ({ page }) => {
    await page.clock.install()

    await page.route('**/api/v1/scores/compute', async route => {
      await route.abort('failed')
    })

    await calculatorPage.inputLetters('AUTO')
    await calculatorPage.waitForApiCall()

    await calculatorPage.verifyErrorBannerVisible()
    await page.clock.fastForward(5000)
    await calculatorPage.verifyErrorBannerNotVisible()
  })

  test('should display error when save operation fails', async ({ page }) => {
    await page.route('**/api/v1/scores', async route => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({
            message: 'Failed to save score to database',
          }),
        })
      } else {
        await route.continue()
      }
    })

    await calculatorPage.inputLetters('SAVE')
    await calculatorPage.verifySaveButtonEnabled()
    await calculatorPage.clickSave()

    await calculatorPage.verifyErrorBannerMessage('Failed to save score to database')
  })

  test('should handle timeout errors appropriately', async ({ page }) => {
    await page.route('**/api/v1/scores/compute', async route => {
      await route.abort('timedout')
    })

    await calculatorPage.inputLetters('SLOW')
    await calculatorPage.waitForApiCall()

    await calculatorPage.verifyErrorBannerMessage('Network error')
  })

  test('should maintain error visibility during page interactions', async ({ page }) => {
    await page.route('**/api/v1/scores/compute', async route => {
      await route.abort('failed')
    })

    await calculatorPage.inputLetters('TEST')
    await calculatorPage.waitForApiCall()

    await calculatorPage.verifyErrorBannerVisible()

    await calculatorPage.verifyResetButtonVisible()
    await expect(page.locator('div[data-testid="tile-0"]')).toBeVisible()

    await calculatorPage.verifyErrorBannerVisible()
    await calculatorPage.dismissErrorBanner()
    await calculatorPage.verifyErrorBannerNotVisible()
  })
})
