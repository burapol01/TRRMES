"use client";
import * as React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import "dayjs/locale/th";
import LocalizedFormat from "dayjs/plugin/buddhistEra";
import OverwriteAdapterDayjs from "../dataAdapter";

dayjs.locale("th");
dayjs.extend(LocalizedFormat);

interface BasicDateTimePicker {
  labelName: string;
  required: string;
}

export default function BasicDateTimePicker({
  labelName,
  required,
}: BasicDateTimePicker) {
  const [value, setValue] = React.useState(null);
  const dateFormat = "D MMM YYYY";

  const handleChange = (val: any) => {
    setValue(val);
  };

  return (
    <div style={{ width: "100%" }}>
      <label htmlFor="" className={`${required} fs-6 font-bold`}>
        {labelName}
      </label>
      <LocalizationProvider
        dateAdapter={OverwriteAdapterDayjs}
        adapterLocale="th"
        dateFormats={{ monthAndYear: "MMMM BBBB" }}
      >
        <DesktopDatePicker
          sx={{ width: "100%", size: "small" }}
          //   label={namLabel}
          format={dateFormat}
          value={value}
          onChange={(newValue) => handleChange(newValue)}
          slotProps={{ textField: { size: "small" } }}
        />
      </LocalizationProvider>
    </div>
  );
}
