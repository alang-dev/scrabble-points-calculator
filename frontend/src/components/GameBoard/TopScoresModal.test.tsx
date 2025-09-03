import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import TopScoresModal from './TopScoresModal'

// Mock the useTopScores hook
const mockUseTopScores = vi.fn()

vi.mock('../../hooks/useTopScores', () => ({
  useTopScores: (isOpen: boolean) => mockUseTopScores(isOpen),
}))

// Mock the Modal component
vi.mock('../base/Modal', () => ({
  default: ({ isOpen, onClose, title, children, 'data-testid': testId }: any) =>
    isOpen ? (
      <div data-testid={testId}>
        <h2>{title}</h2>
        <button onClick={onClose} data-testid="modal-close">
          Close
        </button>
        <div>{children}</div>
      </div>
    ) : null,
}))

// Mock the DataTable component
vi.mock('../base/DataTable', () => ({
  default: ({ columns, data, 'data-testid': testId }: any) => (
    <div data-testid={testId}>
      <div data-testid="table-columns">{columns.length} columns</div>
      <div data-testid="table-rows">{data.length} rows</div>
    </div>
  ),
}))

// Mock formatDateTime utility
vi.mock('../../lib/utils', () => ({
  formatDateTime: (date: string) => `Formatted: ${date}`,
}))

describe('TopScoresModal', () => {
  const mockScores = [
    { rank: 1, score: 50, letters: 'HELLO', createdAt: '2023-01-01' },
    { rank: 2, score: 45, letters: 'WORLD', createdAt: '2023-01-02' },
  ]

  it('should not render when isOpen is false', () => {
    mockUseTopScores.mockReturnValue({
      scores: mockScores,
      isLoading: false,
    })

    render(<TopScoresModal isOpen={false} onClose={vi.fn()} />)

    expect(screen.queryByTestId('top-scores-modal')).not.toBeInTheDocument()
  })

  it('should render when isOpen is true', () => {
    mockUseTopScores.mockReturnValue({
      scores: mockScores,
      isLoading: false,
    })

    render(<TopScoresModal isOpen={true} onClose={vi.fn()} />)

    expect(screen.getByTestId('top-scores-modal')).toBeInTheDocument()
    expect(screen.getByText('Top 10 Scores')).toBeInTheDocument()
  })

  it('should display loading state', () => {
    mockUseTopScores.mockReturnValue({
      scores: [],
      isLoading: true,
    })

    render(<TopScoresModal isOpen={true} onClose={vi.fn()} />)

    expect(screen.getByText('Loading top scores...')).toBeInTheDocument()
    expect(screen.queryByTestId('top-scores-table')).not.toBeInTheDocument()
  })

  it('should display empty state when no scores', () => {
    mockUseTopScores.mockReturnValue({
      scores: [],
      isLoading: false,
    })

    render(<TopScoresModal isOpen={true} onClose={vi.fn()} />)

    expect(screen.getByText('No scores recorded yet.')).toBeInTheDocument()
    expect(screen.getByText('Be the first to save a score!')).toBeInTheDocument()
    expect(screen.queryByTestId('top-scores-table')).not.toBeInTheDocument()
  })

  it('should display scores table when scores exist', () => {
    mockUseTopScores.mockReturnValue({
      scores: mockScores,
      isLoading: false,
    })

    render(<TopScoresModal isOpen={true} onClose={vi.fn()} />)

    expect(screen.getByTestId('top-scores-table')).toBeInTheDocument()
    expect(screen.getByTestId('table-rows')).toHaveTextContent('2 rows')
    expect(screen.queryByText('No scores recorded yet.')).not.toBeInTheDocument()
  })

  it('should display descriptive text', () => {
    mockUseTopScores.mockReturnValue({
      scores: mockScores,
      isLoading: false,
    })

    render(<TopScoresModal isOpen={true} onClose={vi.fn()} />)

    expect(
      screen.getByText('Here are the highest scoring Scrabble words submitted.')
    ).toBeInTheDocument()
  })

  it('should call useTopScores with correct isOpen parameter', () => {
    mockUseTopScores.mockReturnValue({
      scores: [],
      isLoading: false,
    })

    render(<TopScoresModal isOpen={true} onClose={vi.fn()} />)

    expect(mockUseTopScores).toHaveBeenCalledWith(true)

    render(<TopScoresModal isOpen={false} onClose={vi.fn()} />)

    expect(mockUseTopScores).toHaveBeenCalledWith(false)
  })
})
