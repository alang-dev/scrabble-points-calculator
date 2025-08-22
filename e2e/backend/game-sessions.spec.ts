import { test, expect } from '@playwright/test';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8080/api/v1';

test.describe('Game Sessions API', () => {
  test('should create a new game session with player', async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/game-sessions`);
    
    expect(response.status()).toBe(200);
    
    const gameSession = await response.json();
    
    // Validate response structure
    expect(gameSession).toHaveProperty('sessionId');
    expect(gameSession).toHaveProperty('playerId');
    expect(gameSession).toHaveProperty('playerName');
    
    // Validate data types and formats
    expect(typeof gameSession.sessionId).toBe('string');
    expect(gameSession.sessionId).toMatch(/^[0-9a-f-]{36}$/); // UUID format
    
    expect(typeof gameSession.playerId).toBe('string');
    expect(gameSession.playerId).toMatch(/^[0-9a-f-]{36}$/); // UUID format
    
    expect(typeof gameSession.playerName).toBe('string');
    expect(gameSession.playerName).toMatch(/^Player\d+$/); // Player + number format
  });

  test('should return different sessions and players on multiple calls', async ({ request }) => {
    // Create first game session
    const response1 = await request.post(`${API_BASE_URL}/game-sessions`);
    expect(response1.status()).toBe(200);
    const session1 = await response1.json();
    
    // Create second game session
    const response2 = await request.post(`${API_BASE_URL}/game-sessions`);
    expect(response2.status()).toBe(200);
    const session2 = await response2.json();
    
    // Ensure different sessions
    expect(session1.sessionId).not.toBe(session2.sessionId);
    expect(session1.playerId).not.toBe(session2.playerId);
    
    // Player names might be the same due to random generation, so we don't test that
  });
});