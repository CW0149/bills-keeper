import { BillType, BillTypeName } from './types';

export * from './types';

export const typeToTypeName: Record<BillType, BillTypeName> = {
  '0': '支出',
  '1': '收入',
};
