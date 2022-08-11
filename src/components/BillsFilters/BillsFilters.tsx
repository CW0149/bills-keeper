import { Box, TextField, Paper, Chip } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { FC, useState } from 'react';
import zhCN from 'date-fns/locale/zh-CN';
import {
  COMPONENT_SIZE,
  ToFilterYearAndMonth,
  TypeOption,
  typeOptions,
} from '../../constants';
import { BillSelect } from '../Select';

type Props = {
  dateValue: ToFilterYearAndMonth;
  typeValue: TypeOption[];
  setToFilterYearAndMonth: (date: ToFilterYearAndMonth) => void;
  setToFilterTypeOptions: (option: TypeOption[]) => void;
};
export const BillsFilters: FC<Props> = ({
  dateValue,
  setToFilterYearAndMonth,
  typeValue,
  setToFilterTypeOptions,
}) => {
  const [date, setDate] = useState<ToFilterYearAndMonth | null>(dateValue);

  const getDateValue = (value: Date | null): ToFilterYearAndMonth =>
    value ? [value.getFullYear(), value.getMonth() + 1] : null;

  return (
    <Box component={Paper} p={1}>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={zhCN}>
        <DatePicker
          views={['year', 'month']}
          label="年和月"
          minDate={new Date('2018-01-01')}
          maxDate={new Date()}
          value={date}
          onChange={(newValue) => {
            setDate(getDateValue(newValue));
            if (!newValue) {
              setToFilterYearAndMonth(null);
            }
          }}
          onAccept={(newValue) => {
            setToFilterYearAndMonth(getDateValue(newValue));
          }}
          renderInput={(params) => (
            <TextField {...params} size={COMPONENT_SIZE} />
          )}
        />
      </LocalizationProvider>

      <Box component="span" mr={1} />

      <BillSelect
        label="类别"
        width="240px"
        value={typeValue}
        onChange={setToFilterTypeOptions}
        options={typeOptions}
        multiple={true}
      />
    </Box>
  );
};
