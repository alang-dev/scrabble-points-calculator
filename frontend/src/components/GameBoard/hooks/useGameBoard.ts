import { useContext } from 'react'
import { GameBoardContext, type GameBoardContextType } from '../context/GameBoardContext'

export const useGameBoard = (): GameBoardContextType => {
  const context = useContext(GameBoardContext)
  if (!context) {
    throw new Error('useGameBoard must be used within a GameBoardProvider')
  }
  return context
}
