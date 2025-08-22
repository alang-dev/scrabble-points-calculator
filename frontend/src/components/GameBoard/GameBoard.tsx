import React, { useEffect, useState } from 'react';
import { useGameSession } from '../../hooks/useGameSession';
import { useScoringRules } from '../../hooks/useScoringRules';
import api from '../../lib/api';
import { toast } from '../base/Toast/toast';
import Controls from './Controls';
import ScoreDisplay from './ScoreDisplay';
import ScoringRulesTable from './ScoringRulesTable';
import Tiles from './Tiles';

interface GameBoardProps {
  onViewTopScores: () => void;
}

interface ScoreResult {
  sessionId: string;
  playerId: string;
  playerName: string;
  letters: string;
  points: number;
}

const GameBoard: React.FC<GameBoardProps> = ({ onViewTopScores }) => {
  const [tiles, setTiles] = useState('');
  const [score, setScore] = useState(0);
  const [isLoadingScore, setIsLoadingScore] = useState(false);
  const { gameSession, isLoadingSession } = useGameSession();
  const { scoringRules, validLetters } = useScoringRules();

  // Compute score when tiles change
  useEffect(() => {
    // Set loading state immediately when tiles change
    if (gameSession && tiles.trim()) {
      setIsLoadingScore(true);
    } else {
      setIsLoadingScore(false);
    }

    const handleComputeScore = async () => {
      if (!gameSession || !tiles.trim()) {
        setScore(0);
        setIsLoadingScore(false);
        return;
      }

      try {
        const response = await api.post('/scores/compute', {
          sessionId: gameSession.sessionId,
          playerId: gameSession.playerId,
          letters: tiles
        });
        const scoreResult: ScoreResult = response.data;
        setScore(scoreResult.points);
      } catch (error) {
        console.error('Failed to compute score:', error);
        // Error is handled globally by the axios interceptor
        setScore(0);
      } finally {
        setIsLoadingScore(false);
      }
    };

    // Debounce the API call to avoid too many requests
    const timeoutId = setTimeout(handleComputeScore, 300);
    return () => clearTimeout(timeoutId);
  }, [tiles, gameSession]);

  const handleTileChange = (newValue: string) => {
    const filteredValue = newValue
      .split('')
      .filter(char => validLetters.has(char.toUpperCase()))
      .join('');
    setTiles(filteredValue);
  };

  const handleReset = () => {
    setTiles('');
  };

  const handleSave = async () => {
    if (!tiles.trim() || score <= 0 || !gameSession) {
      return;
    }

    try {
      await api.post('/scores', {
        sessionId: gameSession.sessionId,
        playerId: gameSession.playerId,
        letters: tiles,
        points: score
      });
      toast.success(`Score saved! ${tiles} = ${score} points`);
    } catch (error) {
      console.error('Failed to save score:', error);
      // Error is handled globally by the axios interceptor
    }
  };

  const canSave = tiles.trim().length > 0 && score > 0;

  // Show loading state while creating game session
  if (isLoadingSession) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Initializing game session...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <ScoreDisplay score={score} isLoading={isLoadingScore} />

      {/* Tiles Input */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-700 text-center">
          Enter your Scrabble tiles
        </h2>
        <Tiles value={tiles} onChange={handleTileChange} />
        <p className="text-center text-sm text-gray-600">
          Enter up to 10 letters (see scoring rules below)
        </p>
      </div>

      <Controls
        onReset={handleReset}
        onSave={handleSave}
        onViewTopScores={onViewTopScores}
        canSave={canSave}
      />

      {/* Scoring Rules Table */}
      <ScoringRulesTable scoringRules={scoringRules} />
    </div>
  );
};

export default GameBoard;
