import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
const Error500 = () => {
    return (_jsxs(_Fragment, { children: [_jsx("h1", { className: 'fw-bolder fs-2qx text-gray-900 mb-4', children: "System Error" }), _jsx("div", { className: 'fw-semibold fs-6 text-gray-500 mb-7', children: "Something went wrong! Please try again later." }), _jsx("div", { className: 'mb-11' }), _jsx("div", { className: 'mb-0', children: _jsx(Link, { to: '/Home', className: 'btn btn-sm btn-primary', children: "Return Home" }) })] }));
};
export { Error500 };
