import { Box, Divider, Paper, Typography } from '@mui/material';
import { green, grey, lightGreen } from '@mui/material/colors';
import { spawn } from 'child_process';
import { endOfMonth, startOfMonth } from 'date-fns';
import { IncomingMessage } from 'http';
import { FC, useEffect, useMemo, useState } from 'react';
import { usePapaParse } from 'react-papaparse';
import { BillsFilters } from './components/BillsFilters';
import { BillsTable } from './components/BillsTable';
import {
  Bill,
  BillTypeName,
  Category,
  CURRENCY,
  DEFAULT_TYPE_SELECTED,
  FormattedBill,
  ToFilterYearAndMonth,
  typeToTypeName,
} from './constants';
import {
  formatCurrency,
  getFormatBillData,
  getGroupedCategories,
} from './utils/formatter';
import { fetchBills, fetchCategories } from './utils/request';

type BillSummaryProps = {
  billsList: FormattedBill[];
};
const BillSummary: FC<BillSummaryProps> = ({ billsList }) => {
  const amountSumForCates: Record<string, any> = {
    total: 0,
    '0': { total: 0, items: {} },
    '1': { total: 0, items: {} },
  };
  billsList.forEach((bill) => {
    const { amount, type, name } = bill;
    const amountNum = type === '0' ? -Number(amount) : Number(amount);

    amountSumForCates.total += amountNum;

    const typeSum = amountSumForCates[type];
    const { total: typeSumTotal, items: typeSumItems } = typeSum;

    typeSum.total = typeSumTotal + amountNum;
    typeSumItems[name] = typeSumItems[name]
      ? typeSumItems[name] + amountNum
      : amountNum;
  });

  const outcomeSummary = amountSumForCates['0'];
  const { total: outcomeTotal } = outcomeSummary;

  const incomeSummary = amountSumForCates['1'];
  const { total: incomeTotal } = incomeSummary;

  const outcomeItems = Object.keys(outcomeSummary.items).map((cateName) => [
    cateName,
    outcomeSummary.items[cateName],
  ]);
  const incomeItems = Object.keys(incomeSummary.items).map((cateName) => [
    cateName,
    incomeSummary.items[cateName],
  ]);

  return (
    <Box mt={2} mb={2} component={Paper} p={2}>
      <Typography>
        <Box component="span" mr={2}>
          总{typeToTypeName['1']}
          {formatCurrency(incomeTotal)}
        </Box>

        <Box component="span" mr={2}>
          总{typeToTypeName['0']}
          {formatCurrency(outcomeTotal)}
        </Box>

        <Box component="span" mr={2}>
          净收入{formatCurrency(amountSumForCates.total)}
        </Box>
      </Typography>

      {!!outcomeTotal && (
        <>
          <Divider sx={{ mt: 0.5, mb: 0.5 }} />

          <Typography>
            <span>{typeToTypeName['0']}明细：</span>
            <span>
              {outcomeItems.map(([cateName, value]) => (
                <span>
                  {cateName} {formatCurrency(value)}；
                </span>
              ))}
            </span>
          </Typography>
        </>
      )}
      {!!incomeTotal && (
        <>
          <Divider sx={{ mt: 0.5, mb: 0.5 }} />
          <Typography>
            <span>{typeToTypeName['1']}明细：</span>
            <span>
              {incomeItems.map(([cateName, value]) => (
                <span>
                  {cateName} {formatCurrency(value)}；
                </span>
              ))}
            </span>
          </Typography>
        </>
      )}
    </Box>
  );
};

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
    <Box
      p={2}
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

      <BillSummary billsList={tableData} />
      <BillsTable data={tableData} />
    </Box>
  );
}

export default App;
