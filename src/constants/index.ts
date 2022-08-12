import {
  BillType,
  BillTypeName,
  TypeOption,
  BillTableHeader,
  Bill,
} from './types';

export * from './types';

// UI related
export const COMPONENT_SIZE = 'small';
export const MAX_TABLE_HEIGHT = 'calc(100vh - 190px)';
export const TABLE_XS_WHEN_ADDING_BILL = 6;

export const CURRENCY = '￥';

// Bills types
export enum Types {
  OUTCOME = 0,
  INCOME = 1,
}

export const typeIdToLabel: Record<BillType, BillTypeName> = {
  [Types.OUTCOME]: '支出',
  [Types.INCOME]: '收入',
};

export const typeOptions: TypeOption[] = Object.keys(typeIdToLabel).map(
  (id: unknown) => ({
    id: Number(id),
    label: typeIdToLabel[id as BillType],
  })
);

export const DEFAULT_TYPE_SELECTED = typeOptions;

// Table
export const billsTableHeader: BillTableHeader[] = [
  {
    id: 'name',
    label: '名称',
    align: 'center',
  },
  {
    id: 'time',
    label: '日期',
    align: 'center',
    toShowId: 'timeStr',
  },
  {
    id: 'type',
    label: '类别',
    align: 'center',
    toShowId: 'typeName',
  },
  {
    id: 'amount',
    label: `金额${CURRENCY}`,
    align: 'right',
    toShowId: 'amountStr',
  },
];

export const headerIdToLabel = billsTableHeader.reduce((res, item) => {
  res[item.toShowId ?? item.id] = item.label;
  return res;
}, {} as Record<keyof Bill, BillTableHeader['label']>);
