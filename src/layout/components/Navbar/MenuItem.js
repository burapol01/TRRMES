import { jsx as _jsx } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
export default function MenuItem() {
    return (_jsx("div", { className: "flex space-x-4 items-center", children: _jsx(Link, { className: "text-gray-300 hover:bg-gray-200  rounded-md px-3 py-2 text-lg font-bold", "aria-current": "page", to: '/home', children: _jsx("span", { className: 'hover:text-blue-500', children: "Home" }) }) }));
}
