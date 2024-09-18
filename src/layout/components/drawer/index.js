import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import { IconButton } from '@mui/material';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import DrawerMenuMain from './DrawerMenuMain';
export default function AnchorTemporaryDrawer() {
    const [state, setState] = React.useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });
    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' &&
            (event.key === 'Tab' ||
                event.key === 'Shift')) {
            return;
        }
        setState({ ...state, [anchor]: open });
    };
    const list = (anchor) => (_jsx(Box, { sx: { width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }, role: "presentation", 
        // onClick={toggleDrawer(anchor, false)}
        onKeyDown: toggleDrawer(anchor, false), children: _jsx("div", { className: 'mt-5', children: _jsx(DrawerMenuMain, { isOpen: true, toggleDrawer: toggleDrawer(anchor, false) }) }) }));
    return (_jsx("div", { children: ['left'].map((anchor) => (_jsxs(React.Fragment, { children: [_jsx(IconButton, { id: "basic-button", "aria-controls": 'basic-menu', "aria-haspopup": "true", "aria-expanded": 'true', onClick: toggleDrawer(anchor, true), children: _jsx(FormatAlignLeftIcon, {}) }), _jsx(Drawer, { anchor: anchor, open: state[anchor], onClose: toggleDrawer(anchor, false), children: list(anchor) })] }, anchor))) }));
}
