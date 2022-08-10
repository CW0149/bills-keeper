import {
  BillType,
  BillTypeName,
  FormattedBill,
  TableHeader,
  TypeOption,
} from './types';

export * from './types';

export const typeToTypeName: Record<BillType, BillTypeName> = {
  '0': '支出',
  '1': '收入',
};

export const typeOptions: TypeOption[] = Object.keys(typeToTypeName).map(
  (type) => ({
    type: type as BillType,
    name: typeToTypeName[type as BillType],
  })
);

export const DEFAULT_TYPE_SELECTED = typeOptions.map((item) => item.name);

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
