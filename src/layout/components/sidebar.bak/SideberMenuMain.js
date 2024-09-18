import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";
import { useSelector } from "react-redux";
import { Stack } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import SideberMenuItem from "./SideberMenuItem";
export default function SideberMenuMain({ isOpen }) {
    const [openSubmenu, setOpenSubmenu] = React.useState(false);
    const menu = useSelector((state) => state?.user_menu?.user_menu);
    const [menuItems, setMenuItems] = React.useState([]);
    const [checkMenu, setCheckMenu] = React.useState(null);
    const handleClickMenu = (data) => {
        setCheckMenu(data == checkMenu ? null : data);
        setOpenSubmenu(data == checkMenu ? false : true);
    };
    const setSubMenu = () => {
        const data = menu;
        const newData = [];
        const newDataSub = [];
        Array.isArray(data) &&
            data.forEach((el) => {
                if (el.menu_sub == 0) {
                    newData.push(el);
                }
                if (el.menu_sub != 0) {
                    newDataSub.push(el);
                }
            });
        const newMenu = [];
        Array.isArray(newData) &&
            newData.forEach((menu) => {
                const newSubMenu = [];
                Array.isArray(newDataSub) &&
                    newDataSub.forEach((submenu) => {
                        if (menu.menu_id == submenu.menu_sub) {
                            newSubMenu.push(submenu);
                        }
                    });
                newMenu.push({ ...menu, ...{ submenu: newSubMenu } });
            });
        setMenuItems(newMenu);
    };
    React.useEffect(() => {
        setSubMenu();
    }, [menu]);
    return (_jsx("div", { className: "", children: _jsx("ul", { className: "ml-[-10px]", children: menuItems.map((el, index) => (_jsx("div", { children: el?.submenu.length == 0 ? (_jsx(SideberMenuItem, { typeMenu: "main", isOpen: isOpen, to: el.menu_url, title: el.menu_name, icon: el.menu_icon, dataMenu: el }, index)) : (_jsxs(_Fragment, { children: [_jsx("li", { className: `text-gray-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 hover:bg-gray-200 rounded-md  mr-5 mt-2`, onClick: () => handleClickMenu(el), children: _jsxs(Stack, { direction: "row", spacing: 18, children: [_jsx("div", { children: _jsxs(Stack, { direction: "row", spacing: 1, children: [_jsx("span", { className: "text-2xl block float-left", children: _jsx("i", { className: `${el.menu_icon} fs-3` }) }), _jsx("div", { className: `${isOpen ? `block` : `hidden`}`, children: _jsx("label", { className: `w-40 text-base font-medium flex-1 absolute pt-1 sarabun-regular`, children: el.menu_name }) })] }) }), _jsx("div", { className: `${isOpen ? `block` : `hidden`} pt-1`, children: openSubmenu && checkMenu.menu_id == el.menu_id ? (_jsx(ExpandLessIcon, {})) : (_jsx(ExpandMoreIcon, {})) })] }) }), _jsx("div", { className: `${isOpen ? `block` : `hidden`}`, children: _jsx("div", { className: `${openSubmenu && checkMenu.menu_id == el.menu_id ? '' : 'hidden'}`, children: el?.submenu.map((subMenu, index) => (_jsx(SideberMenuItem, { typeMenu: "sub", to: subMenu.menu_url, title: subMenu.menu_name, icon: subMenu.menu_icon, dataMenu: subMenu }, index))) }) })] })) }, index))) }) }));
}
