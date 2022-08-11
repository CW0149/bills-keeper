import { Box, Grid, IconButton, TextField } from '@mui/material';
import { FC, useEffect, useMemo } from 'react';
import {
  CateOption,
  COMPONENT_SIZE,
  CURRENCY,
  TypeOption,
  typeOptions,
} from '../../constants';
import { BillSelect } from '../Select';
import { deGroupCategories, getKeyToCategories } from '../../utils';
import { Delete } from '@mui/icons-material';

type Props = {
  typeToCategories: ReturnType<typeof getKeyToCategories>;

  typeValue?: TypeOption;
  setTypeValue: (type: TypeOption) => void;
  cateValue?: CateOption;
  setCateValue: (cate: CateOption) => void;
  amount?: number;
  setAmount: (amount: number) => void;

  removeBill: (index: number) => void;
  id: number;
};

export const AddBillItem: FC<Props> = ({
  typeToCategories,
  typeValue,
  setTypeValue,
  cateValue,
  setCateValue,
  amount,
  setAmount,

  removeBill,
  id,
}) => {
  const cateOptions = useMemo(() => {
    let categories = [];
    if (!typeValue) {
      categories = deGroupCategories(typeToCategories);
    } else {
      categories = typeToCategories[typeValue.id] || [];
    }

    return categories.map((item) => ({
      id: item.id,
      label: item.name,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeValue, typeToCategories]);

  useEffect(() => {
    if (typeValue && cateOptions) {
      setCateValue(cateOptions[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeValue?.id]);

  return (
    <Grid container spacing={1} mt={0.5}>
      <Grid item xs={3}>
        <BillSelect
          label="类别"
          fullWidth
          options={typeOptions}
          value={typeValue ? [typeValue] : []}
          onChange={(newValue: TypeOption[]) => {
            setTypeValue(newValue[0]);
          }}
        />
      </Grid>
      <Grid item xs={5}>
        <BillSelect
          label="名称"
          freeSolo
          fullWidth
          options={cateOptions}
          value={cateValue ? [cateValue] : []}
          onChange={(newValue: CateOption[]) => {
            setCateValue(newValue[0]);
          }}
        />
      </Grid>
      <Grid item xs={3}>
        <TextField
          type="number"
          fullWidth
          label={`金额${CURRENCY}`}
          size={COMPONENT_SIZE}
          value={amount || ''}
          onChange={(e: any) => setAmount(e.target.value)}
        />
      </Grid>

      <Grid item xs={1} textAlign="right">
        <Box>
          <IconButton onClick={() => removeBill(id)}>
            <Delete />
          </IconButton>
        </Box>
      </Grid>
    </Grid>
  );
};
