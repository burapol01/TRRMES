import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, TextField } from "@mui/material";
import InputAdornment from '@mui/material/InputAdornment';
export default function FullWidthTextField(props) {
    const hedelonChange = (e) => {
        props.onChange && props.onChange(e.target.value);
    };
    return (_jsxs(Box, { sx: { display: props.hidden ? 'none' : 'block' }, children: [_jsx("label", { htmlFor: "", className: `${props.required} fs-5 py-2 sarabun-regular`, children: props.labelName }), _jsx(TextField, { fullWidth: true, sx: {
                    "& .MuiInputBase-input.Mui-disabled": {
                        WebkitTextFillColor: "black", // For text color in WebKit browsers
                    },
                    "& .MuiInputBase-root.Mui-disabled": {
                        backgroundColor: "rgb(241,241,244)", // Background color for the disabled input
                    },
                    "& .MuiOutlinedInput-root": {
                        fontFamily: "Sarabun",
                        "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: props.Validate ? "#d50000" : "",
                        },
                        "&.Mui-focused": {
                            "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: "info.main",
                            },
                        },
                    },
                }, InputProps: {
                    readOnly: props.readonly,
                    endAdornment: props.endAdornment ? _jsx(InputAdornment, { position: "end", children: "%" }) : null,
                    inputProps: {
                        style: { textAlign: props.textAlignTextField },
                    },
                }, autoComplete: "off", id: "fullWidth", size: "small", disabled: props.disabled, onChange: hedelonChange, value: props.value }), props.validateTextLable ? (_jsx("label", { htmlFor: "", className: `fs-7 py-1 sarabun-regular-lable-validate`, children: props.validateTextLable })) : null] }));
}
