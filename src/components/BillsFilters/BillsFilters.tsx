import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  TextField,
  Chip,
  Paper,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { FC, useState } from 'react';
import zhCN from 'date-fns/locale/zh-CN';
import {
  BillTypeName,
  ToFilterYearAndMonth,
  typeOptions,
} from '../../constants';

type Props = {
  dateValue: ToFilterYearAndMonth;
  typeValue: BillTypeName[];
  setToFilterYearAndMonth: (date: ToFilterYearAndMonth) => void;
  setToFilterTypeName: (date: BillTypeName[]) => void;
};
export const BillsFilters: FC<Props> = ({
  dateValue,
  setToFilterYearAndMonth,
  typeValue,
  setToFilterTypeName,
}) => {
  const [date, setDate] = useState<ToFilterYearAndMonth | null>(dateValue);

  const getDateValue = (value: Date | null): ToFilterYearAndMonth =>
    value ? [value.getFullYear(), value.getMonth() + 1] : null;

  const handleTypeChange = (event: SelectChangeEvent<typeof typeValue>) => {
    const {
      target: { value },
    } = event;
    const valueArr = typeof value === 'string' ? value.split(',') : value;

    if (valueArr.length) {
      setToFilterTypeName(valueArr as BillTypeName[]);
    }
  };

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
          renderInput={(params) => <TextField {...params} size="small" />}
        />
      </LocalizationProvider>

      <FormControl sx={{ ml: 1, width: 160 }} size="small">
        <InputLabel id="select-type-label">类别</InputLabel>
        <Select
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple
          value={typeValue}
          onChange={handleTypeChange}
          input={<OutlinedInput id="select-type-label" label="类别" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip size="small" key={value} label={value} />
              ))}
            </Box>
          )}
        >
          {typeOptions.map(({ name, type }) => (
            <MenuItem key={type} value={name}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};
