"use client";
import * as React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import "dayjs/locale/th";
import LocalizedFormat from "dayjs/plugin/buddhistEra";
import OverwriteAdapterDayjs from "../dataAdapter";
import { Stack } from "@mui/material";
import { DesktopDatePicker } from "@mui/x-date-pickers";

dayjs.locale("th");
dayjs.extend(LocalizedFormat);

interface DatePickerBasic {
  valueStart?: any;
  onchangeStart: (el: any) => void;
  labelname?: string;
  required?: string;
  validate?: boolean;
  disabled?: boolean;
  disableFuture?: boolean;
  disablePast?: boolean;
  disableHighlightToday?: boolean;
  disableWeekends?: any;
  checkValidateMonth?: boolean;
  startDate?: any; 
  cutOffFlag?: boolean; // เพิ่ม cutOffFlag
}

export default function DatePickerBasic({
  valueStart,
  onchangeStart,
  labelname,
  required,
  validate,
  disabled,
  disableFuture,
  disablePast,
  disableHighlightToday,
  disableWeekends,
  checkValidateMonth = false,
  startDate,
  cutOffFlag = false, // กำหนดค่าเริ่มต้น
}: DatePickerBasic) {
  const dateFormat = "DD/MM/YYYY";
  const [errorMessage, setErrorMessage] = React.useState("");

  // คำนวณวันสิ้นสุดของเดือนของวันที่เริ่มต้น
  const endOfMonth = startDate ? dayjs(startDate).endOf("month") : undefined;

  // กำหนดวันที่สิ้นสุด
  const minDate = startDate;
  const maxDate = endOfMonth;

  // ตรวจสอบค่า cutOffFlag เพื่อแสดงข้อความ error
  React.useEffect(() => {
    if (cutOffFlag) {
      setErrorMessage("เนื่องจากเดือนที่ท่านเลือกถูกปิดยอดไปเรียบร้อยแล้วกรุณาเลือกเดือนใหม่");
    } else {
      setErrorMessage(""); // เคลียร์ข้อความ error หากไม่มี cutOffFlag
    }
  }, [cutOffFlag]);

  return (
    <div style={{ width: "100%" }}>
      <label className={`${required} fs-5 text-gray-900 py-2`}>{labelname}</label>
      <Stack direction={"row"} spacing={1}>
        <LocalizationProvider
          dateAdapter={OverwriteAdapterDayjs}
          adapterLocale="th"
          dateFormats={{ monthAndYear: "MMMM BBBB" }}
        >
          <DesktopDatePicker
            format={dateFormat}
            value={valueStart ? valueStart : null}
            onChange={(newValue) => onchangeStart(newValue)}
            slotProps={{
              textField: {
                size: "small",
                error: validate || !!errorMessage,
                disabled: disabled,
                sx: {
                  width: "100%",
                  "& .MuiInputBase-input.Mui-disabled": {
                    WebkitTextFillColor: "black",
                  },
                  "& .MuiInputBase-root.Mui-disabled": {
                    backgroundColor: "rgb(241,241,244)",
                  },
                  "& .MuiOutlinedInput-root": {
                    fontFamily: "Sarabun",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: validate || !!errorMessage ? "#d50000" : "",
                    },
                    "&.Mui-focused": {
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "info.main",
                      },
                    },
                  },
                },
                helperText: errorMessage || (validate ? `*** กรุณาเลือก${labelname} ***` : ""),
              },
            }}
            disableFuture={disableFuture}
            disabled={disabled}
            disableHighlightToday={disableHighlightToday}
            disablePast={disablePast}
            shouldDisableDate={disableWeekends}
            minDate={minDate} 
            maxDate={maxDate}
          />
        </LocalizationProvider>
      </Stack>

    </div>
  );
}
