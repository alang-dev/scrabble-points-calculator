import { expect, type APIRequestContext, type Locator, type Page } from '@playwright/test'
import { API_BASE_URL } from '../config/environments'
import { TopScore } from '../models/Score'

export class BasePage {
  readonly page: Page
  readonly toast: Locator
  readonly errorBanner: Locator
  readonly errorDismissButton: Locator

  constructor(page: Page) {
    this.page = page
    this.toast = page.locator('[data-sonner-toast]')
    this.errorBanner = page.getByTestId('error-banner')
    this.errorDismissButton = this.errorBanner.locator('button[aria-label="Dismiss error"]')
  }

  async goto() {
    await this.page.goto('/')
    await this.waitForPageReady()
  }

  async waitForPageReady() {
    await this.page.waitForSelector('h1:has-text("Scrabble Points Calculator")')
  }

  async cleanupAllScores(request: APIRequestContext) {
    let hasScores = true
    while (hasScores) {
      const response = await request.get(`${API_BASE_URL}/scores`, {
        params: {
          size: 10,
          sort: 'createdAt,desc',
        },
      })

      if (!response.ok()) {
        break
      }

      const scores = await response.json()

      if (scores.length === 0) {
        hasScores = false
        break
      }

      const scoreIds = scores.map((score: TopScore) => score.id)
      await request.delete(`${API_BASE_URL}/scores`, {
        data: scoreIds,
      })
    }
  }

  async verifyToastMessage(expectedMessage: string) {
    await expect(this.toast).toBeVisible()
    await expect(this.toast).toContainText(expectedMessage)
  }

  async verifyToastVisible() {
    await expect(this.toast).toBeVisible()
  }

  async verifyToastNotVisible() {
    await expect(this.toast).not.toBeVisible()
  }

  async verifyErrorBannerVisible() {
    await expect(this.errorBanner).toBeVisible()
  }

  async verifyErrorBannerNotVisible() {
    await expect(this.errorBanner).not.toBeVisible()
  }

  async verifyErrorBannerMessage(expectedMessage: string) {
    await expect(this.errorBanner).toBeVisible()
    await expect(this.errorBanner).toContainText(expectedMessage)
  }

  async dismissErrorBanner() {
    await expect(this.errorDismissButton).toBeVisible()
    await this.errorDismissButton.click()
  }

  async waitForApiCall(timeout: number = 1000) {
    // Wait for debounce (300ms) + API call time
    await this.page.waitForTimeout(timeout)
  }
}
