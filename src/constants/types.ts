import { TableCellProps } from '@mui/material';

export type BillType = '0' | '1';
export type BillTypeName = '支出' | '收入';

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
  name: Category['name'];
  amountStr: string;
  amount: number;
};

export type ToFilterYearAndMonth = [number, number] | null;

export type GroupedCategories = Record<BillTypeName, Category[]>;

export type TypeOption = {
  type: BillType;
  name: BillTypeName;
};

export type TableHeader = {
  id: string | number;
  label: string;
  align?: TableCellProps['align'];
  disablePadding?: boolean;
  toShowId?: string | number;
};
