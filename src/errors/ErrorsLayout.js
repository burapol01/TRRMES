import { jsx as _jsx } from "react/jsx-runtime";
import { Outlet } from 'react-router-dom';
export default function ErrorsLayout() {
    return (_jsx("div", { className: 'd-flex flex-column flex-root', children: _jsx("div", { className: 'd-flex flex-column flex-center flex-column-fluid', children: _jsx("div", { className: 'd-flex flex-column flex-center text-center p-10', children: _jsx("div", { className: 'card card-flush  w-lg-650px py-5', children: _jsx("div", { className: 'card-body py-15 py-lg-20', children: _jsx(Outlet, {}) }) }) }) }) }));
}
