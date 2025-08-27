import React from 'react'
import DataTable from '../base/DataTable'
import { useGameBoard } from './hooks/useGameBoard'

interface ScoringRulesTableProps {
  className?: string
}

const COLUMNS = [
  { key: 'points', label: 'Points', align: 'center' as const },
  { key: 'letters', label: 'Letters', align: 'left' as const },
]

const ScoringRulesTable: React.FC<ScoringRulesTableProps> = ({ className }) => {
  const { scoringRules } = useGameBoard()

  const tableData = React.useMemo(() => {
    return scoringRules.map(rule => ({
      points: rule.points,
      letters: rule.letters.split('').join(', '),
    }))
  }, [scoringRules])

  return (
    <div className={`${className || ''}`}>
      <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">
        Scrabble Scoring Rules
      </h3>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <DataTable columns={COLUMNS} data={tableData} />
      </div>
      <p className="text-xs text-gray-500 text-center mt-2">
        Each letter has a point value. Calculate your word's total by adding up all letter values.
      </p>
    </div>
  )
}

export default ScoringRulesTable
