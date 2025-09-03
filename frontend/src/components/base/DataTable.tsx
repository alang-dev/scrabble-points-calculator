import React from 'react'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from './Table'

interface Column {
  key: string
  label: string
  align?: 'left' | 'center' | 'right'
  render?: (value: unknown) => React.ReactNode
}

interface DataTableProps {
  columns: Column[]
  data: Record<string, unknown>[]
  keyField: string
  className?: string
  'data-testid'?: string
}

const DataTable: React.FC<DataTableProps> = ({
  columns,
  data,
  keyField,
  className,
  'data-testid': dataTestId,
}) => {
  const renderCellValue = (column: Column, value: unknown): React.ReactNode => {
    if (column.render) {
      return column.render(value)
    }

    if (value == null) {
      return ''
    }

    if (typeof value === 'object') {
      return '[Object]'
    }

    return String(value)
  }

  return (
    <Table className={className} data-testid={dataTestId}>
      <TableHeader>
        <TableRow>
          {columns.map(column => (
            <TableHead key={column.key} align={column.align}>
              {column.label}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map(row => (
          <TableRow key={String(row[keyField])}>
            {columns.map(column => (
              <TableCell key={column.key} align={column.align}>
                {renderCellValue(column, row[column.key])}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
      {data.length === 0 && <TableCaption>No data available</TableCaption>}
    </Table>
  )
}

export default DataTable
