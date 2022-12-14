import {
  alpha,
  Box,
  Button,
  Grid,
  IconButton,
  Paper,
  SortDirection,
} from '@mui/material';
import { blue } from '@mui/material/colors';
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
import { UploadFile } from '@mui/icons-material';

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

  // Table data
  const tableData = useMemo(() => {
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

    const filteredData = filterConditions.reduce(
      (res, fn) => res.filter(fn),
      bills
    );

    const sortedData = filteredData.sort(getComparator(billOrder, billOrderBy));

    return sortedData;
  }, [
    billOrder,
    billOrderBy,
    bills,
    toFilterTypeOptions,
    toFilterYearAndMonth,
  ]);

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

  const removeBillsItem = (id: Bill['id']) => {
    const newRawBills = rawBills.filter((bill) => bill.id !== id);

    setRawBills(newRawBills);
    saveRawBills(newRawBills);
  };

  return (
    <Box
      p={1}
      bgcolor={alpha(blue['100'], 0.2)}
      height="100vh"
      boxSizing="border-box"
      overflow="auto"
    >
      <Box
        component={Paper}
        display="flex"
        flexWrap="wrap"
        alignItems="center"
        p={1}
        pt={1.1}
      >
        {/* Bills filters */}
        <Box flex={1} data-testid="bills-filters">
          <BillsFilters
            dateValue={toFilterYearAndMonth}
            setToFilterYearAndMonth={setToFilterYearAndMonth}
            typeValue={toFilterTypeOptions}
            setToFilterTypeOptions={setToFilterTypeOptions}
          />
        </Box>

        {/* Placeholder for import bills */}
        <Box mr={1} sx={{ display: { xs: 'none', md: 'block' } }}>
          <IconButton onClick={() => alert('?????????????????????????????????')}>
            <UploadFile />
          </IconButton>
        </Box>

        {/* Download bills data buttons */}
        <BillsDownloader
          sx={{ display: { xs: 'none', md: 'block' } }}
          rawBills={rawBills}
          rawCategories={rawCategories}
          bills={bills}
        />

        {/* Clear cache button */}
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
            ????????????
          </Button>
        </Box>
      </Box>

      <BillsSummary data-testid="bills-summary" bills={tableData} />

      {/* Bills list table */}
      <Grid
        container
        spacing={1}
        display="flex"
        sx={{ flexDirection: { xs: 'column-reverse', md: 'unset' } }}
      >
        <Grid
          item
          xs={12}
          md={TABLE_XS_WHEN_ADDING_BILL}
          data-testid="bills-table-wrapper"
        >
          <BillsTable
            data={tableData}
            order={billOrder}
            setOrder={setBillOrder}
            orderBy={billOrderBy}
            setOrderBy={setBillOrderBy}
            fetchingBills={fetchingBills}
            onRemove={removeBillsItem}
          />
        </Grid>

        {/* Add bills form */}
        <Grid
          item
          xs={12}
          md={12 - TABLE_XS_WHEN_ADDING_BILL}
          data-testid="bills-add-form"
        >
          <AddBillsForm categories={categories} addBillsData={addBillsData} />
        </Grid>
      </Grid>
    </Box>
  );
}

export default App;
