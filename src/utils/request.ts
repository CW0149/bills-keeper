import { RawBill, RawCategory } from '../constants';

const LOCAL_STORAGE_RAW_BILLS_KEY = 'rawBills';
const LOCAL_STORAGE_RAW_CATEGORIES_KEY = 'rawCategories';

export const fetchBills = (): Promise<string> | RawBill[] => {
  const storedBills = localStorage.getItem(LOCAL_STORAGE_RAW_BILLS_KEY);
  const fetchCsv = fetch('bill.csv').then((res) => res.text());

  try {
    const bills = JSON.parse(storedBills as string);
    if (bills) return bills;

    return fetchCsv;
  } catch (err) {
    console.log(err);
    return fetchCsv;
  }
};

export const fetchCategories = (): Promise<string> | RawCategory[] => {
  const storedCategories = localStorage.getItem(
    LOCAL_STORAGE_RAW_CATEGORIES_KEY
  );
  const fetchCsv = fetch('categories.csv').then((res) => res.text());

  try {
    const categories = JSON.parse(storedCategories as string);
    if (categories) return categories;

    return fetchCsv;
  } catch (err) {
    console.log(err);
    return fetchCsv;
  }
};

export const saveRawBills = (bills: RawBill[]): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_RAW_BILLS_KEY, JSON.stringify(bills));
      resolve(true);
    } catch (err) {
      console.log(err);

      reject(err);
    }
  });
};

export const saveRawCategories = (
  categories: RawCategory[]
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    try {
      localStorage.setItem(
        LOCAL_STORAGE_RAW_CATEGORIES_KEY,
        JSON.stringify(categories)
      );
      resolve(true);
    } catch (err) {
      console.log(err);

      reject(err);
    }
  });
};

export const clearLocalBillsData = () => {
  localStorage.removeItem(LOCAL_STORAGE_RAW_BILLS_KEY);
  localStorage.removeItem(LOCAL_STORAGE_RAW_CATEGORIES_KEY);
};
