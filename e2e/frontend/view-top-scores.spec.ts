import { test } from '@playwright/test';
import { ViewTopScoresPage } from '../page-objects/ViewTopScoresPage';

test.describe('View Top Scores Modal', () => {
  let topScoresPage: ViewTopScoresPage;

  test.beforeEach(async ({ page }) => {
    topScoresPage = new ViewTopScoresPage(page);
    await topScoresPage.goto();
  });

  test('should have a "View Top Scores" button', async ({ page }) => {
    await topScoresPage.verifyButtonVisible();
  });

  test('should open modal when "View Top Scores" button is clicked', async ({ page }) => {
    await topScoresPage.openModal();
    await topScoresPage.verifyModalVisible();
    await topScoresPage.verifyModalTitle();
  });

  test('should display top scores table with data', async ({ page }) => {
    const mockData = [
      { player: 'Player 1', score: '89', tiles: 'QUIXOTIC' },
      { player: 'Player 2', score: '76', tiles: 'JAZZY' },
      { player: 'Player 3', score: '65', tiles: 'WAXED' }
    ];

    await topScoresPage.openModal();
    await topScoresPage.verifyTableHeaders(['rank', 'player', 'score', 'tiles', 'date']);
    await topScoresPage.verifyTableData(mockData);
  });

  test('should show scores sorted by rank', async ({ page }) => {
    await topScoresPage.openModal();
    await topScoresPage.verifyRanksSorted();
  });

  test('should close modal when close button is clicked', async ({ page }) => {
    await topScoresPage.openModal();
    await topScoresPage.closeModal();
    await topScoresPage.verifyModalClosed();
  });

  test('should close modal when clicking outside (overlay)', async ({ page }) => {
    await topScoresPage.openModal();
    await topScoresPage.closeWithOverlay();
    await topScoresPage.verifyModalClosed();
  });

  test('should close modal with Escape key', async ({ page }) => {
    await topScoresPage.openModal();
    await topScoresPage.closeWithEscape();
    await topScoresPage.verifyModalClosed();
  });

  test('should maintain proper tab order for accessibility', async ({ page }) => {
    await topScoresPage.openModal();
    await topScoresPage.verifyTabOrder();
  });
});
