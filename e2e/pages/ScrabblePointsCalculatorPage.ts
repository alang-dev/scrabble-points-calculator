import { expect, type APIRequestContext, type Locator, type Page } from '@playwright/test'
import { API_BASE_URL } from '../config/environments'
import { Score } from '../models/Score'
import { BasePage } from './BasePage'

export class ScrabblePointsCalculatorPage extends BasePage {
  readonly tilesInput: Locator
  readonly tileSlots: Locator

  readonly scoreValue: Locator

  readonly resetButton: Locator
  readonly saveButton: Locator

  constructor(page: Page) {
    super(page)
    this.tilesInput = page.getByTestId('tiles-input')
    this.tileSlots = page.locator('[data-testid^="tile-"]')

    this.scoreValue = page.getByTestId('score-value')

    this.resetButton = page.getByTestId('reset-button')
    this.saveButton = page.getByTestId('save-button')
  }

  async goto() {
    await super.goto()
    await this.tilesInput.waitFor({ state: 'visible' })
  }

  async inputLetters(word: string) {
    await this.tilesInput.click()
    await this.page.keyboard.press('Control+a')
    await this.page.keyboard.press('Delete')
    await this.page.keyboard.type(word)
    await this.page.waitForTimeout(1000)
  }

  /**
   * Get the current score value
   * @returns The current score as a number
   */
  async getScore(): Promise<number> {
    await this.scoreValue.waitFor({ state: 'visible' })
    const scoreText = await this.scoreValue.textContent()
    return parseInt(scoreText || '0', 10)
  }

  async clickReset() {
    await this.resetButton.click()
    await this.page.waitForTimeout(1500)
  }

  async clickSave(): Promise<string | null> {
    // Set up response interception to capture the score ID
    const responsePromise = this.page.waitForResponse(
      response =>
        response.url().includes('/api/v1/scores') && response.request().method() === 'POST'
    )

    await this.saveButton.click()

    try {
      const response = await responsePromise
      const responseData = await response.json()
      return responseData.id || null
    } catch (error) {
      console.error('Failed to capture score ID:', error)
      return null
    }
  }

  async verifyTileSlots(expectedCount: number) {
    await expect(this.tileSlots).toHaveCount(expectedCount)
  }

  async verifyTilesInputVisible() {
    await expect(this.tilesInput).toBeVisible()
  }

  async verifyResetButtonVisible() {
    await expect(this.resetButton).toBeVisible()
  }

  async verifySaveButtonAvailable() {
    await expect(this.saveButton).toBeVisible()
    await expect(this.saveButton).toBeEnabled()
  }

  async verifySaveButtonDisabled() {
    await expect(this.saveButton).toBeVisible()
    await expect(this.saveButton).toBeDisabled()
  }

  async verifySaveButtonEnabled() {
    await expect(this.saveButton).toBeVisible()
    await expect(this.saveButton).toBeEnabled()
  }

  async focusTiles() {
    await this.tilesInput.click()
    await this.page.waitForTimeout(500)
  }

  async verifyScore(expectedScore: number) {
    const actualScore = await this.getScore()
    expect(actualScore).toBe(expectedScore)
  }

  async verifyScoreIsPositive() {
    const score = await this.getScore()
    expect(score).toBeGreaterThan(0)
  }

  async verifyScoreIsZero() {
    const score = await this.getScore()
    expect(score).toBe(0)
  }

  async verifyScoreIsEmpty() {
    await this.scoreValue.waitFor({ state: 'visible' })
    const scoreText = await this.scoreValue.textContent()
    expect(scoreText).toBe('--')
  }

  async verifySavedScore(request: APIRequestContext, expectedScore: Score): Promise<void> {
    const response = await request.get(`${API_BASE_URL}/scores?size=5&sort=createdAt,desc`)
    expect(response.status()).toBe(200)

    const scores = await response.json()

    expect(scores).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expectedScore.id,
          rank: expect.any(Number),
          letters: expectedScore.letters,
          score: expectedScore.points,
        }),
      ])
    )
  }

  async getTilesText(): Promise<string> {
    const inputValue = await this.tilesInput.inputValue()
    return inputValue
  }

  async verifyTilesCleared() {
    const inputValue = await this.tilesInput.inputValue()
    expect(inputValue).toBe('')
  }

  async verifyTilesInputFocused() {
    await expect(this.tilesInput).toBeFocused()
  }

  async verifyTiles(expectedWord: string) {
    for (let i = 0; i < expectedWord.length; i++) {
      await expect(this.tileSlots.nth(i)).toContainText(expectedWord[i])
    }

    // Verify remaining tiles (up to 10 total) are empty
    for (let i = expectedWord.length; i < 10; i++) {
      await expect(this.tileSlots.nth(i)).toHaveText('')
    }
  }
}
