import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import AnchorTemporaryDrawer from '../drawer';
import Profile from '../profile';
import MenuItem from './MenuItem';
export default function NavBar({ open }) {
    return (_jsx("nav", { className: `w-full ${open ? `ml-0 sm:ml-72 md:ml-72 lg:ml-72` : `ml-0 sm:ml-20 md:ml-20 lg:ml-20`} border fixed top-0 py-10 select-none transition-all z-10  bg-white`, children: _jsx("div", { className: "px-2 sm:px-6 lg:px-8", children: _jsxs("div", { className: "relative flex h-5 items-center sm:justify-between", children: [_jsx("div", { className: "absolute inset-y-0 left-0 flex items-center sm:hidden", children: _jsx(AnchorTemporaryDrawer, {}) }), _jsx("div", { className: "absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0", children: _jsx("div", { className: "hidden sm:ml-6 sm:block", children: _jsx(MenuItem, {}) }) }), _jsx(Profile, { isOpen: open })] }) }) }));
}
