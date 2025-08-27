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
  className?: string
  'data-testid'?: string
}

const DataTable: React.FC<DataTableProps> = ({
  columns,
  data,
  className,
  'data-testid': dataTestId,
}) => {
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
        {data.map((row, index) => (
          <TableRow key={index}>
            {columns.map(column => (
              <TableCell key={column.key} align={column.align}>
                {column.render ? column.render(row[column.key]) : String(row[column.key] ?? '')}
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
