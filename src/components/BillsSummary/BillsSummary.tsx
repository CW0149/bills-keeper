import { Box, Divider, Paper, Typography } from '@mui/material';
import { FC } from 'react';
import { COMPONENT_SIZE, Bill, typeIdToLabel, Types } from '../../constants';
import { getComparator } from '../../utils';
import { formatCurrency } from '../../utils/formatter';

type Props = {
  bills: Bill[];
};
export const BillsSummary: FC<Props> = ({ bills }) => {
  const amountSumForCates: Record<string, any> = {
    total: 0,
    0: { total: 0, items: {} },
    1: { total: 0, items: {} },
  };
  bills.forEach((bill) => {
    const { amount, type, name } = bill;
    const amountNum = type === Types.OUTCOME ? -Number(amount) : Number(amount);

    amountSumForCates.total += amountNum;

    const typeSum = amountSumForCates[type];
    const { total: typeSumTotal, items: typeSumItems } = typeSum;

    typeSum.total = typeSumTotal + Number(amount);
    typeSumItems[name] = typeSumItems[name]
      ? typeSumItems[name] + amountNum
      : amountNum;
  });

  const outcomeSummary = amountSumForCates[0];
  const { total: outcomeTotal } = outcomeSummary;

  const incomeSummary = amountSumForCates[1];
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
    <Box mt={1} mb={1} component={Paper} p={1}>
      <Typography fontSize={COMPONENT_SIZE} fontWeight="bold">
        <Box component="span" mr={2}>
          总{typeIdToLabel[Types.INCOME]}
          {formatCurrency(incomeTotal)}
        </Box>

        <Box component="span" mr={2}>
          总{typeIdToLabel[Types.OUTCOME]}
          {formatCurrency(outcomeTotal)}
        </Box>

        <Box component="span" mr={2}>
          净收入{formatCurrency(amountSumForCates.total)}
        </Box>
      </Typography>

      {!!outcomeItems.length && (
        <>
          <Divider sx={{ mt: 0.5, mb: 0.5 }} />

          <Typography fontSize={COMPONENT_SIZE}>
            <strong>{typeIdToLabel[Types.OUTCOME]}明细：</strong>
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
      {!!incomeItems.length && (
        <>
          <Divider sx={{ mt: 0.5, mb: 0.5 }} />
          <Typography fontSize={COMPONENT_SIZE}>
            <strong>{typeIdToLabel[Types.INCOME]}明细：</strong>
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
