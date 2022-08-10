import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { usePapaParse } from 'react-papaparse';
import { BillsFilters } from './components/BillsFilters';
import { BillsTable } from './components/BillsTable';
import {
  Bill,
  Category,
  FormattedBill,
  ToFilterYearAndMonth,
} from './constants';
import { getFormatBillData } from './utils/formatter';
import { fetchBills, fetchCategories } from './utils/request';

function App() {
  const { readString } = usePapaParse();
  const [billsList, setBillsList] = useState([] as FormattedBill[]);
  const [toFilterYearAndMonth, setToFilterYearAndMonth] =
    useState<ToFilterYearAndMonth>(null);

  useEffect(() => {
    const getData = async () => {
      const billsString = await fetchBills();
      const categoriesString = await fetchCategories();

      const billsData = (await readCsvString(billsString)) as Bill[];
      const categoriesData = (await readCsvString(
        categoriesString
      )) as Category[];

      setBillsList(getFormatBillData(billsData, categoriesData));
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
        value={toFilterYearAndMonth}
        setToFilterYearAndMonth={setToFilterYearAndMonth}
      />
      <BillsTable
        data={billsList}
        toFilterYearAndMonth={toFilterYearAndMonth}
      />
    </Box>
  );
}

export default App;
