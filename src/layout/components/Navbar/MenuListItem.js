import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// @ts-nocheck
import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import MenuList from '@mui/material/MenuList';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Check from '@mui/icons-material/Check';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import IconButton from '@mui/material/IconButton';
export default function MenuListItem() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (_jsxs("div", { children: [_jsx(IconButton, { id: "basic-button", "aria-controls": open ? 'basic-menu' : undefined, "aria-haspopup": "true", "aria-expanded": open ? 'true' : undefined, onClick: handleClick, children: _jsx(FormatAlignLeftIcon, {}) }), _jsx(Menu, { id: "basic-menu", anchorEl: anchorEl, open: open, onClose: handleClose, MenuListProps: {
                    'aria-labelledby': 'basic-button',
                }, children: _jsxs(MenuList, { dense: true, children: [_jsx(MenuItem, { children: _jsx(ListItemText, { inset: true, children: "Hom" }) }), _jsx(MenuItem, { children: _jsx(ListItemText, { inset: true, children: "About" }) }), _jsx(MenuItem, { children: _jsx(ListItemText, { inset: true, children: "Contact" }) }), _jsxs(MenuItem, { children: [_jsx(ListItemIcon, { children: _jsx(Check, {}) }), "Custom: 1.2"] }), _jsx(Divider, {}), _jsx(MenuItem, { children: _jsx(ListItemText, { children: "Add space before paragraph" }) }), _jsx(MenuItem, { children: _jsx(ListItemText, { children: "Add space after paragraph" }) }), _jsx(Divider, {}), _jsx(MenuItem, { children: _jsx(ListItemText, { children: "Custom spacing..." }) })] }) })] }));
}
