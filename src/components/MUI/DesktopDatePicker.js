"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import "dayjs/locale/th";
import LocalizedFormat from "dayjs/plugin/buddhistEra";
import OverwriteAdapterDayjs from "../dataAdapter";
dayjs.locale("th");
dayjs.extend(LocalizedFormat);
export default function BasicDateTimePicker({ labelName, required, }) {
    const [value, setValue] = React.useState(null);
    const dateFormat = "D MMM YYYY";
    const handleChange = (val) => {
        setValue(val);
    };
    return (_jsxs("div", { style: { width: "100%" }, children: [_jsx("label", { htmlFor: "", className: `${required} fs-6 font-bold`, children: labelName }), _jsx(LocalizationProvider, { dateAdapter: OverwriteAdapterDayjs, adapterLocale: "th", dateFormats: { monthAndYear: "MMMM BBBB" }, children: _jsx(DesktopDatePicker, { sx: { width: "100%", size: "small" }, 
                    //   label={namLabel}
                    format: dateFormat, value: value, onChange: (newValue) => handleChange(newValue), slotProps: { textField: { size: "small" } } }) })] }));
}
