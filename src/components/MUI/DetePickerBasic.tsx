//@ts-nocheck
import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import LocalizedFormat from 'dayjs/plugin/buddhistEra';
import OverwriteAdapterDayjs from '../dataAdapter';

dayjs.locale('th');
dayjs.extend(LocalizedFormat);

export default function DetePickerBasic() {
  const dateFormat = 'D MMMM YYYY';
  return (
    <LocalizationProvider dateAdapter={OverwriteAdapterDayjs} adapterLocale={'th'} dateFormats={{ monthAndYear: "MMMM BBBB" }}>
      <DemoContainer components={['DatePicker']}>
        <DatePicker label="Basic date picker" format={dateFormat} />
      </DemoContainer>
    </LocalizationProvider>
  );
}