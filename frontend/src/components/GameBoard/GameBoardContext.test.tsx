import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mockApiPost } from '../../test/apiMocks'
import { GameBoardProvider } from './GameBoardContext'
import { GameBoardContext } from './context/GameBoardContext'

// Mock the hooks
const mockUseScoreCompute = vi.fn()
const mockUseScoringRules = vi.fn()

vi.mock('../../hooks/useScoreCompute', () => ({
  useScoreCompute: () => mockUseScoreCompute(),
}))

vi.mock('../../hooks/useScoringRules', () => ({
  useScoringRules: () => mockUseScoringRules(),
}))

// Mock toast
vi.mock('../base/Toast/toast', () => ({
  toast: {
    success: vi.fn(),
  },
}))

// Import the toast module to get typed access
import { toast } from '../base/Toast/toast'

// Test component to consume the context
const TestConsumer: React.FC = () => {
  const context = React.useContext(GameBoardContext)

  if (!context) {
    return <div data-testid="no-context">No context</div>
  }

  return (
    <div>
      <div data-testid="original-tiles">{context.originalTiles}</div>
      <div data-testid="is-score-computing">{String(context.isScoreComputing)}</div>
      <div data-testid="is-score-saving">{String(context.isScoreSaving)}</div>
      <div data-testid="score-value">{context.scoreValue}</div>
      <div data-testid="pattern">{context.pattern || 'no-pattern'}</div>
      <div data-testid="scoring-rules-count">{context.scoringRules.length}</div>
      <div data-testid="can-save">{String(context.canSave)}</div>

      <button data-testid="set-tiles" onClick={() => context.setOriginalTiles('HELLO')}>
        Set Tiles
      </button>
      <button data-testid="reset" onClick={context.handleReset}>
        Reset
      </button>
      <button data-testid="save" onClick={context.handleSave}>
        Save
      </button>
    </div>
  )
}

describe('GameBoardProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    // Default mock values
    mockUseScoreCompute.mockReturnValue({
      isLoading: false,
      computedScore: { score: 10 },
    })

    mockUseScoringRules.mockReturnValue({
      pattern: 'test-pattern',
      scoringRules: [
        { letters: 'A', points: 1 },
        { letters: 'B', points: 3 },
      ],
    })

    // Mock API response using global mock
    mockApiPost.mockResolvedValue({
      data: { letters: 'HELLO', points: 10 },
    })
  })

  it('should render provider with initial state', () => {
    render(
      <GameBoardProvider>
        <TestConsumer />
      </GameBoardProvider>
    )

    expect(screen.getByTestId('original-tiles')).toHaveTextContent('')
    expect(screen.getByTestId('is-score-computing')).toHaveTextContent('false')
    expect(screen.getByTestId('is-score-saving')).toHaveTextContent('false')
    expect(screen.getByTestId('score-value')).toHaveTextContent('10')
    expect(screen.getByTestId('pattern')).toHaveTextContent('test-pattern')
    expect(screen.getByTestId('scoring-rules-count')).toHaveTextContent('2')
    expect(screen.getByTestId('can-save')).toHaveTextContent('true')
  })

  it('should update tiles when setOriginalTiles is called', () => {
    render(
      <GameBoardProvider>
        <TestConsumer />
      </GameBoardProvider>
    )

    fireEvent.click(screen.getByTestId('set-tiles'))

    expect(screen.getByTestId('original-tiles')).toHaveTextContent('HELLO')
  })

  it('should clear tiles when handleReset is called', () => {
    render(
      <GameBoardProvider>
        <TestConsumer />
      </GameBoardProvider>
    )

    // Set tiles first
    fireEvent.click(screen.getByTestId('set-tiles'))
    expect(screen.getByTestId('original-tiles')).toHaveTextContent('HELLO')

    // Reset
    fireEvent.click(screen.getByTestId('reset'))
    expect(screen.getByTestId('original-tiles')).toHaveTextContent('')
  })

  it('should handle score computing state', () => {
    mockUseScoreCompute.mockReturnValue({
      isLoading: true,
      computedScore: null,
    })

    render(
      <GameBoardProvider>
        <TestConsumer />
      </GameBoardProvider>
    )

    expect(screen.getByTestId('is-score-computing')).toHaveTextContent('true')
    expect(screen.getByTestId('score-value')).toHaveTextContent('--')
    expect(screen.getByTestId('can-save')).toHaveTextContent('false')
  })

  it('should handle save functionality', async () => {
    render(
      <GameBoardProvider>
        <TestConsumer />
      </GameBoardProvider>
    )

    // Set some tiles first
    fireEvent.click(screen.getByTestId('set-tiles'))

    // Save
    fireEvent.click(screen.getByTestId('save'))

    await waitFor(() => {
      expect(mockApiPost).toHaveBeenCalledWith('/scores', {
        letters: 'HELLO',
      })
    })

    await waitFor(() => {
      expect(vi.mocked(toast.success)).toHaveBeenCalledWith(
        'Tiles "HELLO" that scored 10 points have been saved.'
      )
    })

    // Should clear tiles after saving
    await waitFor(() => {
      expect(screen.getByTestId('original-tiles')).toHaveTextContent('')
    })
  })

  it('should not save when canSave is false', () => {
    mockUseScoreCompute.mockReturnValue({
      isLoading: false,
      computedScore: null, // No computed score
    })

    render(
      <GameBoardProvider>
        <TestConsumer />
      </GameBoardProvider>
    )

    expect(screen.getByTestId('can-save')).toHaveTextContent('false')

    fireEvent.click(screen.getByTestId('save'))

    expect(mockApiPost).not.toHaveBeenCalled()
  })

  it('should handle scoring rules from useScoringRules', () => {
    const customRules = [
      { letters: 'X', points: 8 },
      { letters: 'Y', points: 4 },
      { letters: 'Z', points: 10 },
    ]

    mockUseScoringRules.mockReturnValue({
      pattern: 'custom-pattern',
      scoringRules: customRules,
    })

    render(
      <GameBoardProvider>
        <TestConsumer />
      </GameBoardProvider>
    )

    expect(screen.getByTestId('pattern')).toHaveTextContent('custom-pattern')
    expect(screen.getByTestId('scoring-rules-count')).toHaveTextContent('3')
  })

  it('should handle missing pattern gracefully', () => {
    mockUseScoringRules.mockReturnValue({
      pattern: undefined,
      scoringRules: [],
    })

    render(
      <GameBoardProvider>
        <TestConsumer />
      </GameBoardProvider>
    )

    expect(screen.getByTestId('pattern')).toHaveTextContent('no-pattern')
    expect(screen.getByTestId('scoring-rules-count')).toHaveTextContent('0')
  })
})
