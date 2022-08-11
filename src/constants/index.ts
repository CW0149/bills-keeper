import {
  BillType,
  BillTypeName,
  FormattedBill,
  TableHeader,
  TypeOption,
} from './types';

export * from './types';

export enum Type {
  '支出',
  '收入',
}

export const typeOptions: TypeOption[] = Object.keys(Type)
  .filter((key: unknown) => !isNaN(key as number))
  .map((id: unknown) => ({
    id: id as BillType,
    label: Type[id as BillType] as BillTypeName,
  }));

export const DEFAULT_TYPE_SELECTED = typeOptions;

export const CURRENCY = '￥';

export const BILLS_TABLE_HEADER: (TableHeader & {
  id: keyof FormattedBill;
  toShowId?: keyof FormattedBill;
})[] = [
  {
    id: 'name',
    label: '名称',
    align: 'center',
  },
  {
    id: 'timeStamp',
    label: '日期',
    align: 'center',
    toShowId: 'time',
  },
  {
    id: 'typeName',
    label: '类别',
    align: 'center',
  },
  {
    id: 'amount',
    label: `金额${CURRENCY}`,
    align: 'right',
    toShowId: 'amountStr',
  },
];

// UI related
export const COMPONENT_SIZE = 'small';
export const MAX_TABLE_HEIGHT = 'calc(100vh - 190px)';
export const TABLE_XS_WHEN_ADDING_BILL = 6;
