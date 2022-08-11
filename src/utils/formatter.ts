import {
  Bill,
  BillTypeName,
  Category,
  CURRENCY,
  FormattedBill,
  GroupedCategories,
  Type,
} from '../constants';

export const getFormatBillData = (
  bills: Bill[],
  categories: Category[]
): FormattedBill[] => {
  const cateIdToCate = categories.reduce((res, cate) => {
    res[cate.id] = cate;
    return res;
  }, {} as Record<Category['id'], Category>);

  return bills.map((bill, index) => ({
    id: index,
    time: `${new Date(Number(bill.time)).toISOString()} | ${new Date(
      Number(bill.time)
    ).toLocaleDateString()}`,
    timeStamp: Number(bill.time),

    type: bill.type,
    typeName: Type[bill.type] as BillTypeName,

    category: bill.category,
    name: cateIdToCate[bill.category]?.name || bill.category,

    amountStr: `${Number(bill.amount).toFixed(2)}`,
    amount: Number(bill.amount),
  }));
};

export const getKeyToCategories = (
  data: Category[],
  key: keyof Category
): GroupedCategories =>
  data.reduce((res, item) => {
    const valueOfKey = item[key];

    res[valueOfKey] = res[valueOfKey] || [];
    res[valueOfKey].push(item);

    return res;
  }, {} as GroupedCategories);

export const deGroupCategories = (data: GroupedCategories): Category[] =>
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
