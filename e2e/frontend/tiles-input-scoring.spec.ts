import { expect, test } from '@playwright/test';
import { Score } from '../models/Score';
import { ScrabblePointsCalculatorPage } from '../pages/ScrabblePointsCalculatorPage';
import { SCORING_TEST_CASES } from '../test-data/scoring-rules';
import { API_BASE_URL } from '../config/environments';

test.describe('Tiles Input and Point Calculation', () => {
  let calculatorPage: ScrabblePointsCalculatorPage;

  test.beforeEach(async ({ page }) => {
    calculatorPage = new ScrabblePointsCalculatorPage(page);
    await calculatorPage.goto();
  });

  test('should display 10 tile input fields', async () => {
    await calculatorPage.verifyTilesInputVisible();
    await calculatorPage.verifyTileSlots(10);
  });

  // Data-driven tests for scoring calculations - covers all word scoring scenarios
  SCORING_TEST_CASES.forEach(testCase => {
    test(`should calculate score correctly for "${testCase.word}" (${testCase.expectedPoints} points)`, async () => {
      await calculatorPage.inputLetters(testCase.word);
      await calculatorPage.verifyScore(testCase.expectedPoints);
    });
  });

  test('should have a reset button that clears all tiles', async () => {
    await calculatorPage.inputLetters('TEST');
    await calculatorPage.verifyScoreIsPositive();

    await calculatorPage.verifyResetButtonVisible();
    await calculatorPage.clickReset();

    await calculatorPage.verifyScoreIsEmpty();
  });

  test('should display uppercase letters when lowercase is typed', async ({ page }) => {
    // Type lowercase letters
    await calculatorPage.inputLetters('hello');

    // Verify that the tiles display uppercase letters
    const tileSlots = page.locator('[data-testid^="tile-"]');
    await expect(tileSlots.nth(0)).toContainText('H');
    await expect(tileSlots.nth(1)).toContainText('E');
    await expect(tileSlots.nth(2)).toContainText('L');
    await expect(tileSlots.nth(3)).toContainText('L');
    await expect(tileSlots.nth(4)).toContainText('O');
  });

  test('should auto-advance to next position when editing middle letter', async ({ page }) => {
    await calculatorPage.inputLetters('HELLO');

    // Verify initial score for HELLO: H(4) + E(1) + L(1) + L(1) + O(1) = 8
    await calculatorPage.verifyScore(8);

    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowLeft');
    await page.waitForTimeout(200);

    await page.keyboard.type('X');

    const finalText = await calculatorPage.getTilesText();
    expect(finalText).toBe('HELXO');

    await page.waitForResponse('**/api/v1/scores/compute');

    // Verify updated score for HELXO: H(4) + E(1) + L(1) + X(8) + O(1) = 15
    await calculatorPage.verifyScore(15);
  });

  test('should completely clear tiles and reset score when Reset Tiles button is clicked', async ({ page }) => {
    await calculatorPage.inputLetters('TEST');
    await calculatorPage.verifyScoreIsPositive();

    const tilesBeforeReset = await calculatorPage.getTilesText();
    expect(tilesBeforeReset).toBe('TEST');

    await calculatorPage.clickReset();

    // Wait a bit for the reset to process
    await page.waitForTimeout(500);

    const tilesAfterReset = await calculatorPage.getTilesText();
    expect(tilesAfterReset).toBe('');

    await calculatorPage.verifyScoreIsEmpty();

    const tileSlots = page.locator('[data-testid^="tile-"]');
    for (let i = 0; i < 4; i++) {
      await expect(tileSlots.nth(i)).toHaveText('');
    }
  });
});

test.describe('Score Saving Functionality', () => {
  let calculatorPage: ScrabblePointsCalculatorPage;

  test.beforeEach(async ({ page }) => {
    calculatorPage = new ScrabblePointsCalculatorPage(page);
    await calculatorPage.goto();
  });

  test.afterEach(async ({ page, request }) => {
    await calculatorPage.cleanupAllScores(request);
  });

  test('should have save button disabled on initial render', async () => {
    await calculatorPage.verifySaveButtonDisabled();
  });

  test('should keep save button disabled when focusing with empty input', async () => {
    await calculatorPage.focusTiles();
    await calculatorPage.verifySaveButtonDisabled();
  });

  test('should have save button enabled after entering letters', async () => {
    await calculatorPage.inputLetters('WIN');
    await calculatorPage.verifySaveButtonEnabled();
  });

  test('should save score to backend and show success feedback when save button is clicked', async ({ request }) => {
    const expectedScore: Score = {
      id: '',
      letters: 'QUIZ',
      points: 22 // Q(10) + U(1) + I(1) + Z(10) = 22
    }

    await calculatorPage.inputLetters(expectedScore.letters);
    await calculatorPage.verifyScore(expectedScore.points);

    const savedScoreId = await calculatorPage.clickSave();
    expectedScore.id = savedScoreId || ''

    await calculatorPage.verifySavedScore(request, expectedScore);

    await calculatorPage.verifyToastMessage('Tiles "QUIZ" that scored 22 points have been saved.');
    await calculatorPage.verifyTilesCleared();
    await calculatorPage.verifyScoreIsEmpty();
    await calculatorPage.verifyTilesInputFocused();
  });

});
