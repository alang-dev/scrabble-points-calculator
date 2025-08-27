import React from 'react'
import Controls from './Controls'
import { GameBoardProvider } from './GameBoardContext'
import ScoreDisplay from './ScoreDisplay'
import ScoringRulesTable from './ScoringRulesTable'
import Tiles from './Tiles'

const GameBoardContainer: React.FC = () => {
  return (
    <div className="space-y-8">
      <ScoreDisplay />

      <Tiles />

      <Controls />

      <ScoringRulesTable />
    </div>
  )
}

const GameBoard: React.FC = () => {
  return (
    <GameBoardProvider>
      <GameBoardContainer />
    </GameBoardProvider>
  )
}

export default GameBoard
