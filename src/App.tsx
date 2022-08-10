import { Box, SortDirection } from '@mui/material';
import { lightGreen } from '@mui/material/colors';
import { endOfMonth, startOfMonth } from 'date-fns';
import { useEffect, useState } from 'react';
import { usePapaParse } from 'react-papaparse';
import { BillsFilters } from './components/BillsFilters';
import { BillsSummary } from './components/BillsSummary';
import { BillsTable } from './components/BillsTable';
import {
  Bill,
  BillTypeName,
  Category,
  DEFAULT_TYPE_SELECTED,
  FormattedBill,
  TableHeader,
  ToFilterYearAndMonth,
} from './constants';
import { getComparator } from './utils';
import {
  getFormatBillData,
  getGroupedCategories,
  fetchBills,
  fetchCategories,
} from './utils';

function App() {
  const { readString } = usePapaParse();
  const [billsList, setBillsList] = useState([] as FormattedBill[]);
  const [toFilterYearAndMonth, setToFilterYearAndMonth] =
    useState<ToFilterYearAndMonth>(null);
  const [toFilterTypeName, setToFilterTypeName] = useState<BillTypeName[]>(
    DEFAULT_TYPE_SELECTED
  );
  const [billOrderBy, setBillOrderBy] = useState<TableHeader['id'] | symbol>(
    ''
  );
  const [billOrder, setBillOrder] = useState<SortDirection>(false);
  const [tableData, setTableData] = useState(billsList);
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

    filterConditions.push((bill: FormattedBill) =>
      toFilterTypeName.includes(bill.typeName)
    );

    setTableData(
      filterConditions.reduce((res, fn) => res.filter(fn), billsList)
    );
  }, [billsList, toFilterTypeName, toFilterYearAndMonth]);

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
      getGroupedCategories(billsList);

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
        typeValue={toFilterTypeName}
        setToFilterTypeName={setToFilterTypeName}
      />

      <BillsSummary billsList={tableData} />
      <BillsTable
        data={tableData}
        order={billOrder}
        setOrder={setBillOrder}
        orderBy={billOrderBy}
        setOrderBy={setBillOrderBy}
        fetchingBills={fetchingBills}
      />
    </Box>
  );
}

export default App;
