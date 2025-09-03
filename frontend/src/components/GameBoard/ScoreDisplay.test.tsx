import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import ScoreDisplay from './ScoreDisplay'

// Mock the useGameBoard hook
const mockUseGameBoard = vi.fn()

vi.mock('./hooks/useGameBoard', () => ({
  useGameBoard: () => mockUseGameBoard(),
}))

describe('ScoreDisplay', () => {
  it('should render score display with value when not computing', () => {
    mockUseGameBoard.mockReturnValue({
      isScoreComputing: false,
      scoreValue: 25,
    })

    render(<ScoreDisplay />)

    expect(screen.getByTestId('score-display')).toBeInTheDocument()
    expect(screen.getByTestId('score-value')).toHaveTextContent('25')
    expect(screen.getByText('Your Score')).toBeInTheDocument()
    expect(screen.getByText('points')).toBeInTheDocument()
  })

  it('should render loading state when computing score', () => {
    mockUseGameBoard.mockReturnValue({
      isScoreComputing: true,
      scoreValue: 0,
    })

    render(<ScoreDisplay />)

    expect(screen.getByTestId('score-display')).toBeInTheDocument()
    expect(screen.getByText('Calculating...')).toBeInTheDocument()
    expect(screen.queryByTestId('score-value')).not.toBeInTheDocument()
  })

  it('should render with custom className', () => {
    mockUseGameBoard.mockReturnValue({
      isScoreComputing: false,
      scoreValue: 10,
    })

    const { container } = render(<ScoreDisplay className="custom-class" />)

    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('should display zero score correctly', () => {
    mockUseGameBoard.mockReturnValue({
      isScoreComputing: false,
      scoreValue: 0,
    })

    render(<ScoreDisplay />)

    expect(screen.getByTestId('score-value')).toHaveTextContent('0')
  })

  it('should display high score correctly', () => {
    mockUseGameBoard.mockReturnValue({
      isScoreComputing: false,
      scoreValue: 999,
    })

    render(<ScoreDisplay />)

    expect(screen.getByTestId('score-value')).toHaveTextContent('999')
  })
})
