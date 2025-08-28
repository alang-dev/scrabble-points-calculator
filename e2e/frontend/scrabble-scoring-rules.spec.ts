import { test } from '@playwright/test'
import { ScoringRulesPage } from '../pages/ScoringRulesPage'
import { SCRABBLE_SCORING_RULES } from '../test-data/scoring-rules'

test.describe('Scrabble Scoring Rules', () => {
  let scoringRulesPage: ScoringRulesPage

  test.beforeEach(async ({ page }) => {
    scoringRulesPage = new ScoringRulesPage(page)
    await scoringRulesPage.goto()
  })

  test('should display scoring rules table', async () => {
    await scoringRulesPage.verifyHeadingVisible()
    await scoringRulesPage.verifyTableVisible()
    await scoringRulesPage.verifyTableHeaders(['Points', 'Letters'])
  })

  test('should display correct point values for letters', async () => {
    const expectedRules = SCRABBLE_SCORING_RULES.map(rule => ({
      ...rule,
      letters: rule.letters.split('').join(', '),
    }))

    await scoringRulesPage.verifyTableData(expectedRules)
  })

  test('should display points in ascending order', async () => {
    await scoringRulesPage.verifyPointsInOrder()
  })

  test('should display helpful description text', async () => {
    await scoringRulesPage.verifyDescriptionText()
  })

  test('should have proper table styling', async () => {
    await scoringRulesPage.verifyTableStructure()
  })
})
