import React from 'react';

interface ScoreDisplayProps {
  score: number;
  isLoading?: boolean;
  className?: string;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score, isLoading, className }) => {
  return (
    <div className={`text-center ${className || ''}`}>
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-semibold mb-2">Current Score</h3>
        <div className="text-4xl font-bold flex items-center justify-center gap-2 min-h-[3rem]" data-testid="score-display">
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              <span className="text-2xl">Calculating...</span>
            </>
          ) : (
            <span className="min-w-[4rem] text-center" data-testid="score-value">{score}</span>
          )}
        </div>
        <p className="text-blue-100 text-sm mt-2">points</p>
      </div>
    </div>
  );
};

export default ScoreDisplay;
