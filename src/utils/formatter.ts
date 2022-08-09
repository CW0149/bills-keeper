import { Bill, Category, FormattedBill, typeToTypeName } from '../constants';

export const getFormatBillData = (
  bills: Bill[],
  categories: Category[]
): FormattedBill[] => {
  const cateIdToCate = categories.reduce((res, cate) => {
    res[cate.id] = cate;
    return res;
  }, {} as Record<Category['id'], Category>);

  return bills.map((bill) => ({
    time: new Date(Number(bill.time)).toISOString(),
    typeName: typeToTypeName[bill.type],
    name: cateIdToCate[bill.category]?.name || bill.category,
    amount: `${Number(bill.amount).toFixed(2)}￥`,
  }));
};
