import React from 'react';
import Table from '../base/Table';

interface ScoreGroups {
  [points: string]: string[];
}

interface ScoringRules {
  scoreGroups: ScoreGroups;
}

interface ScoringRulesTableProps {
  className?: string;
  scoringRules: ScoringRules | null;
}

const ScoringRulesTable: React.FC<ScoringRulesTableProps> = ({ className, scoringRules }) => {

  if (!scoringRules) {
    return null;
  }

  // Convert score groups to table data
  const tableData = Object.entries(scoringRules.scoreGroups)
    .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
    .map(([points, letters]) => ({
      points: parseInt(points),
      letters: letters.join(', ')
    }));

  const columns = [
    { key: 'points', label: 'Points', align: 'center' as const },
    { key: 'letters', label: 'Letters', align: 'left' as const },
  ];

  return (
    <div className={`${className || ''}`}>
      <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">Scrabble Scoring Rules</h3>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <Table columns={columns} data={tableData} />
      </div>
      <p className="text-xs text-gray-500 text-center mt-2">
        Each letter has a point value. Calculate your word's total by adding up all letter values.
      </p>
    </div>
  );
};

export default ScoringRulesTable;
