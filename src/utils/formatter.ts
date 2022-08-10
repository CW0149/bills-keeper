import {
  Bill,
  Category,
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

  return bills.map((bill) => ({
    time: `${new Date(Number(bill.time)).toISOString()} | ${new Date(
      Number(bill.time)
    ).toLocaleDateString()}`,
    timeStamp: Number(bill.time),
    typeName: typeToTypeName[bill.type],
    name: cateIdToCate[bill.category]?.name || bill.category,
    amount: `${Number(bill.amount).toFixed(2)}￥`,
  }));
};

export const getGroupedCategories = (
  data: FormattedBill[]
): GroupedCategories => {
  const result = data.reduce((res, item) => {
    const { typeName } = item;

    const set = res[typeName] || new Set([]);
    set.add(item);

    res[typeName] = set;

    return res;
  }, {} as any);

  return result;
};
