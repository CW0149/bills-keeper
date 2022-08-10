import { BillType, BillTypeName, TypeOption } from './types';

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
