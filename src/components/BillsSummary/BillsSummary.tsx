import { Box, Divider, Paper, Typography } from '@mui/material';
import { FC } from 'react';
import { FormattedBill, typeToTypeName } from '../../constants';
import { getComparator } from '../../utils';
import { formatCurrency } from '../../utils/formatter';

type Props = {
  billsList: FormattedBill[];
};
export const BillsSummary: FC<Props> = ({ billsList }) => {
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

  const outcomeItems = Object.keys(outcomeSummary.items)
    .map((cateName) => ({
      cateName,
      amount: outcomeSummary.items[cateName],
    }))
    .sort(getComparator('asc', 'amount'));

  const incomeItems = Object.keys(incomeSummary.items)
    .map((cateName) => ({
      cateName,
      amount: incomeSummary.items[cateName],
    }))
    .sort(getComparator('desc', 'amount'));

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
              {outcomeItems.map(({ cateName, amount }) => (
                <span key={cateName}>
                  {cateName} {formatCurrency(amount)}；
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
              {incomeItems.map(({ cateName, amount }) => (
                <span key={cateName}>
                  {cateName} {formatCurrency(amount)}；
                </span>
              ))}
            </span>
          </Typography>
        </>
      )}
    </Box>
  );
};
