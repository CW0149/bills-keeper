import { Button, Grid } from '@mui/material';
import { Box } from '@mui/system';
import { FC } from 'react';
import { useCSVDownloader } from 'react-papaparse';
import {
  Bill,
  BillTableHeader,
  headerIdToLabel,
  RawBill,
  RawCategory,
} from '../../constants';

type Props = {
  rawBills: RawBill[];
  rawCategories: RawCategory[];
  bills: Bill[];
  [key: string]: any;
};
export const BillsDownloader: FC<Props> = ({
  rawBills,
  rawCategories,
  bills,
  ...rest
}) => {
  const { CSVDownloader } = useCSVDownloader();
  const toDownloadBills = bills.map((bill) => {
    const labelAsKeyBill: Record<BillTableHeader['label'], any> = {};

    Object.keys(headerIdToLabel).forEach((id: unknown) => {
      labelAsKeyBill[headerIdToLabel[id as keyof typeof headerIdToLabel]] =
        bill[id as keyof typeof headerIdToLabel];
    });

    return labelAsKeyBill;
  });

  return (
    <Box {...rest}>
      <Grid container spacing={1}>
        <Grid item>
          <CSVDownloader
            filename={'全部账单'}
            bom={true}
            data={toDownloadBills}
          >
            <Button variant="contained">下载全部账单</Button>
          </CSVDownloader>
        </Grid>
        <Grid item>
          <CSVDownloader filename={'bill'} bom={true} data={rawBills}>
            <Button variant="contained">下载bill.csv</Button>
          </CSVDownloader>
        </Grid>
        <Grid item>
          <Button variant="contained">
            <CSVDownloader
              filename={'categories'}
              bom={true}
              data={rawCategories}
            >
              下载categories.csv
            </CSVDownloader>
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};
