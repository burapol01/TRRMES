import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Route, Routes, Outlet, Navigate } from 'react-router-dom';
import ComponenExample from './component';
export default function Example() {
    return (_jsxs(Routes, { children: [_jsx(Route, { element: _jsx(Outlet, {}), children: _jsx(Route, { path: "example", element: _jsx(ComponenExample, {}) }) }), _jsx(Route, { index: true, element: _jsx(Navigate, { to: "/apps/example" }) })] }));
}
