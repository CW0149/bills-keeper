import { styled } from '@mui/material/styles';
import {
  Box,
  Paper,
  Skeleton,
  SortDirection,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
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
  fetchingBills?: boolean;
};

export const BillsTable: FC<Props> = ({
  data,
  order,
  orderBy,
  setOrder,
  setOrderBy,
  fetchingBills,
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
    <>
      <TableContainer
        sx={{ maxHeight: 'calc(100vh - 190px)' }}
        component={Paper}
      >
        <Table stickyHeader aria-label="bills table" size="small">
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

          {!fetchingBills && (
            <TableBody>
              {data.map((row) => (
                <StyledTableRow key={`${row.id}`}>
                  {BILLS_TABLE_HEADER.map((item) => (
                    <TableCell key={item.id} align={item.align}>
                      {item.toShowId ? row[item.toShowId] : row[item.id]}
                    </TableCell>
                  ))}
                </StyledTableRow>
              ))}
            </TableBody>
          )}
        </Table>
      </TableContainer>

      {fetchingBills && <DataLoading />}
      {!data.length && <NoData />}
    </>
  );
};

const DataLoading: FC = () => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      component={Paper}
      p={2}
    >
      <Stack width="100%">
        {[...Array(7)].map((i) => (
          <Skeleton key={Math.random()} variant="text" height="8vh" />
        ))}
      </Stack>
    </Box>
  );
};

const NoData: FC = () => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      component={Paper}
      p={2}
      height={400}
    >
      <Typography>无数据</Typography>
    </Box>
  );
};

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },

  td: {
    border: 0,
  },
}));
