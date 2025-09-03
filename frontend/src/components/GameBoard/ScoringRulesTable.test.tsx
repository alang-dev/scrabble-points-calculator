import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import ScoringRulesTable from './ScoringRulesTable'

// Mock the useGameBoard hook
const mockUseGameBoard = vi.fn()

vi.mock('./hooks/useGameBoard', () => ({
  useGameBoard: () => mockUseGameBoard(),
}))

// Mock the DataTable component
vi.mock('../base/DataTable', () => ({
  default: ({ columns, data }: { columns: any[]; data: any[] }) => (
    <div data-testid="data-table">
      <div data-testid="table-columns">{columns.length} columns</div>
      <div data-testid="table-data">{data.length} rows</div>
      {data.map((row, index) => (
        <div key={index} data-testid={`table-row-${index}`}>
          {row.points} - {row.letters}
        </div>
      ))}
    </div>
  ),
}))

describe('ScoringRulesTable', () => {
  const mockScoringRules = [
    { points: 1, letters: 'AEIOULNSTR' },
    { points: 2, letters: 'DG' },
    { points: 3, letters: 'BCMP' },
    { points: 4, letters: 'FHVWY' },
    { points: 5, letters: 'K' },
  ]

  it('should render scoring rules table with data', () => {
    mockUseGameBoard.mockReturnValue({
      scoringRules: mockScoringRules,
    })

    render(<ScoringRulesTable />)

    expect(screen.getByText('Scrabble Scoring Rules')).toBeInTheDocument()
    expect(screen.getByTestId('data-table')).toBeInTheDocument()
    expect(screen.getByTestId('table-data')).toHaveTextContent('5 rows')
  })

  it('should format letters correctly with commas', () => {
    mockUseGameBoard.mockReturnValue({
      scoringRules: [
        { points: 1, letters: 'ABC' },
        { points: 2, letters: 'DE' },
      ],
    })

    render(<ScoringRulesTable />)

    expect(screen.getByTestId('table-row-0')).toHaveTextContent('1 - A, B, C')
    expect(screen.getByTestId('table-row-1')).toHaveTextContent('2 - D, E')
  })

  it('should render with custom className', () => {
    mockUseGameBoard.mockReturnValue({
      scoringRules: mockScoringRules,
    })

    const { container } = render(<ScoringRulesTable className="custom-class" />)

    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('should render descriptive text', () => {
    mockUseGameBoard.mockReturnValue({
      scoringRules: mockScoringRules,
    })

    render(<ScoringRulesTable />)

    expect(screen.getByText(/Each letter has a point value/)).toBeInTheDocument()
    expect(
      screen.getByText(/Calculate your word's total by adding up all letter values/)
    ).toBeInTheDocument()
  })

  it('should handle empty scoring rules', () => {
    mockUseGameBoard.mockReturnValue({
      scoringRules: [],
    })

    render(<ScoringRulesTable />)

    expect(screen.getByTestId('table-data')).toHaveTextContent('0 rows')
  })

  it('should memoize table data correctly', () => {
    mockUseGameBoard.mockReturnValue({
      scoringRules: [{ points: 10, letters: 'QZ' }],
    })

    render(<ScoringRulesTable />)

    expect(screen.getByTestId('table-row-0')).toHaveTextContent('10 - Q, Z')
  })
})
