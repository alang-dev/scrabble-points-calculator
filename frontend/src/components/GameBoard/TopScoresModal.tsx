import React from 'react'
import { formatDateTime } from '../../lib/utils'
import { useTopScores } from '../../hooks/useTopScores'
import DataTable from '../base/DataTable'
import Modal from '../base/Modal'

interface TopScoresModalProps {
  isOpen: boolean
  onClose: () => void
}

const columns = [
  { key: 'rank', label: 'Rank', align: 'center' as const },
  { key: 'score', label: 'Score', align: 'right' as const },
  { key: 'letters', label: 'Letters', align: 'left' as const },
  {
    key: 'createdAt',
    label: 'Saved At',
    align: 'right' as const,
    render: (value: unknown) => formatDateTime(value as string),
  },
]

const TopScoresModal: React.FC<TopScoresModalProps> = ({ isOpen, onClose }) => {
  const { scores, isLoading } = useTopScores(isOpen)

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Top 10 Scores"
      className="max-w-2xl"
      data-testid="top-scores-modal"
    >
      <div className="space-y-4">
        <p className="text-gray-600 text-sm">
          Here are the highest scoring Scrabble words submitted.
        </p>

        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading top scores...</span>
          </div>
        ) : scores.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No scores recorded yet.</p>
            <p className="text-sm text-gray-400 mt-2">Be the first to save a score!</p>
          </div>
        ) : (
          <DataTable columns={columns} data={scores} data-testid="top-scores-table" />
        )}
      </div>
    </Modal>
  )
}

export default TopScoresModal
