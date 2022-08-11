import { Add } from '@mui/icons-material';
import { Box, Button, Paper, useTheme } from '@mui/material';
import { FC, useState } from 'react';
import { Category, CateOption, TypeOption } from '../../constants';
import { getKeyToCategories } from '../../utils';
import { AddBillItem } from './AddBillItem';

type Props = {
  categories: Category[];
};
export const AddBillsForm: FC<Props> = ({ categories }) => {
  const theme = useTheme();

  const typeToCategories = getKeyToCategories(categories, 'type');

  const [newBills, setNewBills] = useState<
    {
      typeOption?: TypeOption;
      cateOption?: CateOption;
      amount?: number;
      id: number;
    }[]
  >([]);

  const updateNewBills = (index: number, data: Record<string, any>) => {
    const newList = newBills.map((bill, i) => {
      if (i === index) {
        return {
          ...bill,
          ...data,
        };
      }
      return bill;
    });

    setNewBills(newList);
  };

  const addBill = () => {
    setNewBills([
      ...newBills,
      {
        id: Date.now(),
      },
    ]);
  };

  const removeBill = (id: number) => {
    setNewBills(newBills.filter((item) => item.id !== id));
  };

  return (
    <Box component={Paper} p={1}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        border={`1px dashed ${theme.palette.primary.main}`}
        borderRadius="2px"
      >
        <Button
          fullWidth
          startIcon={<Add fontSize="large" />}
          onClick={addBill}
        >
          添加账单
        </Button>
      </Box>

      {newBills.map((bill, i) => (
        <AddBillItem
          key={bill.id}
          id={bill.id}
          typeToCategories={typeToCategories}
          typeValue={bill.typeOption}
          setTypeValue={(typeOption) => updateNewBills(i, { typeOption })}
          cateValue={bill.cateOption}
          setCateValue={(cateOption) => updateNewBills(i, { cateOption })}
          amount={bill.amount}
          setAmount={(amount) => updateNewBills(i, { amount })}
          removeBill={removeBill}
        />
      ))}
    </Box>
  );
};
