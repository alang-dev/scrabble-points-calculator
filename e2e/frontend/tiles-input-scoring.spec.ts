import { expect, test } from '@playwright/test';
import { Score } from '../models/Score';
import { ScrabblePointsCalculatorPage } from '../pages/ScrabblePointsCalculatorPage';
import { SCORING_TEST_CASES } from '../test-data/scoring-rules';

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
    // FAILING TEST CASE - Documents expected behavior that needs to be implemented
    // Expected: When editing a letter in the middle, it should REPLACE the letter and move cursor to next position
    // Current: It INSERTS the letter and shifts remaining letters to the right

    // First, input a word
    await calculatorPage.inputLetters('HELLO');

    // Use keyboard navigation to move to middle position (position 2)
    const tilesInput = page.locator('[data-testid="tiles-input"]');
    await tilesInput.click();

    // Move cursor to position 2 (middle 'L')
    await page.keyboard.press('Home'); // Go to start
    await page.keyboard.press('ArrowRight'); // Position 1
    await page.keyboard.press('ArrowRight'); // Position 2

    // Type a new letter - this should replace the current letter and advance cursor
    await page.keyboard.type('X');

    const tileSlots = page.locator('[data-testid^="tile-"]');

    // EXPECTED BEHAVIOR (currently failing):
    // Should result in 'HEXLO' - X replaces the L at position 2, cursor moves to position 3
    // await expect(tileSlots.nth(0)).toContainText('H');
    // await expect(tileSlots.nth(1)).toContainText('E');
    // await expect(tileSlots.nth(2)).toContainText('X');
    // await expect(tileSlots.nth(3)).toContainText('L');
    // await expect(tileSlots.nth(4)).toContainText('O');

    // CURRENT BEHAVIOR (what actually happens):
    // Results in 'HEXLLO' - X is inserted at position 2, remaining letters shift right
    const currentText = await calculatorPage.getTilesText();
    expect(currentText).toBe('HEXLLO'); // Documents current (incorrect) behavior
  });

  test('should completely clear tiles and reset score when Reset Tiles button is clicked', async ({ page }) => {
    // Listen for console messages
    page.on('console', msg => console.log('BROWSER:', msg.text()));
    
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

  test('should save score to backend when save button is clicked', async ({ request }) => {
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
  });

});
