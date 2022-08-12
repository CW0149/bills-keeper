import { Autocomplete, FormControl, TextField } from '@mui/material';
import { FC, useMemo } from 'react';
import { COMPONENT_SIZE, SelectProps } from '../../constants';

type Props = SelectProps<any, any>;
export const BillSelect: FC<Props> = ({
  value,
  onChange,
  label,
  options,
  multiple,
  width,
  freeSolo,
}) => {
  const selected = useMemo(() => {
    if (multiple) return value;

    return value[0] ?? null;
  }, [multiple, value]);

  return (
    <FormControl
      sx={{ width: { xs: '100%', md: width }, mb: { xs: 1, md: 0 } }}
    >
      <Autocomplete
        clearIcon={false}
        freeSolo={freeSolo}
        size={COMPONENT_SIZE}
        multiple={multiple}
        value={selected}
        onChange={(e, newValue) => {
          onChange((multiple ? newValue : [newValue]) as typeof value);
        }}
        onBlur={(e: any) => {
          const value = e.target.value;
          if (freeSolo && !options.find((option) => option.label === value)) {
            onChange([{ label: value.trim() }] as typeof value);
          }
        }}
        renderInput={(params) => <TextField {...params} label={label} />}
        options={options}
        isOptionEqualToValue={(option, value) => option.id === value.id}
      />
    </FormControl>
  );
};
