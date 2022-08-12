import { Box, Grid, Paper, SortDirection } from '@mui/material';
import { lightGreen } from '@mui/material/colors';
import { endOfMonth, startOfMonth } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
import { usePapaParse } from 'react-papaparse';
import { AddBillsForm } from './components/AddBillsForm';
import { BillsFilters } from './components/BillsFilters';
import { BillsSummary } from './components/BillsSummary';
import { BillsTable } from './components/BillsTable';
import { Downloader } from './components/BillsDownloader';
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
import { getComparator, getFormattedCategories, readCsvString } from './utils';
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

      const billsString = await fetchBills();
      const categoriesString = await fetchCategories();

      const rawBills = (await readCsvString(
        readString,
        billsString
      )) as RawBill[];
      const rawCategories = (await readCsvString(
        readString,
        categoriesString
      )) as RawCategory[];

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

  const addBillsData = (toAddData: ToAddBillsData): Promise<any> => {
    return new Promise((resolve) => {
      const newRawCategories = [...toAddData.categories, ...rawCategories];

      setRawCategories(newRawCategories);
      setRawBills([...toAddData.bills, ...rawBills]);

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
      <Box component={Paper} p={1} display="flex">
        <Box flex={1}>
          <BillsFilters
            dateValue={toFilterYearAndMonth}
            setToFilterYearAndMonth={setToFilterYearAndMonth}
            typeValue={toFilterTypeOptions}
            setToFilterTypeOptions={setToFilterTypeOptions}
          />
        </Box>

        <Downloader
          rawBills={rawBills}
          rawCategories={rawCategories}
          bills={bills}
        />
      </Box>

      <BillsSummary bills={tableData} />
      <Grid container spacing={1}>
        <Grid item xs={TABLE_XS_WHEN_ADDING_BILL}>
          <BillsTable
            data={tableData}
            order={billOrder}
            setOrder={setBillOrder}
            orderBy={billOrderBy}
            setOrderBy={setBillOrderBy}
            fetchingBills={fetchingBills}
          />
        </Grid>

        <Grid item xs={12 - TABLE_XS_WHEN_ADDING_BILL}>
          <AddBillsForm categories={categories} addBillsData={addBillsData} />
        </Grid>
      </Grid>
    </Box>
  );
}

export default App;
