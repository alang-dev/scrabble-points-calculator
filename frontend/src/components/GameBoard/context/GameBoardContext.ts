import { createContext } from 'react'

interface ScoringRule {
  points: number
  letters: string
}

export interface GameBoardContextType {
  // Original tiles from OTP input - must not be modified as it has side effects
  // when modifying middle letters, the auto advance to next letter won't work
  originalTiles: string
  setOriginalTiles: (tiles: string) => void

  isScoreComputing: boolean
  isScoreSaving: boolean
  scoreValue: string | number

  pattern?: string
  scoringRules: ScoringRule[]

  canSave: boolean
  handleReset: () => void
  handleSave: () => void
}

export const GameBoardContext = createContext<GameBoardContextType | undefined>(undefined)
