export type BillType = '0' | '1';
export type BillTypeName = '支出' | '收入';

export type Bill = {
  time: string;
  type: BillType;
  category: string;
  amount: string;
};

export type Category = {
  id: Bill['category'];
  type: Bill['type'];
  name: string;
};

export type FormattedBill = {
  time: string;
  timeStamp: number;
  type: Bill['type'];
  typeName: BillTypeName;
  name: Category['name'];
  amount: string;
};

export type ToFilterYearAndMonth = [number, number] | null;

export type GroupedCategories = Record<BillTypeName, Category[]>;

export type TypeOption = {
  type: BillType;
  name: BillTypeName;
};
