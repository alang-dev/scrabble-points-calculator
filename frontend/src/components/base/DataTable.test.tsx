import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import DataTable from './DataTable'

const mockColumns = [
  { key: 'name', label: 'Name', align: 'left' as const },
  { key: 'score', label: 'Score', align: 'center' as const },
  {
    key: 'date',
    label: 'Date',
    align: 'right' as const,
    render: (value: unknown) => new Date(value as string).toLocaleDateString(),
  },
]

const mockData = [
  { id: 1, name: 'John', score: 100, date: '2023-01-01' },
  { id: 2, name: 'Jane', score: 200, date: '2023-01-02' },
]

describe('DataTable', () => {
  it('should render table with data', () => {
    render(
      <DataTable columns={mockColumns} data={mockData} keyField="id" data-testid="data-table" />
    )

    expect(screen.getByTestId('data-table')).toBeInTheDocument()
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Score')).toBeInTheDocument()
    expect(screen.getByText('Date')).toBeInTheDocument()
    expect(screen.getByText('John')).toBeInTheDocument()
    expect(screen.getByText('Jane')).toBeInTheDocument()
    expect(screen.getByText('100')).toBeInTheDocument()
    expect(screen.getByText('200')).toBeInTheDocument()
  })

  it('should render empty state when no data', () => {
    render(<DataTable columns={mockColumns} data={[]} keyField="id" />)

    expect(screen.getByText('No data available')).toBeInTheDocument()
  })

  it('should render custom cell content with render function', () => {
    render(<DataTable columns={mockColumns} data={mockData} keyField="id" />)

    expect(screen.getByText('1/1/2023')).toBeInTheDocument()
    expect(screen.getByText('1/2/2023')).toBeInTheDocument()
  })
})
