import { SortDirection } from '@mui/material';
import { usePapaParse } from 'react-papaparse';

export * from './formatter';
export * from './request';

export function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

export function getComparator<Key extends keyof any>(
  order: SortDirection,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

export const readCsvString = (
  readString: ReturnType<typeof usePapaParse>['readString'],
  csvString: string,
  hasHeader = true
) =>
  new Promise((resolve, reject) => {
    try {
      readString(csvString, {
        header: hasHeader,
        worker: true,
        complete: ({ data }) => {
          resolve(data);
        },
      });
    } catch (err) {
      reject(err);
    }
  });
