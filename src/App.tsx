import { Box, Button, Grid, Paper, SortDirection } from '@mui/material';
import { lightGreen } from '@mui/material/colors';
import { endOfMonth, startOfMonth } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
import { usePapaParse } from 'react-papaparse';
import { AddBillsForm } from './components/AddBillsForm';
import { BillsFilters } from './components/BillsFilters';
import { BillsSummary } from './components/BillsSummary';
import { BillsTable } from './components/BillsTable';
import { BillsDownloader } from './components/BillsDownloader';
import {
  RawBill,
  Category,
  DEFAULT_TYPE_SELECTED,
  Bill,
  TABLE_XS_WHEN_ADDING_BILL,
  ToAddBillsData,
  ToFilterYearAndMonth,
  TypeOption,
  RawCategory,
  BillTableHeader,
} from './constants';
import {
  clearLocalBillsData,
  getComparator,
  getFormattedCategories,
  readCsvString,
  saveRawBills,
  saveRawCategories,
} from './utils';
import { getFormattedBills, fetchBills, fetchCategories } from './utils';

function App() {
  const { readString } = usePapaParse();

  // For filter and sort
  const [toFilterYearAndMonth, setToFilterYearAndMonth] =
    useState<ToFilterYearAndMonth>(null);
  const [toFilterTypeOptions, setToFilterTypeOptions] = useState<TypeOption[]>(
    DEFAULT_TYPE_SELECTED
  );
  const [billOrderBy, setBillOrderBy] = useState<BillTableHeader['id']>('time');
  const [billOrder, setBillOrder] = useState<SortDirection>('desc');

  // For loading status
  const [fetchingBills, setFetchingBills] = useState(false);

  // For data
  const [rawBills, setRawBills] = useState([] as RawBill[]);
  const [rawCategories, setRawCategories] = useState<RawCategory[]>([]);

  const bills = useMemo(
    () => getFormattedBills(rawBills, rawCategories),
    [rawBills, rawCategories]
  );
  const categories: Category[] = useMemo(
    () => getFormattedCategories(rawCategories),
    [rawCategories]
  );
  const [tableData, setTableData] = useState(
    bills.sort(getComparator(billOrder, billOrderBy))
  );

  // Get data
  useEffect(() => {
    const getData = async () => {
      setFetchingBills(true);

      const unhandledBills = await fetchBills();
      const unhandledCategories = await fetchCategories();

      const rawBills =
        typeof unhandledBills === 'string'
          ? ((await readCsvString(readString, unhandledBills)) as RawBill[])
          : unhandledBills;

      const rawCategories =
        typeof unhandledCategories === 'string'
          ? ((await readCsvString(
              readString,
              unhandledCategories
            )) as RawCategory[])
          : unhandledCategories;

      setRawBills(rawBills);
      setRawCategories(rawCategories);

      setFetchingBills(false);
    };

    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter table
  useEffect(() => {
    const filterConditions = [];

    if (toFilterYearAndMonth) {
      const [year, month] = toFilterYearAndMonth;
      const firstDay = startOfMonth(new Date(year, month - 1));
      const lastDay = endOfMonth(new Date(year, month - 1));

      filterConditions.push(
        (bill: Bill) =>
          bill.time <= lastDay.getTime() && bill.time >= firstDay.getTime()
      );
    }

    filterConditions.push(
      (bill: Bill) =>
        !!toFilterTypeOptions.find((option) => option.label === bill.typeName)
    );

    setTableData(filterConditions.reduce((res, fn) => res.filter(fn), bills));
  }, [bills, toFilterTypeOptions, toFilterYearAndMonth]);

  // Order table
  useEffect(() => {
    setTableData([...tableData.sort(getComparator(billOrder, billOrderBy))]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [billOrder, billOrderBy]);

  const addBillsData = (toAddData: ToAddBillsData): Promise<'success'> => {
    return new Promise((resolve) => {
      const newRawCategories = [...toAddData.categories, ...rawCategories];
      const newRawBills = [...toAddData.bills, ...rawBills];

      setRawCategories(newRawCategories);
      setRawBills(newRawBills);

      saveRawCategories(newRawCategories);
      saveRawBills(newRawBills);

      resolve('success');
    });
  };

  return (
    <Box
      p={1}
      bgcolor={lightGreen['50']}
      height="100vh"
      boxSizing="border-box"
      overflow="auto"
    >
      <Box component={Paper} p={1} display="flex" flexWrap={'wrap'}>
        <Box flex={1}>
          <BillsFilters
            dateValue={toFilterYearAndMonth}
            setToFilterYearAndMonth={setToFilterYearAndMonth}
            typeValue={toFilterTypeOptions}
            setToFilterTypeOptions={setToFilterTypeOptions}
          />
        </Box>

        <BillsDownloader
          sx={{ display: { xs: 'none', md: 'block' } }}
          rawBills={rawBills}
          rawCategories={rawCategories}
          bills={bills}
        />

        <Box
          sx={{
            ml: { xs: 0, md: 2 },
            width: { xs: '100%', md: 'auto' },
            mt: { xs: 1, md: 0 },
          }}
        >
          <Button
            fullWidth
            variant="contained"
            color="warning"
            onClick={() => {
              clearLocalBillsData();
              window.location.reload();
            }}
          >
            清除缓存
          </Button>
        </Box>
      </Box>

      <BillsSummary bills={tableData} />

      <Grid container spacing={1}>
        <Grid item xs={12} md={TABLE_XS_WHEN_ADDING_BILL}>
          <BillsTable
            data={tableData}
            order={billOrder}
            setOrder={setBillOrder}
            orderBy={billOrderBy}
            setOrderBy={setBillOrderBy}
            fetchingBills={fetchingBills}
          />
        </Grid>

        <Grid item xs={12} md={12 - TABLE_XS_WHEN_ADDING_BILL}>
          <AddBillsForm categories={categories} addBillsData={addBillsData} />
        </Grid>
      </Grid>
    </Box>
  );
}

export default App;
