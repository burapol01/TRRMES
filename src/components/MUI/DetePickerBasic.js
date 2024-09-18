"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import "dayjs/locale/th";
import LocalizedFormat from "dayjs/plugin/buddhistEra";
import OverwriteAdapterDayjs from "../dataAdapter";
import { Stack } from "@mui/material";
import { DesktopDatePicker } from "@mui/x-date-pickers";
dayjs.locale("th");
dayjs.extend(LocalizedFormat);
export default function DatePickerBasic({ valueStart, onchangeStart, labelname, required, validate, disabled, disableFuture, disablePast, disableHighlightToday, disableWeekends, minDate, maxDate, }) {
    const dateFormat = "DD/MM/YYYY";
    const handleTextField = (e) => {
        const fullTime = dayjs(e).format("YYYY-MM-DDTHH:mm:ssZ[Z]");
        if (fullTime != "Invalid Date") {
            const year = (Number(fullTime.split("-")[0]) - 543);
            const newFilltime = `${year}-${fullTime.split("-")[1]}-${fullTime.split("-")[2]}`;
            onchangeStart(dayjs(newFilltime, 'YYYY-MM-DDTHH:mm:ssZ[Z]'));
        }
        else {
            onchangeStart(null);
        }
    };
    return (_jsxs("div", { style: { width: "100%" }, children: [_jsx("label", { className: `${required} fs-5 text-gray-900 py-2`, children: labelname }), _jsx(Stack, { direction: "row", spacing: 1, children: _jsx(LocalizationProvider, { dateAdapter: OverwriteAdapterDayjs, adapterLocale: "th", dateFormats: { monthAndYear: "MMMM BBBB" }, children: _jsx(DesktopDatePicker
                    // sx={{ width: "100%", size: "small" }}
                    // label={labelname}
                    , { 
                        // sx={{ width: "100%", size: "small" }}
                        // label={labelname}
                        format: dateFormat, value: valueStart ? valueStart : null, onChange: (newValue) => onchangeStart(newValue), slotProps: {
                            textField: {
                                size: "small",
                                error: validate,
                                disabled: disabled,
                                sx: {
                                    width: "100%",
                                    "& .MuiInputBase-input.Mui-disabled": {
                                        WebkitTextFillColor: "black", // For text color in WebKit browsers
                                    },
                                    "& .MuiInputBase-root.Mui-disabled": {
                                        backgroundColor: "rgb(241,241,244)", // Background color for the disabled input
                                    },
                                    "& .MuiOutlinedInput-root": {
                                        fontFamily: "Sarabun",
                                        "& .MuiOutlinedInput-notchedOutline": {
                                            borderColor: validate ? "#d50000" : "",
                                        },
                                        "&.Mui-focused": {
                                            "& .MuiOutlinedInput-notchedOutline": {
                                                borderColor: "info.main",
                                            },
                                        },
                                    },
                                },
                                helperText: validate ? `*** กรุณาเลือก${labelname} ***` : "",
                                onChange: handleTextField
                            },
                        }, disableFuture: disableFuture, disabled: disabled, disableHighlightToday: disableHighlightToday, disablePast: disablePast, shouldDisableDate: disableWeekends, minDate: minDate, maxDate: maxDate }) }) })] }));
}
