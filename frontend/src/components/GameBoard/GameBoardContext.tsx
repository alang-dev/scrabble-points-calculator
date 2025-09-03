import React, { useState, useMemo } from 'react'
import { useScoreCompute } from '../../hooks/useScoreCompute'
import { useScoringRules } from '../../hooks/useScoringRules'
import api from '../../lib/api'
import { toast } from '../base/Toast/toast'
import { GameBoardContext, type GameBoardContextType } from './context/GameBoardContext'

interface GameBoardProviderProps {
  children: React.ReactNode
}

export const GameBoardProvider: React.FC<GameBoardProviderProps> = ({ children }) => {
  // Original tiles from OTP input - must not be modified as it has side effects
  // when modifying middle letters, the auto advance to next letter won't work
  const [originalTiles, setOriginalTilesState] = useState('')
  const [isScoreSaving, setIsScoreSaving] = useState(false)

  const { pattern, scoringRules = [] } = useScoringRules()
  const { isLoading: isScoreComputing, computedScore } = useScoreCompute(originalTiles)

  const setOriginalTiles = (newTiles: string) => {
    setOriginalTilesState(newTiles)
  }

  const clearTiles = () => {
    setOriginalTilesState('')
  }

  const handleReset = () => {
    clearTiles()
  }

  const canSave = typeof computedScore?.score === 'number'
  const handleSave = () => {
    if (!canSave) {
      return
    }

    setIsScoreSaving(true)
    const letters = originalTiles.toUpperCase()
    api
      .post('/scores', {
        letters: letters,
      })
      .then(response => {
        const { letters, points } = response.data
        toast.success(`Tiles "${letters}" that scored ${points} points have been saved.`)
        clearTiles()
      })
      .finally(() => {
        setIsScoreSaving(false)
      })
  }

  const value: GameBoardContextType = useMemo(
    () => ({
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
    }),
    [
      originalTiles,
      isScoreComputing,
      isScoreSaving,
      computedScore?.score,
      pattern,
      scoringRules,
      canSave,
      handleReset,
      handleSave,
    ]
  )

  return <GameBoardContext.Provider value={value}>{children}</GameBoardContext.Provider>
}
