import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { FC } from 'react';
import { CURRENCY, FormattedBill } from '../../constants';

type Props = {
  data: FormattedBill[];
};

export const BillsTable: FC<Props> = ({ data }) => {
  return (
    <TableContainer sx={{ maxHeight: 'calc(100vh - 100px)' }} component={Paper}>
      <Table stickyHeader aria-label="bills table">
        <TableHead>
          <TableRow>
            <TableCell>名称</TableCell>
            <TableCell align="center">日期</TableCell>
            <TableCell align="center">类别</TableCell>
            <TableCell align="right">金额({CURRENCY})</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow
              key={`${row.time}${row.amount}`}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell>{row.name}</TableCell>
              <TableCell align="center">{row.time}</TableCell>
              <TableCell align="center">{row.typeName}</TableCell>
              <TableCell align="right">{row.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
