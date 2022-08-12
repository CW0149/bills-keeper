import { Box, TextField } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { FC } from 'react';
import zhCN from 'date-fns/locale/zh-CN';
import {
  COMPONENT_SIZE,
  ToFilterYearAndMonth,
  TypeOption,
  typeOptions,
  TYPE_LABEL,
} from '../../constants';
import { BillSelect } from '../BillsSelect';

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
  const getDateValue = (value: Date | null): ToFilterYearAndMonth =>
    value ? [value.getFullYear(), value.getMonth() + 1] : null;

  return (
    <>
      <BillSelect
        label={TYPE_LABEL}
        width="240px"
        value={typeValue}
        onChange={(options) =>
          options.length && setToFilterTypeOptions(options)
        }
        options={typeOptions}
        multiple={true}
      />

      <Box component="span" mr={1} />

      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={zhCN}>
        <DatePicker
          showToolbar={false}
          closeOnSelect={true}
          views={['year', 'month']}
          label="年和月"
          minDate={new Date('2018-01-01')}
          maxDate={new Date()}
          value={
            dateValue &&
            new Date(dateValue?.[0] as number, (dateValue?.[1] as number) - 1)
          }
          onChange={(newValue) => {
            if (!newValue) {
              setToFilterYearAndMonth(null);
            }
          }}
          onAccept={(newValue) => {
            setToFilterYearAndMonth(getDateValue(newValue));
          }}
          renderInput={(params) => (
            <TextField
              sx={{ width: { xs: '100%', md: 'auto' } }}
              {...params}
              size={COMPONENT_SIZE}
            />
          )}
        />
      </LocalizationProvider>
    </>
  );
};
