import { Box } from '@mui/material';
import { endOfMonth, startOfMonth } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
import { usePapaParse } from 'react-papaparse';
import { BillsFilters } from './components/BillsFilters';
import { BillsTable } from './components/BillsTable';
import {
  Bill,
  BillTypeName,
  Category,
  DEFAULT_TYPE_SELECTED,
  FormattedBill,
  ToFilterYearAndMonth,
} from './constants';
import { getFormatBillData, getGroupedCategories } from './utils/formatter';
import { fetchBills, fetchCategories } from './utils/request';

function App() {
  const { readString } = usePapaParse();
  const [billsList, setBillsList] = useState([] as FormattedBill[]);
  const [toFilterYearAndMonth, setToFilterYearAndMonth] =
    useState<ToFilterYearAndMonth>(null);
  const [toFilterTypeName, setToFilterTypeName] = useState<BillTypeName[]>(
    DEFAULT_TYPE_SELECTED
  );

  const tableData = useMemo(() => {
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

    return filterConditions.reduce((res, fn) => res.filter(fn), billsList);
  }, [billsList, toFilterTypeName, toFilterYearAndMonth]);

  useEffect(() => {
    const getData = async () => {
      const billsString = await fetchBills();
      const categoriesString = await fetchCategories();

      const billsData = (await readCsvString(billsString)) as Bill[];
      const categoriesData = (await readCsvString(
        categoriesString
      )) as Category[];

      const billsList = getFormatBillData(billsData, categoriesData);
      getGroupedCategories(billsList);

      setBillsList(billsList);
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
    <Box p={2}>
      <BillsFilters
        dateValue={toFilterYearAndMonth}
        setToFilterYearAndMonth={setToFilterYearAndMonth}
        typeValue={toFilterTypeName}
        setToFilterTypeName={setToFilterTypeName}
      />
      <BillsTable data={tableData} />
    </Box>
  );
}

export default App;
