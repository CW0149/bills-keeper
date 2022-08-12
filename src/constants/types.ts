import { CSSProperties } from '@emotion/serialize';
import { TableCellProps } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';

// Global
export type TableHeader = {
  id: string | number;
  label: string;
  align?: TableCellProps['align'];
  disablePadding?: boolean;
  toShowId?: string | number;
};

export type SelectOption<ID, LABEL> = {
  id: ID;
  label: LABEL;
};
export type SelectProps<ID, LABEL> = {
  value: SelectOption<ID, LABEL>[];
  onChange: (newValue: SelectOption<ID, LABEL>[]) => void;
  label?: string;
  options: { id: string | number; label: string }[];
  multiple?: boolean;
  valueComponent?: OverridableComponent<any>;
  width?: CSSProperties['width'];
  freeSolo?: boolean;
};

// Data type
export type BillType = 0 | 1 | number;
export type BillTypeName = '支出' | '收入' | string;

export type RawBill = {
  time: string;
  type: string;
  category: string;
  amount: string;
};

export type RawCategory = {
  id: string; // Equal to RawBill.category
  type: string;
  name: string;
};

export type Category = {
  id: string;
  type: BillType;
  name: string;
};

export type Bill = {
  timeStr: string;
  time: number;
  type: BillType;
  typeName: BillTypeName;
  category: Category['id'];
  name: Category['name'];
  amountStr: string;
  amount: number;
};

// Select Options
export type TypeOption = SelectOption<BillType, BillTypeName>;
export type CateOption = SelectOption<Category['id'], Category['name']>;

// Temp data
export type GroupedCategories = Record<string, Category[]>;
export type ToAddBillsData = {
  bills: RawBill[];
  categories: RawCategory[];
};

// For table
export type ToFilterYearAndMonth = [number, number] | null;

export type BillTableHeader = TableHeader & {
  id: keyof Bill;
  toShowId?: keyof Bill;
};
