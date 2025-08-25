import { expect, test } from '@playwright/test';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8080/api/v1';

test.describe('Scores API', () => {
  test('should return scoring rules with correct letter groups', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/scores/rules`);

    expect(response.status()).toBe(200);

    const actualRules = await response.json();

    const expectedRules = [
      { points: 1, letters: 'AEIOULNSTR' },
      { points: 2, letters: 'DG' },
      { points: 3, letters: 'BCMP' },
      { points: 4, letters: 'FHVWY' },
      { points: 6, letters: 'K' },
      { points: 8, letters: 'JX' },
      { points: 10, letters: 'QZ' }
    ];

    expect(actualRules).toEqual(expectedRules);
  });

  test('should compute score for valid letters', async ({ request }) => {
    const testLetters = 'HELLO';
    const expectedScore = 8; // H(4) + E(1) + L(1) + L(1) + O(1) = 8

    const response = await request.post(`${API_BASE_URL}/scores/compute`, {
      data: { letters: testLetters }
    });

    expect(response.status()).toBe(200);

    const actualResult = await response.json();

    const expectedResult = expect.objectContaining({
      letters: testLetters,
      score: expectedScore
    });

    expect(actualResult).toEqual(expectedResult);
  });

  test('should handle empty letters in compute score', async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/scores/compute`, {
      data: { letters: '' }
    });

    expect(response.status()).toBe(200);

    const actualResult = await response.json();

    const expectedResult = expect.objectContaining({
      letters: '',
      score: 0
    });

    expect(actualResult).toEqual(expectedResult);
  });

  test.describe('Mutation', () => {
    const createdScoreIds: string[] = [];

    const testScores = [
      { letters: 'A', expectedPoints: 1 },
      { letters: 'QUIZ', expectedPoints: 22 }, // Q(10) + U(1) + I(1) + Z(10)
      { letters: 'HI', expectedPoints: 5 },     // H(4) + I(1)
      { letters: 'TEST', expectedPoints: 4 } // T(1) + E(1) + S(1) + T(1) = 4
    ];

    test.afterAll(async ({ request }) => {
      for (const id of createdScoreIds) {
        await request.delete(`${API_BASE_URL}/scores/${id}`);
      }
      createdScoreIds.length = 0;
    });

    for (const { letters, expectedPoints } of testScores) {
      test(`should create score for '${letters}' with ${expectedPoints} points`, async ({ request }) => {
        const response = await request.post(`${API_BASE_URL}/scores`, {
          data: { letters }
        });

        expect(response.status()).toBe(200);

        const actualScore = await response.json();
        createdScoreIds.push(actualScore.id); // Register for cleanup

        const expectedScore = expect.objectContaining({
          id: expect.any(String),
          letters: letters,
          points: expectedPoints,
          createdAt: expect.any(String)
        });

        expect(actualScore).toEqual(expectedScore);
      });
    }

    test('should get top scores sorted by points descending', async ({ request }) => {
      const expectedSize = 10;
      const response = await request.get(`${API_BASE_URL}/scores?size=${expectedSize}&sort=points,desc`);

      expect(response.status()).toBe(200);

      const actualScores = await response.json();

      expect(Array.isArray(actualScores)).toBe(true);
      expect(actualScores.length).toBeGreaterThanOrEqual(3);

      // Validate that scores are sorted by score descending
      for (let i = 0; i < actualScores.length - 1; i++) {
        expect(actualScores[i].score).toBeGreaterThanOrEqual(actualScores[i + 1].score);
      }

      // Validate top score structure
      actualScores.forEach((score: any, index: number) => {
        const expectedScore = expect.objectContaining({
          rank: index + 1,
          score: expect.any(Number),
          letters: expect.any(String)
        });
        expect(score).toEqual(expectedScore);
      });
    });

    test('should limit results when size parameter is provided', async ({ request }) => {
      const expectedMaxSize = 2;
      const response = await request.get(`${API_BASE_URL}/scores?size=${expectedMaxSize}`);

      expect(response.status()).toBe(200);

      const actualScores = await response.json();

      expect(Array.isArray(actualScores)).toBe(true);
      expect(actualScores.length).toBe(expectedMaxSize);
    });
  });
});
