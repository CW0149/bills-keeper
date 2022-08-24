import { Add } from '@mui/icons-material';
import { Box, Button, Paper, useTheme } from '@mui/material';
import { FC, useState } from 'react';
import {
  CateOption,
  Category,
  MAX_TABLE_HEIGHT,
  ToAddBillsData,
  TypeOption,
  RawCategory,
  typeOptions,
} from '../../constants';
import { getKeyToCategories } from '../../utils';
import { AddBillItem } from './AddBillItem';

type Props = {
  categories: Category[];
  addBillsData: (data: ToAddBillsData) => Promise<'success' | 'failed'>;
};

type NewBill = {
  typeOption: TypeOption;
  cateOption?: CateOption;
  amount?: number;
  id: number;
};

export const AddBillsForm: FC<Props> = ({ categories, addBillsData }) => {
  const theme = useTheme();

  const typeToCategories = getKeyToCategories(categories, 'type');

  const [newBills, setNewBills] = useState<NewBill[]>([]);

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
        typeOption: typeOptions[0],
      },
    ]);
  };

  const removeBill = (id: number) => {
    setNewBills(newBills.filter((item) => item.id !== id));
  };

  const isNewBillValid = (bill: NewBill) => {
    return (
      !!bill.amount &&
      bill.typeOption?.id !== undefined &&
      bill.cateOption?.label !== undefined
    );
  };

  const confirmAdd = () => {
    // Can add a form validation here to produce a better performance

    const toAddBills = newBills.filter((bill) => isNewBillValid(bill));
    if (!toAddBills.length) {
      alert('没有有效的账单');
      return;
    }

    const bills: ToAddBillsData['bills'] = [];
    const categories: ToAddBillsData['categories'] = [];
    const cateNameToId: Record<RawCategory['name'], RawCategory['id']> = {};
    const typeToCateMap = {} as Record<
      RawCategory['type'],
      typeof cateNameToId
    >;

    toAddBills.forEach((bill) => {
      const { typeOption, cateOption, amount } = bill as Required<NewBill>;
      const time = Date.now();

      const { id: type } = typeOption;
      const cateName = cateOption.label;
      let cateId = cateOption.id;

      if (!cateId) {
        const createdId = typeToCateMap[type]?.[cateName];

        if (createdId) {
          cateId = createdId;
        } else {
          cateId = `randomCategoryId${Math.random()}`;
          typeToCateMap[type] = typeToCateMap[type] || {};
          typeToCateMap[type][cateName] = cateId;

          categories.push({
            id: cateId,
            name: cateName,
            type: String(type),
          });
        }
      }

      bills.push({
        id: `randomBillId${Math.random()}`,
        time: String(time),
        type: String(type),
        category: cateId,
        amount: String(amount),
      });
    });

    // We can add handler for error here for better user experience
    addBillsData({
      bills,
      categories,
    }).then(() => {
      console.log(toAddBills, 'successfully added');

      const notToAddBills = newBills.filter((bill) => !isNewBillValid(bill));
      setNewBills(notToAddBills);
    });
  };

  return (
    <Box
      component={Paper}
      p={1}
      maxHeight={MAX_TABLE_HEIGHT}
      overflow="auto"
      boxSizing="border-box"
    >
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

      {!!newBills.length && (
        <Box display="flex" justifyContent="center" mt={2} mb={1}>
          <Button
            sx={{ width: '140px' }}
            variant="contained"
            onClick={confirmAdd}
          >
            保存
          </Button>
        </Box>
      )}
    </Box>
  );
};
