import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { endOfMonth } from 'date-fns';
import { startOfMonth } from 'date-fns/esm';
import { FC, useMemo } from 'react';
import { FormattedBill, ToFilterYearAndMonth } from '../../constants';

type Props = {
  data: FormattedBill[];
  toFilterYearAndMonth: ToFilterYearAndMonth;
};

export const BillsTable: FC<Props> = ({ data, toFilterYearAndMonth }) => {
  const toShownData = useMemo(() => {
    if (!toFilterYearAndMonth) return data;

    const [year, month] = toFilterYearAndMonth;
    const firstDay = startOfMonth(new Date(year, month - 1));
    const lastDay = endOfMonth(new Date(year, month - 1));

    return data.filter(
      (bill) =>
        bill.timeStamp <= lastDay.getTime() &&
        bill.timeStamp >= firstDay.getTime()
    );
  }, [data, toFilterYearAndMonth]);

  return (
    <TableContainer
      sx={{ maxHeight: 'calc(100vh - 100px)', maxWidth: 800 }}
      component={Paper}
    >
      <Table stickyHeader aria-label="bills table">
        <TableHead>
          <TableRow>
            <TableCell>名称</TableCell>
            <TableCell align="center">日期</TableCell>
            <TableCell align="center">类别</TableCell>
            <TableCell align="right">金额</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {toShownData.map((row) => (
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
