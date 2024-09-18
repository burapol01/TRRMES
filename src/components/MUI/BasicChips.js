import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
export default function BasicChips(props) {
    return (_jsx(_Fragment, { children: _jsx(Stack, { direction: "row", spacing: 1, children: _jsx(Chip, { label: props.label, variant: "outlined", sx: {
                    backgroundColor: props.backgroundColor,
                    color: props.textColor || '#000000', // ใช้ค่า textColor ที่ส่งเข้ามา หากไม่มีใช้สีดำเป็นค่าเริ่มต้น
                    borderColor: props.borderColor,
                } }) }) }));
}
