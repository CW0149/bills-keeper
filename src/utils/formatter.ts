import {
  Bill,
  Category,
  CURRENCY,
  FormattedBill,
  GroupedCategories,
  typeToTypeName,
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
    typeName: typeToTypeName[bill.type],

    name: cateIdToCate[bill.category]?.name || bill.category,

    amountStr: `${Number(bill.amount).toFixed(2)}`,
    amount: Number(bill.amount),
  }));
};

export const getGroupedCategories = (
  data: FormattedBill[]
): GroupedCategories => {
  const result = data.reduce((res, item) => {
    const { type } = item;

    const set = res[type] || new Set([]);
    set.add(item);

    res[type] = set;

    return res;
  }, {} as any);

  return result;
};

export const formatCurrency = (
  amount: string | number,
  currency: string = CURRENCY
) => {
  return `${currency}${Number(amount).toFixed(2)}`;
};
