import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, TextField } from '@mui/material';
export default function FullWidthTextareaField({ value = '', labelName, required = '', disabled = false, onChange, readonly = false, textAlignTextField = 'left', rows = 4, Validate = false, validateTextLable = '', multiline = false, }) {
    const handleChange = (e) => {
        onChange && onChange(e.target.value);
    };
    return (_jsxs(Box, { children: [_jsx("label", { htmlFor: "", className: `${required ? 'required' : ''} fs-5 py-2 sarabun-regular`, children: labelName }), _jsx(TextField, { fullWidth: true, multiline: multiline, rows: rows, sx: {
                    "& .MuiInputBase-input.Mui-disabled": {
                        WebkitTextFillColor: "black", // For text color in WebKit browsers
                    },
                    "& .MuiInputBase-root.Mui-disabled": {
                        backgroundColor: "rgb(241,241,244)", // Background color for the disabled input
                    },
                    "& .MuiOutlinedInput-root": {
                        fontFamily: "Sarabun",
                        "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: Validate ? "#d50000" : "",
                        },
                        "&.Mui-focused": {
                            "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: "info.main",
                            },
                        },
                    },
                }, InputProps: {
                    readOnly: readonly,
                    inputProps: {
                        style: { textAlign: textAlignTextField },
                    },
                }, autoComplete: "off", size: "small", disabled: disabled, onChange: handleChange, value: value }), validateTextLable && (_jsx("label", { htmlFor: "", className: `fs-7 py-1 sarabun-regular-lable-validate`, children: validateTextLable }))] }));
}
