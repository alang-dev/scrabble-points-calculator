import React, { useState } from 'react';
import Modal from '../base/Modal';
import DataTable from '../base/DataTable';

interface ScoreEntry {
  rank: number;
  playerName: string;
  score: number;
  tiles: string;
  date: string;
}

interface TopScoresModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TopScoresModal: React.FC<TopScoresModalProps> = ({ isOpen, onClose }) => {
  // Mock data for top scores - will be replaced with backend API integration later
  const [scores] = useState<ScoreEntry[]>([
    { rank: 1, playerName: 'Player 1', score: 89, tiles: 'QUIXOTIC', date: '2025-01-15' },
    { rank: 2, playerName: 'Player 2', score: 76, tiles: 'JAZZY', date: '2025-01-14' },
    { rank: 3, playerName: 'Player 3', score: 65, tiles: 'WAXED', date: '2025-01-13' },
  ]);
  const columns = [
    { key: 'rank', label: 'Rank', align: 'center' as const },
    { key: 'playerName', label: 'Player', align: 'left' as const },
    { key: 'score', label: 'Score', align: 'right' as const },
    { key: 'tiles', label: 'Tiles', align: 'center' as const },
    { key: 'date', label: 'Date', align: 'center' as const },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Top 10 Scores"
      className="max-w-2xl"
    >
      <div className="space-y-4">
        <p className="text-gray-600 text-sm">
          Here are the highest scoring Scrabble words submitted by players.
        </p>

        <DataTable
          columns={columns}
          data={scores}
        />

        {scores.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No scores recorded yet.</p>
            <p className="text-sm text-gray-400 mt-2">
              Be the first to save a score!
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default TopScoresModal;
