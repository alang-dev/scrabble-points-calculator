import { expect, type APIRequestContext, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { API_BASE_URL } from '../config/environments';

interface TableRowData {
  rank: number;
  points: number;
  letters: string;
  savedAt: string;
}

export class ViewTopScoresPage extends BasePage {
  readonly viewTopScoresButton: Locator;
  readonly modal: Locator;
  readonly closeButton: Locator;
  readonly table: Locator;

  constructor(page: Page) {
    super(page);
    this.viewTopScoresButton = page.locator('button').filter({ hasText: /view.*top.*scores/i });
    this.modal = page.locator('[role="dialog"], .modal, [data-testid="top-scores-modal"]');
    this.closeButton = page.locator('button').filter({ hasText: /close|×|✕/i }).first();
    this.table = this.modal.locator('table');
  }

  async clickViewTopScores() {
    await this.viewTopScoresButton.click();
    await this.modal.waitFor({ state: 'visible' });
  }

  async closeModal() {
    await this.closeButton.click();
    await this.page.waitForTimeout(1000);
  }

  async closeWithEscape() {
    await this.page.keyboard.press('Escape');
    await this.page.waitForTimeout(1000);
  }

  async closeWithOverlay() {
    await this.page.mouse.click(100, 100); // Click in top-left area outside modal
    await this.page.waitForTimeout(1000);
  }

  async verifyButtonVisible() {
    await expect(this.viewTopScoresButton).toBeVisible();
    await expect(this.viewTopScoresButton).toBeEnabled();
  }

  async verifyModalVisible() {
    await expect(this.modal).toBeVisible();
  }

  async verifyModalClosed() {
    await expect(this.modal).toBeHidden({ timeout: 5000 });
  }

  async verifyModalTitle() {
    await expect(this.page.locator('h2, h3').filter({ hasText: /top.*scores/i })).toBeVisible();
  }

  async verifyTableHeaders(headers: string[]) {
    const headerRow = this.modal.locator('thead tr').first();
    for (let i = 0; i < headers.length; i++) {
      await expect(headerRow.locator('th').nth(i)).toHaveText(headers[i]);
    }
  }

  async verifyTableData(data: TableRowData[]) {
    const tbody = this.modal.locator('tbody');

    for (let i = 0; i < data.length; i++) {
      const row = tbody.locator('tr').nth(i);
      const expectedData = data[i];

      // Verify each column in the correct order: Rank, Score, Letters, Saved At
      await expect(row.locator('td').nth(0)).toHaveText(expectedData.rank.toString());
      await expect(row.locator('td').nth(1)).toHaveText(expectedData.points.toString());
      await expect(row.locator('td').nth(2)).toHaveText(expectedData.letters);
      await expect(row.locator('td').nth(3)).toHaveText(expectedData.savedAt);
    }
  }

  async verifyRanksSorted() {
    const rankCells = this.modal.locator('td').filter({ hasText: /^[1-3]$/ });
    const ranks = await rankCells.allTextContents();
    const rankNumbers = ranks.map(r => parseInt(r)).filter(n => !isNaN(n) && n <= 3);
    const sortedRanks = [...rankNumbers].sort((a, b) => a - b);
    expect(rankNumbers).toEqual(sortedRanks);
  }

  async verifyDescriptionText() {
    await expect(this.page.locator('p').filter({
      hasText: /highest scoring.*scrabble.*words/i
    })).toBeVisible();
  }

  async verifyTabOrder() {
    await this.page.keyboard.press('Tab');
    await expect(this.closeButton).toBeFocused();
  }

  async seedScores(request: APIRequestContext, scoreData: Array<{ letters: string }>) {
    const savedScores = [];

    for (const data of scoreData) {
      const response = await request.post(`${API_BASE_URL}/scores`, {
        data: { letters: data.letters }
      });
      if (response.status() === 200) {
        const score = await response.json();
        savedScores.push(score);
      }
    }

    return savedScores;
  }
}
