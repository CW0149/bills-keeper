import {
  Paper,
  SortDirection,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
} from '@mui/material';
import { FC } from 'react';
import {
  BILLS_TABLE_HEADER,
  FormattedBill,
  TableHeader,
} from '../../constants';

type Props = {
  data: FormattedBill[];
  order: SortDirection;
  orderBy: TableHeader['id'] | symbol;
  setOrder: (direction: SortDirection) => void;
  setOrderBy: (id: TableHeader['id']) => void;
};

export const BillsTable: FC<Props> = ({
  data,
  order,
  orderBy,
  setOrder,
  setOrderBy,
}) => {
  const handleRequestSort = (property: TableHeader['id']) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const createSortHandler =
    (property: TableHeader['id']) => (event: React.MouseEvent<unknown>) => {
      handleRequestSort(property);
    };

  return (
    <TableContainer sx={{ maxHeight: 'calc(100vh - 100px)' }} component={Paper}>
      <Table stickyHeader aria-label="bills table">
        <TableHead>
          <TableRow>
            {BILLS_TABLE_HEADER.map((headCell) => (
              <TableCell
                key={headCell.id}
                align={headCell.align}
                padding={headCell.disablePadding ? 'none' : 'normal'}
                sortDirection={orderBy === headCell.id ? order : false}
              >
                <TableSortLabel
                  active={orderBy === headCell.id}
                  direction={orderBy === headCell.id ? (order as any) : 'asc'}
                  onClick={createSortHandler(headCell.id)}
                >
                  {headCell.label}
                </TableSortLabel>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {data.map((row) => (
            <TableRow
              key={`${row.id}`}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              {BILLS_TABLE_HEADER.map((item) => (
                <TableCell key={item.id} align={item.align}>
                  {item.toShowId ? row[item.toShowId] : row[item.id]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
