import { expect, test } from '@playwright/test'
import { API_BASE_URL } from '../config/environments'
import { TopScore } from '../models/Score'
import { SCORING_TEST_CASES, SCRABBLE_SCORING_RULES } from '../test-data/scoring-rules'

test.describe('Scores API', () => {
  const createdScoreIds: string[] = []

  test.afterEach(async ({ request }) => {
    if (createdScoreIds.length > 0) {
      await request.delete(`${API_BASE_URL}/scores`, {
        data: createdScoreIds,
      })
      createdScoreIds.length = 0
    }
  })

  test('should return scoring rules with correct letter groups', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/scores/rules`)

    expect(response.status()).toBe(200)

    const actualRules = await response.json()

    expect(actualRules).toEqual(SCRABBLE_SCORING_RULES)
  })

  test('should compute score for valid letters', async ({ request }) => {
    const testLetters = 'HELLO'
    const expectedScore = 8 // H(4) + E(1) + L(1) + L(1) + O(1) = 8

    const response = await request.post(`${API_BASE_URL}/scores/compute`, {
      data: { letters: testLetters },
    })

    expect(response.status()).toBe(200)

    const actualResult = await response.json()

    const expectedResult = expect.objectContaining({
      letters: testLetters,
      score: expectedScore,
    })

    expect(actualResult).toEqual(expectedResult)
  })

  test('should not allow empty letters in compute score', async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/scores/compute`, {
      data: { letters: '' },
    })

    expect(response.status()).toBe(400)

    const errorResponse = await response.json()
    expect(errorResponse.message).toContain('Validation failed for object=\'scoreCreateDTO\'')
    expect(errorResponse.errors).toHaveLength(1)
    expect(errorResponse.errors[0].defaultMessage).toBe('Letters field is required and cannot be empty')
  })

  test('should compute score for alphanumeric string with special characters', async ({
    request,
  }) => {
    const testLetters = '#$3sdkfDSS'
    const expectedScore = 17 // S(1) + D(2) + K(6) + F(4) + D(2) + S(1) + S(1) = 17

    const response = await request.post(`${API_BASE_URL}/scores/compute`, {
      data: { letters: testLetters },
    })

    expect(response.status()).toBe(200)

    const actualResult = await response.json()

    const expectedResult = expect.objectContaining({
      letters: testLetters,
      score: expectedScore,
    })

    expect(actualResult).toEqual(expectedResult)
  })

  test('should not allow letters longer than 10 characters', async ({ request }) => {
    const testLetters = 'ABCDEFGHIJK' // 11 letters

    const response = await request.post(`${API_BASE_URL}/scores/compute`, {
      data: { letters: testLetters },
    })

    expect(response.status()).toBe(400)

    const errorResponse = await response.json()
    expect(errorResponse.message).toContain('Validation failed for object=\'scoreCreateDTO\'')
    expect(errorResponse.errors).toHaveLength(1)
    expect(errorResponse.errors[0].defaultMessage).toBe('Letters cannot exceed 10 characters')
  })

  test('should not create score for letters longer than 10 characters', async ({ request }) => {
    const testLetters = 'ABCDEFGHIJKLMNOP' // 16 letters

    const response = await request.post(`${API_BASE_URL}/scores`, {
      data: { letters: testLetters },
    })

    expect(response.status()).toBe(400)

    const errorResponse = await response.json()
    expect(errorResponse.message).toContain('Validation failed for object=\'scoreCreateDTO\'')
    expect(errorResponse.errors).toHaveLength(1)
    expect(errorResponse.errors[0].defaultMessage).toBe('Letters cannot exceed 10 characters')
  })

  for (const { word, expectedPoints } of SCORING_TEST_CASES) {
    test(`should create score for '${word}' with ${expectedPoints} points`, async ({ request }) => {
      const response = await request.post(`${API_BASE_URL}/scores`, {
        data: { letters: word },
      })

      expect(response.status()).toBe(200)

      const actualScore = await response.json()
      createdScoreIds.push(actualScore.id)

      const expectedScore = expect.objectContaining({
        id: expect.any(String),
        letters: word,
        points: expectedPoints,
        createdAt: expect.any(String),
      })

      expect(actualScore).toEqual(expectedScore)
    })
  }

  test('should get top scores sorted by points descending', async ({ request }) => {
    const testData = [
      { letters: 'QUIZ', expectedPoints: 22 },
      { letters: 'HELLO', expectedPoints: 8 },
      { letters: 'TEST', expectedPoints: 4 },
    ]

    for (const { letters } of testData) {
      const createResponse = await request.post(`${API_BASE_URL}/scores`, {
        data: { letters },
      })
      expect(createResponse.status()).toBe(200)
      const score = await createResponse.json()
      createdScoreIds.push(score.id)
    }

    const expectedSize = 10
    const response = await request.get(
      `${API_BASE_URL}/scores?size=${expectedSize}&sort=points,desc`
    )

    expect(response.status()).toBe(200)

    const actualScores = await response.json()

    expect(Array.isArray(actualScores)).toBe(true)
    expect(actualScores.length).toBeGreaterThanOrEqual(3)

    for (let i = 0; i < actualScores.length - 1; i++) {
      expect(actualScores[i].score).toBeGreaterThanOrEqual(actualScores[i + 1].score)
    }

    actualScores.forEach((score: TopScore, index: number) => {
      const expectedScore = expect.objectContaining({
        rank: index + 1,
        score: expect.any(Number),
        letters: expect.any(String),
      })
      expect(score).toEqual(expectedScore)
    })
  })

  test('should limit results when size parameter is provided', async ({ request }) => {
    const testData = [{ letters: 'A' }, { letters: 'B' }, { letters: 'C' }]

    for (const { letters } of testData) {
      const createResponse = await request.post(`${API_BASE_URL}/scores`, {
        data: { letters },
      })
      expect(createResponse.status()).toBe(200)
      const score = await createResponse.json()
      createdScoreIds.push(score.id)
    }

    const expectedMaxSize = 2
    const response = await request.get(`${API_BASE_URL}/scores?size=${expectedMaxSize}`)

    expect(response.status()).toBe(200)

    const actualScores = await response.json()

    expect(Array.isArray(actualScores)).toBe(true)
    expect(actualScores.length).toBe(expectedMaxSize)
  })
})
