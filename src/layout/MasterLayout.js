import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from './components/Navbar';
import SideBar from './components/sidebar';
import Footer from './components/footer';
export default function MasterLayout() {
    const [open, setOpen] = React.useState(true);
    const headleOpen = (val) => {
        setOpen(val);
    };
    return (_jsxs("div", { className: "d-flex flex-column flex-root app-root scroll scroll-pull", id: "kt_app_root", "data-scroll": "true", "data-wheel-propagation": "true", children: [_jsxs("div", { className: "app-page flex-column flex-column-fluid bg-gray-200", id: "kt_app_page", children: [_jsx(NavBar, { open: open }), _jsx("div", { className: 'hidden sm:block', children: _jsx(SideBar, { isOpen: open, headleOpen: headleOpen }) }), _jsx("div", { className: `${open ? `ml-0 sm:ml-72` : `ml-0 sm:ml-20`} pt-[6.5rem] pl-5 pr-5 duration-300`, children: _jsx(Outlet, {}) })] }), _jsx(Footer, { isOpen: open })] }));
}
