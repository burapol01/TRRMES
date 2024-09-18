import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
const Error404 = () => {
    return (_jsxs(_Fragment, { children: [_jsx("h1", { className: 'fw-bolder fs-2hx text-gray-900 mb-4', children: "Oops!" }), _jsx("div", { className: 'fw-semibold fs-6 text-gray-500 mb-7', children: `We can't find that page.` }), _jsx("div", { className: 'mb-3' }), _jsx("div", { className: 'mb-0', children: _jsx(Link, { to: '/home', className: 'btn btn-sm btn-primary', children: "Return Home" }) })] }));
};
export { Error404 };
