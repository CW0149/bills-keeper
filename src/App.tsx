import { Box, Grid, SortDirection } from '@mui/material';
import { lightGreen } from '@mui/material/colors';
import { endOfMonth, startOfMonth } from 'date-fns';
import { useEffect, useState } from 'react';
import { usePapaParse } from 'react-papaparse';
import { AddBillsForm } from './components/AddBillsForm';
import { BillsFilters } from './components/BillsFilters';
import { BillsSummary } from './components/BillsSummary';
import { BillsTable } from './components/BillsTable';
import {
  Bill,
  Category,
  DEFAULT_TYPE_SELECTED,
  FormattedBill,
  TableHeader,
  ToFilterYearAndMonth,
  TypeOption,
} from './constants';
import { getComparator } from './utils';
import { getFormatBillData, fetchBills, fetchCategories } from './utils';

const TABLE_XS_WHEN_ADDING_BILL = 6;

function App() {
  const { readString } = usePapaParse();
  const [billsList, setBillsList] = useState([] as FormattedBill[]);
  const [toFilterYearAndMonth, setToFilterYearAndMonth] =
    useState<ToFilterYearAndMonth>(null);
  const [toFilterTypeOptions, setToFilterTypeOptions] = useState<TypeOption[]>(
    DEFAULT_TYPE_SELECTED
  );
  const [billOrderBy, setBillOrderBy] = useState<TableHeader['id'] | symbol>(
    ''
  );
  const [tableData, setTableData] = useState(billsList);
  const [categories, setCategories] = useState<Category[]>([]);
  const [billOrder, setBillOrder] = useState<SortDirection>(false);
  const [fetchingBills, setFetchingBills] = useState(false);

  useEffect(() => {
    const filterConditions = [];

    if (toFilterYearAndMonth) {
      const [year, month] = toFilterYearAndMonth;
      const firstDay = startOfMonth(new Date(year, month - 1));
      const lastDay = endOfMonth(new Date(year, month - 1));

      filterConditions.push(
        (bill: FormattedBill) =>
          bill.timeStamp <= lastDay.getTime() &&
          bill.timeStamp >= firstDay.getTime()
      );
    }

    filterConditions.push(
      (bill: FormattedBill) =>
        !!toFilterTypeOptions.find((option) => option.label === bill.typeName)
    );

    setTableData(
      filterConditions.reduce((res, fn) => res.filter(fn), billsList)
    );
  }, [billsList, toFilterTypeOptions, toFilterYearAndMonth]);

  useEffect(() => {
    setTableData([...tableData.sort(getComparator(billOrder, billOrderBy))]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [billOrder, billOrderBy]);

  useEffect(() => {
    const getData = async () => {
      setFetchingBills(true);

      const billsString = await fetchBills();
      const categoriesString = await fetchCategories();

      const billsData = (await readCsvString(billsString)) as Bill[];
      const categoriesData = (await readCsvString(
        categoriesString
      )) as Category[];
      const billsList = getFormatBillData(billsData, categoriesData);

      setCategories(categoriesData);
      setBillsList(billsList);

      setFetchingBills(false);
    };

    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const readCsvString = (csvString: string, hasHeader = true) =>
    new Promise((resolve, reject) => {
      try {
        readString(csvString, {
          header: hasHeader,
          worker: true,
          complete: ({ data }) => {
            resolve(data);
          },
        });
      } catch (err) {
        reject(err);
      }
    });

  return (
    <Box
      p={1}
      bgcolor={lightGreen['50']}
      height="100vh"
      boxSizing="border-box"
      overflow="auto"
    >
      <BillsFilters
        dateValue={toFilterYearAndMonth}
        setToFilterYearAndMonth={setToFilterYearAndMonth}
        typeValue={toFilterTypeOptions}
        setToFilterTypeOptions={setToFilterTypeOptions}
      />

      <BillsSummary billsList={tableData} />
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
          <AddBillsForm categories={categories} />
        </Grid>
      </Grid>
    </Box>
  );
}

export default App;
