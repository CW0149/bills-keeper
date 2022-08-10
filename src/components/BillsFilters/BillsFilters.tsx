import { TextField } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { FC, useState } from 'react';
import zhCN from 'date-fns/locale/zh-CN';
import { ToFilterYearAndMonth } from '../../constants';

type Props = {
  value: ToFilterYearAndMonth;
  setToFilterYearAndMonth: (date: ToFilterYearAndMonth) => void;
};
export const BillsFilters: FC<Props> = ({ value, setToFilterYearAndMonth }) => {
  const [date, setDate] = useState<ToFilterYearAndMonth | null>(value);
  const getValue = (value: Date | null): ToFilterYearAndMonth =>
    value ? [value.getFullYear(), value.getMonth() + 1] : null;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={zhCN}>
      <DatePicker
        views={['year', 'month']}
        label="年和月"
        minDate={new Date('2018-01-01')}
        maxDate={new Date()}
        value={date}
        onChange={(newValue) => {
          setDate(getValue(newValue));
          if (!newValue) {
            setToFilterYearAndMonth(null);
          }
        }}
        onAccept={(newValue) => {
          setToFilterYearAndMonth(getValue(newValue));
        }}
        renderInput={(params) => <TextField {...params} />}
      />
    </LocalizationProvider>
  );
};
