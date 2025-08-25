import React from 'react';
import { useGameBoard } from './GameBoardContext';

interface ScoreDisplayProps {
  className?: string;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ className }) => {
  const { isScoreLoading, scoreValue } = useGameBoard();
  return (
    <div className={`text-center ${className || ''}`}>
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-semibold mb-2">Your Score</h3>
        <div className="text-4xl font-bold flex items-center justify-center gap-2 min-h-[3rem]" data-testid="score-display">
          {isScoreLoading ? (
            <>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              <span className="text-2xl">Calculating...</span>
            </>
          ) : (
            <span className="min-w-[4rem] text-center" data-testid="score-value">{scoreValue}</span>
          )}
        </div>
        <p className="text-blue-100 text-sm mt-2">points</p>
      </div>
    </div>
  );
};

export default ScoreDisplay;
