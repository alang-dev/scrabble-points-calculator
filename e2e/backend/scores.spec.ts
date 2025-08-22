import { expect, test } from '@playwright/test';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8080/api/v1';

test.describe('Scores API', () => {
  test('should get scoring rules with correct letter groups', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/scores/rules`);

    expect(response.status()).toBe(200);

    const scoringRules = await response.json();

    // Validate complete scoring rules structure
    const expectedScoreGroups = {
      "1": ["A", "E", "I", "L", "N", "O", "R", "S", "T", "U"],
      "2": ["D", "G"],
      "3": ["B", "C", "M", "P"],
      "4": ["F", "H", "V", "W", "Y"],
      "5": ["K"],
      "8": ["J", "X"],
      "10": ["Q", "Z"]
    };


    expect(scoringRules.scoreGroups).toEqual(expectedScoreGroups);
  });

  test('should compute score for valid letters', async ({ request }) => {
    // First create a game session to get valid IDs
    const sessionResponse = await request.post(`${API_BASE_URL}/game-sessions`);
    expect(sessionResponse.status()).toBe(200);
    const gameSession = await sessionResponse.json();

    const response = await request.post(`${API_BASE_URL}/scores/compute`, {
      data: {
        sessionId: gameSession.sessionId,
        playerId: gameSession.playerId,
        letters: 'HELLO'
      }
    });

    expect(response.status()).toBe(200);

    const scoreResult = await response.json();

    // Validate response structure
    expect(scoreResult).toHaveProperty('sessionId');
    expect(scoreResult).toHaveProperty('playerId');
    expect(scoreResult).toHaveProperty('playerName');
    expect(scoreResult).toHaveProperty('letters');
    expect(scoreResult).toHaveProperty('points');
    expect(scoreResult.sessionId).toBe(gameSession.sessionId);
    expect(scoreResult.playerId).toBe(gameSession.playerId);
    expect(scoreResult.playerName).toBe(gameSession.playerName);
    expect(scoreResult.letters).toBe('HELLO');

    // H=4, E=1, L=1, L=1, O=1 = 8 points
    expect(scoreResult.points).toBe(8);
  });

  test('should reject invalid letters in compute score', async ({ request }) => {
    // First create a game session to get valid IDs
    const sessionResponse = await request.post(`${API_BASE_URL}/game-sessions`);
    expect(sessionResponse.status()).toBe(200);
    const gameSession = await sessionResponse.json();

    const response = await request.post(`${API_BASE_URL}/scores/compute`, {
      data: {
        sessionId: gameSession.sessionId,
        playerId: gameSession.playerId,
        letters: 'ABC1'
      }
    });

    expect(response.status()).toBe(400);
  });

  test('should reject invalid player ID in compute score', async ({ request }) => {
    // Create a game session first
    const sessionResponse = await request.post(`${API_BASE_URL}/game-sessions`);
    const gameSession = await sessionResponse.json();

    const response = await request.post(`${API_BASE_URL}/scores/compute`, {
      data: {
        playerId: '00000000-0000-0000-0000-000000000000',
        sessionId: gameSession.sessionId,
        letters: 'TEST'
      }
    });

    expect(response.status()).toBe(404);
  });

  test('should reject invalid session ID in compute score', async ({ request }) => {
    // Create a game session first
    const sessionResponse = await request.post(`${API_BASE_URL}/game-sessions`);
    const gameSession = await sessionResponse.json();

    const response = await request.post(`${API_BASE_URL}/scores/compute`, {
      data: {
        playerId: gameSession.playerId,
        sessionId: '00000000-0000-0000-0000-000000000000',
        letters: 'TEST'
      }
    });

    expect(response.status()).toBe(404);
  });

  test('should create score with valid data', async ({ request }) => {
    // First create a game session to get valid IDs
    const sessionResponse = await request.post(`${API_BASE_URL}/game-sessions`);
    expect(sessionResponse.status()).toBe(200);
    const gameSession = await sessionResponse.json();

    // Create score
    const response = await request.post(`${API_BASE_URL}/scores`, {
      data: {
        playerId: gameSession.playerId,
        sessionId: gameSession.sessionId,
        letters: 'QUIZ'
      }
    });

    expect(response.status()).toBe(200);

    const score = await response.json();

    // Validate response structure
    expect(score).toHaveProperty('scoreId');
    expect(score).toHaveProperty('playerId');
    expect(score).toHaveProperty('playerName');
    expect(score).toHaveProperty('sessionId');
    expect(score).toHaveProperty('letters');
    expect(score).toHaveProperty('points');
    expect(score).toHaveProperty('createdAt');

    // Validate data
    expect(score.playerId).toBe(gameSession.playerId);
    expect(score.playerName).toBe(gameSession.playerName);
    expect(score.sessionId).toBe(gameSession.sessionId);
    expect(score.letters).toBe('QUIZ');

    // Q=10, U=1, I=1, Z=10 = 22 points
    expect(score.points).toBe(22);

    // Validate UUID format
    expect(score.scoreId).toMatch(/^[0-9a-f-]{36}$/);
  });

  test('should reject invalid player ID in create score', async ({ request }) => {
    // Create a game session first
    const sessionResponse = await request.post(`${API_BASE_URL}/game-sessions`);
    const gameSession = await sessionResponse.json();

    const response = await request.post(`${API_BASE_URL}/scores`, {
      data: {
        playerId: '00000000-0000-0000-0000-000000000000',
        sessionId: gameSession.sessionId,
        letters: 'TEST'
      }
    });

    expect(response.status()).toBe(404);
  });

  test('should reject invalid session ID in create score', async ({ request }) => {
    // Create a game session first
    const sessionResponse = await request.post(`${API_BASE_URL}/game-sessions`);
    const gameSession = await sessionResponse.json();

    const response = await request.post(`${API_BASE_URL}/scores`, {
      data: {
        playerId: gameSession.playerId,
        sessionId: '00000000-0000-0000-0000-000000000000',
        letters: 'TEST'
      }
    });

    expect(response.status()).toBe(404);
  });
});
