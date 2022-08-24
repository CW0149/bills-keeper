import { styled } from '@mui/material/styles';
import {
  Box,
  IconButton,
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
  billsTableHeader,
  COMPONENT_SIZE,
  Bill,
  MAX_TABLE_HEIGHT,
  BillTableHeader,
} from '../../constants';
import { Delete } from '@mui/icons-material';

type HeaderId = BillTableHeader['id'];

type Props = {
  data: Bill[];
  order: SortDirection;
  orderBy: HeaderId;
  setOrder: (direction: SortDirection) => void;
  setOrderBy: (id: HeaderId) => void;
  fetchingBills?: boolean;
  onRemove: (id: Bill['id']) => void;
};

export const BillsTable: FC<Props> = ({
  data,
  order,
  orderBy,
  setOrder,
  setOrderBy,
  fetchingBills,
  onRemove,
}) => {
  const handleRequestSort = (property: HeaderId) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const createSortHandler =
    (property: HeaderId) => (event: React.MouseEvent<unknown>) => {
      handleRequestSort(property);
    };

  return (
    <>
      <TableContainer sx={{ maxHeight: MAX_TABLE_HEIGHT }} component={Paper}>
        <Table stickyHeader aria-label="bills table" size={COMPONENT_SIZE}>
          <TableHead>
            <TableRow>
              {billsTableHeader.map((headCell) => (
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
              <TableCell align="center">操作</TableCell>
            </TableRow>
          </TableHead>

          {!fetchingBills && (
            <TableBody>
              {data.map((row) => (
                <StyledTableRow key={row.id}>
                  {billsTableHeader.map((item) => (
                    <TableCell key={item.id} align={item.align}>
                      {item.toShowId ? row[item.toShowId] : row[item.id]}
                    </TableCell>
                  ))}
                  <TableCell align="center">
                    <IconButton onClick={() => onRemove(row.id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          )}
        </Table>
      </TableContainer>

      {fetchingBills && <DataLoading />}
      {!fetchingBills && !data.length && <NoData />}
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
      sx={{ height: { xs: 60, md: 400 } }}
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
