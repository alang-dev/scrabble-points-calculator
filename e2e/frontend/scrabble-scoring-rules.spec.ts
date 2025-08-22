import { test } from '@playwright/test';
import { ScoringRulesPage } from '../page-objects/ScoringRulesPage';
import { SCRABBLE_SCORING_RULES } from '../test-data/scoring-rules';

test.describe('Scrabble Scoring Rules', () => {
  let scoringRulesPage: ScoringRulesPage;

  test.beforeEach(async ({ page }) => {
    scoringRulesPage = new ScoringRulesPage(page);
    await scoringRulesPage.goto();
  });

  test('should display scoring rules table', async ({ page }) => {
    await scoringRulesPage.verifyHeadingVisible();
    await scoringRulesPage.verifyTableVisible();
    await scoringRulesPage.verifyTableHeaders(['Points', 'Letters']);
  });

  test('should display correct point values for letters', async ({ page }) => {
    await scoringRulesPage.verifyTableData(SCRABBLE_SCORING_RULES.scoreGroups);
  });

  test('should display points in ascending order', async ({ page }) => {
    await scoringRulesPage.verifyPointsInOrder();
  });

  test('should display helpful description text', async ({ page }) => {
    await scoringRulesPage.verifyDescriptionText();
  });

  test('should have proper table styling', async ({ page }) => {
    await scoringRulesPage.verifyTableStructure();
  });
});
