import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";
import { useSelector } from "react-redux";
import SideberMenuItem from "./SideberMenuItem";
import { SlArrowDown } from "react-icons/sl";
import { SlArrowUp } from "react-icons/sl";
export default function SideberMenuMain({ isOpen, headleOpen }) {
    const [active, setActive] = React.useState(false);
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
    return (_jsxs("div", { className: `bg-white min-h-screen fixed ${isOpen || active ? `w-72` : `w-20`} duration-500 text-gray-900 px-4 border z-10`, onMouseEnter: () => setActive(true), onMouseLeave: () => setActive(false), children: [_jsxs("div", { className: 'h-28', children: [isOpen ? (_jsx("div", { className: ' absolute cursor-pointer rounded-full -right-4 top-6 bg-white z-50', onClick: () => {
                            headleOpen(false);
                            setActive(false);
                        }, children: _jsxs("svg", { className: "h-8 w-8 text-red-500", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", children: ["  ", _jsx("circle", { cx: "12", cy: "12", r: "10" }), "  ", _jsx("polyline", { points: "12 8 8 12 12 16" }), "  ", _jsx("line", { x1: "16", y1: "12", x2: "8", y2: "12" })] }) })) : (_jsx("div", { className: ' absolute cursor-pointer rounded-full -right-4 top-6 bg-white  z-50', onClick: () => headleOpen(true), children: _jsxs("svg", { className: "h-8 w-8 text-red-500", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", children: ["  ", _jsx("circle", { cx: "12", cy: "12", r: "10" }), "  ", _jsx("polyline", { points: "12 16 16 12 12 8" }), "  ", _jsx("line", { x1: "8", y1: "12", x2: "16", y2: "12" })] }) })), _jsxs("div", { className: 'inline-flex', children: [_jsx("div", { className: `${isOpen || active ? `block` : `hidden`} `, children: _jsx("img", { alt: "Logo", src: "http://trr-web.trrgroup.com/storage/INTRANET/DMZ/Asset/Logo/Logo_TRR_Lin_TH.png", className: "py-2" }) }), _jsx("div", { className: `${isOpen || active ? `hidden` : `block`} `, children: _jsx("img", { alt: "Logo", src: "http://trr-web.trrgroup.com/storage/EVI/DEV/Logo/TRR.png", className: "h-[40px] mt-3" }) })] })] }), _jsx("div", { className: 'mt-5 flex flex-col gap-4 relative', children: menuItems?.map((menu, index) => menu?.submenu.length == 0 ? (_jsx(SideberMenuItem, { typeMenu: "main", isOpen: isOpen || active, to: menu.menu_url, title: menu.menu_name, icon: menu.menu_icon, dataMenu: menu, index: index }, index)) : (_jsxs("div", { children: [_jsxs("div", { className: 'flex items-center text-sm gap-3.5 font-medium p-2 hover:bg-blue-100 hover:scale-110 rounded-md', onClick: () => handleClickMenu(menu), children: [_jsx("div", { children: _jsx("i", { className: `${menu.menu_icon} fs-2` }) }), _jsxs("div", { style: { transitionDelay: `${index + 1}00ms` }, className: `w-full flex items-center justify-between whitespace-pre duration-500 ${!isOpen && !active && "opacity-0 translate-x-28 overflow-hidden"}`, children: [_jsx("label", { className: "text-lg", children: menu.menu_name }), openSubmenu && checkMenu.menu_id == menu.menu_id ? (_jsx(SlArrowUp, {})) : (_jsx(SlArrowDown, {}))] })] }, index), _jsx("div", { style: { transitionDelay: `${index + 1}00ms` }, className: `ml-5 transition-all whitespace-pre duration-500 ease-in-out ${openSubmenu && checkMenu.menu_id === menu.menu_id && (isOpen || active) ? "max-h-[1000px] opacity-100 translate-x-0" : "max-h-0 opacity-0 overflow-hidden translate-x-28"}`, children: menu?.submenu?.map((subMenu, index) => (_jsx(SideberMenuItem, { typeMenu: "sub", to: subMenu.menu_url, title: subMenu.menu_name, icon: subMenu.menu_icon, dataMenu: subMenu, index: index }, index))) })] }, index))) })] }));
}
