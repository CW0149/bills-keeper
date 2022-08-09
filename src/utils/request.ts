export const fetchBills = (): Promise<string> => {
  return fetch('bill.csv').then((res) => res.text());
};

export const fetchCategories = (): Promise<string> => {
  return fetch('categories.csv').then((res) => res.text());
};
