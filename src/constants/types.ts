import { CSSProperties } from '@emotion/serialize';
import { TableCellProps } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { Type } from '.';

export type BillType = 0 | 1;
export type BillTypeName = keyof typeof Type;

export type Bill = {
  time: string;
  type: BillType;
  category: string;
  amount: string;
};

export type Category = {
  id: Bill['category'];
  type: Bill['type'];
  name: string;
};

export type FormattedBill = {
  id: number;
  time: string;
  timeStamp: number;
  type: Bill['type'];
  typeName: BillTypeName;
  category: Category['id'];
  name: Category['name'];
  amountStr: string;
  amount: number;
};

export type ToFilterYearAndMonth = [number, number] | null;

export type GroupedCategories = Record<string, Category[]>;

export type SelectOption<ID, LABEL> = {
  id: ID;
  label: LABEL;
};

export type TypeOption = SelectOption<BillType, BillTypeName>;
export type CateOption = SelectOption<Category['id'], Category['name']>;

export type TableHeader = {
  id: string | number;
  label: string;
  align?: TableCellProps['align'];
  disablePadding?: boolean;
  toShowId?: string | number;
};

export type SelectProps<ID, LABEL> = {
  value: SelectOption<ID, LABEL>[];
  onChange: (newValue: SelectOption<ID, LABEL>[]) => void;
  label?: string;
  options: { id: string | number; label: string }[];
  multiple?: boolean;
  valueComponent?: OverridableComponent<any>;
  width?: CSSProperties['width'];
  fullWidth?: boolean;
  freeSolo?: boolean;
};
