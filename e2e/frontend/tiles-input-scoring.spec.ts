import { test } from '@playwright/test';
import { ScrabblePointsCalculatorPage } from '../page-objects/ScrabblePointsCalculatorPage';
import { SCORING_TEST_CASES } from '../test-data/scoring-rules';

test.describe('Tiles Input and Scoring', () => {
  let calculatorPage: ScrabblePointsCalculatorPage;

  test.beforeEach(async ({ page }) => {
    calculatorPage = new ScrabblePointsCalculatorPage(page);
    await calculatorPage.goto();
  });

  test('should display 10 tile input fields', async ({ page }) => {
    await calculatorPage.verifyTilesInputVisible();
    await calculatorPage.verifyTileSlots(10);
  });

  // Data-driven tests for scoring calculations - covers all word scoring scenarios
  SCORING_TEST_CASES.forEach(testCase => {
    test(`should calculate score correctly for "${testCase.word}" (${testCase.expectedPoints} points)`, async ({ page }) => {
      await calculatorPage.inputLetters(testCase.word);
      await calculatorPage.verifyScore(testCase.expectedPoints);
    });
  });

  test('should have a reset button that clears all tiles', async ({ page }) => {
    await calculatorPage.inputLetters('TEST');
    await calculatorPage.verifyScoreIsPositive();

    await calculatorPage.verifyResetButtonVisible();
    await calculatorPage.clickReset();

    await calculatorPage.verifyScoreIsZero();
  });

  test('should have a save score button that is visible and enabled', async ({ page }) => {
    await calculatorPage.inputLetters('WIN');
    await calculatorPage.verifySaveButtonAvailable();
  });

});
