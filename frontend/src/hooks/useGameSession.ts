import { useEffect, useState } from 'react';
import api from '../lib/api';

interface GameSession {
  sessionId: string;
  playerId: string;
  playerName: string;
}

export const useGameSession = () => {
  const [gameSession, setGameSession] = useState<GameSession | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);

  // Create game session on hook initialization
  useEffect(() => {
    const createGameSession = async () => {
      try {
        setIsLoadingSession(true);
        const response = await api.post('/game-sessions');
        setGameSession(response.data);
      } catch (error) {
        console.error('Failed to create game session:', error);
        // Error is handled globally by the axios interceptor
      } finally {
        setIsLoadingSession(false);
      }
    };

    createGameSession();
  }, []);

  return {
    gameSession,
    isLoadingSession
  };
};
