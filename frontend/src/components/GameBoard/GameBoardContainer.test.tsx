import { render } from '@testing-library/react'
import React from 'react'
import { beforeEach, describe, it, vi } from 'vitest'
import GameBoard from './GameBoard'

vi.mock('./ScoreDisplay', () => ({
  default: () => <div data-testid="score-display">Mocked ScoreDisplay</div>,
}))

vi.mock('./Tiles', () => ({
  default: () => <div data-testid="tiles">Mocked Tiles</div>,
}))

vi.mock('./Controls', () => ({
  default: () => <div data-testid="controls">Mocked Controls</div>,
}))

vi.mock('./ScoringRulesTable', () => ({
  default: () => <div data-testid="scoring-rules-table">Mocked ScoringRulesTable</div>,
}))

vi.mock('./GameBoardContext', () => ({
  GameBoardProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="gameboard-provider">{children}</div>
  ),
}))

describe('GameBoardContainer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render all child components in correct order', () => {
    const { getByTestId } = render(<GameBoard />)

    expect(getByTestId('gameboard-provider')).toBeInTheDocument()
    expect(getByTestId('score-display')).toBeInTheDocument()
    expect(getByTestId('tiles')).toBeInTheDocument()
    expect(getByTestId('controls')).toBeInTheDocument()
    expect(getByTestId('scoring-rules-table')).toBeInTheDocument()
  })
})
