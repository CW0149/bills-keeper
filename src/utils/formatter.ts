import { isValidDate } from '.';
import {
  RawBill,
  Category,
  CURRENCY,
  Bill,
  GroupedCategories,
  typeIdToLabel,
  RawCategory,
} from '../constants';

export const getFormattedBills = (
  bills: RawBill[],
  categories: RawCategory[]
): Bill[] => {
  const cateIdToCate = categories.reduce((res, cate) => {
    res[cate.id] = cate;
    return res;
  }, {} as Record<RawCategory['id'], RawCategory>);

  return bills.map((bill) => ({
    timeStr: isValidDate(bill.time)
      ? `${new Date(Number(bill.time)).toISOString()} | ${new Date(
          Number(bill.time)
        ).toLocaleString()}`
      : '',
    time: Number(bill.time),

    type: Number(bill.type),
    typeName: typeIdToLabel[Number(bill.type)],

    category: bill.category,
    name: cateIdToCate[bill.category]?.name || bill.category,

    amountStr: `${Number(bill.amount).toFixed(2)}`,
    amount: Number(bill.amount),
  }));
};

export const getFormattedCategories = (categories: RawCategory[]): Category[] =>
  categories.map((item) => ({
    id: item.id,
    type: Number(item.type),
    name: item.name,
  }));

export const getKeyToCategories = (data: Category[], key: keyof Category) =>
  data.reduce((res, item) => {
    const valueOfKey = item[key];

    res[valueOfKey] = res[valueOfKey] || [];
    res[valueOfKey].push(item);

    return res;
  }, {} as GroupedCategories);

export const deGroupCategories = (data: GroupedCategories) =>
  Object.keys(data).reduce((res, key) => {
    res = [...res, ...data[key]];

    return res;
  }, [] as Category[]);

export const formatCurrency = (
  amount: string | number,
  currency: string = CURRENCY
) => {
  return `${currency}${Number(amount).toFixed(2)}`;
};
