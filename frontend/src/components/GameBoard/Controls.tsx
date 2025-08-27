import { BarChart3, CloudUpload, RotateCcw } from 'lucide-react'
import React, { useState } from 'react'
import { cn } from '../../lib/utils'
import { IconButton } from '../base/Button'
import { useGameBoard } from './hooks/useGameBoard'
import TopScoresModal from './TopScoresModal'

interface ControlsProps {
  className?: string
}

const Controls: React.FC<ControlsProps> = ({ className }) => {
  const { handleReset, handleSave, canSave } = useGameBoard()
  const [showTopScores, setShowTopScores] = useState(false)

  const handleViewTopScores = () => {
    setShowTopScores(true)
  }

  const handleCloseTopScores = () => {
    setShowTopScores(false)
  }

  return (
    <>
      <div className={cn('flex justify-center gap-4', className)}>
        <IconButton icon={RotateCcw} onClick={handleReset} data-testid="reset-button">
          Reset Tiles
        </IconButton>
        <IconButton
          icon={CloudUpload}
          onClick={handleSave}
          disabled={!canSave}
          data-testid="save-button"
        >
          Save Score
        </IconButton>
        <IconButton
          icon={BarChart3}
          onClick={handleViewTopScores}
          data-testid="view-top-scores-button"
        >
          View Top Scores
        </IconButton>
      </div>

      <TopScoresModal isOpen={showTopScores} onClose={handleCloseTopScores} />
    </>
  )
}

export default Controls
