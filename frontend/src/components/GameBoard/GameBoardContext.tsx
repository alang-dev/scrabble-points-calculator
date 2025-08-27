import React, { createContext, useContext, useRef, useState } from 'react';
import { useScoreCompute } from '../../hooks/useScoreCompute';
import { useScoringRules } from '../../hooks/useScoringRules';
import api from '../../lib/api';
import { toast } from '../base/Toast/toast';

interface ScoringRule {
  points: number;
  letters: string;
}

interface GameBoardContextType {
  // Original tiles from OTP input - must not be modified as it has side effects
  // when modifying middle letters, the auto advance to next letter won't work
  originalTiles: string;
  setOriginalTiles: (tiles: string) => void;

  isScoreComputing: boolean;
  isScoreSaving: boolean;
  scoreValue: string | number

  pattern?: string;
  scoringRules: ScoringRule[];

  canSave: boolean;
  handleReset: () => void;
  handleSave: () => void;
}

const GameBoardContext = createContext<GameBoardContextType | undefined>(undefined);

export const useGameBoard = () => {
  const context = useContext(GameBoardContext);
  if (!context) {
    throw new Error('useGameBoard must be used within a GameBoardProvider');
  }
  return context;
};

interface GameBoardProviderProps {
  children: React.ReactNode;
}

export const GameBoardProvider: React.FC<GameBoardProviderProps> = ({ children }) => {
  // Original tiles from OTP input - must not be modified as it has side effects
  // when modifying middle letters, the auto advance to next letter won't work
  const [originalTiles, setOriginalTilesState] = useState('');
  const [isScoreSaving, setIsScoreSaving] = useState(false);

  const { pattern, scoringRules = [] } = useScoringRules();
  const { isLoading: isScoreComputing, computedScore } = useScoreCompute(originalTiles);


  const setOriginalTiles = (newTiles: string) => {
    setOriginalTilesState(newTiles);
  };

  const clearTiles = () => {
    setOriginalTilesState('');
  };


  const handleReset = () => {
    clearTiles();
  };

  const canSave = typeof computedScore?.score === 'number'
  const handleSave = () => {
    if (!canSave) {
      return;
    }

    setIsScoreSaving(true);
    const letters = originalTiles.toUpperCase()
    api.post('/scores', {
      letters: letters
    })
      .then((response) => {
        const { letters, points } = response.data
        toast.success(`Tiles "${letters}" that scored ${points} points have been saved.`);
        clearTiles();
      })
      .finally(() => {
        setIsScoreSaving(false);
      });
  };


  const value: GameBoardContextType = {
    originalTiles,
    setOriginalTiles,

    isScoreComputing,
    isScoreSaving,
    scoreValue: computedScore?.score ?? '--',
    pattern,
    scoringRules,

    canSave,
    handleReset,
    handleSave,
  };

  return (
    <GameBoardContext.Provider value={value}>
      {children}
    </GameBoardContext.Provider>
  );
};
