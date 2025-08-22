import React from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from './Table';

interface Column {
  key: string;
  label: string;
  align?: 'left' | 'center' | 'right';
}

interface DataTableProps {
  columns: Column[];
  data: Record<string, any>[];
  className?: string;
}

const DataTable: React.FC<DataTableProps> = ({ columns, data, className }) => {
  return (
    <Table className={className}>
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead
              key={column.key}
              align={column.align}
            >
              {column.label}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, index) => (
          <TableRow key={index}>
            {columns.map((column) => (
              <TableCell
                key={column.key}
                align={column.align}
              >
                {row[column.key]}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
      {data.length === 0 && (
        <TableCaption>No data available</TableCaption>
      )}
    </Table>
  );
};

export default DataTable;