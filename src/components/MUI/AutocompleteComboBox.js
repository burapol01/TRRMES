import { createElement as _createElement } from "react";
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
export default function AutocompleteComboBox(props) {
    const { value, labelName, required, setvalue, options = [], column, disabled, readonly } = props;
    const handleOnChange = (e, newValue) => {
        console.log(newValue);
        if (newValue === null) {
            // ถ้าค่าที่เลือกเป็น null (เมื่อกดปุ่มเคลียร์)
            setvalue && setvalue(null);
        }
        else {
            // ถ้าค่าที่เลือกเป็นค่าที่ไม่ใช่ null
            setvalue && setvalue(newValue);
        }
    };
    return (_jsxs(_Fragment, { children: [_jsx("label", { htmlFor: "", className: `${required} fs-5 py-2 sarabun-regular`, children: labelName }), _jsx(Autocomplete, { sx: {
                    width: "100%"
                }, disablePortal: true, value: value, id: "combo-box-demo", options: options ? options : [], getOptionLabel: (option) => option[`${column}`], renderOption: (props, option) => {
                    //console.log(option); // Debugging
                    return (_createElement("li", { ...props, key: `${option[`${column}`]}-${option?.id}` }, option[`${column}`]));
                }, onChange: handleOnChange, disabled: disabled, readOnly: readonly, isOptionEqualToValue: (option, value) => option?.id === value?.id, renderInput: (params) => (_jsx(TextField, { ...params, placeholder: "\u0E01\u0E23\u0E38\u0E13\u0E32\u0E40\u0E25\u0E37\u0E2D\u0E01", size: "small", sx: {
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
                    } })) })] }));
}
