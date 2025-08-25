import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { ScoringRule } from '../test-data/scoring-rules'; // Import ScoringRule

export class ScoringRulesPage extends BasePage {
  readonly heading: Locator;
  readonly table: Locator;
  readonly description: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.locator('h3').filter({ hasText: 'Scrabble Scoring Rules' });
    this.table = page.locator('table').first();
    this.description = page.locator('p').filter({
      hasText: 'Each letter has a point value. Calculate your word\'s total by adding up all letter values.'
    });
  }

  async verifyHeadingVisible() {
    await expect(this.heading).toBeVisible();
  }

  async verifyTableVisible() {
    await expect(this.table).toBeVisible();
  }

  async verifyTableHeaders(headers: string[]) {
    for (const header of headers) {
      await expect(this.page.locator('th').filter({ hasText: new RegExp(header, 'i') })).toBeVisible();
    }
  }

  async verifyTableData(data: ScoringRule[]) { // Change input type to ScoringRule[]
    await this.page.waitForSelector('h3:has-text("Scrabble Scoring Rules")');
    const scoringRulesTable = this.heading.locator('..').locator('table');

    for (const rule of data) {
      // Find row by locating the specific cell with exact points value, then check the letters in the same row
      const pointsCell = scoringRulesTable.locator('td').filter({ hasText: new RegExp(`^${rule.points}$`) });
      const row = pointsCell.locator('..');
      await expect(row).toContainText(rule.letters);
    }
  }

  async verifyPointsInOrder() {
    const pointCells = this.page.locator('td').filter({ hasText: /^\d+$/ });
    const pointValues = await pointCells.allTextContents();

    const numbers = pointValues.map(val => parseInt(val)).filter(num => !isNaN(num));
    const sortedNumbers = [...numbers].sort((a, b) => a - b);

    expect(numbers).toEqual(sortedNumbers);
  }

  async verifyDescriptionText() {
    await expect(this.description).toBeVisible();
  }

  async verifyTableStructure() {
    await expect(this.table.locator('thead')).toBeVisible();
    await expect(this.table.locator('tbody')).toBeVisible();

    const rows = this.table.locator('tbody tr');
    const rowCount = await rows.count();
    expect(rowCount).toBeGreaterThan(5);
  }
}

