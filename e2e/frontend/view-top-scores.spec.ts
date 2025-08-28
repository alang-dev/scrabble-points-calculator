import { expect, test } from '@playwright/test'
import { ViewTopScoresPage } from '../pages/ViewTopScoresPage'
import { TopScore } from '../models/Score'

test.describe.serial('Top Scores Table Display', () => {
  let topScoresPage: ViewTopScoresPage
  let allSeededScores: TopScore[] = []

  test.beforeEach(async ({ page }) => {
    topScoresPage = new ViewTopScoresPage(page)
    await topScoresPage.goto()
  })

  test.afterEach(async ({ page }) => {
    if (await page.locator('[role="dialog"]').isVisible()) {
      await topScoresPage.closeModal()
    }
  })

  test.afterAll(async ({ request }) => {
    if (topScoresPage) {
      await topScoresPage.cleanupAllScores(request)
    }
  })

  test('should show empty state when no scores exist', async ({ request }) => {
    allSeededScores = []
    await topScoresPage.cleanupAllScores(request)

    await topScoresPage.clickViewTopScores()
    await topScoresPage.verifyModalVisible()

    const rowCount = await topScoresPage.getTableRowCount()
    expect(rowCount).toBe(0)
    expect(allSeededScores).toHaveLength(0)
  })

  test('should display 6 scores when 6 scores are seeded', async ({ request }) => {
    const scoreData = [
      { letters: 'QUIZ' },
      { letters: 'JAVA' },
      { letters: 'WORLD' },
      { letters: 'HELLO' },
      { letters: 'CODE' },
      { letters: 'TEST' },
    ]
    const newScores = await topScoresPage.seedScores(request, scoreData)
    allSeededScores.push(...newScores)

    await topScoresPage.clickViewTopScores()

    const expectedTableData = allSeededScores.map((score, index) => ({
      rank: index + 1,
      points: score.points,
      letters: score.letters,
      savedAt: score.createdAt.slice(0, 19),
    }))

    await topScoresPage.verifyTableHeaders(['Rank', 'Score', 'Letters', 'Saved At'])
    await topScoresPage.verifyTableData(expectedTableData)
  })

  test('should display only top 10 scores when more than 10 scores exist', async ({ request }) => {
    const additionalScoreData = [
      { letters: 'PATCH' },
      { letters: 'SPRING' },
      { letters: 'DEBUG' },
      { letters: 'BUILD' },
      { letters: 'REACT' },
    ]
    const newScores = await topScoresPage.seedScores(request, additionalScoreData)
    allSeededScores.push(...newScores)

    await topScoresPage.clickViewTopScores()

    const top10ExpectedScores = allSeededScores
      .sort((s1, s2) => {
        const scoreDiff = s2.points - s1.points
        if (scoreDiff !== 0) return scoreDiff
        return s1.createdAt.localeCompare(s2.createdAt)
      })
      .slice(0, 10)
      .map((score, index) => ({
        rank: index + 1,
        points: score.points,
        letters: score.letters,
        savedAt: score.createdAt.slice(0, 19),
      }))

    await topScoresPage.verifyTableData(top10ExpectedScores)
  })
})

test.describe('Modal Closing Functionality', () => {
  let topScoresPage: ViewTopScoresPage

  test.beforeEach(async ({ page }) => {
    topScoresPage = new ViewTopScoresPage(page)
    await topScoresPage.goto()
  })

  test.afterEach(async ({ page }) => {
    if (await page.locator('[role="dialog"]').isVisible()) {
      await topScoresPage.closeModal()
    }
  })

  test('should close modal when close button is clicked', async () => {
    await topScoresPage.clickViewTopScores()
    await topScoresPage.closeModal()
    await topScoresPage.verifyModalClosed()
  })

  test('should close modal when clicking outside (overlay)', async () => {
    await topScoresPage.clickViewTopScores()
    await topScoresPage.closeWithOverlay()
    await topScoresPage.verifyModalClosed()
  })

  test('should close modal with Escape key', async () => {
    await topScoresPage.clickViewTopScores()
    await topScoresPage.closeWithEscape()
    await topScoresPage.verifyModalClosed()
  })

  test('should maintain proper tab order for accessibility', async () => {
    await topScoresPage.clickViewTopScores()
    await topScoresPage.verifyTabOrder()
  })
})
