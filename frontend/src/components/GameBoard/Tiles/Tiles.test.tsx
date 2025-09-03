import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { type GameBoardContextType } from '../context/GameBoardContext'
import { useGameBoard } from '../hooks/useGameBoard'
import Tiles from './index'

vi.mock('../hooks/useGameBoard')
vi.mock('./TilesHeader', () => ({
  default: () => <div data-testid="tiles-header">Mocked TilesHeader</div>,
}))

vi.mock('./TilesInput', () => ({
  default: ({ value, onChange, maxLength, autoCapitalize, autoFocus, pattern }: any) => (
    <input
      data-testid="tiles-input"
      value={value}
      onChange={e => onChange(e.target.value)}
      maxLength={maxLength}
      autoCapitalize={autoCapitalize}
      autoFocus={autoFocus}
      pattern={pattern}
    />
  ),
}))

vi.mock('./TilesFooter', () => ({
  default: () => <div data-testid="tiles-footer">Mocked TilesFooter</div>,
}))

const mockUseGameBoard = vi.hoisted(
  (): GameBoardContextType => ({
    isScoreSaving: false,
    isScoreComputing: false,
    pattern: '[A-Z]*',
    setOriginalTiles: vi.fn(),
    originalTiles: 'HELLO',
    scoreValue: 10,
    scoringRules: [],
    canSave: true,
    handleReset: vi.fn(),
    handleSave: vi.fn(),
  })
)

describe('Tiles', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useGameBoard).mockReturnValue(mockUseGameBoard)
  })

  it('should render all child components', () => {
    render(<Tiles />)

    expect(screen.getByTestId('tiles-header')).toBeInTheDocument()
    expect(screen.getByTestId('tiles-input')).toBeInTheDocument()
    expect(screen.getByTestId('tiles-footer')).toBeInTheDocument()
  })
})
