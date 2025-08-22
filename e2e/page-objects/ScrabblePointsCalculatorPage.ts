import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ScrabblePointsCalculatorPage extends BasePage {
  readonly tilesInput: Locator;
  readonly scoreValue: Locator;
  readonly resetButton: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    super(page);
    this.tilesInput = page.locator('[data-testid="tiles-input"]');
    this.scoreValue = page.locator('[data-testid="score-value"]');
    this.resetButton = page.locator('[data-testid="reset-button"]');
    this.saveButton = page.locator('[data-testid="save-button"]');
  }

  async goto() {
    await super.goto();
    await this.tilesInput.waitFor({ state: 'visible' });
  }

  async inputLetters(word: string) {
    await this.tilesInput.click();
    await this.page.keyboard.press('Control+a');
    await this.page.keyboard.press('Delete');
    await this.page.keyboard.type(word);
    await this.page.waitForTimeout(1000);
  }

  /**
   * Get the current score value
   * @returns The current score as a number
   */
  async getScore(): Promise<number> {
    await this.scoreValue.waitFor({ state: 'visible' });
    const scoreText = await this.scoreValue.textContent();
    return parseInt(scoreText || '0', 10);
  }

  async clickReset() {
    await this.resetButton.click();
    await this.page.waitForTimeout(1500);
  }

  async clickSave() {
    await this.saveButton.click();
  }

  async verifyTileSlots(expectedCount: number) {
    const tileSlots = this.page.locator('[data-testid^="tile-"]');
    await expect(tileSlots).toHaveCount(expectedCount);
  }

  async verifyTilesInputVisible() {
    await expect(this.tilesInput).toBeVisible();
  }

  async verifyResetButtonVisible() {
    await expect(this.resetButton).toBeVisible();
  }

  async verifySaveButtonAvailable() {
    await expect(this.saveButton).toBeVisible();
    await expect(this.saveButton).toBeEnabled();
  }

  async verifyScore(expectedScore: number) {
    const actualScore = await this.getScore();
    expect(actualScore).toBe(expectedScore);
  }

  async verifyScoreIsPositive() {
    const score = await this.getScore();
    expect(score).toBeGreaterThan(0);
  }

  async verifyScoreIsZero() {
    const score = await this.getScore();
    expect(score).toBe(0);
  }
}
